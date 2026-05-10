import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useProctoring } from "../hooks/useProctoring";

const SEVERITY_COLORS = {
  critical: { bg: "rgba(254, 226, 226, 0.9)", border: "#ef4444", text: "#991b1b", icon: "🚨" },
  high:     { bg: "rgba(254, 243, 199, 0.9)", border: "#f59e0b", text: "#92400e", icon: "⚠️" },
  medium:   { bg: "rgba(219, 234, 254, 0.9)", border: "#3b82f6", text: "#1e40af", icon: "👁️" },
  low:      { bg: "rgba(240, 253, 244, 0.9)", border: "#22c55e", text: "#166534", icon: "ℹ️" },
};

export function ProctoringOverlay({ userId, examId, onScoreChange }) {
  const [minimized, setMinimized] = useState(false);

  const {
    startProctoring,
    stopProctoring,
    score,
    activeAlerts,
    isActive,
    cameraReady,
    videoRef,
    canvasRef,
  } = useProctoring({
    userId,
    examId,
    onAlert: (alert) => {
      console.log("[Proctor Alert]", alert);
    },
  });

  useEffect(() => {
    onScoreChange?.(score);
  }, [score, onScoreChange]);

  const scoreColor =
    score >= 90 ? "#16a34a" :
    score >= 75 ? "#ca8a04" :
    score >= 60 ? "#ea580c" :
    "#dc2626";

  return (
    <>
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {/* Top Right Mini Alerts */}
      <div className="fixed top-5 right-5 flex flex-col gap-3 z-[9999] max-w-[340px]">
        {activeAlerts.filter(a => a.severity === 'low').map((alert) => {
          const colors = SEVERITY_COLORS[alert.severity] || SEVERITY_COLORS.medium;
          return (
            <div 
              key={alert.id} 
              className="flex items-start gap-3 p-3 rounded-2xl border backdrop-blur-md shadow-xl animate-in slide-in-from-right-full"
              style={{ background: colors.bg, borderColor: colors.border }}
            >
              <span className="text-lg">{colors.icon}</span>
              <p className="m-0 text-xs font-bold" style={{ color: colors.text }}>{alert.message}</p>
            </div>
          );
        })}
      </div>

      {/* CENTER POPUP FOR SUSPICIOUS ACTIVITY & PROTOCOL BREACHES */}
      {activeAlerts.find(a => a.severity === 'medium' || a.severity === 'high' || a.severity === 'critical') && (
        <div className="fixed inset-0 flex items-center justify-center z-[10000] pointer-events-none p-6">
          <div className="absolute inset-0 bg-red-950/20 backdrop-blur-[2px]" />
          {activeAlerts.filter(a => a.severity === 'medium' || a.severity === 'high' || a.severity === 'critical').slice(-1).map((alert) => {
             const colors = SEVERITY_COLORS[alert.severity];
             return (
               <motion.div 
                 key={alert.id}
                 initial={{ scale: 0.8, opacity: 0, y: 20 }}
                 animate={{ scale: 1, opacity: 1, y: 0 }}
                 exit={{ scale: 1.1, opacity: 0 }}
                 className="relative bg-white/95 backdrop-blur-3xl p-10 rounded-[3rem] shadow-[0_0_150px_rgba(239,68,68,0.5)] border-8 flex flex-col items-center text-center max-w-lg w-full pointer-events-auto"
                 style={{ borderColor: colors.border }}
               >
                 <div className="w-24 h-24 rounded-full flex items-center justify-center text-6xl mb-8 animate-bounce" style={{ backgroundColor: `${colors.border}22` }}>
                   {colors.icon}
                 </div>
                 <h2 className="text-3xl font-black uppercase tracking-tighter mb-4" style={{ color: colors.text }}>
                   Critical Security Warning
                 </h2>
                 <p className="text-xl font-bold text-secondary leading-tight mb-6">
                   {alert.message}
                 </p>
                 <div className="px-6 py-3 bg-red-500 text-white rounded-full text-xs font-black uppercase tracking-[0.2em] animate-pulse">
                   Automatic Termination Initiated
                 </div>
               </motion.div>
             )
          })}
        </div>
      )}

      {/* Proctoring Panel */}
      <div className={`fixed bottom-5 right-5 w-56 bg-secondary/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden z-[9990] border border-white/10 transition-all duration-300 ${minimized ? 'h-12' : 'h-auto'}`}>
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
            <span className="text-white text-[10px] font-black uppercase tracking-widest">
              {isActive ? "AI Tracking" : "Proctoring"}
            </span>
          </div>
          <button 
            onClick={() => setMinimized((m) => !m)} 
            className="text-white/40 hover:text-white transition-colors p-1"
          >
            {minimized ? "▲" : "▼"}
          </button>
        </div>

        {!minimized && (
          <>
            {/* Score Badge */}
            <div className="flex items-baseline justify-center gap-1 py-4" style={{ backgroundColor: `${scoreColor}22` }}>
              <span className="text-4xl font-black" style={{ color: scoreColor }}>{score}</span>
              <span className="text-xs font-bold text-white/40">/ 100</span>
            </div>

            {/* Camera Feed */}
            <div className="mx-3 my-2 rounded-2xl overflow-hidden bg-black/40 h-32 relative flex items-center justify-center border border-white/5">
              <video
                ref={videoRef}
                muted
                playsInline
                className={`w-full h-full object-cover transition-opacity duration-500 ${cameraReady ? 'opacity-100' : 'opacity-30'}`}
              />
              {!cameraReady && isActive && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                   <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      <span className="text-[10px] font-bold text-white/60">Starting camera...</span>
                   </div>
                </div>
              )}
              {!isActive && (
                <div className="text-white/20 text-3xl">📷</div>
              )}
            </div>

            {/* Action Button */}
            <div className="p-3">
              <button
                onClick={isActive ? stopProctoring : startProctoring}
                className={`w-full py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 shadow-lg ${
                  isActive 
                  ? 'bg-red-500/20 text-red-500 border border-red-500/30 hover:bg-red-500 hover:text-white' 
                  : 'bg-primary text-white shadow-primary/20 hover:scale-[1.02]'
                }`}
              >
                {isActive ? "Stop Tracking" : "Start Proctoring"}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export function ProctoringScoreCard({ report }) {
  if (!report) return null;

  const { proctoring_score, grade, summary, violations, exam_id, started_at } = report;

  const gradeColor =
    proctoring_score >= 90 ? "#16a34a" :
    proctoring_score >= 75 ? "#ca8a04" :
    proctoring_score >= 60 ? "#ea580c" :
    "#dc2626";

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xl max-w-sm">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="font-black text-secondary uppercase text-xs tracking-widest mb-1">📝 Assessment Report</p>
          <h4 className="text-lg font-bold text-secondary">{exam_id}</h4>
          <p className="text-[10px] text-gray-400 font-bold">
            {new Date(started_at).toLocaleDateString("en-IN", {
              day: "numeric", month: "short", year: "numeric",
            })}
          </p>
        </div>
        <div 
          className="flex flex-col items-center rounded-2xl px-4 py-2 text-white shadow-lg"
          style={{ background: gradeColor }}
        >
          <span className="text-2xl font-black leading-none">{proctoring_score}</span>
          <span className="text-[10px] font-bold uppercase tracking-widest mt-1">{grade}</span>
        </div>
      </div>

      {/* Score bar */}
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-6">
        <div 
          className="h-full transition-all duration-1000 ease-out"
          style={{ width: `${proctoring_score}%`, backgroundColor: gradeColor }} 
        />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {[
          { label: "Tab switches",   value: report.tab_switches, icon: "📑" },
          { label: "No face",        value: report.no_face_count, icon: "👤" },
          { label: "Multiple faces", value: report.multiple_face_count, icon: "👥" },
          { label: "Looking away",   value: report.looking_away_count, icon: "👀" },
        ].map((s) => (
          <div key={s.label} className="bg-gray-50 rounded-2xl p-3 flex flex-col border border-gray-100">
            <span className="text-lg mb-1">{s.icon}</span>
            <span className="text-xl font-black text-secondary">{s.value}</span>
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Critical Violations */}
      {summary?.critical_violations > 0 && (
        <div className="bg-red-50 text-red-600 rounded-2xl p-3 border border-red-100 flex items-center gap-3">
          <span className="text-xl">🚨</span>
          <p className="text-[10px] font-black uppercase tracking-widest m-0">
            {summary.critical_violations} Critical Violations Recorded
          </p>
        </div>
      )}
    </div>
  );
}
