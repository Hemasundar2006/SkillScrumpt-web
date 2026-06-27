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
 const [showFeedback, setShowFeedback] = useState(false);
 const [submissionResult, setSubmissionResult] = useState(null);
 const [feedbackText, setFeedbackText] = useState("");
 const [feedbackRating, setFeedbackRating] = useState(5);
 const [genTimeLeft, setGenTimeLeft] = useState(30); 
 const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

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
 question: `Error 404: The assessment ID"${testId}" was not found in our database.`,
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
 let timer;
 if (showFeedback && genTimeLeft > 0) {
 timer = setInterval(() => {
 setGenTimeLeft(prev => prev - 1);
 }, 1000);
 }
 return () => clearInterval(timer);
 }, [showFeedback, genTimeLeft]);

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

 setSubmissionResult({ 
 score: response.data.score || technicalScore,
 proctoringScore: report?.proctoring_score || 100,
 report: {
 ...report,
 aiAnalysis: response.data.aiAnalysis 
 },
 status: response.data.status,
 assessmentId: testId
 });
 setIsSubmitting(false);
 setShowFeedback(true);
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

 const submitFeedback = async () => {
 setIsSubmittingFeedback(true);
 try {
 await api.post('/users/feedbacks', {
 text: feedbackText ||"No comment provided.",
 rating: feedbackRating
 });
 navigate('/assessments/result', { state: submissionResult });
 } catch (err) {
 console.error("Feedback failed", err);
 navigate('/assessments/result', { state: submissionResult });
 }
 };

 if (isLocked) {
 return (
 <div className="h-screen overflow-hidden bg-[#FFF0E5] flex items-center justify-center p-8">
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
 {lockMessage ||"Security systems detect multiple attempt signatures for this identity."}
 </p>

 {remainingHours && (
 <div className="p-6 mb-10 bg-slate-50 rounded-2xl border border-slate-100">
 <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Timeout Remaining</p>
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
 <div className="h-screen overflow-hidden bg-[#FFF0E5] flex items-center justify-center">
 <div className="flex flex-col items-center gap-6">
 <div className="w-16 h-16 border-4 border-[#F97316] border-t-transparent rounded-full animate-spin" />
 <p className="text-slate-500 font-bold text-sm uppercase tracking-wider animate-pulse">Initializing Assessment Engine...</p>
 </div>
 </div>
 );
 }

 const currentQuestion = questions[currentQuestionIdx];

 return (
 <div className="h-screen overflow-hidden bg-[#FFF0E5] text-slate-900 flex flex-col font-sans selection:bg-[#F97316] selection:text-white">
 <canvas ref={canvasRef} style={{ display:"none" }} />
 <div className="hidden">
 <ProctoringOverlay 
 userId={user?._id || user?.id} 
 examId={testId} 
 onScoreChange={setRealScore}
 />
 </div>

 {/* Header - Premium Glassmorphism */}
 <header className="h-20 border-b border-slate-200 bg-white/80 backdrop-blur-md flex items-center justify-between px-10 sticky top-0 z-[100] shadow-sm">
 <div className="flex items-center gap-8">
 <Link to="/dashboard/student" className="flex items-center gap-4 group">
 <div className="w-11 h-11 bg-[#F97316] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-[#F97316]/20 group-hover:scale-105 transition-transform duration-300">
 <Shield size={22} />
 </div>
 <div>
 <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-none mb-1">SkillScrumpt <span className="text-[#F97316]">AI</span></h1>
 <div className="flex items-center gap-2">
 <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
 <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
 {isActive ? 'PROCTORING_SECURE' : 'SESSION_IDLE'}
 </p>
 </div>
 </div>
 </Link>
 </div>

 <div className="flex items-center gap-12">
 <div className="hidden xl:flex items-center gap-10">
 <ProctorIndicator icon={Camera} label="Vision" active={isActive && cameraReady} />
 <ProctorIndicator icon={Mic} label="Audio" active={isActive} />
 <ProctorIndicator icon={Monitor} label="Stream" active={isActive} />
 </div>
 
 <div className="flex items-center gap-6">
 <div className="flex items-center gap-3 px-6 py-3 bg-slate-900 rounded-2xl shadow-xl shadow-slate-200">
 <Clock size={18} className="text-sky-400" />
 <span className={`text-xl font-bold tabular-nums tracking-tight ${timeLeft < 300 ? 'text-rose-400 animate-pulse' : 'text-white'}`}>
 {formatTime(timeLeft)}
 </span>
 </div>

 <button 
 onClick={handleFinish}
 disabled={isSubmitting}
 className="px-8 py-3.5 bg-[#F97316] text-white text-sm font-bold uppercase tracking-wider rounded-2xl hover:bg-orange-600 transition-all shadow-sm hover:shadow-md active:scale-95 disabled:opacity-50"
 >
 {isSubmitting ? 'Finalizing...' : 'Finish Test'}
 </button>
 </div>
 </div>
 </header>

 {/* Main Workspace Layout */}
 <div className="flex-1 flex overflow-hidden">
 
 {/* Navigation Sidebar - Modern Dot Style */}
 <aside className="w-28 border-r border-slate-200 bg-white flex flex-col items-center py-10 gap-5 overflow-y-auto z-10 custom-scrollbar">
 <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Questions</div>
 {questions.map((_, i) => (
 <button 
 key={i}
 onClick={() => setCurrentQuestionIdx(i)}
 className={`relative w-12 h-12 rounded-2xl flex items-center justify-center text-xs font-bold transition-all duration-300 ${
 i === currentQuestionIdx 
 ? 'bg-slate-900 text-white shadow-xl scale-110' 
 : answers[i] !== undefined
 ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
 : 'bg-slate-50 text-slate-400 border border-slate-100 hover:border-orange-200 hover:text-[#F97316]'
 }`}
 >
 {i + 1}
 {answers[i] !== undefined && i !== currentQuestionIdx && (
 <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
 )}
 </button>
 ))}
 </aside>

  {/* Assessment Core Area */}
  <main className="flex-1 flex flex-col bg-transparent overflow-hidden">
  <div className="flex-1 flex flex-col p-6 overflow-hidden">
  <div className="max-w-5xl w-full mx-auto flex flex-col h-full gap-6">
  
  {/* Question Header Card */}
  <motion.div
  key={`q-${currentQuestionIdx}`}
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
  className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden group shrink-0"
  >
  <div className="absolute top-0 left-0 w-2 h-full bg-[#38BDF8] opacity-0 group-hover:opacity-100 transition-opacity" />
  <div className="flex items-center justify-between mb-4">
  <div className="flex items-center gap-4">
  <div className="px-4 py-1.5 bg-sky-50 text-sky-700 text-xs font-bold uppercase tracking-wider rounded-full border border-sky-100">
  {currentQuestion.type === 'mcq' ? 'PROTOCOL_MCQ' : 'CORE_ENGINE_CHALLENGE'}
  </div>
  <div className="h-4 w-px bg-slate-200" />
  <span className="text-slate-400 font-bold text-xs uppercase tracking-wider">
  Module {currentQuestion.id} <span className="text-slate-300 mx-1">/</span> {questions.length}
  </span>
  </div>
  <Badge variant="outline" className="font-bold text-xs tracking-wider">{currentQuestion.points || 1} POINTS</Badge>
  </div>
  
  <h2 className="text-2xl font-bold text-slate-900 leading-tight tracking-tight">
  {currentQuestion.question}
  </h2>
  </motion.div>

  {/* Options Grid */}
  <div className="flex-1 overflow-hidden min-h-0">
  <div className={`grid gap-4 ${currentQuestion.type === 'mcq' ? 'grid-cols-2 h-full' : 'h-full'}`}>
 {currentQuestion.type === 'mcq' ? (
 <AnimatePresence mode="popLayout">
 {currentQuestion.options.map((opt, i) => (
 <motion.div
 key={`${currentQuestionIdx}-${i}`}
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: i * 0.05 }}
 >
 <OptionCard 
 label={String.fromCharCode(65 + i)} 
 text={opt.text}
 selected={answers[currentQuestionIdx] === i}
 onClick={() => setAnswers({...answers, [currentQuestionIdx]: i})}
 />
 </motion.div>
 ))}
 </AnimatePresence>
 ) : (
 <div className="h-full gap-4 flex flex-col min-h-0">
 <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-white rounded-[2rem] border border-slate-200 shadow-sm">
 <div className="bg-slate-50 px-8 py-5 border-b border-slate-200 flex items-center justify-between">
 <div className="flex items-center gap-4">
 <div className="flex gap-1.5">
 <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
 <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
 <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
 </div>
 <span className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-2">
 {currentQuestion.language === 'python' ? 'engine.py' : 'main.js'}
 </span>
 </div>
 <button 
 onClick={async () => {
 setIsRunning(true);
 setConsoleOutput(">> Initializing Runtime environment...\n>> Compiling source code...");
 try {
 const response = await api.post('/compiler/run', {
 compiler: currentQuestion.language === 'python' ? 'python3' : 'nodejs20',
 code: answers[currentQuestionIdx] || currentQuestion.initialCode,
 input: ''
 });
 setConsoleOutput(prev => prev +"\n>> Execution completed.\n\n" + (response.data.output || response.data.error ||"Execution completed with no output."));
 } catch (err) {
 setConsoleOutput(prev => prev +"\n>> CRITICAL_ERROR:" + err.message);
 } finally {
 setIsRunning(false);
 }
 }}
 disabled={isRunning}
 className="px-6 py-2.5 bg-slate-900 text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-slate-800 transition-all shadow-sm active:scale-95"
 >
 {isRunning ? 'EXECUTING...' : 'RUN_CODE'}
 </button>
 </div>
 
 <textarea
 className="flex-1 bg-white p-10 font-mono text-sm leading-[1.7] text-slate-700 outline-none resize-none selection:bg-indigo-100"
 spellCheck="false"
 placeholder="// Write your logic here..."
 value={answers[currentQuestionIdx] || currentQuestion.initialCode}
 onChange={(e) => setAnswers({...answers, [currentQuestionIdx]: e.target.value})}
 />
 </div>

 {/* Console View */}
 <div className="h-40 bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-800 flex flex-col overflow-hidden shrink-0">
 <div className="bg-slate-800/50 px-8 py-3 flex items-center justify-between border-b border-slate-800">
 <div className="flex items-center gap-2">
 <Activity size={14} className="text-emerald-500" />
 <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Runtime Terminal</span>
 </div>
 <button onClick={() => setConsoleOutput("")} className="text-xs font-bold text-slate-500 hover:text-white uppercase tracking-wider transition-colors">Wipe Console</button>
 </div>
 <div className="flex-1 p-6 font-mono text-xs leading-relaxed overflow-y-auto whitespace-pre-wrap text-emerald-500/90 custom-scrollbar">
 {consoleOutput ? (
 <div className="animate-in fade-in duration-500">{consoleOutput}</div>
 ) : (
 <span className="text-slate-600">Terminal awaiting instructions. Press RUN_CODE to start.</span>
 )}
 </div>
 </div>
 </div>
 )}
 </div>
 </div>
 </div>

 {/* Persistent Action Bar */}
 <div className="h-20 bg-white border-t border-slate-200 px-12 flex items-center justify-between shadow-[0_-4px_20px_rgba(0,0,0,0.02)] shrink-0">
 <button 
 onClick={() => setCurrentQuestionIdx(prev => Math.max(0, prev - 1))}
 className="px-8 py-3.5 bg-white border border-slate-200 text-slate-700 text-sm font-bold uppercase tracking-wider rounded-2xl hover:border-slate-400 transition-all disabled:opacity-30 active:scale-95 flex items-center gap-3"
 disabled={currentQuestionIdx === 0}
 >
 <ChevronLeft size={18} /> Previous
 </button>
 
 <div className="flex gap-4">
 <div className="hidden md:flex items-center gap-2 mr-4">
 <div className="flex -space-x-1">
 {[1,2,3].map(i => <div key={i} className="w-2 h-2 rounded-full bg-slate-200 border border-white" />)}
 </div>
 <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Progress Verified</span>
 </div>
 
 <button 
 className="px-10 py-3.5 bg-[#38BDF8] text-white font-bold text-sm uppercase tracking-wider rounded-2xl hover:bg-sky-600 transition-all flex items-center gap-4 shadow-sm active:scale-95"
 onClick={() => {
 if (currentQuestionIdx < questions.length - 1) {
 setCurrentQuestionIdx(prev => prev + 1);
 } else {
 handleFinish();
 }
 }}
 >
 {currentQuestionIdx === questions.length - 1 ? 'Review & Submit' : 'Next Question'} 
 <ArrowRight size={18} />
 </button>
 </div>
 </div>
 </div>
 </main>

 {/* Right HUD - AI Surveillance Panel */}
 <aside className="w-[420px] border-l border-slate-200 bg-white flex flex-col z-10 shadow-2xl overflow-hidden">
 <div className="p-10 flex-1 overflow-y-auto custom-scrollbar space-y-12">
 
 <section>
 <div className="flex items-center justify-between mb-6">
 <h4 className="text-xs font-bold text-slate-900 flex items-center gap-3 uppercase tracking-wider">
 <Activity size={18} className="text-sky-600" /> Biometric Link
 </h4>
 <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${isActive ? 'bg-emerald-500 text-white shadow-sm' : 'bg-slate-100 text-slate-500'}`}>
 {isActive ? 'SECURE_LIVE' : 'OFFLINE'}
 </div>
 </div>
 
 <div className="relative aspect-video rounded-[2rem] bg-slate-900 overflow-hidden shadow-2xl border-4 border-white ring-1 ring-slate-200 group">
 <video 
 ref={videoRef} 
 autoPlay 
 muted 
 playsInline 
 className={`w-full h-full object-cover scale-x-[-1] transition-all duration-1000 ${cameraReady ? 'opacity-100 grayscale-[0.2]' : 'opacity-0'}`} 
 />
 
 {/* AI Scanning Lines Overlay */}
 {isActive && cameraReady && (
 <div className="absolute inset-0 pointer-events-none">
 <div className="absolute top-0 left-0 w-full h-full border-[1px] border-emerald-500/20 rounded-[2rem]" />
 <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-emerald-400/50" />
 <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-emerald-400/50" />
 <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-emerald-400/50" />
 <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-emerald-400/50" />
 
 <motion.div 
 className="absolute inset-x-0 h-[2px] bg-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
 animate={{ top: ["0%","100%","0%"] }}
 transition={{ duration: 4, repeat: Infinity, ease:"linear" }}
 />
 </div>
 )}
 
 <div className="absolute bottom-6 right-6 z-20">
 <div className="px-4 py-2 bg-black/60 backdrop-blur-md rounded-xl text-xs font-bold text-white border border-white/20 flex items-center gap-2">
 <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
 MATCH_STABILITY: {realScore}%
 </div>
 </div>
 </div>
 </section>

 <section>
 <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-8">Telemetry Diagnostics</h4>
 <div className="grid grid-cols-2 gap-5">
 <TelemetryCard icon={Eye} label="Gaze Focus" value={realScore > 80 ?"OPTIMAL" :"DEVIATED"} active={realScore > 80} />
 <TelemetryCard icon={Activity} label="Integrity" value={`${realScore}%`} active={realScore > 80} />
 <TelemetryCard icon={Cpu} label="Engine" value={isActive ?"NOMINAL" :"IDLE"} active={isActive} />
 <TelemetryCard icon={Lock} label="Identity" value="VERIFIED" active={true} />
 </div>
 </section>

 <section className="flex flex-col">
 <div className="flex items-center justify-between mb-6">
 <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Real-time Audit Log</h4>
 <Badge variant="secondary" className="text-xs font-bold opacity-60">AUTO_SAVE_ENABLED</Badge>
 </div>
 <div className="bg-slate-900 rounded-[2.5rem] p-8 space-y-5 font-mono text-xs min-h-[300px] border border-slate-800 shadow-inner overflow-y-auto custom-scrollbar-dark">
 {violations.length > 0 ? violations.map((v, i) => (
 <motion.div 
 initial={{ opacity: 0, x: 10 }}
 animate={{ opacity: 1, x: 0 }}
 key={i} 
 className={`flex gap-4 p-4 rounded-2xl border ${v.severity === 'high' || v.severity === 'critical' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' : 'bg-white/5 border-white/10 text-slate-400'}`}
 >
 <span className="opacity-50 font-bold tabular-nums">{new Date().toLocaleTimeString().slice(0,5)}</span>
 <span className="leading-relaxed">{" >>"} {v.message}</span>
 </motion.div>
 )) : (
 <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 opacity-30">
 <Shield size={32} />
 <p className="text-xs font-bold uppercase tracking-wider">Protocol Secure.<br/>Monitoring constant.</p>
 </div>
 )}
 </div>
 </section>
 </div>
 </aside>
 </div>

 {/* Overlays: Initiation and Submission */}
 <AnimatePresence mode="wait">
 {showFeedback ? (
 <motion.div 
 key="feedback"
 className="fixed inset-0 z-[400] flex items-center justify-center p-8 bg-slate-900/90 backdrop-blur-2xl"
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 >
 <div className="w-full max-w-2xl bg-white rounded-[3rem] p-16 relative overflow-hidden shadow-2xl">
 <div className="absolute top-0 left-0 w-full h-2 bg-[#F97316]" />
 
 <div className="flex flex-col items-center text-center mb-10">
 <div className="w-16 h-16 bg-sky-50 text-sky-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
 <Clock size={32} className="animate-pulse" />
 </div>
 <h3 className="text-3xl font-bold mb-2 text-slate-900 tracking-tight">Finalizing Analysis</h3>
 <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-4">Results generating in: <span className="text-[#F97316]">{genTimeLeft} seconds</span></p>
 <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
 <motion.div 
 className="h-full bg-[#F97316]"
 initial={{ width:"0%" }}
 animate={{ width: `${((30 - genTimeLeft) / 30) * 100}%` }}
 />
 </div>
 </div>

 <div className="space-y-8">
 <div>
 <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 block text-center">Rate your experience</label>
 <div className="flex justify-center gap-4">
 {[1, 2, 3, 4, 5].map((star) => (
 <button 
 key={star} 
 onClick={() => setFeedbackRating(star)}
 className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${feedbackRating >= star ? 'bg-[#F97316] text-white shadow-lg' : 'bg-slate-50 text-slate-300 border border-slate-100'}`}
 >
 <CheckCircle size={20} fill={feedbackRating >= star ?"currentColor" :"none"} />
 </button>
 ))}
 </div>
 </div>

 <div>
 <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 block">Tell us about the assessment</label>
 <textarea 
 value={feedbackText}
 onChange={(e) => setFeedbackText(e.target.value)}
 placeholder="Was the level appropriate? Any technical issues?..."
 className="w-full p-6 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:border-orange-300 transition-all resize-none h-32"
 />
 </div>

 <button 
 onClick={submitFeedback}
 disabled={isSubmittingFeedback}
 className="w-full py-5 bg-slate-900 text-white rounded-[2rem] text-sm font-bold uppercase tracking-wider hover:bg-slate-800 transition-all shadow-sm active:scale-95 disabled:opacity-50"
 >
 {isSubmittingFeedback ? 'Transmitting...' : 'Submit & View Results'}
 </button>
 </div>
 </div>
 </motion.div>
 ) : isSubmitting ? (
 <motion.div 
 key="generating"
 className="fixed inset-0 z-[300] flex items-center justify-center p-8 bg-slate-900/90 backdrop-blur-2xl"
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 >
 <div className="w-full max-w-xl bg-white rounded-[4rem] p-20 text-center relative overflow-hidden shadow-2xl">
 <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-orange-400 via-[#F97316] to-orange-600 animate-pulse" />
 
 <div className="relative w-32 h-32 mx-auto mb-12">
 <div className="absolute inset-0 border-[6px] border-[#F97316]/10 rounded-[2rem] animate-spin-slow" />
 <div className="w-full h-full flex items-center justify-center text-[#F97316]">
 <Cpu size={64} className="animate-pulse" />
 </div>
 </div>

 <h3 className="text-4xl font-bold mb-6 text-slate-900 tracking-tight">Processing Certification</h3>
 <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-16 leading-relaxed">Synthesizing telemetry data & <br/>technical performance metrics</p>
 
 <div className="space-y-4 max-w-sm mx-auto">
 <div className="flex items-center justify-between px-8 py-5 bg-slate-50 rounded-[2rem] border border-slate-100 shadow-sm">
 <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Protocol Audit</span>
 <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-3">
 <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" /> SECURE
 </span>
 </div>
 <div className="flex items-center justify-between px-8 py-5 bg-slate-50 rounded-[2rem] border border-slate-100 shadow-sm">
 <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Score Vector</span>
 <span className="text-xs font-bold text-[#F97316] uppercase tracking-wider animate-pulse">Calculating...</span>
 </div>
 </div>
 </div>
 </motion.div>
 ) : !isActive ? (
 <motion.div 
 key="initiation"
 className="fixed inset-0 z-[200] flex items-center justify-center p-8 bg-slate-900/70 backdrop-blur-xl"
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 >
 <div className="w-full max-w-xl bg-white rounded-[3rem] p-16 text-center relative overflow-hidden shadow-2xl border border-white/20">
 <div className="w-24 h-24 bg-sky-50 text-sky-600 rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-inner group">
 <Shield size={48} className="animate-pulse group-hover:scale-110 transition-transform" />
 </div>
 <h3 className="text-4xl font-bold mb-6 text-slate-900 tracking-tight">Initialize Secure Link</h3>
 <p className="text-slate-500 text-sm font-bold leading-relaxed mb-12 max-w-sm mx-auto uppercase tracking-wide opacity-80">
 Environmental diagnostics complete. <br/>Biometric synchronization required for <br/>certification validity.
 </p>
 <div className="space-y-8">
 <button 
 onClick={startProctoring}
 className="w-full py-6 bg-slate-900 text-white rounded-[2rem] text-sm font-bold uppercase tracking-wider hover:bg-slate-800 transition-all shadow-sm active:scale-95"
 >
 Confirm & Start Session
 </button>
 <div className="flex items-center justify-center gap-8 text-xs font-bold text-slate-400 uppercase tracking-wider">
 <span className="flex items-center gap-2"><Lock size={14} className="text-emerald-500"/> AES_256_SECURE</span>
 <span className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
 <span className="flex items-center gap-2"><Shield size={14} className="text-[#38BDF8]"/> AI_AUDITED</span>
 </div>
 </div>
 </div>
 </motion.div>
 ) : null}
 </AnimatePresence>

 <style jsx>{`
 .custom-scrollbar::-webkit-scrollbar { width: 4px; }
 .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
 .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
 
 .custom-scrollbar-dark::-webkit-scrollbar { width: 4px; }
 .custom-scrollbar-dark::-webkit-scrollbar-track { background: transparent; }
 .custom-scrollbar-dark::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }

 @keyframes spin-slow {
 from { transform: rotate(0deg); }
 to { transform: rotate(360deg); }
 }
 .animate-spin-slow { animation: spin-slow 8s linear infinite; }
 `}</style>
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
 className={`w-full text-left p-6 rounded-2xl border transition-all flex items-start gap-6 group shadow-sm ${
 selected 
 ? 'bg-sky-50 border-sky-200' 
 : 'bg-white border-slate-200 hover:border-sky-300 hover:shadow-md'
 }`}
 >
 <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all ${
 selected ? 'bg-[#38BDF8] text-white shadow-sm' : 'bg-slate-50 text-slate-500 group-hover:bg-sky-50 group-hover:text-sky-600'
 }`}>
 {label}
 </div>
 <p className={`text-base font-medium ${selected ? 'text-sky-900' : 'text-slate-700'}`}>
 {text}
 </p>
 </button>
 );
}

function TelemetryCard({ icon: Icon, label, value, active }) {
 return (
 <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center text-center justify-center min-h-[110px]">
 <Icon size={20} className={`mb-2 ${active ? 'text-[#38BDF8]' : 'text-slate-400'}`} />
 <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
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
 <div className="h-screen overflow-hidden bg-[#FFF0E5] flex items-center justify-center p-8">
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
 sent ? 'bg-emerald-50 text-emerald-600 cursor-default' : 'bg-[#F97316] text-white hover:bg-orange-600'
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
