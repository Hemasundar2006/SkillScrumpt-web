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

export function AIProctoringInterface() {
  const location = useLocation();
  const navigate = useNavigate();
  const testId = location.state?.testId;
  
  const [isIdentityVerified, setIsIdentityVerified] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const [stream, setStream] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const videoRef = useRef(null);

  // Mock Questions (Should ideally be fetched via testId)
  const questions = [
    {
      id: 1,
      type: 'mcq',
      question: 'In React, what is the primary purpose of the "key" prop in a list of elements?',
      options: [
        'To uniquely identify an element among its siblings for efficient DOM diffing.',
        'To provide a CSS class name for styling specific list items.',
        'To enable the browser to cache the list item for faster re-rendering.',
        'To satisfy the React compiler that the developer is following best practices.'
      ]
    },
    {
      id: 2,
      type: 'mcq',
      question: 'Which hook would you use to store a mutable value that does not cause a re-render when changed?',
      options: [
        'useState',
        'useMemo',
        'useRef',
        'useCallback'
      ]
    }
  ];

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    
    // Timer Logic
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(timer);
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startLiveFeed = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(s);
      setIsRecording(true);
      if (videoRef.current) {
        videoRef.current.srcObject = s;
      }
    } catch (err) {
      console.error('Proctoring feed error:', err);
    }
  };

  useEffect(() => {
    if (isIdentityVerified && !stream) {
      startLiveFeed();
    }
  }, [isIdentityVerified]);

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, isIdentityVerified]);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleFinish = async () => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      navigate('/assessments/result', { state: { score: 85, total: 100 } });
    }, 2000);
  };

  if (!isDesktop) return <DesktopRequiredView />;

  return (
    <div className="min-h-screen bg-[#05070a] text-white flex flex-col font-inter selection:bg-primary/30">
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
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Live Security Session Active</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-12">
          <div className="hidden xl:flex items-center gap-8">
             <ProctorIndicator icon={Camera} label="Biometrics" active={isRecording} />
             <ProctorIndicator icon={Mic} label="Audio" active={isRecording} />
             <ProctorIndicator icon={Monitor} label="Encrypted" active={isRecording} />
          </div>
          
          <div className="flex items-center gap-4 bg-white/5 px-6 py-2.5 rounded-full border border-white/10 shadow-inner">
            <Clock size={18} className="text-primary" />
            <span className="text-xl font-mono font-bold tracking-tighter text-white/80">{formatTime(timeLeft)}</span>
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
          {Array.from({ length: 15 }).map((_, i) => (
            <button 
              key={i}
              onClick={() => setCurrentQuestionIdx(i % questions.length)}
              className={`w-10 h-10 rounded-xl border flex items-center justify-center text-xs font-bold transition-all ${
                i === currentQuestionIdx 
                  ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' 
                  : 'bg-white/5 border-white/10 text-gray-500 hover:border-white/30'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </aside>

        {/* Assessment Engine */}
        <main className="flex-1 p-12 overflow-y-auto bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.03),transparent)]">
          <div className="max-w-4xl mx-auto">
            <motion.div
              key={currentQuestionIdx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-12"
            >
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Badge variant="primary" className="bg-primary/10 text-primary border-primary/20 px-4 py-1 text-xs">Standardized MCQ</Badge>
                  <span className="text-gray-500 font-mono text-xs">REF: SS-ASSESS-Q{currentQuestionIdx + 1}</span>
                </div>
                <h2 className="text-4xl font-black leading-tight text-white/95">
                  {questions[currentQuestionIdx % questions.length].question}
                </h2>
              </div>

              <div className="grid gap-4">
                {questions[currentQuestionIdx % questions.length].options.map((opt, i) => (
                  <OptionCard 
                    key={i}
                    label={String.fromCharCode(65 + i)} 
                    text={opt}
                    selected={answers[currentQuestionIdx] === i}
                    onClick={() => setAnswers({...answers, [currentQuestionIdx]: i})}
                  />
                ))}
              </div>

              <div className="flex justify-between items-center pt-12 border-t border-white/5">
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentQuestionIdx(prev => Math.max(0, prev - 1))}
                  className="border-white/10 text-white hover:bg-white/5 h-12 px-8"
                >
                  <ChevronLeft className="mr-2" /> Previous
                </Button>
                <Button 
                  className="h-12 px-12 group"
                  onClick={() => setCurrentQuestionIdx(prev => prev + 1)}
                >
                  Next Question <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
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
               <Badge variant="neutral" className="bg-red-500/10 text-red-500 border-none text-[8px] animate-pulse">RECORDING</Badge>
             </div>
             
             <div className="relative aspect-video bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
               {/* Actual Video Stream */}
               <video 
                 ref={videoRef} 
                 autoPlay 
                 muted 
                 playsInline 
                 className="w-full h-full object-cover scale-x-[-1]" 
               />
               
               {/* AI Overlay Layer */}
               <div className="absolute inset-0 z-10 pointer-events-none">
                 {/* Face Tracking Simulation */}
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-40 border border-primary/40 rounded-[2rem] shadow-[0_0_15px_rgba(59,130,246,0.3)] flex flex-col items-center justify-center">
                    <div className="w-1 h-1 bg-primary rounded-full absolute top-10 left-10" />
                    <div className="w-1 h-1 bg-primary rounded-full absolute top-10 right-10" />
                    <div className="w-1 h-1 bg-primary rounded-full absolute bottom-12" />
                 </div>
                 
                 {/* Data Stream */}
                 <div className="absolute top-4 right-4 text-[8px] font-mono text-primary/70 text-right leading-tight">
                    FPS: 60.0<br/>
                    LATENCY: 12ms<br/>
                    ID: {testId || 'VERIFIED'}
                 </div>
               </div>

               {/* Static Noise Overlay */}
               <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://media.giphy.com/media/oEI9uWUicGLeU/giphy.gif')] mix-blend-overlay" />
             </div>
          </section>

          <section className="space-y-6">
            <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Biometric Telemetry</h4>
            <div className="grid grid-cols-2 gap-4">
              <TelemetryCard icon={Eye} label="Gaze" value="Centered" color="text-green-500" />
              <TelemetryCard icon={Activity} label="Pulse" value="78 BPM" color="text-primary" />
              <TelemetryCard icon={Cpu} label="System" value="Locked" color="text-green-500" />
              <TelemetryCard icon={Lock} label="Browser" value="Secure" color="text-green-500" />
            </div>
          </section>

          <section>
            <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Security Protocol Logs</h4>
            <div className="bg-white/5 rounded-2xl p-4 border border-white/5 space-y-3 font-mono text-[10px]">
               <div className="flex gap-2 text-gray-500">
                  <span className="text-primary/50">[04:32:01]</span>
                  <span>Environment scan completed.</span>
               </div>
               <div className="flex gap-2 text-gray-500">
                  <span className="text-primary/50">[04:35:12]</span>
                  <span>Candidate identity matched.</span>
               </div>
               <div className="flex gap-2 text-green-500">
                  <span className="text-green-500/50">[04:38:45]</span>
                  <span>Audio encryption active.</span>
               </div>
            </div>
          </section>
        </aside>
      </div>

      {/* Identity Verification Overlay */}
      <AnimatePresence>
        {!isIdentityVerified && (
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
                <Button className="w-full h-16 text-lg font-black uppercase tracking-widest shadow-2xl shadow-primary/30" onClick={() => setIsIdentityVerified(true)}>
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
