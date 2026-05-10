"""
SkillScrumpt AI Proctoring System - FastAPI Backend
Run: uvicorn main:app --reload --host 0.0.0.0 --port 8000
"""

import asyncio
import base64
import json
import time
import uuid
from datetime import datetime
from typing import Dict, Optional

import cv2
import mediapipe as mp
import numpy as np
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="SkillScrumpt Proctoring API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "https://skillscrumpt.vercel.app",
        "https://skillscrumpt.web.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── MediaPipe setup ──────────────────────────────────────────────────────────
mp_face_detection = mp.solutions.face_detection
mp_face_mesh = mp.solutions.face_mesh

# ── In-memory session store (replace with DB in production) ──────────────────
sessions: Dict[str, dict] = {}


# ── Score weights ─────────────────────────────────────────────────────────────
VIOLATION_WEIGHTS = {
    "no_face":         8,   # face not visible
    "multiple_faces":  15,  # more than one person
    "looking_away":    5,   # eyes/gaze deviated
    "tab_switch":      10,  # left the exam tab
    "phone_detected":  20,  # phone-like object near face
}

MAX_SCORE = 100


class SessionStart(BaseModel):
    user_id: str
    exam_id: str


class TabEvent(BaseModel):
    session_id: str
    event: str   # "hidden" | "visible"
    timestamp: float


class SessionEnd(BaseModel):
    session_id: str


# ── REST endpoints ─────────────────────────────────────────────────────────────

@app.post("/proctoring/start")
async def start_session(body: SessionStart):
    session_id = str(uuid.uuid4())
    sessions[session_id] = {
        "session_id": session_id,
        "user_id": body.user_id,
        "exam_id": body.exam_id,
        "started_at": datetime.utcnow().isoformat(),
        "ended_at": None,
        "violations": [],
        "score": MAX_SCORE,
        "frames_analyzed": 0,
        "tab_switches": 0,
        "no_face_count": 0,
        "multiple_face_count": 0,
        "looking_away_count": 0,
        "status": "active",
    }
    return {"session_id": session_id, "message": "Proctoring session started"}


@app.post("/proctoring/tab-event")
async def record_tab_event(body: TabEvent):
    session = sessions.get(body.session_id)
    if not session:
        raise HTTPException(404, "Session not found")

    if body.event == "hidden":
        session["tab_switches"] += 1
        violation = {
            "type": "tab_switch",
            "severity": "high",
            "timestamp": body.timestamp,
            "message": f"Tab switch #{session['tab_switches']} detected",
        }
        session["violations"].append(violation)
        session["score"] = max(0, session["score"] - VIOLATION_WEIGHTS["tab_switch"])

    return {"status": "recorded", "current_score": session["score"]}


@app.post("/proctoring/end")
async def end_session(body: SessionEnd):
    session = sessions.get(body.session_id)
    if not session:
        raise HTTPException(404, "Session not found")

    session["ended_at"] = datetime.utcnow().isoformat()
    session["status"] = "completed"
    report = _generate_report(session)
    return report


@app.get("/proctoring/report/{session_id}")
async def get_report(session_id: str):
    session = sessions.get(session_id)
    if not session:
        raise HTTPException(404, "Session not found")
    return _generate_report(session)


@app.get("/user/{user_id}/proctoring-scores")
async def get_user_scores(user_id: str):
    """Returns all proctoring results for a user's profile page."""
    user_sessions = [
        _generate_report(s) for s in sessions.values()
        if s["user_id"] == user_id and s["status"] == "completed"
    ]
    return {"user_id": user_id, "results": user_sessions}


# ── WebSocket for real-time frame analysis ─────────────────────────────────────

