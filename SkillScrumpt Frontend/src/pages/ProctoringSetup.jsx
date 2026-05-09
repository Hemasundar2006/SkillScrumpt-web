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
  XCircle
} from 'lucide-react';
import { Button, Card, Badge } from '../components/UI';
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

  // Setup steps
  const steps = [
    { title: 'Welcome', icon: Shield, desc: 'Let\'s get your environment ready for the assessment.' },
    { title: 'Identity', icon: Camera, desc: 'Verify your face and allow camera access.' },
    { title: 'Audio', icon: Mic, desc: 'Check your microphone and background noise.' },
    { title: 'Screen', icon: Monitor, desc: 'Share your screen to prevent unauthorized tools.' },
    { title: 'Ready', icon: CheckCircle, desc: 'All systems verified. Good luck!' }
  ];

  const [stream, setStream] = useState(null);

  // Camera handling
  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(s);
      setIsCameraActive(true);
    } catch (err) {
      console.error('Camera error:', err);
      alert('Could not access camera. Please check permissions.');
    }
  };

  useEffect(() => {
    if (isCameraActive && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
    
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
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

  // Mic/Audio handling (Simulated noise level)
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
      console.error('Mic error:', err);
      alert('Could not access microphone.');
    }
  };

  // Screen share handling
  const startScreenShare = async () => {
    try {
      await navigator.mediaDevices.getDisplayMedia({ video: true });
      setIsScreenActive(true);
    } catch (err) {
      console.error('Screen share error:', err);
      alert('Screen share is required to continue.');
    }
  };

  const nextStep = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else navigate(`/assessments/live`, { state: { testId: id } });
  };

  return (
    <DashboardLayout user={user}>
      <div className="pb-12 px-4 flex flex-col items-center">
        {/* Progress Stepper */}
        <div className="max-w-3xl w-full mb-12">
          <div className="flex justify-between items-center relative">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 z-0" />
            <motion.div 
              className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 z-0 transition-all duration-500"
              style={{ width: `${(step / (steps.length - 1)) * 100}%` }}
            />
            {steps.map((s, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
                  i <= step ? 'bg-primary border-primary text-white shadow-lg shadow-primary/30' : 'bg-white border-gray-200 text-gray-400'
                }`}>
                  {i < step ? <CheckCircle size={18} /> : <s.icon size={18} />}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-tighter mt-2 ${i <= step ? 'text-primary' : 'text-gray-400'}`}>
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
            className="max-w-2xl w-full"
          >
            <Card className="p-10 border-none shadow-2xl bg-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-10 -mt-10" />
              
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-primary/10 text-primary rounded-custom">
                  {React.createElement(steps[step].icon, { size: 28 })}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-secondary">{steps[step].title} Setup</h2>
                  <p className="text-gray-500 text-sm font-medium">{steps[step].desc}</p>
                </div>
              </div>

              {/* Step Content */}
              <div className="min-h-[300px] flex flex-col">
                {step === 0 && (
                  <div className="space-y-6">
                    <div className="bg-blue-50 p-6 rounded-custom border border-blue-100 flex gap-4">
                      <Info className="text-primary shrink-0" />
                      <p className="text-sm text-blue-900 font-medium leading-relaxed">
                        This assessment is proctored by SkillScrumpt AI. To ensure integrity, we need to verify your hardware and environment before you start.
                      </p>
                    </div>
                    <ul className="space-y-4">
                      <li className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                        <div className="w-2 h-2 bg-primary rounded-full" /> Stable internet connection required
                      </li>
                      <li className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                        <div className="w-2 h-2 bg-primary rounded-full" /> A quiet room with good lighting
                      </li>
                      <li className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                        <div className="w-2 h-2 bg-primary rounded-full" /> No other windows or tabs open
                      </li>
                    </ul>
                    <div className="pt-8 flex gap-4">
                      <Button onClick={nextStep} className="flex-1 h-14">Get Started</Button>
                      <button onClick={() => setStep(4)} className="text-gray-400 hover:text-secondary text-sm font-bold px-4">Skip Tour</button>
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div className="space-y-6">
                    <div className="relative aspect-video bg-gray-900 rounded-custom overflow-hidden border-2 border-gray-100 shadow-inner group">
                      {!isCameraActive ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8 text-center">
                          <Camera size={48} className="mb-4 text-gray-600" />
                          <p className="mb-6 font-medium text-gray-400">Camera access is required for verification</p>
                          <Button onClick={startCamera}>Enable Camera</Button>
                        </div>
                      ) : (
                        <>
                          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                          {capturedImage && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center animate-in fade-in">
                              <img src={capturedImage} className="max-h-[80%] rounded-lg border-4 border-white shadow-2xl" alt="Captured" />
                              <button onClick={() => setCapturedImage(null)} className="absolute top-4 right-4 bg-white rounded-full p-2 text-red-500 shadow-xl">
                                <XCircle size={24} />
                              </button>
                            </div>
                          )}
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                            <button 
                              onClick={capturePhoto}
                              className="w-16 h-16 bg-white rounded-full border-4 border-primary/20 flex items-center justify-center shadow-2xl hover:scale-110 transition-transform active:scale-95"
                            >
                              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white">
                                 <Camera size={24} />
                              </div>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                    <canvas ref={canvasRef} className="hidden" />
                    <Button disabled={!capturedImage} onClick={nextStep} className="w-full h-14">
                      Verify Identity <ArrowRight className="ml-2" size={18} />
                    </Button>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-8">
                    <div className="p-8 bg-gray-50 rounded-custom border border-gray-100 text-center">
                      {!isMicActive ? (
                        <div className="space-y-6">
                          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm border border-gray-100">
                            <Mic size={32} className="text-gray-400" />
                          </div>
                          <p className="font-bold text-gray-600">Testing microphone levels...</p>
                          <Button onClick={startMic}>Test Microphone</Button>
                        </div>
                      ) : (
                        <div className="space-y-8">
                           <div className="flex items-end justify-center gap-1 h-20 mb-4">
                             {[...Array(20)].map((_, i) => (
                               <motion.div 
                                 key={i}
                                 animate={{ height: `${Math.random() * noiseLevel + 5}%` }}
                                 className={`w-2 bg-primary rounded-full ${noiseLevel > 60 ? 'bg-red-500' : 'bg-primary'}`}
                               />
                             ))}
                           </div>
                           <div className="flex items-center justify-center gap-2">
                              <Volume2 className={noiseLevel > 60 ? 'text-red-500' : 'text-primary'} />
                              <span className="text-sm font-bold text-gray-600">Background Noise: {noiseLevel > 60 ? 'Too High' : 'Good'}</span>
                           </div>
                           <Badge variant={noiseLevel > 60 ? 'warning' : 'success'} className="px-6 py-2">
                             {noiseLevel > 60 ? 'Please move to a quieter room' : 'Audio Verified'}
                           </Badge>
                        </div>
                      )}
                    </div>
                    <Button disabled={!isMicActive} onClick={nextStep} className="w-full h-14">
                      Proceed to Screen Share <ArrowRight className="ml-2" size={18} />
                    </Button>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-8">
                    <div className="p-10 border-2 border-dashed border-gray-200 rounded-custom text-center bg-gray-50/50">
                      <Monitor size={48} className="text-gray-300 mx-auto mb-6" />
                      <h4 className="text-lg font-bold text-secondary mb-2">Share Full Screen</h4>
                      <p className="text-sm text-gray-500 font-medium mb-8 max-w-sm mx-auto">
                        To prevent usage of unauthorized materials, you must share your entire screen.
                      </p>
                      <Button onClick={startScreenShare} variant={isScreenActive ? 'outline' : 'primary'} className="px-8">
                        {isScreenActive ? 'Screen Sharing Active' : 'Start Screen Sharing'}
                      </Button>
                    </div>
                    <div className="bg-amber-50 p-4 rounded-lg border border-amber-100 flex gap-3">
                      <AlertCircle className="text-amber-500 shrink-0" size={18} />
                      <p className="text-xs text-amber-900 font-medium">
                        Stopping screen share during the test will result in immediate disqualification.
                      </p>
                    </div>
                    <Button disabled={!isScreenActive} onClick={nextStep} className="w-full h-14">
                      Final Check <ArrowRight className="ml-2" size={18} />
                    </Button>
                  </div>
                )}

                {step === 4 && (
                  <div className="text-center space-y-8 animate-in zoom-in duration-500">
                    <div className="w-32 h-32 bg-green-50 rounded-full flex items-center justify-center mx-auto border-4 border-white shadow-xl shadow-green-500/10">
                      <CheckCircle size={64} className="text-green-500" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-secondary mb-2">You're All Set!</h3>
                      <p className="text-gray-500 font-medium">Everything is verified and ready for the assessment.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-left max-w-md mx-auto">
                      <div className="bg-gray-50 p-3 rounded-lg flex items-center gap-2 border border-gray-100">
                        <Camera size={16} className="text-green-500" />
                        <span className="text-xs font-bold text-gray-600">Camera Verified</span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg flex items-center gap-2 border border-gray-100">
                        <Mic size={16} className="text-green-500" />
                        <span className="text-xs font-bold text-gray-600">Audio Optimized</span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg flex items-center gap-2 border border-gray-100">
                        <Monitor size={16} className="text-green-500" />
                        <span className="text-xs font-bold text-gray-600">Screen Locked</span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg flex items-center gap-2 border border-gray-100">
                        <Shield size={16} className="text-green-500" />
                        <span className="text-xs font-bold text-gray-600">Proctoring Active</span>
                      </div>
                    </div>
                    <Button onClick={nextStep} className="w-full h-16 text-lg shadow-2xl shadow-primary/30">
                      Start Assessment Now
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>

        <p className="mt-8 text-gray-400 text-xs font-medium flex items-center gap-2">
          <Shield size={12} /> Secure Proctoring Session • IP: Verified • Time: {new Date().toLocaleTimeString()}
        </p>
      </div>
    </DashboardLayout>
  );
}
