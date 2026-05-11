import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Award, 
  BadgeCheck, 
  Share2, 
  Download, 
  ArrowRight, 
  Star, 
  TrendingUp,
  AlertTriangle,
  Clock,
  Briefcase,
  Check,
  CheckCircle,
  Cpu,
  Lock,
  Zap
} from 'lucide-react';
import { Button, Card, Badge } from '../components/UI';
import { Link, useLocation } from 'react-router-dom';

export function AssessmentResult() {
  const location = useLocation();
  const userStr = localStorage.getItem('user');
  const currentUser = userStr ? JSON.parse(userStr) : { firstName: 'OPERATIVE', lastName: '' };
  
  const { score, proctoringScore, report } = location.state || { 
    score: 0, 
    proctoringScore: 100, 
    report: null 
  };

  const integrityGrade = proctoringScore >= 90 ? 'OPTIMAL' : proctoringScore >= 75 ? 'NOMINAL' : 'COMPROMISED';
  const isPassed = score >= 70 && proctoringScore >= 60;

  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  const submitFeedback = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/v1/users/feedbacks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ text: feedbackText, rating: 5 })
      });
      if (res.ok) {
        setFeedbackSuccess(true);
        setTimeout(() => setFeedbackOpen(false), 2000);
      } else {
        const err = await res.json();
        alert(err.message || 'Error submitting feedback');
      }
    } catch (e) {
      alert('Error submitting feedback');
    }
  };

  return (
    <div className="pt-20 bg-black text-white selection:bg-white selection:text-black pb-24 min-h-screen">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header with Print/Share */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">AUDIT_REPORT // SS.PROCTOR.IN.V4</h2>
              </div>
              <h1 className="text-6xl font-black tracking-tighter uppercase italic">VERIFICATION <br />MANIFEST.</h1>
            </div>
            <div className="flex gap-4">
              <button className="px-6 py-3 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center gap-3">
                <Download size={14} /> EXPORT_DATA
              </button>
              <button className="px-6 py-3 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center gap-3">
                <Share2 size={14} /> RELAY_REPORT
              </button>
            </div>
        </div>

        {/* The Report Document */}
        <div className="border border-white/10 bg-white/5 p-1 relative overflow-hidden">
          <div className="bg-black border border-white/10 p-12 md:p-20 relative">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 border border-white/5 -mr-32 -mt-32 rotate-45" />
            
            <div className="flex flex-col md:flex-row justify-between gap-16 items-start mb-24 relative z-10">
              {/* Left: Candidate & Exam Details */}
              <div className="flex-1">
                <div className="flex items-center gap-8 mb-12">
                   <div className="w-20 h-20 border border-white/10 flex items-center justify-center text-white text-3xl font-black italic bg-white/5">
                     {currentUser.firstName?.[0]}
                   </div>
                   <div>
                     <h2 className="text-4xl font-black text-white leading-none mb-3 italic tracking-tight">{currentUser.firstName} {currentUser.lastName}</h2>
                     <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">OPERATIVE_ID: {currentUser._id?.slice(-8).toUpperCase() || 'SS-OPERATIVE'}</p>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-y-10 gap-x-16 max-w-xl">
                  <DetailItem label="PROTOCOL_TARGET" value="Expert React Architect" />
                  <DetailItem label="TIMESTAMP" value={new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase()} />
                  <DetailItem label="CYCLE_DURATION" value="45 MINUTES" />
                  <DetailItem label="SESSION_HASH" value={report?.session_id?.slice(0, 8).toUpperCase() || 'LIVE-RELAY-0X1'} />
                </div>
              </div>

              {/* Right: Security Seal & Grade */}
              <div className="flex flex-col items-center p-12 border border-white/10 bg-white/5 min-w-[280px]">
                <div className="relative mb-8">
                  <div className={`w-36 h-36 border flex items-center justify-center ${isPassed ? 'border-white' : 'border-white/20'}`}>
                    <div className={`w-28 h-28 flex items-center justify-center text-black shadow-xl bg-white`}>
                      {isPassed ? <Award size={48} /> : <Shield size={48} />}
                    </div>
                  </div>
                  {isPassed && (
                    <motion.div 
                      className="absolute -top-3 -right-3 bg-white text-black p-2 border border-black"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Star size={16} fill="black" />
                    </motion.div>
                  )}
                </div>
                <div className="text-center">
                   <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-3">INTEGRITY_INDEX</h4>
                   <span className={`text-4xl font-black italic ${isPassed ? 'text-white' : 'text-white/30'}`}>{integrityGrade}</span>
                </div>
              </div>
            </div>

            {/* Performance Matrix */}
            <div className="grid md:grid-cols-3 gap-1 border-t border-white/10 mb-24">
              <MetricCard 
                label="OVERALL_SCORE" 
                value={`${score}%`} 
                sub="WEIGHTED_COMPOSITE_SCORE" 
                color="text-white"
              />
              <MetricCard 
                label="TRUST_SCORE" 
                value={`${proctoringScore}%`} 
                sub="AI_BEHAVIOR_ANALYSIS" 
                color={proctoringScore > 80 ? "text-white" : "text-white/40"}
              />
              <MetricCard 
                label="VERIFICATION_STATUS" 
                value={isPassed ? "AUTHORIZED" : "TERMINATED"} 
                sub="IDENTITY_LOCKED" 
                color={isPassed ? "text-white" : "text-white/20"}
              />
            </div>

            {/* Violation Audit Log */}
            <section className="border-t border-white/10 pt-20">
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                  <h3 className="text-2xl font-black text-white flex items-center gap-4 italic uppercase tracking-tight">
                    <Shield size={24} className="text-white/40" /> SECURITY_AUDIT_LOG
                  </h3>
                  <div className="px-6 py-2 border border-white/10 text-[9px] font-black text-white/30 uppercase tracking-widest">
                    {report?.violations?.length || 0} ANOMALIES_RECORDED
                  </div>
               </div>

               {report?.violations && report.violations.length > 0 ? (
                 <div className="space-y-4">
                    {report.violations.map((v, i) => (
                      <div key={i} className="flex items-center justify-between p-6 border border-white/10 bg-white/5">
                        <div className="flex items-center gap-6">
                           <div className={`px-4 py-1 border text-[8px] font-black uppercase tracking-widest ${v.severity === 'critical' ? 'border-white bg-white text-black' : 'border-white/20 text-white/40'}`}>
                             {v.severity}
                           </div>
                           <span className="text-[11px] font-bold text-white uppercase tracking-widest">{v.message}</span>
                        </div>
                        <span className="text-[10px] font-mono text-white/20">{new Date(v.timestamp).toLocaleTimeString()}</span>
                      </div>
                    ))}
                 </div>
               ) : (
                 <div className="py-20 border border-dashed border-white/10 text-center">
                    <CheckCircle className="text-white/20 mx-auto mb-6" size={40} />
                    <p className="text-[11px] font-black uppercase tracking-[0.4em] text-white/40 italic">PRISTINE_SESSION: ZERO_ANOMALIES_DETECTED.</p>
                 </div>
               )}
            </section>

            {/* Footer Seal */}
            <div className="mt-32 pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-12">
                <div className="flex items-center gap-6">
                   <div className="w-16 h-16 border border-white/10 flex items-center justify-center text-white">
                     <Shield size={32} />
                   </div>
                   <div className="space-y-2">
                     <p className="text-[10px] text-white/30 font-black uppercase tracking-widest leading-relaxed max-w-xs">
                       DOCUMENT_AUTHENTICATED: ENCRYPTED_TAMPER_LOCK.
                     </p>
                     <p className="text-[9px] font-mono text-white/20">RELAY_ID: {report?.session_id || 'X77-NOMINAL'}</p>
                   </div>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-2">VERIFIED_BY_SYSTEM</p>
                   <div className="flex items-center gap-4 justify-end">
                      <p className="text-2xl font-black text-white italic uppercase tracking-tighter">SkillScrumpt.in</p>
                      <div className="px-3 py-1 bg-white text-black text-[9px] font-black uppercase tracking-widest">AI_PROCTOR</div>
                   </div>
                </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-20 flex flex-col sm:flex-row justify-center gap-6">
          <Link to="/dashboard/student">
            <button className="px-12 py-6 border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all">RETURN_TO_COMMAND</button>
          </Link>
          <button className="px-12 py-6 bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white/90 transition-all">GENERATE_CERTIFICATE</button>
          <button onClick={() => setFeedbackOpen(true)} className="px-12 py-6 border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all">PROVIDE_FEEDBACK</button>
        </div>

        {/* Feedback Modal */}
        <AnimatePresence>
          {feedbackOpen && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                className="bg-[#111] border border-white/10 p-8 max-w-md w-full relative"
              >
                <button onClick={() => setFeedbackOpen(false)} className="absolute top-4 right-4 text-white/40 hover:text-white">✕</button>
                <h3 className="text-2xl font-black italic mb-6">MISSION FEEDBACK</h3>
                {feedbackSuccess ? (
                  <div className="text-center py-10">
                    <CheckCircle className="mx-auto mb-4 text-white/40" size={40} />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em]">Feedback securely logged.</p>
                  </div>
                ) : (
                  <>
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-4">YOUR_ASSESSMENT_EXPERIENCE</p>
                    <textarea 
                      className="w-full bg-black border border-white/10 p-4 text-sm focus:outline-none focus:border-white/40 min-h-[120px] mb-6"
                      placeholder="Share your thoughts on the AI Proctoring and the assessment..."
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                    />
                    <button 
                      onClick={submitFeedback}
                      disabled={!feedbackText.trim()}
                      className="w-full px-6 py-4 bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/90 disabled:opacity-50"
                    >
                      SUBMIT_FEEDBACK
                    </button>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="mt-24 flex justify-center items-center gap-10 text-[9px] font-black uppercase tracking-[0.4em] text-white/10">
           <div className="flex items-center gap-2"><Lock size={12}/> DATA_SECURED</div>
           <div className="flex items-center gap-2"><Cpu size={12}/> CORE_VERIFIED</div>
           <div className="flex items-center gap-2"><Zap size={12}/> SkillScrumpt.in</div>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div className="space-y-2">
      <h4 className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">{label}</h4>
      <p className="text-sm font-black text-white uppercase italic tracking-wider">{value}</p>
    </div>
  );
}

function MetricCard({ label, value, sub, color }) {
  return (
    <div className="p-10 border border-white/10 text-center bg-white/[0.02]">
      <h4 className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] mb-4">{label}</h4>
      <p className={`text-5xl font-black mb-4 italic tracking-tighter ${color}`}>{value}</p>
      <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">{sub}</p>
    </div>
  );
}
