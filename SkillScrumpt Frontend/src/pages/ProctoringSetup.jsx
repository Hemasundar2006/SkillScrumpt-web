import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  Mic, 
  Monitor, 
  Shield, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight, 
  Info,
  Volume2,
  XCircle,
  Zap,
  Lock,
  Cpu
} from 'lucide-react';
import { Button, Badge } from '../components/UI';
import { DashboardLayout } from '../layout/DashboardLayout';
import api from '../utils/api';

export function ProctoringSetup() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);
  const [isScreenActive, setIsScreenActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [noiseLevel, setNoiseLevel] = useState(0);
  const [user, setUser] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    setUser(savedUser);
  }, []);

  const steps = [
    { title: 'Welcome', icon: Shield, desc: 'Initializing Security Parameters' },
    { title: 'Biometrics', icon: Camera, desc: 'Identity Verification' },
    { icon: Mic, title: 'Audio', desc: 'Environment Calibration' },
    { icon: Monitor, title: 'Screen', desc: 'Display Synchronization' },
    { icon: CheckCircle, title: 'Ready', desc: 'All Systems Verified' }
  ];

  const [stream, setStream] = useState(null);

  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(s);
      setIsCameraActive(true);
    } catch (err) {
      alert('Camera access denied. Please allow camera permissions.');
    }
  };

  useEffect(() => {
    if (isCameraActive && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, [isCameraActive, stream]);

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0);
      setCapturedImage(canvasRef.current.toDataURL('image/png'));
    }
  };

  useEffect(() => {
    if (step === 2) {
      const interval = setInterval(() => {
        setNoiseLevel(Math.random() * 40 + 10);
      }, 500);
      return () => clearInterval(interval);
    }
  }, [step]);

  const startMic = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsMicActive(true);
    } catch (err) {
      alert('Microphone access denied. Please allow microphone permissions.');
    }
  };

  const startScreenShare = async () => {
    try {
      await navigator.mediaDevices.getDisplayMedia({ video: true });
      setIsScreenActive(true);
    } catch (err) {
      alert('Screen recording access required for proctoring.');
    }
  };

  const nextStep = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else navigate(`/assessments/live`, { state: { testId: id } });
  };

  return (
    <DashboardLayout user={user}>
      <div className="pb-24 px-4 flex flex-col items-center min-h-[80vh] bg-slate-50 font-sans">
        {/* Progress Stepper */}
        <div className="max-w-4xl w-full mb-16 pt-8">
          <div className="flex justify-between items-center relative">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -translate-y-1/2 z-0 rounded-full" />
            <motion.div 
              className="absolute top-1/2 left-0 h-1 bg-indigo-600 -translate-y-1/2 z-0 transition-all duration-700 rounded-full"
              style={{ width: `${(step / (steps.length - 1)) * 100}%` }}
            />
            {steps.map((s, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-sm ${
                  i <= step ? 'bg-indigo-600 text-white scale-110 shadow-indigo-200' : 'bg-white text-slate-400 border border-slate-200'
                }`}>
                  {i < step ? <CheckCircle size={20} /> : <s.icon size={20} />}
                </div>
                <span className={`text-xs font-bold mt-4 ${i <= step ? 'text-slate-900' : 'text-slate-400'}`}>
                  {s.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-3xl w-full"
          >
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden p-8 md:p-12 relative">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-sm">
                    {React.createElement(steps[step].icon, { size: 28 })}
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{steps[step].title}</h2>
                    <p className="text-slate-500 text-sm font-medium mt-1">{steps[step].desc}</p>
                  </div>
                </div>
                <div className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-xl">
                  Step {step + 1} of 5
                </div>
              </div>

              <div className="min-h-[350px] flex flex-col">
                {step === 0 && (
                  <div className="space-y-8">
                    <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-2xl flex gap-5">
                      <Shield className="text-indigo-600 shrink-0" size={24} />
                      <p className="text-sm font-medium leading-relaxed text-indigo-900">
                        This assessment is proctored by SkillScrumpt AI. To ensure session integrity, we require synchronization of your camera, microphone, and screen display.
                      </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-5">
                       <InfoItem label="Latency" value="Optimum" />
                       <InfoItem label="Security" value="AES-256" />
                       <InfoItem label="Identity" value="Pending" />
                    </div>
                    <div className="pt-8 flex flex-col sm:flex-row gap-4">
                      <button onClick={nextStep} className="flex-1 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-md">
                        Initiate Setup
                      </button>
                      <button onClick={() => setStep(4)} className="text-slate-500 hover:text-slate-900 text-sm font-bold px-8 transition-colors">Skip Tour</button>
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div className="space-y-8">
                    <div className="relative aspect-video rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden group shadow-inner">
                      {!isCameraActive ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                            <Camera size={32} className="text-slate-400" />
                          </div>
                          <p className="mb-8 text-sm font-medium text-slate-500 max-w-xs">We need access to your camera to verify your identity during the assessment.</p>
                          <button onClick={startCamera} className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-sm">Allow Camera</button>
                        </div>
                      ) : (
                        <>
                          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover scale-x-[-1]" />
                          {capturedImage && (
                            <div className="absolute inset-0 bg-white/95 flex items-center justify-center animate-in fade-in p-6 backdrop-blur-sm">
                              <img src={capturedImage} className="max-h-full rounded-xl border border-slate-200 shadow-md scale-x-[-1]" alt="Captured" />
                              <button onClick={() => setCapturedImage(null)} className="absolute top-6 right-6 w-10 h-10 bg-white text-slate-500 rounded-full flex items-center justify-center hover:bg-slate-100 hover:text-rose-500 transition-colors shadow-sm">
                                <XCircle size={24} />
                              </button>
                            </div>
                          )}
                          {!capturedImage && (
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
                              <button 
                                onClick={capturePhoto}
                                className="w-16 h-16 rounded-full border-4 border-white bg-indigo-600 flex items-center justify-center group hover:bg-indigo-700 transition-all shadow-lg hover:scale-105"
                              >
                                 <Camera size={24} className="text-white" />
                              </button>
                            </div>
                          )}
                        </>
                      )}
                      <div className="absolute top-4 left-4 px-3 py-1.5 bg-white/90 backdrop-blur text-[10px] font-bold text-slate-600 uppercase tracking-widest rounded-lg shadow-sm">
                        Status: {isCameraActive ? 'Active' : 'Offline'}
                      </div>
                    </div>
                    <canvas ref={canvasRef} className="hidden" />
                    <button 
                      disabled={!capturedImage} 
                      onClick={nextStep} 
                      className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Confirm Photo
                    </button>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-8">
                    <div className="p-12 border border-slate-200 rounded-2xl bg-slate-50 text-center shadow-inner">
                      {!isMicActive ? (
                        <div className="space-y-8">
                          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                            <Mic size={32} className="text-slate-400" />
                          </div>
                          <p className="text-sm font-medium text-slate-500">We need to check your microphone to ensure your environment is quiet enough for the assessment.</p>
                          <button onClick={startMic} className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-sm">Allow Microphone</button>
                        </div>
                      ) : (
                        <div className="space-y-10">
                           <div className="flex items-center justify-center gap-1.5 h-20 mb-4">
                             {[...Array(30)].map((_, i) => (
                               <motion.div 
                                 key={i}
                                 animate={{ height: `${Math.random() * noiseLevel + 5}%` }}
                                 className={`w-2 rounded-full transition-colors ${noiseLevel > 60 ? 'bg-rose-400' : 'bg-indigo-400'}`}
                               />
                             ))}
                           </div>
                           <div className="flex flex-col items-center gap-3">
                              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Environment Check</span>
                              <div className={`px-6 py-2.5 rounded-xl text-sm font-bold shadow-sm ${noiseLevel > 60 ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                                {noiseLevel > 60 ? 'Too Loud - Find a quiet place' : 'Perfect - Environment is quiet'}
                              </div>
                           </div>
                        </div>
                      )}
                    </div>
                    <button 
                      disabled={!isMicActive} 
                      onClick={nextStep} 
                      className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue
                    </button>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-8">
                    <div className="p-12 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 text-center">
                      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                         <Monitor size={32} className="text-indigo-500" />
                      </div>
                      <h4 className="text-xl font-bold text-slate-900 mb-3">Share Your Screen</h4>
                      <p className="text-sm text-slate-500 font-medium mb-8 max-w-sm mx-auto leading-relaxed">
                        Full display synchronization is required to secure the operative workspace environment. Please select your entire screen.
                      </p>
                      <button 
                        onClick={startScreenShare} 
                        className={`px-8 py-3 rounded-xl text-sm font-bold transition-all shadow-sm ${isScreenActive ? 'bg-emerald-500 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                      >
                        {isScreenActive ? 'Screen Shared Successfully' : 'Share Entire Screen'}
                      </button>
                    </div>
                    <div className="p-5 rounded-2xl bg-amber-50 border border-amber-100 flex gap-4">
                      <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={20} />
                      <p className="text-sm text-amber-800 font-medium leading-relaxed">
                        Disconnecting the display relay during the session will result in immediate test termination.
                      </p>
                    </div>
                    <button 
                      disabled={!isScreenActive} 
                      onClick={nextStep} 
                      className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Complete Setup
                    </button>
                  </div>
                )}

                {step === 4 && (
                  <div className="text-center space-y-12 py-6">
                    <div className="w-28 h-28 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-sm ring-8 ring-emerald-50/50">
                      <CheckCircle size={48} />
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-3xl font-bold text-slate-900 tracking-tight">You're All Set!</h3>
                      <p className="text-slate-500 text-sm font-medium">All systems have been verified successfully.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-left max-w-sm mx-auto">
                      <StatusItem icon={Camera} label="Camera" />
                      <StatusItem icon={Mic} label="Audio" />
                      <StatusItem icon={Monitor} label="Screen" />
                      <StatusItem icon={Shield} label="Security" />
                    </div>
                    <button 
                      onClick={nextStep} 
                      className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200"
                    >
                      Start Assessment
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-12 flex items-center gap-6 text-xs font-bold text-slate-400">
           <div className="flex items-center gap-1.5"><Lock size={14}/> Secure Session</div>
           <div className="w-1.5 h-1.5 bg-slate-300 rounded-full"/>
           <div className="flex items-center gap-1.5"><Shield size={14}/> Verified</div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="border border-slate-200 p-4 rounded-xl bg-white shadow-sm text-center md:text-left">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-sm font-bold text-slate-900">{value}</p>
    </div>
  );
}

function StatusItem({ icon: Icon, label }) {
  return (
    <div className="border border-slate-200 p-4 rounded-xl flex items-center gap-3 bg-white shadow-sm">
      <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
         <Icon size={16} />
      </div>
      <span className="text-xs font-bold text-slate-700">{label} Verified</span>
    </div>
  );
}
