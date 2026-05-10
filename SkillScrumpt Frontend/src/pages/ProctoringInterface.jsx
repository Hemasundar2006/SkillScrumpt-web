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
  Cpu
} from 'lucide-react';
import { Button, GlassContainer, Badge, Card } from '../components/UI';
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

  // Generate 20 MCQs and 1 Coding Question
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
          if (!isSubmitting) handleFinish(); // Auto-submit when time is up
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
    // Navigate to results with real proctoring data
    navigate('/assessments/result', { 
        state: { 
            score: 85, // Assessment score
            proctoringScore: report?.proctoring_score || 100,
            report: report
        } 
    });
  };

  if (!isDesktop) return <DesktopRequiredView />;

  const currentQuestion = questions[currentQuestionIdx];

  return (
    <div className="min-h-screen bg-[#05070a] text-white flex flex-col font-inter selection:bg-primary/30">
      {/* Hidden canvas for useProctoring */}
      <canvas ref={canvasRef} style={{ display: "none" }} />
      
      {/* Proctoring Overlay (Internal handling of WS/Analysis) */}
      <div className="hidden">
         <ProctoringOverlay 
            userId={user?._id || user?.id} 
            examId={testId} 
            onScoreChange={setRealScore}
         />
      </div>

      {/* Dynamic Scanline Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[100] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] opacity-20" />

      {/* High-Tech Header */}
      <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full animate-pulse" />
            <Shield className="text-primary relative z-10" size={28} />
          </div>
          <div className="h-8 w-[1px] bg-white/10" />
          <div>
            <h1 className="text-lg font-black tracking-tight text-white/90">SkillScrumpt <span className="text-primary">ProctorV3</span></h1>
            <div className="flex items-center gap-2 mt-1">
              <div className={`w-2 h-2 rounded-full animate-pulse ${isActive ? 'bg-green-500' : 'bg-red-500'}`} />
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                 {isActive ? 'Live Security Session Active' : 'Security Session Paused'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-12">
          <div className="hidden xl:flex items-center gap-8">
             <ProctorIndicator icon={Camera} label="Biometrics" active={isActive && cameraReady} />
             <ProctorIndicator icon={Mic} label="Audio" active={isActive} />
             <ProctorIndicator icon={Monitor} label="Encrypted" active={isActive} />
          </div>
          
          <div className="flex items-center gap-4 bg-white/5 px-6 py-2.5 rounded-full border border-white/10 shadow-inner">
            <Clock size={18} className="text-primary" />
            <span className={`text-xl font-mono font-bold tracking-tighter ${timeLeft < 300 ? 'text-red-500 animate-pulse' : 'text-white/80'}`}>
              {formatTime(timeLeft)}
            </span>
          </div>

          <Button 
            variant="danger" 
            size="sm" 
            onClick={handleFinish}
            disabled={isSubmitting}
            className="h-10 px-8 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-red-500/20"
          >
            {isSubmitting ? 'Submitting...' : 'Terminate & Submit'}
          </Button>
        </div>
      </header>

      {/* Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar (Question Map) */}
        <aside className="w-20 border-r border-white/5 bg-black/20 flex flex-col items-center py-8 gap-4 overflow-y-auto">
          {questions.map((_, i) => (
            <button 
              key={i}
              onClick={() => setCurrentQuestionIdx(i)}
              className={`w-10 h-10 rounded-xl border flex items-center justify-center text-xs font-bold transition-all flex-shrink-0 ${
                i === currentQuestionIdx 
                  ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' 
                  : answers[i] !== undefined
                  ? 'bg-green-500/20 border-green-500/40 text-green-500'
                  : 'bg-white/5 border-white/10 text-gray-500 hover:border-white/30'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </aside>

        {/* Assessment Engine */}
        <main className="flex-1 p-12 overflow-y-auto bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.03),transparent)]">
          <div className="max-w-4xl mx-auto h-full">
            <motion.div
              key={currentQuestionIdx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8 h-full flex flex-col"
            >
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Badge variant="primary" className="bg-primary/10 text-primary border-primary/20 px-4 py-1 text-xs uppercase tracking-widest font-black">
                    {currentQuestion.type === 'mcq' ? 'Standardized MCQ' : 'Technical Coding Challenge'}
                  </Badge>
                  <span className="text-gray-500 font-mono text-xs">REF: SS-Q{currentQuestion.id}</span>
                </div>
                <h2 className="text-3xl font-black leading-tight text-white/95">
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
                <div className="flex-1 flex flex-col min-h-[400px]">
                   <div className="bg-[#1e1e1e] rounded-2xl border border-white/5 flex flex-col overflow-hidden shadow-2xl flex-1">
                      <div className="bg-[#181818] px-6 py-3 border-b border-white/5 flex items-center justify-between">
                         <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/40" />
                            <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/40" />
                            <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/40" />
                            <span className="ml-4 text-[10px] font-mono text-gray-500">solution.js</span>
                         </div>
                         <Badge variant="neutral" className="bg-primary/10 text-primary border-none text-[8px] font-black uppercase tracking-widest">Node.js Environment</Badge>
                      </div>
                      <textarea
                        className="flex-1 bg-transparent p-8 font-mono text-sm leading-relaxed text-gray-300 outline-none resize-none"
                        spellCheck="false"
                        defaultValue={currentQuestion.initialCode}
                        onChange={(e) => setAnswers({...answers, [currentQuestionIdx]: e.target.value})}
                      />
                   </div>
                </div>
              )}

              <div className="flex justify-between items-center pt-8 border-t border-white/5 mt-auto">
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentQuestionIdx(prev => Math.max(0, prev - 1))}
                  className="border-white/10 text-white hover:bg-white/5 h-12 px-8"
                  disabled={currentQuestionIdx === 0}
                >
                  <ChevronLeft className="mr-2" /> Previous
                </Button>
                <Button 
                  className="h-12 px-12 group"
                  onClick={() => {
                    if (currentQuestionIdx < questions.length - 1) {
                      setCurrentQuestionIdx(prev => prev + 1);
                    } else {
                      handleFinish();
                    }
                  }}
                >
                  {currentQuestionIdx === questions.length - 1 ? 'Finish Assessment' : 'Next Question'} 
                  <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </motion.div>
          </div>
        </main>

        {/* AI HUD Sidebar */}
        <aside className="w-[380px] border-l border-white/5 bg-[#080a0f] p-8 flex flex-col gap-10">
          <section>
             <div className="flex items-center justify-between mb-4">
               <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                 <Activity size={12} className="text-primary" /> Live Feed Matrix
               </h4>
               <Badge variant="neutral" className={`border-none text-[8px] ${isActive ? 'bg-red-500/10 text-red-500 animate-pulse' : 'bg-gray-500/10 text-gray-500'}`}>
                  {isActive ? 'RECORDING' : 'PAUSED'}
               </Badge>
             </div>
             
             <div className="relative aspect-video bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
               {/* Actual Video Stream */}
               <video 
                 ref={videoRef} 
                 autoPlay 
                 muted 
                 playsInline 
                 className={`w-full h-full object-cover scale-x-[-1] transition-opacity duration-500 ${cameraReady ? 'opacity-100' : 'opacity-30'}`} 
               />
               
               {/* AI Overlay Layer */}
               <div className="absolute inset-0 z-10 pointer-events-none">
                 {/* Face Tracking Simulation */}
                 <AnimatePresence>
                   {isActive && cameraReady && (
                     <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-40 border border-primary/40 rounded-[2rem] shadow-[0_0_15px_rgba(59,130,246,0.3)] flex flex-col items-center justify-center"
                     >
                        <div className="w-1 h-1 bg-primary rounded-full absolute top-10 left-10" />
                        <div className="w-1 h-1 bg-primary rounded-full absolute top-10 right-10" />
                        <div className="w-1 h-1 bg-primary rounded-full absolute bottom-12" />
                     </motion.div>
                   )}
                 </AnimatePresence>
                 
                 {/* Data Stream */}
                 <div className="absolute top-4 right-4 text-[8px] font-mono text-primary/70 text-right leading-tight">
                    FPS: 60.0<br/>
                    LATENCY: 12ms<br/>
                    SCORE: {realScore}%
                 </div>
               </div>

               {/* Static Noise Overlay */}
               <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://media.giphy.com/media/oEI9uWUicGLeU/giphy.gif')] mix-blend-overlay" />
             </div>
          </section>

          <section className="space-y-6">
            <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Biometric Telemetry</h4>
            <div className="grid grid-cols-2 gap-4">
              <TelemetryCard icon={Eye} label="Gaze" value={realScore > 80 ? "Centered" : "Deviated"} color={realScore > 80 ? "text-green-500" : "text-red-500"} />
              <TelemetryCard icon={Activity} label="Health" value={`${realScore}%`} color={realScore > 80 ? "text-green-500" : "text-amber-500"} />
              <TelemetryCard icon={Cpu} label="System" value={isActive ? "Monitoring" : "Idle"} color={isActive ? "text-green-500" : "text-gray-500"} />
              <TelemetryCard icon={Lock} label="Protocol" value="Encrypted" color="text-green-500" />
            </div>
          </section>

          <section>
            <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Security Protocol Logs</h4>
            <div className="bg-white/5 rounded-2xl p-4 border border-white/5 space-y-3 font-mono text-[10px] max-h-40 overflow-y-auto">
               {violations.length > 0 ? violations.map((v, i) => (
                 <div key={i} className={`flex gap-2 ${v.severity === 'high' || v.severity === 'critical' ? 'text-red-500' : 'text-amber-500'}`}>
                    <span className="opacity-50">[{new Date().toLocaleTimeString()}]</span>
                    <span>{v.message}</span>
                 </div>
               )) : (
                 <div className="flex gap-2 text-gray-500 italic">
                    <span className="text-primary/50">[{new Date().toLocaleTimeString()}]</span>
                    <span>Monitoring environmental data...</span>
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
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#05070a]/95 backdrop-blur-3xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Card className="w-full max-w-xl bg-black border-white/5 p-12 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
              <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-10 shadow-[0_0_40px_rgba(59,130,246,0.15)] border border-primary/20">
                <Shield size={48} className="animate-pulse" />
              </div>
              <h3 className="text-4xl font-black mb-6 tracking-tighter">Security Initiation</h3>
              <p className="text-gray-400 mb-12 leading-relaxed text-lg font-medium">
                The AI proctoring system is initializing. Please ensure you are in a well-lit environment and look directly at the sensor.
              </p>
              <div className="space-y-6">
                <Button className="w-full h-16 text-lg font-black uppercase tracking-widest shadow-2xl shadow-primary/30" onClick={startProctoring}>
                  Initialize Secure Session
                </Button>
                <div className="flex items-center justify-center gap-4 text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                   <div className="flex items-center gap-1"><Lock size={12}/> AES-256</div>
                   <div className="w-1 h-1 bg-gray-700 rounded-full" />
                   <div className="flex items-center gap-1"><Shield size={12}/> AI-VERIFIED</div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProctorIndicator({ icon: Icon, label, active = false }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-2 h-2 rounded-full ${active ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]'}`} />
      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</span>
    </div>
  );
}

function OptionCard({ label, text, selected = false, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full text-left p-6 border rounded-2xl transition-all flex gap-6 group relative overflow-hidden ${
        selected 
          ? 'bg-primary/10 border-primary shadow-[0_20px_40px_rgba(59,130,246,0.1)]' 
          : 'bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/[0.07]'
      }`}
    >
      {selected && <div className="absolute left-0 top-0 w-1 h-full bg-primary" />}
      <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm border transition-all ${
        selected ? 'bg-primary border-primary text-white scale-110 shadow-lg shadow-primary/30' : 'border-white/10 text-gray-500 group-hover:border-white/30'
      }`}>
        {label}
      </div>
      <p className={`text-lg font-medium leading-relaxed transition-colors ${selected ? 'text-white' : 'text-gray-400'}`}>
        {text}
      </p>
    </button>
  );
}

function TelemetryCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white/5 border border-white/5 p-4 rounded-2xl">
       <div className="flex items-center gap-2 mb-2 text-gray-500">
          <Icon size={14} />
          <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
       </div>
       <p className={`text-sm font-black ${color}`}>{value}</p>
    </div>
  );
}

function DesktopRequiredView() {
  return (
    <div className="min-h-screen bg-[#05070a] text-white flex items-center justify-center p-8 text-center relative overflow-hidden">
       <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(239,68,68,0.1),transparent)]" />
      <div className="max-w-md space-y-10 relative z-10">
        <div className="w-28 h-28 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto border border-red-500/20 shadow-2xl shadow-red-500/10">
          <Monitor size={56} className="animate-bounce" />
        </div>
        <div className="space-y-4">
          <h2 className="text-4xl font-black tracking-tighter">RESTRICTED ACCESS</h2>
          <p className="text-gray-400 text-lg font-medium leading-relaxed">
            AI Proctoring requires a full desktop environment for biometric telemetry and secure screen synchronization.
          </p>
        </div>
        <Link to="/dashboard/student" className="block">
          <Button variant="outline" className="w-full h-16 border-white/10 text-white hover:bg-white/5 uppercase tracking-widest font-black text-xs">
            Return to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
