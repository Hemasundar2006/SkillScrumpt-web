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
    { title: 'WELCOME', icon: Shield, desc: 'INITIALIZING SECURITY PARAMETERS.' },
    { title: 'BIOMETRICS', icon: Camera, desc: 'ESTABLISHING VISUAL IDENTITY LOCK.' },
    { icon: Mic, title: 'ACOUSTICS', desc: 'CALIBRATING AUDIO ENVIRONMENT.' },
    { icon: Monitor, title: 'SYNC', desc: 'SYNCHRONIZING WORKSPACE TELEMETRY.' },
    { icon: CheckCircle, title: 'READY', desc: 'ALL SYSTEMS NOMINAL.' }
  ];

  const [stream, setStream] = useState(null);

  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(s);
      setIsCameraActive(true);
    } catch (err) {
      alert('PROTOCOL_ERROR: CAMERA_ACCESS_DENIED');
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
      alert('PROTOCOL_ERROR: AUDIO_ACCESS_DENIED');
    }
  };

  const startScreenShare = async () => {
    try {
      await navigator.mediaDevices.getDisplayMedia({ video: true });
      setIsScreenActive(true);
    } catch (err) {
      alert('PROTOCOL_ERROR: SCREEN_SYNC_REQUIRED');
    }
  };

  const nextStep = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else navigate(`/assessments/live`, { state: { testId: id } });
  };

  return (
    <DashboardLayout user={user}>
      <div className="pb-24 px-4 flex flex-col items-center min-h-[80vh] selection:bg-white selection:text-black">
        {/* Progress Stepper */}
        <div className="max-w-4xl w-full mb-20">
          <div className="flex justify-between items-center relative">
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/10 -translate-y-1/2 z-0" />
            <motion.div 
              className="absolute top-1/2 left-0 h-[1px] bg-white -translate-y-1/2 z-0 transition-all duration-700"
              style={{ width: `${(step / (steps.length - 1)) * 100}%` }}
            />
            {steps.map((s, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center">
                <div className={`w-12 h-12 flex items-center justify-center border transition-all duration-500 ${
                  i <= step ? 'bg-white border-white text-black italic scale-110' : 'bg-black border-white/10 text-white/20'
                }`}>
                  {i < step ? <CheckCircle size={20} /> : <s.icon size={20} />}
                </div>
                <span className={`text-[9px] font-black uppercase tracking-widest mt-4 ${i <= step ? 'text-white' : 'text-white/20'}`}>
                  {s.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="max-w-3xl w-full"
          >
            <div className="border border-white/10 bg-white/5 p-1">
              <div className="bg-black border border-white/10 p-12 md:p-16 relative overflow-hidden">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-16">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 border border-white/10 flex items-center justify-center text-white/40">
                      {React.createElement(steps[step].icon, { size: 32 })}
                    </div>
                    <div>
                      <h2 className="text-4xl font-black tracking-tighter uppercase italic">{steps[step].title}</h2>
                      <p className="text-white/30 text-[10px] font-black uppercase tracking-widest mt-2">{steps[step].desc}</p>
                    </div>
                  </div>
                  <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Phase {step + 1} of 5</div>
                </div>

                <div className="min-h-[350px] flex flex-col">
                  {step === 0 && (
                    <div className="space-y-12">
                      <div className="p-8 border border-white/10 bg-white/5 flex gap-6">
                        <Shield className="text-white shrink-0" size={24} />
                        <p className="text-[11px] font-bold uppercase tracking-widest leading-loose text-white/50">
                          This assessment is proctored by SkillScrumpt.in AI. To ensure session integrity, we require synchronization of all biometric and environmental telemetry.
                        </p>
                      </div>
                      <div className="grid md:grid-cols-3 gap-6">
                         <InfoItem label="Latency" value="Optimum" />
                         <InfoItem label="Security" value="AES-256" />
                         <InfoItem label="Identity" value="Pending" />
                      </div>
                      <div className="pt-12 flex flex-col sm:flex-row gap-6">
                        <button onClick={nextStep} className="flex-1 py-6 bg-white text-black font-black uppercase tracking-[0.4em] text-xs hover:bg-white/90 transition-all">
                          Initiate Sequence
                        </button>
                        <button onClick={() => setStep(4)} className="text-white/20 hover:text-white text-[10px] font-black uppercase tracking-widest px-8 transition-colors">Bypass Tour</button>
                      </div>
                    </div>
                  )}

                  {step === 1 && (
                    <div className="space-y-8">
                      <div className="relative aspect-video border border-white/10 bg-black overflow-hidden group">
                        {!isCameraActive ? (
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-12 text-center">
                            <Camera size={48} className="mb-6 text-white/10" />
                            <p className="mb-10 text-[10px] font-black uppercase tracking-widest text-white/30">Biometric Sensor Access Required</p>
                            <button onClick={startCamera} className="px-10 py-4 border border-white text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">Authorize Sensor</button>
                          </div>
                        ) : (
                          <>
                            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover grayscale" />
                            {capturedImage && (
                              <div className="absolute inset-0 bg-black/90 flex items-center justify-center animate-in fade-in p-8">
                                <img src={capturedImage} className="max-h-full border border-white/20 grayscale" alt="Captured" />
                                <button onClick={() => setCapturedImage(null)} className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors">
                                  <XCircle size={32} />
                                </button>
                              </div>
                            )}
                            {!capturedImage && (
                              <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
                                <button 
                                  onClick={capturePhoto}
                                  className="w-20 h-20 border border-white bg-black/50 backdrop-blur-md flex items-center justify-center group hover:bg-white transition-all"
                                >
                                   <Camera size={28} className="text-white group-hover:text-black" />
                                </button>
                              </div>
                            )}
                          </>
                        )}
                        <div className="absolute inset-0 pointer-events-none border-[20px] border-black/20" />
                        <div className="absolute top-6 left-6 text-[9px] font-mono text-white/30 uppercase tracking-widest">Sensor_Ready: {isCameraActive ? 'True' : 'False'}</div>
                      </div>
                      <canvas ref={canvasRef} className="hidden" />
                      <button 
                        disabled={!capturedImage} 
                        onClick={nextStep} 
                        className="w-full py-6 bg-white text-black font-black uppercase tracking-[0.4em] text-xs hover:bg-white/90 transition-all disabled:opacity-20"
                      >
                        Confirm Biometric Lock
                      </button>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-12">
                      <div className="p-12 border border-white/10 bg-white/5 text-center">
                        {!isMicActive ? (
                          <div className="space-y-10">
                            <div className="w-24 h-24 border border-white/10 flex items-center justify-center mx-auto">
                              <Mic size={40} className="text-white/10" />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Calibrating Acoustic Environment...</p>
                            <button onClick={startMic} className="px-10 py-4 border border-white text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">Authorize Mic</button>
                          </div>
                        ) : (
                          <div className="space-y-12">
                             <div className="flex items-end justify-center gap-2 h-24 mb-6">
                               {[...Array(24)].map((_, i) => (
                                 <motion.div 
                                   key={i}
                                   animate={{ height: `${Math.random() * noiseLevel + 5}%` }}
                                   className={`w-1 bg-white transition-colors ${noiseLevel > 60 ? 'bg-white/20' : 'bg-white'}`}
                                 />
                               ))}
                             </div>
                             <div className="flex flex-col items-center gap-4">
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Environment Signature</span>
                                <div className={`px-6 py-2 border text-[9px] font-black uppercase tracking-widest ${noiseLevel > 60 ? 'border-white/10 text-white/20' : 'border-white text-white italic'}`}>
                                  {noiseLevel > 60 ? 'INTERFERENCE_DETECTED' : 'OPTIMAL_ACOUSTICS'}
                                </div>
                             </div>
                          </div>
                        )}
                      </div>
                      <button 
                        disabled={!isMicActive} 
                        onClick={nextStep} 
                        className="w-full py-6 bg-white text-black font-black uppercase tracking-[0.4em] text-xs hover:bg-white/90 transition-all disabled:opacity-20"
                      >
                        Synchronize Workspace
                      </button>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-12">
                      <div className="p-16 border border-white/10 border-dashed bg-white/5 text-center">
                        <Monitor size={48} className="text-white/10 mx-auto mb-10" />
                        <h4 className="text-xl font-black uppercase italic mb-4">Display Relay</h4>
                        <p className="text-[10px] text-white/30 font-black uppercase tracking-widest mb-12 max-w-sm mx-auto leading-relaxed">
                          Full display synchronization is required to secure the operative workspace environment.
                        </p>
                        <button 
                          onClick={startScreenShare} 
                          className={`px-10 py-5 border text-[10px] font-black uppercase tracking-widest transition-all ${isScreenActive ? 'bg-white text-black' : 'border-white hover:bg-white hover:text-black'}`}
                        >
                          {isScreenActive ? 'RELAY_STABLE' : 'ESTABLISH RELAY'}
                        </button>
                      </div>
                      <div className="p-6 border border-white/10 flex gap-4">
                        <AlertCircle className="text-white/20 shrink-0" size={18} />
                        <p className="text-[9px] text-white/40 font-black uppercase tracking-widest leading-loose">
                          DISCONNECTING DISPLAY RELAY DURING SESSION WILL RESULT IN IMMEDIATE PROTOCOL TERMINATION.
                        </p>
                      </div>
                      <button 
                        disabled={!isScreenActive} 
                        onClick={nextStep} 
                        className="w-full py-6 bg-white text-black font-black uppercase tracking-[0.4em] text-xs hover:bg-white/90 transition-all disabled:opacity-20"
                      >
                        Final Validation
                      </button>
                    </div>
                  )}

                  {step === 4 && (
                    <div className="text-center space-y-16 py-8">
                      <div className="w-32 h-32 border border-white flex items-center justify-center mx-auto italic font-black text-4xl">
                        READY.
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-4xl font-black tracking-tighter uppercase italic">SYSTEMS NOMINAL.</h3>
                        <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em]">All security protocols established and verified.</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-left max-w-md mx-auto">
                        <StatusItem icon={Camera} label="Biometrics" />
                        <StatusItem icon={Mic} label="Acoustics" />
                        <StatusItem icon={Monitor} label="Relay" />
                        <StatusItem icon={Shield} label="Proctoring" />
                      </div>
                      <button 
                        onClick={nextStep} 
                        className="w-full py-8 bg-white text-black font-black uppercase tracking-[0.5em] text-sm hover:bg-white/90 transition-all"
                      >
                        START ASSESSMENT
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-16 flex items-center gap-8 text-[9px] font-black uppercase tracking-[0.3em] text-white/20">
           <div className="flex items-center gap-2"><Lock size={12}/> SECURE SESSION</div>
           <div className="flex items-center gap-2"><Cpu size={12}/> AI_VERIFIED</div>
           <div className="flex items-center gap-2"><Zap size={12}/> SkillScrumpt.in</div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="border border-white/10 p-5 bg-white/5">
      <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-2">{label}</p>
      <p className="text-sm font-black italic uppercase text-white/80">{value}</p>
    </div>
  );
}

function StatusItem({ icon: Icon, label }) {
  return (
    <div className="border border-white/10 p-4 flex items-center gap-4 bg-white/5">
      <Icon size={14} className="text-white" />
      <span className="text-[9px] font-black uppercase tracking-widest text-white/50">{label} VERIFIED</span>
    </div>
  );
}
