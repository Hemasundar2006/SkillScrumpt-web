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
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api';

import { useProctoring } from '../hooks/useProctoring';
import { ProctoringOverlay } from '../components/ProctoringOverlay';

export function AIProctoringInterface() {
  const { testId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
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

  const [questions, setQuestions] = useState([]);
  const [assessment, setAssessment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAssessmentData = async () => {
      if (!testId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        console.log(`Attempting to fetch assessment with ID: ${testId}`);
        const response = await api.get(`/assessments/${testId}`);
        
        if (response.data) {
          setAssessment(response.data);
          if (response.data.questions && response.data.questions.length > 0) {
            setQuestions(response.data.questions);
            if (response.data.duration) {
              setTimeLeft(response.data.duration * 60);
            }
          } else {
            console.warn('Assessment found but contains no questions.');
            setQuestions([
              {
                id: 1,
                type: 'mcq',
                question: 'Assessment data error: No questions are associated with this test ID.',
                options: ['Return to Dashboard', 'Contact Support'],
                correctAnswer: 0
              }
            ]);
          }
        }
      } catch (err) {
        console.error('Error fetching assessment questions:', err);
        if (err.response) {
          if (err.response.status === 403) {
            setIsLocked(true);
            setLockMessage(err.response.data.message);
            setRemainingHours(err.response.data.remainingHours);
          } else if (err.response.status === 404) {
            setQuestions([
              {
                id: 1,
                type: 'mcq',
                question: `Error 404: The assessment ID "${testId}" was not found in our database.`,
                options: ['Go Back', 'Browse All Tests'],
                correctAnswer: 0
              }
            ]);
          } else {
            setQuestions([
              {
                id: 1,
                type: 'mcq',
                question: `Backend Error: ${err.response.data.message || 'Failed to connect to assessment engine.'}`,
                options: ['Retry', 'Exit'],
                correctAnswer: 0
              }
            ]);
          }
        } else {
          setQuestions([
            {
              id: 1,
              type: 'mcq',
              question: 'Network Error: Unable to reach the SkillScrumpt backend. Please check your connection.',
              options: ['Retry', 'Exit'],
              correctAnswer: 0
            }
          ]);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchAssessmentData();
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
    examId: testId,
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
    if (isSubmitting || questions.length === 0) return;
    setIsSubmitting(true);
    const report = await stopProctoring();
    
    try {
      // Calculate technical score from actual answers
      let correctCount = 0;
      let totalPoints = 0;
      let earnedPoints = 0;

      questions.forEach((q, idx) => {
        const qPoints = q.points || 1;
        totalPoints += qPoints;
        
        if (q.type === 'mcq') {
          const selectedOptionIdx = answers[idx];
          if (selectedOptionIdx !== undefined && q.options[selectedOptionIdx]?.isCorrect) {
            correctCount++;
            earnedPoints += qPoints;
          }
        } else if (q.type === 'coding') {
          // For coding challenges, we do a basic length/keyword check if not using a real runner
          // or we can assume a base score if they attempted it
          if (answers[idx] && answers[idx].length > 50) {
            correctCount++;
            earnedPoints += qPoints;
          }
        }
      });
      
      const technicalScore = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;

      const response = await api.post(`/assessments/${testId}/submit`, {
        score: technicalScore,
        totalQuestions: questions.length,
        correctAnswers: correctCount,
        timeTaken: (assessment?.duration * 60 || 3600) - timeLeft,
        proctoringReport: report,
      });

      navigate('/assessments/result', { 
          state: { 
              score: response.data.score || technicalScore,
              proctoringScore: report?.proctoring_score || 100,
              report: {
                ...report,
                aiAnalysis: response.data.aiAnalysis // Include the backend analysis
              },
              status: response.data.status,
              assessmentId: testId
          } 
      });
    } catch (error) {
      console.error("Error submitting assessment:", error);
      navigate('/assessments/result', { 
          state: { 
              score: 0,
              proctoringScore: report?.proctoring_score || 0,
              report: report,
              status: 'failed'
          } 
      });
    }
  };

  if (isLocked) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white rounded-[2rem] p-12 text-center relative overflow-hidden shadow-xl border border-slate-100"
        >
          <div className="absolute top-0 left-0 w-full h-1.5 bg-rose-500" />
          <div className="w-20 h-20 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-8 text-rose-500 shadow-sm">
            <Lock size={32} />
          </div>
          <h2 className="text-3xl font-bold mb-4 text-slate-900 tracking-tight">Access Denied</h2>
          <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">
            {lockMessage || "Security systems detect multiple attempt signatures for this identity."}
          </p>

          {remainingHours && (
            <div className="p-6 mb-10 bg-slate-50 rounded-2xl border border-slate-100">
               <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Timeout Remaining</p>
               <div className="flex items-center justify-center gap-3 text-slate-900">
                  <Clock size={20} className="text-indigo-600" />
                  <span className="text-2xl font-bold">{remainingHours} Hours</span>
               </div>
            </div>
          )}

          <button 
            className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-md"
            onClick={() => navigate('/dashboard/student')}
          >
            Return to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  if (!isDesktop) return <DesktopRequiredView />;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 font-bold text-sm uppercase tracking-widest animate-pulse">Initializing Assessment Engine...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIdx];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <div className="hidden">
         <ProctoringOverlay 
            userId={user?._id || user?.id} 
            examId={testId} 
            onScoreChange={setRealScore}
         />
      </div>

      {/* Header */}
      <header className="h-20 border-b border-slate-200 bg-white flex items-center justify-between px-8 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
            <Shield size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">SkillScrumpt Assessment</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                 {isActive ? 'Proctoring Active' : 'Proctoring Inactive'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-10">
          <div className="hidden xl:flex items-center gap-8">
             <ProctorIndicator icon={Camera} label="Camera" active={isActive && cameraReady} />
             <ProctorIndicator icon={Mic} label="Audio" active={isActive} />
             <ProctorIndicator icon={Monitor} label="Screen" active={isActive} />
          </div>
          
          <div className="flex items-center gap-3 px-5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl">
            <Clock size={16} className="text-indigo-600" />
            <span className={`text-lg font-bold tracking-tight ${timeLeft < 300 ? 'text-rose-600 animate-pulse' : 'text-slate-700'}`}>
              {formatTime(timeLeft)}
            </span>
          </div>

          <button 
            onClick={handleFinish}
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-all shadow-sm"
          >
            {isSubmitting ? 'Submitting...' : 'Finish Test'}
          </button>
        </div>
      </header>

      {/* Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <aside className="w-24 border-r border-slate-200 bg-white flex flex-col items-center py-8 gap-3 overflow-y-auto shadow-sm z-10">
          {questions.map((_, i) => (
            <button 
              key={i}
              onClick={() => setCurrentQuestionIdx(i)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold transition-all flex-shrink-0 ${
                i === currentQuestionIdx 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : answers[i] !== undefined
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                  : 'bg-slate-50 text-slate-500 border border-slate-200 hover:border-slate-300 hover:bg-slate-100'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </aside>

        {/* Assessment Engine */}
        <main className="flex-1 p-10 overflow-y-auto relative bg-slate-50/50">
          <div className="max-w-4xl mx-auto h-full flex flex-col">
            <motion.div
              key={currentQuestionIdx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8 h-full flex flex-col"
            >
              <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                  <div className="px-3 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-widest rounded-lg">
                    {currentQuestion.type === 'mcq' ? 'Multiple Choice' : 'Coding Challenge'}
                  </div>
                  <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Question {currentQuestion.id} of {questions.length}</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 leading-relaxed">
                  {currentQuestion.question}
                </h2>
              </div>

              {currentQuestion.type === 'mcq' ? (
                <div className="grid gap-4 flex-1">
                  {currentQuestion.options.map((opt, i) => (
                    <OptionCard 
                      key={i}
                      label={String.fromCharCode(65 + i)} 
                      text={opt.text}
                      selected={answers[currentQuestionIdx] === i}
                      onClick={() => setAnswers({...answers, [currentQuestionIdx]: i})}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex-1 flex flex-col min-h-[500px] gap-6">
                   <div className="flex flex-col overflow-hidden flex-[3] bg-white rounded-[2rem] border border-slate-200 shadow-sm">
                      <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                            <span className="text-xs font-bold text-slate-600">{currentQuestion.language === 'python' ? 'solution.py' : 'index.js'}</span>
                         </div>
                         <button 
                            onClick={async () => {
                              setIsRunning(true);
                              setConsoleOutput("Compiling...");
                              try {
                                const response = await api.post('/compiler/run', {
                                  compiler: currentQuestion.language === 'python' ? 'python3' : 'nodejs20',
                                  code: answers[currentQuestionIdx] || currentQuestion.initialCode,
                                  input: ''
                                });
                                setConsoleOutput(response.data.output || response.data.error || "Execution completed with no output.");
                              } catch (err) {
                                setConsoleOutput("Error: " + err.message);
                              } finally {
                                setIsRunning(false);
                              }
                            }}
                            disabled={isRunning}
                            className="px-4 py-2 bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg hover:bg-indigo-700 transition-all shadow-sm"
                          >
                            {isRunning ? 'Running...' : 'Run Code'}
                          </button>
                      </div>
                      
                      <textarea
                        className="flex-1 bg-transparent p-6 font-mono text-sm leading-relaxed text-slate-700 outline-none resize-none"
                        spellCheck="false"
                        value={answers[currentQuestionIdx] || currentQuestion.initialCode}
                        onChange={(e) => setAnswers({...answers, [currentQuestionIdx]: e.target.value})}
                      />
                   </div>

                   {/* Terminal */}
                   <div className="flex flex-col overflow-hidden h-48 bg-slate-900 rounded-[2rem] shadow-sm">
                      <div className="bg-slate-800 px-6 py-3 flex items-center justify-between border-b border-slate-700">
                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Console Output</span>
                         <button onClick={() => setConsoleOutput("")} className="text-[10px] text-slate-500 hover:text-white uppercase font-bold transition-colors">Clear</button>
                      </div>
                      <div className="flex-1 p-6 font-mono text-xs leading-relaxed overflow-y-auto whitespace-pre-wrap text-slate-300">
                        {consoleOutput ? (
                          <div>{consoleOutput}</div>
                        ) : (
                          <span className="text-slate-600 italic">No output yet. Run your code to see results.</span>
                        )}
                      </div>
                   </div>
                </div>
              )}

              <div className="flex justify-between items-center pt-6 mt-auto">
                <button 
                  onClick={() => setCurrentQuestionIdx(prev => Math.max(0, prev - 1))}
                  className="px-8 py-4 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-2xl hover:bg-slate-50 transition-all disabled:opacity-50 shadow-sm"
                  disabled={currentQuestionIdx === 0}
                >
                  Previous
                </button>
                <button 
                  className="px-8 py-4 bg-indigo-600 text-white font-bold text-xs rounded-2xl hover:bg-indigo-700 transition-all flex items-center gap-3 shadow-md shadow-indigo-200"
                  onClick={() => {
                    if (currentQuestionIdx < questions.length - 1) {
                      setCurrentQuestionIdx(prev => prev + 1);
                    } else {
                      handleFinish();
                    }
                  }}
                >
                  {currentQuestionIdx === questions.length - 1 ? 'Review & Submit' : 'Next Question'} 
                  <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          </div>
        </main>

        {/* AI HUD Sidebar */}
        <aside className="w-[360px] border-l border-slate-200 bg-white p-8 flex flex-col gap-8 overflow-y-auto z-10 shadow-sm">
          <section>
             <div className="flex items-center justify-between mb-4">
               <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                 <Activity size={16} className="text-indigo-600" /> Proctoring Status
               </h4>
               <div className={`px-2 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest ${isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                  {isActive ? 'Live' : 'Idle'}
               </div>
             </div>
             
             <div className="relative aspect-video rounded-2xl bg-slate-100 overflow-hidden group shadow-sm border border-slate-200">
               <video 
                 ref={videoRef} 
                 autoPlay 
                 muted 
                 playsInline 
                 className={`w-full h-full object-cover scale-x-[-1] transition-opacity duration-1000 ${cameraReady ? 'opacity-100' : 'opacity-0'}`} 
               />
               
               <div className="absolute inset-0 z-10 pointer-events-none">
                 <AnimatePresence>
                   {isActive && cameraReady && (
                     <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-40 border-2 border-emerald-400/50 rounded-xl flex flex-col items-center justify-center"
                     >
                     </motion.div>
                   )}
                 </AnimatePresence>
                 
                 <div className="absolute bottom-3 left-3 text-[9px] font-bold text-white bg-black/50 px-2 py-1 rounded-md backdrop-blur-sm">
                    Match: {realScore}%
                 </div>
               </div>
             </div>
          </section>

          <section className="space-y-4">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Telemetry</h4>
            <div className="grid grid-cols-2 gap-3">
              <TelemetryCard icon={Eye} label="Gaze" value={realScore > 80 ? "Focused" : "Deviated"} active={realScore > 80} />
              <TelemetryCard icon={Activity} label="Score" value={`${realScore}%`} active={realScore > 80} />
              <TelemetryCard icon={Cpu} label="Status" value={isActive ? "Active" : "Idle"} active={isActive} />
              <TelemetryCard icon={Lock} label="Identity" value="Secure" active={true} />
            </div>
          </section>

          <section className="flex-1 flex flex-col min-h-0">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Activity Log</h4>
            <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 font-mono text-[10px] overflow-y-auto">
               {violations.length > 0 ? violations.map((v, i) => (
                 <div key={i} className={`flex gap-2 ${v.severity === 'high' || v.severity === 'critical' ? 'text-rose-600 font-bold' : 'text-slate-600'}`}>
                    <span className="text-slate-400">[{new Date().toLocaleTimeString().slice(0,5)}]</span>
                    <span>{v.message}</span>
                 </div>
               )) : (
                 <div className="flex gap-2 text-slate-400">
                    <span>Session secure. No violations detected.</span>
                 </div>
               )}
            </div>
          </section>
        </aside>
      </div>

      {/* Overlays: Initiation and Submission */}
      <AnimatePresence mode="wait">
        {isSubmitting ? (
          <motion.div 
            key="generating"
            className="fixed inset-0 z-[300] flex items-center justify-center p-8 bg-slate-900/80 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="w-full max-w-lg bg-white rounded-[3rem] p-16 text-center relative overflow-hidden shadow-2xl">
               <div className="absolute top-0 left-0 w-full h-2 bg-indigo-600 animate-pulse" />
               
               {/* Animated AI Scanning Effect */}
               <div className="relative w-24 h-24 mx-auto mb-10">
                  <div className="absolute inset-0 border-4 border-indigo-600/20 rounded-2xl" />
                  <motion.div 
                    className="absolute inset-x-0 h-1 bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.5)] z-10"
                    animate={{ top: ["0%", "100%", "0%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />
                  <div className="w-full h-full flex items-center justify-center text-indigo-600">
                     <Cpu size={48} className="animate-pulse" />
                  </div>
               </div>

               <h3 className="text-3xl font-black mb-4 text-slate-900 tracking-tight italic uppercase">Result Generating.</h3>
               <p className="text-slate-500 text-sm font-bold uppercase tracking-[0.2em] mb-12">AI Engine is processing your telemetry & performance</p>
               
               <div className="space-y-4">
                  <div className="flex items-center justify-between px-6 py-4 bg-slate-50 rounded-2xl border border-slate-100">
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Protocol Audit</span>
                     <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Verified
                     </span>
                  </div>
                  <div className="flex items-center justify-between px-6 py-4 bg-slate-50 rounded-2xl border border-slate-100">
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Score Synthesis</span>
                     <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest animate-pulse">Processing...</span>
                  </div>
               </div>
            </div>
          </motion.div>
        ) : !isActive ? (
          <motion.div 
            key="initiation"
            className="fixed inset-0 z-[200] flex items-center justify-center p-8 bg-slate-900/60 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="w-full max-w-lg bg-white rounded-[2rem] p-12 text-center relative overflow-hidden shadow-2xl">
              <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-sm">
                <Shield size={40} className="animate-pulse" />
              </div>
              <h3 className="text-3xl font-bold mb-4 text-slate-900 tracking-tight">Proctoring Ready</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed mb-10">
                Ensure you are in a quiet, well-lit environment. Your camera, microphone, and screen will be monitored during the assessment.
              </p>
              <div className="space-y-6">
                <button 
                   onClick={startProctoring}
                   className="w-full py-5 bg-indigo-600 text-white rounded-2xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200"
                >
                  Start Assessment
                </button>
                <div className="flex items-center justify-center gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                   <span className="flex items-center gap-1"><Lock size={12}/> Secure</span>
                   <span className="w-1 h-1 bg-slate-300 rounded-full" />
                   <span className="flex items-center gap-1"><Shield size={12}/> AI Verified</span>
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function ProctorIndicator({ icon: Icon, label, active = false }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-2 h-2 rounded-full ${active ? 'bg-emerald-500' : 'bg-slate-300'}`} />
      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
        <Icon size={14} className={active ? 'text-emerald-600' : 'text-slate-400'} />
        {label}
      </div>
    </div>
  );
}

function OptionCard({ label, text, selected = false, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full text-left p-6 rounded-2xl border transition-all flex items-center gap-6 group shadow-sm ${
        selected 
          ? 'bg-indigo-50 border-indigo-200' 
          : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-md'
      }`}
    >
      <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all ${
        selected ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-50 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600'
      }`}>
        {label}
      </div>
      <p className={`text-base font-medium ${selected ? 'text-indigo-900' : 'text-slate-700'}`}>
        {text}
      </p>
    </button>
  );
}

function TelemetryCard({ icon: Icon, label, value, active }) {
  return (
    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center text-center justify-center">
       <Icon size={20} className={`mb-2 ${active ? 'text-indigo-500' : 'text-slate-400'}`} />
       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
       <p className={`text-sm font-bold ${active ? 'text-slate-900' : 'text-slate-500'}`}>{value}</p>
    </div>
  );
}

function DesktopRequiredView() {
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);
  const location = useLocation();
  const testId = location.state?.testId || '';

  const handleSendLink = async () => {
    setIsSending(true);
    try {
      await api.post('/users/desktop-handoff', { testId });
      setSent(true);
    } catch (err) {
      console.error("Failed to send link", err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-white rounded-[2rem] p-12 text-center shadow-xl border border-slate-100">
        <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-sm">
          <Monitor size={40} />
        </div>
        <h2 className="text-3xl font-bold mb-4 text-slate-900 tracking-tight">Desktop Required</h2>
        <p className="text-slate-500 text-sm font-medium leading-relaxed mb-10">
          AI Proctoring requires an established desktop environment for biometric synchronization and screen monitoring.
        </p>
        
        <div className="space-y-4">
          <button 
             onClick={handleSendLink}
             disabled={isSending || sent}
             className={`w-full py-4 font-bold rounded-2xl transition-all shadow-md flex items-center justify-center gap-3 ${
               sent ? 'bg-emerald-50 text-emerald-600 cursor-default' : 'bg-indigo-600 text-white hover:bg-indigo-700'
             }`}
          >
            {isSending ? 'Sending...' : sent ? 'Link Sent to Email' : 'Send Link to Desktop'}
            {!isSending && !sent && <ArrowRight size={18} />}
            {sent && <CheckCircle size={18} />}
          </button>

          <Link to="/dashboard/student" className="block">
            <button className="w-full py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all">
              Return to Dashboard
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
