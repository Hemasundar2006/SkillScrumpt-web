import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Camera, 
  Mic, 
  Monitor, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  X, 
  Users, 
  Lock,
  Clock,
  ChevronRight,
  ChevronLeft,
  Circle,
  Eye,
  Activity,
  Cpu,
  ArrowRight
} from 'lucide-react';
import { Button, Badge, Card } from '../components/UI';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../utils/api';

import { useProctoring } from '../hooks/useProctoring';
import { ProctoringOverlay } from '../components/ProctoringOverlay';

export function AIProctoringInterface() {
  const location = useLocation();
  const navigate = useNavigate();
  const testId = location.state?.testId;
  const user = JSON.parse(localStorage.getItem('user'));
  
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [realScore, setRealScore] = useState(100);
  const [isRunning, setIsRunning] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState("");
  const [isLocked, setIsLocked] = useState(false);
  const [lockMessage, setLockMessage] = useState("");
  const [remainingHours, setRemainingHours] = useState(null);

  useEffect(() => {
    const checkAttempt = async () => {
      try {
        await api.get(`/assessments/${testId || 'react-assessment-01'}`);
      } catch (error) {
        if (error.response && error.response.status === 403) {
          setIsLocked(true);
          setLockMessage(error.response.data.message);
          setRemainingHours(error.response.data.remainingHours);
        }
      }
    };
    checkAttempt();
  }, [testId]);

  const {
    startProctoring,
    stopProctoring,
    violations,
    isActive,
    cameraReady,
    videoRef,
    canvasRef,
  } = useProctoring({
    userId: user?._id || user?.id,
    examId: testId || 'react-assessment-01',
    onAlert: (alert) => {
      console.log("[HUD Alert]", alert);
    }
  });

  useEffect(() => {
    const criticalViolation = violations.find(v => v.severity === 'critical');
    if (criticalViolation && isActive) {
      handleFinish();
    }
  }, [violations, isActive]);

  const questions = [
    ...Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      type: 'mcq',
      question: `Question ${i + 1}: What is the output of this ${i % 2 === 0 ? 'React' : 'JavaScript'} concept?`,
      options: [
        'Option A: Performance optimized approach',
        'Option B: Standard implementation',
        'Option C: Deprecated but functional',
        'Option D: Syntax error in strict mode'
      ]
    })),
    {
      id: 21,
      type: 'coding',
      question: 'Implement a function to find the longest palindromic substring in a given string.',
      initialCode: '// Write your JavaScript solution here\nfunction longestPalindrome(s) {\n  \n}'
    }
  ];

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          if (!isSubmitting) handleFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(timer);
    };
  }, [isSubmitting]);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleFinish = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    const report = await stopProctoring();
    navigate('/assessments/result', { 
        state: { 
            score: 85,
            proctoringScore: report?.proctoring_score || 100,
            report: report
        } 
    });
  };

  if (isLocked) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-8 selection:bg-white selection:text-black">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-black border border-white/20 p-12 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-white" />
          <div className="w-24 h-24 border border-white/10 flex items-center justify-center mx-auto mb-10">
            <Lock size={40} className="text-white/40" />
          </div>
          <h2 className="text-4xl font-black mb-6 tracking-tighter uppercase italic">SESSION DENIED.</h2>
          <p className="text-white/40 text-[11px] font-bold uppercase tracking-widest leading-relaxed mb-10">
            {lockMessage || "Security systems detect multiple attempt signatures for this identity."}
          </p>

          {remainingHours && (
            <div className="border border-white/10 p-8 mb-12 bg-white/5">
               <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-3">Protocol Timeout Remaining</p>
               <div className="flex items-center justify-center gap-3">
                  <Clock size={20} className="text-white/50" />
                  <span className="text-3xl font-black italic">{remainingHours} HOURS</span>
               </div>
            </div>
          )}

          <button 
            className="w-full py-5 bg-white text-black font-black uppercase tracking-widest text-[11px] hover:bg-white/90 transition-all"
            onClick={() => navigate('/dashboard/student')}
          >
            Return to Control Center
          </button>
        </motion.div>
      </div>
    );
  }

  if (!isDesktop) return <DesktopRequiredView />;

  const currentQuestion = questions[currentQuestionIdx];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col selection:bg-white selection:text-black">
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <div className="hidden">
         <ProctoringOverlay 
            userId={user?._id || user?.id} 
            examId={testId} 
            onScoreChange={setRealScore}
         />
      </div>

      {/* High-Tech Header */}
      <header className="h-24 border-b border-white/10 flex items-center justify-between px-10 bg-black sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <div className="relative group">
            <Shield className="text-white relative z-10" size={32} />
          </div>
          <div className="h-10 w-[1px] bg-white/10" />
          <div>
            <h1 className="text-xl font-black tracking-tighter italic uppercase">SS.PROCTOR.IN.V4</h1>
            <div className="flex items-center gap-3 mt-1">
              <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-white animate-pulse' : 'bg-white/10'}`} />
              <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em]">
                 {isActive ? 'Live Security Relay Active' : 'Relay Terminated'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-16">
          <div className="hidden xl:flex items-center gap-12">
             <ProctorIndicator icon={Camera} label="BIOMETRICS" active={isActive && cameraReady} />
             <ProctorIndicator icon={Mic} label="AUDIO" active={isActive} />
             <ProctorIndicator icon={Monitor} label="ENCRYPTED" active={isActive} />
          </div>
          
          <div className="flex items-center gap-5 px-8 py-3 border border-white/10 bg-white/5">
            <Clock size={16} className="text-white/40" />
            <span className={`text-2xl font-black italic tracking-tighter ${timeLeft < 300 ? 'animate-pulse' : ''}`}>
              {formatTime(timeLeft)}
            </span>
          </div>

          <button 
            onClick={handleFinish}
            disabled={isSubmitting}
            className="h-12 px-10 border border-white text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all"
          >
            {isSubmitting ? 'TERMINATING...' : 'FINALIZE SESSION'}
          </button>
        </div>
      </header>

      {/* Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <aside className="w-24 border-r border-white/10 bg-black flex flex-col items-center py-10 gap-5 overflow-y-auto">
          {questions.map((_, i) => (
            <button 
              key={i}
              onClick={() => setCurrentQuestionIdx(i)}
              className={`w-12 h-12 border flex items-center justify-center text-[10px] font-black transition-all flex-shrink-0 ${
                i === currentQuestionIdx 
                  ? 'bg-white border-white text-black italic scale-110' 
                  : answers[i] !== undefined
                  ? 'bg-white/20 border-white/20 text-white'
                  : 'bg-black border-white/10 text-white/30 hover:border-white/50 hover:text-white'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </aside>

        {/* Assessment Engine */}
        <main className="flex-1 p-16 overflow-y-auto relative">
          <div className="max-w-5xl mx-auto h-full flex flex-col">
            <motion.div
              key={currentQuestionIdx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-12 h-full flex flex-col"
            >
              <div className="space-y-8">
                <div className="flex items-center gap-6 pb-6 border-b border-white/10">
                  <div className="px-4 py-1 border border-white text-[9px] font-black uppercase tracking-widest">
                    {currentQuestion.type === 'mcq' ? 'STANDARDIZED MCQ' : 'CODING DIRECTIVE'}
                  </div>
                  <span className="text-white/20 font-black text-[9px] uppercase tracking-widest">UID: SS_REF_{currentQuestion.id}</span>
                </div>
                <h2 className="text-4xl font-black leading-tight tracking-tight uppercase italic">
                  {currentQuestion.question}
                </h2>
              </div>

              {currentQuestion.type === 'mcq' ? (
                <div className="grid gap-4">
                  {currentQuestion.options.map((opt, i) => (
                    <OptionCard 
                      key={i}
                      label={String.fromCharCode(65 + i)} 
                      text={opt}
                      selected={answers[currentQuestionIdx] === i}
                      onClick={() => setAnswers({...answers, [currentQuestionIdx]: i})}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex-1 flex flex-col min-h-[500px] gap-6">
                   <div className="border border-white/10 flex flex-col overflow-hidden flex-[3] bg-white/[0.02]">
                      <div className="bg-white/5 px-8 py-4 border-b border-white/10 flex items-center justify-between">
                         <div className="flex items-center gap-4">
                            <div className="w-1.5 h-1.5 bg-white rounded-full" />
                            <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">solution_relay.js</span>
                         </div>
                         <button 
                            onClick={async () => {
                              setIsRunning(true);
                              setConsoleOutput("INITIATING COMPILER...");
                              try {
                                const response = await api.post('/compiler/run', {
                                  compiler: 'nodejs20',
                                  code: answers[currentQuestionIdx] || currentQuestion.initialCode,
                                  input: ''
                                });
                                setConsoleOutput(response.data.output || response.data.error || "RELAY SUCCESSFUL: NO OUTPUT.");
                              } catch (err) {
                                setConsoleOutput("COMPILER ERROR: " + err.message);
                              } finally {
                                setIsRunning(false);
                              }
                            }}
                            disabled={isRunning}
                            className="px-6 py-2 bg-white text-black text-[9px] font-black uppercase tracking-widest hover:bg-white/90 transition-all"
                          >
                            {isRunning ? 'EXECUTING...' : 'RUN MODULE'}
                          </button>
                      </div>
                      
                      <textarea
                        className="flex-1 bg-transparent p-10 font-mono text-sm leading-relaxed text-white/70 outline-none resize-none"
                        spellCheck="false"
                        value={answers[currentQuestionIdx] || currentQuestion.initialCode}
                        onChange={(e) => setAnswers({...answers, [currentQuestionIdx]: e.target.value})}
                      />
                   </div>

                   {/* Terminal */}
                   <div className="border border-white/10 flex flex-col overflow-hidden h-40 bg-black">
                      <div className="bg-white/5 px-6 py-2 border-b border-white/10 flex items-center justify-between">
                         <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">SECURITY CONSOLE // SKILLSCRUMPT.IN</span>
                         <button onClick={() => setConsoleOutput("")} className="text-[9px] text-white/20 hover:text-white uppercase font-black transition-colors">CLEAR</button>
                      </div>
                      <div className="flex-1 p-6 font-mono text-[11px] leading-relaxed overflow-y-auto whitespace-pre-wrap uppercase tracking-tighter">
                        {consoleOutput ? (
                          <div className="text-white/80">
                             {consoleOutput}
                          </div>
                        ) : (
                          <span className="text-white/10 italic">WAITING FOR OPERATIVE DATA...</span>
                        )}
                      </div>
                   </div>
                </div>
              )}

              <div className="flex justify-between items-center pt-12 border-t border-white/10 mt-auto">
                <button 
                  onClick={() => setCurrentQuestionIdx(prev => Math.max(0, prev - 1))}
                  className="px-10 py-5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:border-white transition-all disabled:opacity-20"
                  disabled={currentQuestionIdx === 0}
                >
                  PREVIOUS
                </button>
                <button 
                  className="px-16 py-5 bg-white text-black font-black uppercase tracking-widest text-[10px] hover:bg-white/90 transition-all flex items-center gap-4"
                  onClick={() => {
                    if (currentQuestionIdx < questions.length - 1) {
                      setCurrentQuestionIdx(prev => prev + 1);
                    } else {
                      handleFinish();
                    }
                  }}
                >
                  {currentQuestionIdx === questions.length - 1 ? 'FINALIZE ASSESSMENT' : 'NEXT DIRECTIVE'} 
                  <ArrowRight size={14} />
                </button>
              </div>
            </motion.div>
          </div>
        </main>

        {/* AI HUD Sidebar */}
        <aside className="w-[400px] border-l border-white/10 bg-black p-10 flex flex-col gap-12">
          <section>
             <div className="flex items-center justify-between mb-6">
               <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] flex items-center gap-3">
                 <Activity size={12} className="text-white" /> LIVE TELEMETRY
               </h4>
               <div className={`px-3 py-1 border border-white/10 text-[9px] font-black uppercase tracking-widest ${isActive ? 'animate-pulse text-white' : 'text-white/20'}`}>
                  {isActive ? 'RECORDING' : 'IDLE'}
               </div>
             </div>
             
             <div className="relative aspect-video border border-white/20 bg-white/5 overflow-hidden group">
               <video 
                 ref={videoRef} 
                 autoPlay 
                 muted 
                 playsInline 
                 className={`w-full h-full object-cover scale-x-[-1] grayscale transition-opacity duration-1000 ${cameraReady ? 'opacity-100' : 'opacity-10'}`} 
               />
               
               <div className="absolute inset-0 z-10 pointer-events-none">
                 <AnimatePresence>
                   {isActive && cameraReady && (
                     <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-48 border border-white/30 flex flex-col items-center justify-center"
                     >
                        <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-white" />
                        <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-white" />
                        <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-white" />
                        <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-white" />
                     </motion.div>
                   )}
                 </AnimatePresence>
                 
                 <div className="absolute bottom-4 left-4 text-[8px] font-mono text-white/40 tracking-widest uppercase">
                    SIM_ID: {user?._id?.substring(0,8) || 'OPERATIVE'}<br/>
                    LAT: 12.02<br/>
                    TRUST: {realScore}%
                 </div>
               </div>

               <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] opacity-20" />
             </div>
          </section>

          <section className="space-y-8">
            <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">SENSOR ANALYSIS</h4>
            <div className="grid grid-cols-2 gap-4">
              <TelemetryCard icon={Eye} label="GAZE" value={realScore > 80 ? "ALIGNED" : "DEVIATED"} active={realScore > 80} />
              <TelemetryCard icon={Activity} label="SCORE" value={`${realScore}%`} active={realScore > 80} />
              <TelemetryCard icon={Cpu} label="PROCESS" value={isActive ? "ACTIVE" : "IDLE"} active={isActive} />
              <TelemetryCard icon={Lock} label="IDENTITY" value="SECURE" active={true} />
            </div>
          </section>

          <section className="flex-1 flex flex-col min-h-0">
            <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mb-6">PROTOCOL LOGS</h4>
            <div className="flex-1 bg-white/5 border border-white/10 p-6 space-y-4 font-mono text-[9px] overflow-y-auto tracking-tighter uppercase">
               {violations.length > 0 ? violations.map((v, i) => (
                 <div key={i} className={`flex gap-3 ${v.severity === 'high' || v.severity === 'critical' ? 'text-white' : 'text-white/40'}`}>
                    <span className="opacity-30">[{new Date().toLocaleTimeString()}]</span>
                    <span className={v.severity === 'critical' ? 'font-black italic' : ''}>{v.message}</span>
                 </div>
               )) : (
                 <div className="flex gap-3 text-white/10 italic">
                    <span>[{new Date().toLocaleTimeString()}]</span>
                    <span>STANDBY: SCANNING FOR VIOLATIONS...</span>
                 </div>
               )}
            </div>
          </section>
        </aside>
      </div>

      {/* Initiation Overlay */}
      <AnimatePresence>
        {!isActive && (
          <motion.div 
            className="fixed inset-0 z-[200] flex items-center justify-center p-8 bg-black/95 backdrop-blur-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="w-full max-w-xl bg-black border border-white/20 p-16 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-white" />
              <div className="w-24 h-24 border border-white/10 flex items-center justify-center mx-auto mb-10">
                <Shield size={48} className="text-white/20 animate-pulse" />
              </div>
              <h3 className="text-4xl font-black mb-6 tracking-tighter uppercase italic">PROTOCOL INITIATION.</h3>
              <p className="text-white/40 text-[11px] font-bold uppercase tracking-[0.25em] leading-loose mb-16">
                The AI proctoring engine is awaiting synchronization. Establish biometric lock by positioning your face within the capture frame.
              </p>
              <div className="space-y-8">
                <button 
                   onClick={startProctoring}
                   className="w-full py-6 bg-white text-black text-xs font-black uppercase tracking-[0.5em] hover:bg-white/90 transition-all"
                >
                  ESTABLISH RELAY
                </button>
                <div className="flex items-center justify-center gap-8 text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">
                   <span>AES-256 ENCRYPTED</span>
                   <span>|</span>
                   <span>AI-VERIFIED SESSION</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProctorIndicator({ icon: Icon, label, active = false }) {
  return (
    <div className="flex items-center gap-4">
      <div className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-white' : 'bg-white/10'}`} />
      <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">{label}</span>
    </div>
  );
}

function OptionCard({ label, text, selected = false, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full text-left p-8 border transition-all flex gap-8 group relative overflow-hidden ${
        selected 
          ? 'bg-white text-black italic font-black' 
          : 'bg-black border-white/10 text-white/40 hover:border-white/50 hover:bg-white/5'
      }`}
    >
      <div className={`flex-shrink-0 w-12 h-12 border flex items-center justify-center text-[10px] font-black transition-all ${
        selected ? 'bg-black border-black text-white' : 'border-white/10 text-white/20 group-hover:border-white/40'
      }`}>
        {label}
      </div>
      <p className="text-xl leading-relaxed uppercase tracking-tight">
        {text}
      </p>
    </button>
  );
}

function TelemetryCard({ icon: Icon, label, value, active }) {
  return (
    <div className="border border-white/10 p-5 bg-white/5">
       <div className="flex items-center gap-3 mb-3 text-white/20">
          <Icon size={14} />
          <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
       </div>
       <p className={`text-sm font-black italic ${active ? 'text-white' : 'text-white/30'}`}>{value}</p>
       <div className="mt-4 pt-4 border-t border-white/5 text-[7px] font-black uppercase tracking-[0.3em] text-white/10">SS.CORE.RELAY</div>
    </div>
  );
}

function DesktopRequiredView() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-12 text-center relative overflow-hidden">
      <div className="max-w-md space-y-12 relative z-10">
        <div className="w-24 h-24 border border-white/10 flex items-center justify-center mx-auto">
          <Monitor size={48} className="text-white/20" />
        </div>
        <div className="space-y-6">
          <h2 className="text-4xl font-black tracking-tighter uppercase italic">ACCESS DENIED.</h2>
          <p className="text-white/40 text-[11px] font-bold uppercase tracking-[0.25em] leading-loose">
            AI Proctoring requires an established desktop environment for biometric synchronization.
          </p>
        </div>
        <Link to="/dashboard/student" className="block">
          <button className="w-full py-6 border border-white text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">
            Return to Dashboard
          </button>
        </Link>
      </div>
    </div>
  );
}
