// src/hooks/useProctoring.js
// Drop into your SkillScrumpt React project.
// Usage:  const proctoring = useProctoring({ userId, examId, onAlert });

import { useCallback, useEffect, useRef, useState } from "react";

const API_BASE = import.meta.env.VITE_PROCTOR_API || "http://localhost:8000";
const WS_BASE  = import.meta.env.VITE_PROCTOR_WS  || "ws://localhost:8000";

export function useProctoring({ userId, examId, onAlert }) {
  const [sessionId,      setSessionId]      = useState(null);
  const [score,          setScore]          = useState(100);
  const [violations,     setViolations]     = useState([]);
  const [activeAlerts,   setActiveAlerts]   = useState([]);
  const [isActive,       setIsActive]       = useState(false);
  const [cameraReady,    setCameraReady]    = useState(false);
  const [report,         setReport]         = useState(null);

  const videoRef       = useRef(null);
  const canvasRef      = useRef(null);
  const wsRef          = useRef(null);
  const streamRef      = useRef(null);
  const intervalRef    = useRef(null);
  const sessionIdRef   = useRef(null);   // stable ref for cleanup

  // ── Start proctoring ───────────────────────────────────────────────────────
  const startProctoring = useCallback(async () => {
    try {
        // 1. Create backend session
        const res = await fetch(`${API_BASE}/proctoring/start`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userId, exam_id: examId }),
        });
        const { session_id } = await res.json();
        setSessionId(session_id);
        sessionIdRef.current = session_id;

        // 2. Request camera
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: 640, height: 480, facingMode: "user" },
            audio: false,
          });
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            await videoRef.current.play();
            setCameraReady(true);
          }
        } catch (err) {
          console.error("Camera access denied:", err);
          return;
        }

        // 3. Open WebSocket
        const ws = new WebSocket(`${WS_BASE}/ws/proctor/${session_id}`);
        wsRef.current = ws;

        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          if (data.type === "analysis") {
            setScore(data.score);
            if (data.alerts?.length) {
              data.alerts.forEach((alert) => {
                addAlert(alert);
                onAlert?.(alert);
              });
            }
          }
        };

        ws.onerror = (e) => console.error("Proctoring WS error", e);

        // 4. Start frame capture loop (2 fps — lightweight)
        intervalRef.current = setInterval(() => {
          captureAndSend(ws);
        }, 500);

        setIsActive(true);
    } catch (error) {
        console.error("Failed to start proctoring:", error);
    }
  }, [userId, examId, onAlert]);


  // ── Stop proctoring ────────────────────────────────────────────────────────
  const stopProctoring = useCallback(async () => {
    clearInterval(intervalRef.current);
    wsRef.current?.close();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    setIsActive(false);
    setCameraReady(false);

    if (sessionIdRef.current) {
      try {
          const res = await fetch(`${API_BASE}/proctoring/end`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ session_id: sessionIdRef.current }),
          });
          const data = await res.json();
          setReport(data);
          return data;
      } catch (error) {
          console.error("Failed to end proctoring session:", error);
      }
    }
  }, []);


  // ── Capture frame and send via WebSocket ───────────────────────────────────
  const captureAndSend = (ws) => {
    if (!videoRef.current || !canvasRef.current) return;
    if (ws.readyState !== WebSocket.OPEN) return;

    const canvas = canvasRef.current;
    const video  = videoRef.current;
    const ctx    = canvas.getContext("2d");

    canvas.width  = 320;   // reduced resolution for speed
    canvas.height = 240;
    ctx.drawImage(video, 0, 0, 320, 240);

    const frame = canvas.toDataURL("image/jpeg", 0.7);
    ws.send(JSON.stringify({ type: "frame", frame }));
  };


  // ── Tab visibility tracking ────────────────────────────────────────────────
  useEffect(() => {
    if (!isActive) return;

    const handleVisibility = async () => {
      if (!sessionIdRef.current) return;
      try {
          await fetch(`${API_BASE}/proctoring/tab-event`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              session_id: sessionIdRef.current,
              event: document.hidden ? "hidden" : "visible",
              timestamp: Date.now() / 1000,
            }),
          });

          if (document.hidden) {
            addAlert({
              type: "tab_switch",
              message: "⚠️ You switched tabs! This has been recorded.",
              severity: "high",
            });
          }
      } catch (error) {
          console.error("Failed to report tab event:", error);
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [isActive]);


  // ── Alert helper (auto-dismiss after 5s) ──────────────────────────────────
  const addAlert = (alert) => {
    const id = Date.now() + Math.random();
    const withId = { ...alert, id };
    setActiveAlerts((prev) => [...prev.slice(-4), withId]); // keep max 5
    setViolations((prev) => [...prev, withId]);
    setTimeout(() => {
      setActiveAlerts((prev) => prev.filter((a) => a.id !== id));
    }, 5000);
  };


  // ── Cleanup on unmount ─────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current);
      wsRef.current?.close();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);


  return {
    startProctoring,
    stopProctoring,
    sessionId,
    score,
    violations,
    activeAlerts,
    isActive,
    cameraReady,
    report,
    videoRef,
    canvasRef,
  };
}
