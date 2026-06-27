import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import * as tf from '@tensorflow/tfjs';
import * as blazeface from '@tensorflow-models/blazeface';
import { 
  Camera, 
  Mic, 
  Monitor, 
  Shield, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  Lock,
  Info,
  User,
  UserX,
  Loader2
} from 'lucide-react';
import { DashboardLayout } from '../layout/DashboardLayout';

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

  const [isDetecting, setIsDetecting] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const [showExamples, setShowExamples] = useState(false);
  const modelRef = useRef(null);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    setUser(savedUser);
    
    // Load face detection model
    const initModel = async () => {
      try {
        await tf.ready();
        modelRef.current = await blazeface.load();
      } catch (e) {
        console.error("Failed to load blazeface", e);
      }
    };
    initModel();
  }, []);

  const steps = [
    { title: 'Welcome', icon: Shield, desc: 'Initializing Security' },
    { title: 'Biometrics', icon: Camera, desc: 'Identity Verification' },
    { icon: Mic, title: 'Audio', desc: 'Environment Check' },
    { icon: Monitor, title: 'Screen', desc: 'Display Sync' },
    { icon: CheckCircle, title: 'Ready', desc: 'All Verified' }
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

  const capturePhoto = async () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0);
      
      if (modelRef.current) {
        setIsDetecting(true);
        setValidationError(null);
        setShowExamples(false);
        
        try {
          const predictions = await modelRef.current.estimateFaces(canvasRef.current, false);
          
          if (predictions.length > 0) {
            setCapturedImage(canvasRef.current.toDataURL('image/png'));
          } else {
            setValidationError("Face not detected. Please take a picture of your face and then continue.");
            setShowExamples(true);
          }
        } catch (e) {
          console.error("Face detection failed", e);
          // Fallback if detection crashes
          setCapturedImage(canvasRef.current.toDataURL('image/png'));
        } finally {
          setIsDetecting(false);
        }
      } else {
        // Fallback if model isn't loaded
        setCapturedImage(canvasRef.current.toDataURL('image/png'));
      }
    }
  };

  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const animationRef = useRef(null);

  const startMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setStream(stream);
      setIsMicActive(true);

      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      
      analyser.fftSize = 256;
      microphone.connect(analyser);
      
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      dataArrayRef.current = dataArray;

      const updateNoiseLevel = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArrayRef.current);
        const sum = dataArrayRef.current.reduce((a, b) => a + b, 0);
        const average = sum / bufferLength;
        // Map average (usually 0-60) to 0-100 percentage
        setNoiseLevel(Math.min(average * 2, 100)); 
        animationRef.current = requestAnimationFrame(updateNoiseLevel);
      };

      updateNoiseLevel();
    } catch (err) {
      alert('Microphone access denied. Please allow microphone permissions.');
    }
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []);

  const startScreenShare = async () => {
    try {
      const displayStream = await navigator.mediaDevices.getDisplayMedia({ 
        video: { displaySurface: "monitor" }
      });
      
      const track = displayStream.getVideoTracks()[0];
      const settings = track.getSettings();
      
      if (settings.displaySurface !== 'monitor') {
        alert("For security purposes, you MUST select 'Entire Screen'. Please close any unrelated tabs and try again.");
        track.stop();
        return;
      }

      track.onended = () => {
        setIsScreenActive(false);
        setStep(1); // Return to initial step
        alert("Screen sharing was terminated. You have been returned to the beginning of the setup.");
      };
      
      setIsScreenActive(true);
    } catch (err) {
      alert('Screen sharing access denied or cancelled.');
    }
  };

  // Detect if the user switches tabs
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isScreenActive) {
        setIsScreenActive(false);
        setStep(1);
        alert("SECURITY WARNING: You navigated away from the proctoring tab! For security reasons, you must close other tabs and restart the setup.");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isScreenActive]);

  const nextStep = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else navigate(`/assessments/live/${id}`);
  };

  return (
    <DashboardLayout user={user}>
      <div className="flex-1 w-full flex flex-col items-center justify-center font-sans bg-[#FFF0E5] rounded-[24px] p-6 shadow-inner relative overflow-hidden h-full min-h-0">
        
        {/* Progress Stepper (Compact) */}
        <div className="w-full max-w-4xl mb-6 relative shrink-0">
          <div className="flex justify-between items-center relative px-4">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-[#E0F2FE] -translate-y-1/2 z-0 rounded-full" />
            <motion.div 
              className="absolute top-1/2 left-0 h-1 bg-[#38BDF8] -translate-y-1/2 z-0 transition-all duration-700 rounded-full shadow-[0_0_8px_rgba(56,189,248,0.5)]"
              style={{ width: `${(step / (steps.length - 1)) * 100}%` }}
            />
            {steps.map((s, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center">
                <div className={`w-10 h-10 rounded-[12px] flex items-center justify-center transition-all duration-500 shadow-sm ${
                  i <= step ? 'bg-[#38BDF8] text-white scale-110 shadow-[0_4px_12px_rgba(56,189,248,0.4)]' : 'bg-white text-slate-300 border border-slate-100'
                }`}>
                  {i < step ? <CheckCircle size={18} /> : <s.icon size={18} />}
                </div>
                <span className={`absolute top-[120%] text-[10px] font-bold whitespace-nowrap uppercase tracking-wider ${i <= step ? 'text-[#1E293B]' : 'text-slate-400'}`}>
                  {s.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="w-full max-w-3xl flex-1 flex flex-col min-h-0 relative mt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -10 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full bg-white rounded-[20px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#38BDF8]/10 overflow-hidden flex flex-col"
            >
              <div className="p-6 md:p-8 flex flex-col h-full">
                
                {/* Card Header */}
                <div className="flex items-center justify-between gap-4 mb-6 shrink-0">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#E0F2FE] text-[#38BDF8] rounded-[12px] flex items-center justify-center shadow-inner">
                      {React.createElement(steps[step].icon, { size: 24 })}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-[#1E293B] tracking-tight">{steps[step].title}</h2>
                      <p className="text-[#1E293B]/60 text-sm font-medium">{steps[step].desc}</p>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-[#FFF0E5] text-[#F97316] text-xs font-bold rounded-full">
                    Step {step + 1} / 5
                  </div>
                </div>

                {/* Step Content */}
                <div className="flex-1 flex flex-col justify-center min-h-0 overflow-y-auto custom-scrollbar">
                  {step === 0 && (
                    <div className="space-y-6">
                      <div className="p-4 bg-[#E0F2FE] border border-[#38BDF8]/20 rounded-[16px] flex gap-4 items-center">
                        <Shield className="text-[#38BDF8] shrink-0" size={24} />
                        <p className="text-sm font-medium leading-relaxed text-[#1E293B]">
                          This assessment is proctored by SkillScrumpt AI. To ensure session integrity, we require synchronization of your camera, microphone, and screen display.
                        </p>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <InfoItem label="Latency" value="Optimum" />
                        <InfoItem label="Security" value="AES-256" />
                        <InfoItem label="Identity" value="Pending" />
                      </div>
                    </div>
                  )}

                  {step === 1 && (
                    <div className="flex flex-col items-center justify-center h-full min-h-0 w-full py-2 space-y-6">
                      <div className="relative w-full max-w-[300px] aspect-square rounded-[24px] bg-[#FFF0E5] border-4 border-[#38BDF8]/20 overflow-hidden shadow-inner flex flex-col items-center justify-center mx-auto ring-4 ring-[#E0F2FE]">
                        {!isCameraActive ? (
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-slate-50">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-slate-100">
                              <Camera size={28} className="text-[#F97316]" />
                            </div>
                            <p className="mb-6 text-sm font-medium text-[#1E293B]/70 max-w-[200px]">Allow camera access</p>
                            <button onClick={startCamera} className="px-6 py-2.5 bg-[#F97316] text-white text-sm font-bold rounded-[12px] hover:bg-[#EA580C] transition-all shadow-[0_4px_12px_rgba(249,115,22,0.25)] hover:-translate-y-0.5">Start</button>
                          </div>
                        ) : (
                          <>
                            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover scale-x-[-1]" />
                            <canvas ref={canvasRef} className="hidden" />
                            {capturedImage && (
                              <div className="absolute inset-0 bg-white/80 flex items-center justify-center animate-in fade-in p-2 backdrop-blur-md">
                                <img src={capturedImage} className="w-full h-full rounded-[20px] border-4 border-white shadow-lg scale-x-[-1] object-cover" alt="Captured" />
                                <button onClick={() => setCapturedImage(null)} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 text-[#1E293B] rounded-full flex items-center justify-center hover:text-red-500 hover:shadow-lg transition-all shadow-md backdrop-blur">
                                  <XCircle size={28} />
                                </button>
                              </div>
                            )}
                            
                            {isDetecting && (
                              <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center z-20 rounded-[24px]">
                                <Loader2 size={32} className="text-[#38BDF8] animate-spin mb-2" />
                              </div>
                            )}
                          </>
                        )}
                        <div className="absolute top-4 left-4 px-4 py-1.5 bg-white/90 backdrop-blur text-[10px] font-bold text-[#1E293B] uppercase tracking-wider rounded-full shadow-sm z-10 flex items-center gap-2 border border-slate-200">
                          <div className={`w-1.5 h-1.5 rounded-full ${isCameraActive ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)] animate-pulse' : 'bg-[#F97316] shadow-[0_0_8px_rgba(249,115,22,0.8)]'}`} />
                          {isCameraActive ? 'Feed Active' : 'Feed Offline'}
                        </div>
                      </div>

                      {isCameraActive && !capturedImage && (
                        <div className="flex justify-center z-10">
                          <button 
                            onClick={capturePhoto}
                            disabled={isDetecting}
                            className="w-16 h-16 rounded-full border-[4px] border-white bg-[#F97316] flex items-center justify-center hover:bg-[#EA580C] hover:scale-105 transition-all shadow-lg disabled:opacity-50 disabled:hover:scale-100 ring-4 ring-[#F97316]/20"
                          >
                            <Camera size={24} className="text-white" />
                          </button>
                        </div>
                      )}

                      {showExamples && (
                        <div className="relative w-full max-w-xl p-4 bg-red-50 border border-red-200 rounded-[16px] animate-in fade-in slide-in-from-bottom-4 flex flex-col items-center shrink-0 shadow-sm">
                          <button 
                            onClick={() => setShowExamples(false)} 
                            className="absolute top-2 right-2 text-red-400 hover:text-red-600 hover:bg-red-100/50 p-1 rounded-full transition-all"
                          >
                            <XCircle size={18} />
                          </button>
                          <p className="text-sm font-bold text-red-600 mb-3 text-center flex items-center gap-2 px-6">
                            <AlertCircle size={16} className="shrink-0" /> 
                            <span>{validationError}</span>
                          </p>
                          <div className="flex justify-center gap-6 w-full mt-1">
                            <div className="flex flex-col items-center gap-1.5">
                              <div className="w-16 h-16 bg-white border-2 border-green-400 rounded-full flex items-center justify-center shadow-sm relative overflow-hidden">
                                <User className="text-slate-700 w-10 h-10 mt-2" />
                                <div className="absolute top-1 right-1 bg-green-500 rounded-full p-0.5"><CheckCircle size={10} className="text-white" /></div>
                              </div>
                              <span className="text-[10px] font-bold text-green-700 uppercase">Correct</span>
                            </div>
                            <div className="flex flex-col items-center gap-1.5">
                              <div className="w-16 h-16 bg-white border-2 border-red-400 rounded-full flex items-center justify-center shadow-sm relative overflow-hidden">
                                <UserX className="text-slate-300 w-10 h-10 absolute bottom-[-10px] left-[-10px]" />
                                <div className="absolute top-1 right-1 bg-red-500 rounded-full p-0.5"><XCircle size={10} className="text-white" /></div>
                              </div>
                              <span className="text-[10px] font-bold text-red-700 uppercase">No Face</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {step === 2 && (
                    <div className="flex flex-col items-center justify-center h-full min-h-0 w-full py-4">
                      <div className="w-full h-full max-h-[300px] max-w-md p-8 border border-[#38BDF8]/20 rounded-[16px] bg-[#E0F2FE]/50 text-center shadow-inner flex flex-col items-center justify-center">
                        {!isMicActive ? (
                          <div className="space-y-6">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                              <Mic size={28} className="text-[#38BDF8]" />
                            </div>
                            <p className="text-sm font-medium text-[#1E293B]/70">We need to check your microphone to ensure your environment is quiet enough.</p>
                            <button onClick={startMic} className="px-6 py-2.5 bg-[#38BDF8] text-white text-sm font-bold rounded-[12px] hover:bg-[#38BDF8] transition-all shadow-[0_4px_12px_rgba(56,189,248,0.25)] hover:-translate-y-0.5">Allow Microphone</button>
                          </div>
                        ) : (
                          <div className="space-y-8 w-full">
                            <div className="flex items-center justify-center gap-1.5 h-16">
                              {[...Array(24)].map((_, i) => (
                                <motion.div 
                                  key={i}
                                  animate={{ height: `${Math.random() * noiseLevel + 10}%` }}
                                  className={`w-1.5 rounded-full transition-colors ${noiseLevel > 60 ? 'bg-[#F97316]' : 'bg-[#38BDF8]'}`}
                                />
                              ))}
                            </div>
                            <div className="flex flex-col items-center gap-2">
                              <span className="text-[10px] font-bold text-[#1E293B]/50 uppercase tracking-wider">Environment Check</span>
                              <div className={`px-4 py-2 rounded-[10px] text-xs font-bold shadow-sm ${noiseLevel > 60 ? 'bg-red-50 text-red-600 border border-red-200 animate-pulse' : 'bg-[#E0F2FE] text-[#38BDF8] border border-[#38BDF8]/30'}`}>
                                {noiseLevel > 60 ? 'Too loud! Please go to a quiet environment.' : 'Perfect - Environment is quiet'}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="flex flex-col items-center justify-center h-full min-h-0 w-full py-4 space-y-4">
                      <div className="w-full h-full max-h-[250px] max-w-md p-6 border-2 border-dashed border-[#38BDF8]/30 rounded-[16px] bg-[#E0F2FE]/20 text-center flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                          <Monitor size={28} className="text-[#38BDF8]" />
                        </div>
                        <h4 className="text-lg font-bold text-[#1E293B] mb-2">Share Your Screen</h4>
                        <p className="text-xs text-[#1E293B]/60 font-medium mb-6 leading-relaxed">
                          Full display synchronization is required. Please select your entire screen.
                        </p>
                        <button 
                          onClick={startScreenShare} 
                          className={`px-6 py-2.5 rounded-[12px] text-sm font-bold transition-all shadow-sm hover:-translate-y-0.5 ${isScreenActive ? 'bg-green-500 text-white shadow-[0_4px_12px_rgba(34,197,94,0.3)]' : 'bg-[#38BDF8] text-white hover:bg-[#38BDF8] shadow-[0_4px_12px_rgba(56,189,248,0.25)]'}`}
                        >
                          {isScreenActive ? 'Screen Shared Successfully' : 'Share Entire Screen'}
                        </button>
                      </div>
                      <div className="w-full max-w-md p-4 rounded-[12px] bg-[#FFF0E5] border border-[#F97316]/20 flex gap-3 items-start shrink-0">
                        <AlertCircle className="text-[#F97316] shrink-0" size={16} />
                        <p className="text-[11px] text-[#1E293B]/80 font-bold leading-relaxed">
                          Disconnecting the display relay during the session will result in immediate termination.
                        </p>
                      </div>
                    </div>
                  )}

                  {step === 4 && (
                    <div className="text-center space-y-6 h-full flex flex-col justify-center items-center">
                      <div className="w-24 h-24 bg-[#E0F2FE] text-[#38BDF8] rounded-full flex items-center justify-center shadow-sm ring-4 ring-[#E0F2FE]/50 relative">
                        <div className="absolute inset-0 bg-[#38BDF8] rounded-full animate-ping opacity-20" />
                        <CheckCircle size={40} />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-[#1E293B] tracking-tight">You're All Set!</h3>
                        <p className="text-[#1E293B]/60 text-sm font-medium">All systems verified successfully.</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3 w-full max-w-[280px]">
                        <StatusItem icon={Camera} label="Camera" />
                        <StatusItem icon={Mic} label="Audio" />
                        <StatusItem icon={Monitor} label="Screen" />
                        <StatusItem icon={Shield} label="Security" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Controls */}
                <div className="pt-6 mt-2 border-t border-slate-100 shrink-0">
                  {step === 0 && (
                    <div className="flex gap-4">
                      <button onClick={nextStep} className="flex-1 py-3 bg-[#F97316] text-white font-bold rounded-[12px] hover:bg-[#EA580C] transition-all shadow-[0_8px_20px_rgba(249,115,22,0.25)] hover:-translate-y-0.5">
                        Initiate Setup
                      </button>
                      <button onClick={() => setStep(4)} className="text-[#1E293B]/50 hover:text-[#1E293B] text-sm font-bold px-6 transition-colors">Skip</button>
                    </div>
                  )}
                  {step === 1 && (
                    <button 
                      disabled={!capturedImage} 
                      onClick={nextStep} 
                      className="w-full py-3 bg-[#1E293B] text-white font-bold rounded-[12px] hover:bg-slate-800 transition-all shadow-[0_8px_20px_rgba(30,41,59,0.2)] disabled:opacity-50 disabled:hover:-translate-y-0 hover:-translate-y-0.5"
                    >
                      Confirm Photo
                    </button>
                  )}
                  {step === 2 && (
                    <button 
                      disabled={!isMicActive} 
                      onClick={nextStep} 
                      className="w-full py-3 bg-[#1E293B] text-white font-bold rounded-[12px] hover:bg-slate-800 transition-all shadow-[0_8px_20px_rgba(30,41,59,0.2)] disabled:opacity-50 disabled:hover:-translate-y-0 hover:-translate-y-0.5"
                    >
                      Continue
                    </button>
                  )}
                  {step === 3 && (
                    <button 
                      disabled={!isScreenActive} 
                      onClick={nextStep} 
                      className="w-full py-3 bg-[#1E293B] text-white font-bold rounded-[12px] hover:bg-slate-800 transition-all shadow-[0_8px_20px_rgba(30,41,59,0.2)] disabled:opacity-50 disabled:hover:-translate-y-0 hover:-translate-y-0.5"
                    >
                      Complete Setup
                    </button>
                  )}
                  {step === 4 && (
                    <button 
                      onClick={nextStep} 
                      className="w-full py-3 bg-[#F97316] text-white font-bold rounded-[12px] hover:bg-[#EA580C] transition-all shadow-[0_8px_20px_rgba(249,115,22,0.25)] hover:-translate-y-0.5"
                    >
                      Start Assessment
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Global Security Footer */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-4 text-[10px] font-bold text-[#1E293B]/40 uppercase tracking-widest shrink-0">
          <div className="flex items-center gap-1.5"><Lock size={12}/> Secure Session</div>
          <div className="w-1 h-1 bg-[#1E293B]/20 rounded-full"/>
          <div className="flex items-center gap-1.5"><Shield size={12}/> Verified</div>
        </div>

      </div>
    </DashboardLayout>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="border border-slate-100 p-3 rounded-[12px] bg-slate-50 text-center shadow-sm">
      <p className="text-[10px] font-bold text-[#1E293B]/50 uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-xs font-bold text-[#1E293B]">{value}</p>
    </div>
  );
}

function StatusItem({ icon: Icon, label }) {
  return (
    <div className="border border-[#38BDF8]/10 p-2.5 rounded-[12px] flex items-center gap-2 bg-[#E0F2FE]/30">
      <div className="w-6 h-6 rounded-full bg-[#38BDF8] flex items-center justify-center text-white shrink-0 shadow-sm">
        <Icon size={12} />
      </div>
      <span className="text-[10px] font-bold text-[#1E293B]">{label} <span className="opacity-60">Verified</span></span>
    </div>
  );
}