@app.websocket("/ws/proctor/{session_id}")
async def websocket_proctor(websocket: WebSocket, session_id: str):
    await websocket.accept()
    session = sessions.get(session_id)
    if not session:
        await websocket.send_json({"error": "Session not found"})
        await websocket.close()
        return

    face_detector = mp_face_detection.FaceDetection(
        model_selection=0, min_detection_confidence=0.6
    )
    face_mesh = mp_face_mesh.FaceMesh(
        static_image_mode=False,
        max_num_faces=4,
        refine_landmarks=True,
        min_detection_confidence=0.5,
        min_tracking_confidence=0.5,
    )

    last_alert_time: Dict[str, float] = {}
    ALERT_COOLDOWN = 5.0  # seconds between same-type alerts

    try:
        while True:
            raw = await websocket.receive_text()
            data = json.loads(raw)

            if data.get("type") == "ping":
                await websocket.send_json({"type": "pong"})
                continue

            frame_b64 = data.get("frame")
            if not frame_b64:
                continue

            # Decode frame
            img_bytes = base64.b64decode(frame_b64.split(",")[-1])
            np_arr = np.frombuffer(img_bytes, np.uint8)
            frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
            if frame is None:
                continue

            session["frames_analyzed"] += 1
            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

            alerts = []
            now = time.time()

            # ── Face detection ───────────────────────────────────────────────
            face_result = face_detector.process(rgb)
            num_faces = len(face_result.detections) if face_result.detections else 0

            if num_faces == 0:
                session["no_face_count"] += 1
                if _should_alert("no_face", last_alert_time, ALERT_COOLDOWN):
                    session["score"] = max(0, session["score"] - VIOLATION_WEIGHTS["no_face"])
                    v = _make_violation("no_face", "high", "No face detected in frame")
                    session["violations"].append(v)
                    alerts.append({"type": "no_face", "message": "⚠️ No face detected! Please stay visible.", "severity": "high"})

            elif num_faces > 1:
                session["multiple_face_count"] += 1
                if _should_alert("multiple_faces", last_alert_time, ALERT_COOLDOWN):
                    session["score"] = max(0, session["score"] - VIOLATION_WEIGHTS["multiple_faces"])
                    v = _make_violation("multiple_faces", "critical", f"{num_faces} faces detected")
                    session["violations"].append(v)
                    alerts.append({"type": "multiple_faces", "message": f"🚨 Multiple people detected ({num_faces} faces)!", "severity": "critical"})

            else:
                # ── Eye / gaze tracking (only if exactly 1 face) ─────────────
                mesh_result = face_mesh.process(rgb)
                if mesh_result.multi_face_landmarks:
                    gaze = _check_gaze(mesh_result.multi_face_landmarks[0], frame.shape)
                    if gaze == "looking_away":
                        session["looking_away_count"] += 1
                        if _should_alert("looking_away", last_alert_time, ALERT_COOLDOWN):
                            session["score"] = max(0, session["score"] - VIOLATION_WEIGHTS["looking_away"])
                            v = _make_violation("looking_away", "medium", "Candidate looking away from screen")
                            session["violations"].append(v)
                            alerts.append({"type": "looking_away", "message": "👁️ Please look at the screen.", "severity": "medium"})

            # Send analysis result back
            await websocket.send_json({
                "type": "analysis",
                "session_id": session_id,
                "score": session["score"],
                "num_faces": num_faces,
                "frames_analyzed": session["frames_analyzed"],
                "alerts": alerts,
                "violations_count": len(session["violations"]),
            })

    except WebSocketDisconnect:
        pass
    finally:
        face_detector.close()
        face_mesh.close()


# ── Helpers ────────────────────────────────────────────────────────────────────

def _check_gaze(landmarks, frame_shape) -> str:
    """
    Returns 'looking_away' if eyes deviate too far from center.
    Uses iris landmarks (468-477) from face mesh refine_landmarks=True.
    """
    h, w = frame_shape[:2]

    # Iris landmark indices (left: 468-472, right: 473-477)
    LEFT_IRIS  = [468, 469, 470, 471, 472]
    RIGHT_IRIS = [473, 474, 475, 476, 477]

    # Eye corner landmarks
    LEFT_EYE_CORNERS  = [33, 133]
    RIGHT_EYE_CORNERS = [362, 263]

    lm = landmarks.landmark

    def iris_ratio(iris_ids, corner_ids):
        iris_x = np.mean([lm[i].x for i in iris_ids])
        left_x  = lm[corner_ids[0]].x
        right_x = lm[corner_ids[1]].x
        if abs(right_x - left_x) < 1e-6:
            return 0.5
        return (iris_x - left_x) / (right_x - left_x)

    l_ratio = iris_ratio(LEFT_IRIS,  LEFT_EYE_CORNERS)
    r_ratio = iris_ratio(RIGHT_IRIS, RIGHT_EYE_CORNERS)
    avg_ratio = (l_ratio + r_ratio) / 2

    # 0 = extreme left, 1 = extreme right; center ≈ 0.35–0.65
    if avg_ratio < 0.25 or avg_ratio > 0.75:
        return "looking_away"
    return "center"


def _should_alert(key: str, last_times: Dict[str, float], cooldown: float) -> bool:
    now = time.time()
    if now - last_times.get(key, 0) >= cooldown:
        last_times[key] = now
        return True
    return False


def _make_violation(vtype: str, severity: str, message: str) -> dict:
    return {
        "type": vtype,
        "severity": severity,
        "timestamp": datetime.utcnow().isoformat(),
        "message": message,
    }


def _generate_report(session: dict) -> dict:
    score = session["score"]
    grade = (
        "Excellent" if score >= 90 else
        "Good"      if score >= 75 else
        "Fair"      if score >= 60 else
        "Poor"
    )
    return {
        "session_id":          session["session_id"],
        "user_id":             session["user_id"],
        "exam_id":             session["exam_id"],
        "started_at":          session["started_at"],
        "ended_at":            session.get("ended_at"),
        "status":              session["status"],
        "proctoring_score":    score,
        "grade":               grade,
        "frames_analyzed":     session["frames_analyzed"],
        "tab_switches":        session["tab_switches"],
        "no_face_count":       session["no_face_count"],
        "multiple_face_count": session["multiple_face_count"],
        "looking_away_count":  session["looking_away_count"],
        "violations":          session["violations"],
        "summary": {
            "total_violations":    len(session["violations"]),
            "critical_violations": sum(1 for v in session["violations"] if v["severity"] == "critical"),
            "high_violations":     sum(1 for v in session["violations"] if v["severity"] == "high"),
            "medium_violations":   sum(1 for v in session["violations"] if v["severity"] == "medium"),
        },
    }
