import React, { useState, useEffect } from 'react';
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
  CheckCircle,
  Cpu,
  Lock,
  Zap,
  X,
  FileText,
  User,
  Activity,
  ChevronLeft
} from 'lucide-react';
import { Button, Card, Badge } from '../components/UI';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../layout/DashboardLayout';
import api from '../utils/api';

export function AssessmentResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [assessment, setAssessment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { score, proctoringScore, report, status: passedStatus, assessmentId } = location.state || { 
    score: 0, 
    proctoringScore: 100, 
    report: null,
    status: 'failed',
    assessmentId: ''
  };

  useEffect(() => {
    if (assessmentId) {
      fetchData();
    } else {
      setIsLoading(false);
    }
  }, [assessmentId]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const savedUser = JSON.parse(localStorage.getItem('user'));
      const [profileRes, assessmentRes] = await Promise.all([
        api.get(`/users/profile/${savedUser._id || savedUser.id}`),
        api.get(`/assessments/${assessmentId}`)
      ]);
      setCurrentUser(profileRes.data);
      setAssessment(assessmentRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
      const userStr = localStorage.getItem('user');
      if (userStr) setCurrentUser(JSON.parse(userStr));
    } finally {
      setIsLoading(false);
    }
  };

  const isPassed = passedStatus === 'passed';
  const integrityGrade = proctoringScore >= 90 ? 'OPTIMAL' : proctoringScore >= 75 ? 'NOMINAL' : 'COMPROMISED';
  
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  const submitFeedback = async () => {
    try {
      const res = await api.post('/users/feedbacks', { text: feedbackText, rating: 5 });
      setFeedbackSuccess(true);
      setTimeout(() => setFeedbackOpen(false), 2000);
    } catch (e) {
      alert(e.response?.data?.message || 'Error submitting feedback');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
           <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
           <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Generating Manifest...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout user={currentUser}>
      <div className="max-w-[1400px] mx-auto px-6 pb-20">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-12">
          <div>
            <Link to="/dashboard/student" className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 mb-6 transition-all font-bold text-xs group">
               <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
            </Link>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 uppercase italic">Assessment Report.</h1>
            <p className="text-slate-500 font-bold text-sm mt-2 uppercase tracking-widest">{assessment?.title || 'Protocol Execution Result'}</p>
          </div>
          <div className="flex gap-4">
             <div className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest shadow-sm flex items-center gap-2">
                <Shield size={14} className="text-indigo-600" /> Protocol Secure
             </div>
          </div>
        </header>

        {/* Main Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Result Summary */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Status Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-10 rounded-[2.5rem] border overflow-hidden relative shadow-sm ${
                isPassed ? 'bg-indigo-600 border-indigo-700 text-white' : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              <div className="relative z-10 flex flex-col md:flex-row justify-between gap-10">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-8">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-bold ${isPassed ? 'bg-white/20 text-white' : 'bg-indigo-50 text-indigo-600'}`}>
                      {currentUser?.firstName?.[0]}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold tracking-tight">{currentUser?.firstName} {currentUser?.lastName}</h2>
                      <p className={`text-xs font-bold uppercase tracking-widest ${isPassed ? 'text-indigo-200' : 'text-slate-400'}`}>
                        {assessment?.title || 'Expert Assessment'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <StatItem label="Final Score" value={`${score}%`} isPassed={isPassed} />
                    <StatItem label="Status" value={isPassed ? 'Passed' : 'Failed'} isPassed={isPassed} />
                    <StatItem label="Verified Badge" value={isPassed ? (assessment?.reward || 'Certified') : 'None'} isPassed={isPassed} />
                    <StatItem label="Session" value={report?.session_id?.slice(0, 8).toUpperCase() || 'LIVE-X1'} isPassed={isPassed} />
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center text-center p-8 bg-black/5 rounded-[2rem] border border-white/10 backdrop-blur-sm min-w-[240px]">
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 border-4 ${isPassed ? 'bg-white text-indigo-600 border-white/20' : 'bg-rose-50 text-rose-500 border-rose-100'}`}>
                    {isPassed ? <BadgeCheck size={48} className="animate-pulse" /> : <X size={48} />}
                  </div>
                  <h4 className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isPassed ? 'text-indigo-200' : 'text-slate-400'}`}>INTEGRITY GRADE</h4>
                  <p className="text-2xl font-bold">{integrityGrade}</p>
                  {isPassed && <p className="text-[10px] font-black mt-2 tracking-widest uppercase">VERIFIED PARTNER</p>}
                </div>
              </div>
              
              {/* Abstract decorative element */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 -mr-32 -mt-32 rounded-full blur-3xl pointer-events-none" />
            </motion.div>

            {/* AI Analysis Reason Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-2 rounded-xl ${isPassed ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                  <Activity size={20} />
                </div>
                <h3 className="text-xl font-bold text-slate-900">AI Proctoring Analysis</h3>
              </div>
              
              <div className={`p-6 rounded-2xl border ${isPassed ? 'bg-emerald-50/50 border-emerald-100' : 'bg-rose-50/50 border-rose-100'}`}>
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-full ${isPassed ? 'bg-emerald-500' : 'bg-rose-500'} text-white flex-shrink-0 mt-1`}>
                    {isPassed ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold mb-1 ${isPassed ? 'text-emerald-900' : 'text-rose-900'}`}>
                      {isPassed ? 'System Validation Successful' : 'Security Policy Violation'}
                    </h4>
                    <p className={`text-sm leading-relaxed ${isPassed ? 'text-emerald-700/80' : 'text-rose-700/80'}`}>
                      {report?.aiAnalysis?.summary || "No specific anomalies detected during the verification cycle."}
                    </p>
                  </div>
                </div>
              </div>

              {!isPassed && (
                 <div className="mt-8 pt-8 border-t border-slate-100">
                    <h4 className="text-[10px] font-bold text-rose-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                       <Clock size={14} /> Mandatory Cooling Period Active
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed italic">
                      Security protocols require a <span className="font-bold text-slate-900">48-hour cooling period</span> for skill improvement. You will be eligible to re-attempt this assessment once the period expires. Ensure a stable environment and focused behavior for the next session.
                    </p>
                 </div>
              )}
            </motion.div>

            {/* Audit Log */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                  <Shield className="text-indigo-600" size={24} /> Audit Trail
                </h3>
                <Badge color="slate">{report?.violations?.length || 0} Recorded Anomalies</Badge>
              </div>

              {report?.violations && report.violations.length > 0 ? (
                <div className="space-y-4">
                   {report.violations.map((v, i) => (
                     <div key={i} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                       <div className="flex items-center gap-4">
                          <div className={`px-2 py-1 rounded-md text-[8px] font-bold uppercase tracking-widest ${v.severity === 'critical' ? 'bg-rose-100 text-rose-700' : 'bg-slate-200 text-slate-600'}`}>
                            {v.severity}
                          </div>
                          <span className="text-xs font-bold text-slate-700">{v.message}</span>
                       </div>
                       <span className="text-[10px] font-medium text-slate-400">{new Date(v.timestamp).toLocaleTimeString()}</span>
                     </div>
                   ))}
                </div>
              ) : (
                <div className="py-12 border-2 border-dashed border-slate-100 rounded-[2rem] text-center">
                   <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <CheckCircle size={32} />
                   </div>
                   <p className="text-sm font-bold text-slate-500 uppercase tracking-widest italic">Pristine Session Flow</p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Right Column: Actions & Details */}
          <div className="space-y-8">
            
            {/* Quick Summary Card */}
            <Card className="p-8 rounded-[2rem]">
               <h3 className="text-lg font-bold mb-6">Manifest Meta</h3>
               <div className="space-y-6">
                 <MetaItem icon={Briefcase} label="Target Module" value={assessment?.title || "Expert React Architect"} />
                 <MetaItem icon={Clock} label="Cycle Duration" value="45 Minutes" />
                 <MetaItem icon={FileText} label="Protocol Version" value="v4.2.1-stable" />
                 <MetaItem icon={Lock} label="Encryption" value="AES-256" />
               </div>
            </Card>

            {/* Actions */}
            <div className="space-y-4">
               {isPassed && (
                 <div className="w-full py-6 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-[2rem] flex flex-col items-center justify-center gap-2 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
                   <div className="flex items-center gap-2">
                     <BadgeCheck size={24} className="text-emerald-500" /> 
                     <span className="text-lg font-black uppercase tracking-tight italic">Verified Badge Earned</span>
                   </div>
                   <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600/60 bg-emerald-100/50 px-4 py-1 rounded-full border border-emerald-200">
                     {assessment?.reward || assessment?.title || 'Certified Specialist'}
                   </p>
                 </div>
               )}
               <button 
                 onClick={() => navigate('/dashboard/student')}
                 className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-md flex items-center justify-center gap-3"
               >
                 Return to Dashboard <ArrowRight size={18} />
               </button>
               <button 
                 onClick={() => setFeedbackOpen(true)}
                 className="w-full py-4 bg-white border border-slate-200 text-slate-900 font-bold rounded-2xl hover:bg-slate-50 transition-all shadow-sm flex items-center justify-center gap-3"
               >
                 <Zap size={18} className="text-indigo-600" /> Provide Feedback
               </button>
            </div>
          </div>
        </div>

        {/* Feedback Modal */}
        <AnimatePresence>
          {feedbackOpen && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md">
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl relative border border-slate-100"
              >
                <button onClick={() => setFeedbackOpen(false)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-600 transition-colors">
                  <X size={24} />
                </button>
                
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Session Feedback</h3>
                <p className="text-slate-500 text-sm font-medium mb-8">Share your assessment experience with our team.</p>

                {feedbackSuccess ? (
                  <div className="text-center py-10">
                    <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle size={40} />
                    </div>
                    <p className="text-lg font-bold text-slate-900 mb-1">Feedback Logged</p>
                    <p className="text-sm text-slate-500">Your report has been encrypted and saved.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 block">Your Assessment Experience</label>
                      <textarea 
                        className="w-full bg-slate-50 border border-slate-200 p-5 rounded-2xl text-sm font-medium text-slate-700 focus:outline-none focus:border-indigo-500 transition-all min-h-[160px] resize-none"
                        placeholder="Was the AI proctoring fair? How was the question quality?"
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                      />
                    </div>
                    <button 
                      onClick={submitFeedback}
                      disabled={!feedbackText.trim()}
                      className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-md shadow-indigo-100"
                    >
                      Initialize Submission
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </DashboardLayout>
  );
}

function StatItem({ label, value, isPassed }) {
  return (
    <div className="space-y-1">
      <p className={`text-[10px] font-bold uppercase tracking-widest ${isPassed ? 'text-indigo-200' : 'text-slate-400'}`}>
        {label}
      </p>
      <p className="text-xl font-bold tracking-tight">{value}</p>
    </div>
  );
}

function MetaItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-4">
      <div className="p-2.5 bg-slate-50 text-indigo-600 rounded-xl">
        <Icon size={18} />
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
        <p className="text-sm font-bold text-slate-700">{value}</p>
      </div>
    </div>
  );
}
