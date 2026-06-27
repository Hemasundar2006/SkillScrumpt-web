// src/hooks/useProctoring.js
// Drop into your SkillScrumpt.in React project.
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

        // 2. Request camera & screen
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: 640, height: 480, facingMode: "user" },
            audio: true, // Audio enabled for ambient noise checking
          });
          
          const displayStream = await navigator.mediaDevices.getDisplayMedia({
            video: { displaySurface: "monitor" },
            audio: true // System audio
          });

          // Store all tracks securely to guarantee full shutdown
          allTracksRef.current = [...stream.getTracks(), ...displayStream.getTracks()];

          const screenTrack = displayStream.getVideoTracks()[0];
          if (screenTrack.getSettings().displaySurface !== 'monitor') {
            screenTrack.stop();
            throw new Error("Must share Entire Screen");
          }

          screenTrack.onended = () => {
            addAlert({ type: "screen_stopped", message: "🚨 Screen sharing stopped! Exam compromised.", severity: "critical" });
            stopProctoring();
          };

          streamRef.current = stream;
          // Store screen track so we can stop it later
          streamRef.current.addTrack(screenTrack);

          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            await videoRef.current.play();
            setCameraReady(true);
          }
        } catch (err) {
          console.error("Hardware access denied:", err);
          alert("You must allow Camera and Entire Screen sharing to start the exam.");
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
    // Guarantee all tracks (video, audio, screen) are terminated
    allTracksRef.current.forEach(t => {
      try { t.stop(); } catch(e){}
    });
    streamRef.current?.getTracks().forEach((t) => {
      try { t.stop(); } catch(e){}
    });
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
      if (document.hidden) {
        addAlert({
          type: "tab_switch",
          message: "🚨 You switched tabs! The exam has been terminated.",
          severity: "critical",
        });
        
        // Throw a blocking browser alert
        alert("SECURITY VIOLATION: You navigated away from the exam tab! Tab-switching is strictly prohibited. Your exam session has been terminated.");
        
        // Terminate the exam
        stopProctoring();
        
        if (!sessionIdRef.current) return;
        try {
            await fetch(`${API_BASE}/proctoring/tab-event`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                session_id: sessionIdRef.current,
                event: "hidden",
                timestamp: Date.now() / 1000,
              }),
            });
        } catch (error) {
            console.error("Failed to report tab event:", error);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [isActive, stopProctoring]);


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
