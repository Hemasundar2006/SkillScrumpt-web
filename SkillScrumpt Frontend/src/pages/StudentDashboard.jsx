import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Flame, 
  Clock, 
  Trophy, 
  Shield, 
  AlertCircle, 
  CheckCircle,
  ArrowRight,
  TrendingUp,
  Activity,
  Code,
  Star,
  Zap,
  BookOpen,
  Target
} from 'lucide-react';
import { Badge } from '../components/UI';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../layout/DashboardLayout';
import api from '../utils/api';
import RazorpayPayment from '../components/RazorpayPayment';

const UpgradeModal = ({ onClose }) => {
  const [pricing] = useState({ currentPrice: 1, isPromoActive: true, remainingPromoSpots: 198 });

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#1E293B]/60 backdrop-blur-md"
    >
      <motion.div 
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="max-w-md w-full bg-white p-10 relative overflow-hidden rounded-[16px] shadow-2xl"
      >
        <div className="absolute top-0 left-0 w-full h-1.5 bg-[#F97316]" />
        
        <div className="text-center mb-10">
          <div className="text-xs font-bold text-[#F97316] uppercase tracking-wider mb-4 flex items-center justify-center gap-2">
            <Star size={14} className="fill-[#F97316]" /> Elite Access
          </div>
          <h3 className="text-3xl font-bold text-[#1E293B] tracking-tight mb-6">Upgrade to Pro</h3>
          <div className="inline-block px-4 py-2 bg-[#FFF0E5] text-[#F97316] text-xs font-bold uppercase tracking-wider mb-6 rounded-full">
            ₹1 SPECIAL OFFER ({pricing.remainingPromoSpots} spots left)
          </div>
        </div>
        
        <div className="space-y-4 mb-10">
          {[
            'Access to Elite AI Assessments',
            'Priority Placement for Big Tech Roles',
            'Unlimited Verified Badges',
            '24/7 Career Support'
          ].map((feature, i) => (
            <div key={i} className="flex items-center gap-4 text-sm font-medium text-[#1E293B]/70">
              <CheckCircle size={20} className="text-[#38BDF8]" />
              {feature}
            </div>
          ))}
        </div>
        
        <div className="flex flex-col gap-3">
          <RazorpayPayment 
            amount={pricing.currentPrice} 
            buttonText={`Authorize Upgrade (₹${pricing.currentPrice})`}
            className="w-full py-4 bg-[#F97316] text-white font-bold rounded-[12px] hover:bg-[#EA580C] hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(249,115,22,0.25)] transition-all duration-200"
            onSuccess={async (data) => {
              alert('Identity Upgraded to Pro Status.');
              onClose();
            }}
            onError={(error) => {
              alert('Authorization Failed: ' + error);
            }}
          />
          <button 
            onClick={onClose}
            className="w-full py-4 text-[#1E293B]/50 font-bold rounded-[12px] hover:bg-[#FFF0E5] hover:text-[#1E293B] transition-all duration-200"
          >
            Maintain Standard Status
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export function StudentDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showUpgradeModal, setShowUpgradeModal] = useState(location.state?.showUpgrade || false);
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [testHistory, setTestHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (location.state?.showUpgrade) {
      setShowUpgradeModal(true);
    }
    fetchData();
  }, [location.state]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const savedUser = JSON.parse(localStorage.getItem('user'));
      const [profileRes, projectsRes, assessmentsRes, historyRes] = await Promise.all([
        api.get(`/users/profile/${savedUser._id || savedUser.id}`),
        api.get('/projects'),
        api.get('/assessments'),
        api.get('/assessments/my-results')
      ]);

      setUser(profileRes.data);
      localStorage.setItem('user', JSON.stringify(profileRes.data));
      setProjects(projectsRes.data.slice(0, 3)); 
      setTestHistory(historyRes.data);
      
      const challengePresets = [
        { _id: 'ai-01', title: 'Python AI Specialist', duration: 90, difficulty: 'Expert', reward: 'Neural Network Badge', icon: Code },
        { _id: 'cloud-01', title: 'Cloud Infrastructure', duration: 120, difficulty: 'Senior', reward: 'SRE Verified Badge', icon: Activity }
      ];
      setAssessments([...assessmentsRes.data, ...challengePresets]);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (isLoading && !user) {
    const cachedUserStr = localStorage.getItem('user');
    const cachedUser = cachedUserStr ? JSON.parse(cachedUserStr) : null;
    return (
      <DashboardLayout user={cachedUser}>
        <div className="min-h-[60vh] flex items-center justify-center bg-[#FFF0E5]">
          <div className="w-12 h-12 border-4 border-[#38BDF8]/30 border-t-[#38BDF8] rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  // Calculate some mock analytics based on user data
  const totalHoursMastered = user?.badges?.length * 15 || 45;
  const currentStreak = user?.activeContractsCount > 0 ? 5 : 2;
  const progressPercent = Math.min(100, Math.round((totalHoursMastered / 100) * 100));

  return (
    <DashboardLayout user={user}>
      <div className="bg-[#FFF0E5] min-h-screen p-6 md:p-10 font-sans text-[#1E293B]">
        <AnimatePresence>
          {showUpgradeModal && <UpgradeModal onClose={() => setShowUpgradeModal(false)} />}
        </AnimatePresence>

        <div className="max-w-[1400px] mx-auto space-y-8">
          
          {/* Header Section */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-4xl font-bold tracking-tight text-[#1E293B] mb-2 flex items-center gap-4">
                {getGreeting()}, {user?.firstName}
                {user?.isPro && (
                  <span className="flex items-center gap-1 px-3 py-1 bg-[#F97316] text-white text-xs font-bold rounded-full shadow-[0_4px_10px_rgba(249,115,22,0.3)]">
                    <Zap size={14} fill="currentColor" /> PRO
                  </span>
                )}
              </h1>
              <p className="text-[#1E293B]/60 text-base font-medium">
                Let's accelerate your skills and secure your next big opportunity.
              </p>
            </motion.div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/assessments')}
                className="px-6 py-3 bg-white border border-[#38BDF8]/20 text-[#38BDF8] font-bold text-sm rounded-[12px] hover:-translate-y-0.5 hover:shadow-[0_8px_16px_rgba(56,189,248,0.15)] transition-all duration-200"
              >
                Browse Catalog
              </button>
              {!user?.isPro && (
                <button 
                  onClick={() => setShowUpgradeModal(true)}
                  className="px-6 py-3 bg-[#1E293B] text-white font-bold text-sm rounded-[12px] hover:-translate-y-0.5 hover:shadow-[0_8px_16px_rgba(30,41,59,0.2)] transition-all duration-200 flex items-center gap-2"
                >
                  <Star size={16} className="text-[#F97316]" /> Upgrade Access
                </button>
              )}
            </div>
          </header>

          {/* Top Priority Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Persistent Core CTA: Resume Last Lesson */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2 bg-[#1E293B] rounded-[16px] p-8 md:p-10 text-white relative overflow-hidden shadow-[0_10px_30px_rgba(30,41,59,0.15)]"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#38BDF8] opacity-10 rounded-full blur-[60px] translate-x-1/2 -translate-y-1/2" />
              
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 bg-[#38BDF8]/20 text-[#38BDF8] text-xs font-bold uppercase tracking-wider rounded-full">
                      In Progress
                    </span>
                    <span className="text-white/50 text-sm font-medium">Module 3 of 8</span>
                  </div>
                  <h2 className="text-3xl font-bold mb-3 tracking-tight">Advanced System Architecture</h2>
                  <p className="text-white/70 font-medium max-w-md">
                    Mastering scalable microservices and resilient data pipelines. You're 60% through this module.
                  </p>
                </div>
                
                <button className="group shrink-0 px-8 py-5 bg-[#F97316] text-white font-bold rounded-[12px] hover:bg-[#EA580C] hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(249,115,22,0.3)] transition-all duration-200 flex items-center gap-3">
                  <Play size={20} className="fill-current" />
                  Resume Learning
                </button>
              </div>
            </motion.div>

            {/* Performance Analytics Panel */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-[16px] p-8 border border-[#38BDF8]/10 shadow-[0_4px_20px_rgba(56,189,248,0.05)] flex flex-col justify-between"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-sm font-bold text-[#1E293B]/50 uppercase tracking-wider mb-1">Total Mastery</h3>
                  <div className="text-3xl font-bold text-[#1E293B]">{totalHoursMastered} <span className="text-lg text-[#1E293B]/40 font-medium">hrs</span></div>
                </div>
                
                {/* Active Learning Streak */}
                <div className="flex flex-col items-center justify-center p-3 bg-[#FFF0E5] rounded-[12px]">
                  <Flame size={24} className="text-[#F97316] mb-1" />
                  <span className="text-xs font-bold text-[#F97316] uppercase tracking-wider">{currentStreak} Day Streak</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-[#1E293B]/60 mb-2">
                  <span>Weekly Goal Progress</span>
                  <span className="text-[#38BDF8]">{progressPercent}%</span>
                </div>
                {/* Linear Progress Meter */}
                <div className="w-full h-2 bg-[#FFF0E5] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#38BDF8] rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${progressPercent}%` }} 
                  />
                </div>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Interactive Course Modules / Assessments */}
            <div className="lg:col-span-8 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-[#1E293B] flex items-center gap-2">
                  <Target className="text-[#38BDF8]" /> Available Skill Assessments
                </h3>
                <Link to="/assessments" className="text-sm font-bold text-[#38BDF8] hover:text-[#F97316] transition-colors flex items-center gap-1">
                  View All <ArrowRight size={16} />
                </Link>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-6">
                {assessments.slice(0,4).map((assessment, i) => (
                  <motion.div 
                    key={assessment._id || i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + (i * 0.1) }}
                    className="bg-white rounded-[16px] p-6 border border-slate-100 shadow-[0_4px_15px_rgba(0,0,0,0.02)] hover:border-[#38BDF8]/30 hover:shadow-[0_10px_30px_rgba(56,189,248,0.08)] transition-all duration-200 hover:-translate-y-1 group"
                  >
                    <div className="flex justify-between items-start mb-5">
                      <div className="w-12 h-12 bg-[#E0F2FE] text-[#38BDF8] rounded-[12px] flex items-center justify-center group-hover:bg-[#38BDF8] group-hover:text-white transition-colors duration-300">
                        {assessment.icon ? <assessment.icon size={22} /> : <BookOpen size={22} />}
                      </div>
                      <Badge variant="outline" className="text-xs font-bold uppercase tracking-wider text-[#1E293B]/60 border-[#1E293B]/10">
                        {assessment.difficulty}
                      </Badge>
                    </div>
                    
                    <h4 className="text-lg font-bold text-[#1E293B] mb-3 group-hover:text-[#38BDF8] transition-colors">{assessment.title}</h4>
                    
                    <div className="flex items-center gap-4 text-sm text-[#1E293B]/60 font-medium mb-6">
                      <span className="flex items-center gap-1.5"><Clock size={16} className="text-[#38BDF8]" /> {assessment.duration} min</span>
                      <span className="flex items-center gap-1.5"><Trophy size={16} className="text-[#F97316]" /> {assessment.reward}</span>
                    </div>
                    
                    <button 
                      onClick={() => navigate('/assessments')} 
                      className="w-full py-3 bg-[#FFF0E5] text-[#F97316] rounded-[10px] text-sm font-bold hover:bg-[#F97316] hover:text-white transition-colors duration-200"
                    >
                      Start Module
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Critical Milestone Stream */}
            <div className="lg:col-span-4 space-y-6">
              <h3 className="text-xl font-bold text-[#1E293B] flex items-center gap-2">
                <AlertCircle className="text-[#F97316]" /> Action Required
              </h3>
              
              <div className="bg-white rounded-[16px] border border-slate-100 shadow-[0_4px_15px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col h-[calc(100%-2rem)]">
                <div className="p-6 space-y-4 flex-1">
                  
                  {/* Urgent Item */}
                  <div className="p-4 bg-[#FFF0E5] border border-[#F97316]/20 rounded-[12px] relative overflow-hidden group hover:-translate-y-0.5 transition-transform duration-200">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#F97316]" />
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold text-[#F97316] uppercase tracking-wider">Due in 14h</span>
                      <AlertCircle size={16} className="text-[#F97316]" />
                    </div>
                    <h4 className="font-bold text-[#1E293B] mb-1 leading-tight">Submit Backend Architecture Plan</h4>
                    <p className="text-xs text-[#1E293B]/60 font-medium mb-3">Project: E-Commerce Refactor</p>
                    <button className="text-sm font-bold text-[#F97316] hover:text-[#EA580C] flex items-center gap-1 transition-colors">
                      Complete Task <ArrowRight size={14} />
                    </button>
                  </div>

                  {projects.length > 0 ? projects.map((proj, i) => (
                    <div key={proj._id} className="p-4 bg-slate-50 border border-slate-100 rounded-[12px] group hover:bg-[#E0F2FE] hover:border-[#38BDF8]/30 transition-all duration-200 hover:-translate-y-0.5">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold text-[#38BDF8] uppercase tracking-wider">Active Project</span>
                      </div>
                      <h4 className="font-bold text-[#1E293B] mb-1 leading-tight group-hover:text-[#38BDF8] transition-colors">{proj.title}</h4>
                      <div className="flex justify-between items-end mt-3">
                        <p className="text-xs text-[#1E293B]/60 font-medium">Due: {new Date(proj.deadline).toLocaleDateString()}</p>
                        <p className="text-sm font-bold text-[#1E293B]">${proj.budget?.toLocaleString()}</p>
                      </div>
                    </div>
                  )) : (
                    <div className="py-8 text-center">
                      <p className="text-sm text-[#1E293B]/50 font-medium">No active milestones.</p>
                    </div>
                  )}
                  
                </div>
                <div className="p-4 border-t border-slate-100 bg-slate-50 text-center">
                  <Link to="/dashboard/student/browse" className="text-sm font-bold text-[#38BDF8] hover:text-[#1E293B] transition-colors">
                    Find New Projects
                  </Link>
                </div>
              </div>
            </div>

          </div>

          {/* Verification Status (Re-styled) */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className={`p-8 md:p-10 rounded-[16px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border flex flex-col md:flex-row items-center justify-between gap-8 ${
              user?.isVerified 
                ? 'bg-[#E0F2FE] border-[#38BDF8]/30 text-[#1E293B]' 
                : 'bg-white border-slate-200 text-[#1E293B]'
            }`}
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <div className={`w-2.5 h-2.5 rounded-full ${user?.isVerified ? 'bg-[#38BDF8]' : 'bg-[#F97316]'}`} />
                <span className={`text-xs font-bold uppercase tracking-wider ${user?.isVerified ? 'text-[#38BDF8]' : 'text-[#F97316]'}`}>
                  {user?.isVerified ? 'AI VERIFIED EXPERT' : 'VERIFICATION PENDING'}
                </span>
              </div>
              <h4 className="text-2xl font-bold mb-2">
                {user?.isVerified ? 'You are a Verified Professional' : 'Unlock Premium Opportunities'}
              </h4>
              <p className={`text-sm leading-relaxed font-medium ${user?.isVerified ? 'text-[#1E293B]/70' : 'text-[#1E293B]/60'}`}>
                {user?.isVerified 
                  ? 'Your skills have been cryptographically verified by our AI proctoring system. You now have priority access to top clients.' 
                  : 'Complete an AI-proctored challenge to validate your skills and gain access to high-paying, zero-brokerage contracts.'}
              </p>
            </div>
            <div className="shrink-0 w-full md:w-auto">
              <button 
                onClick={() => navigate(user?.isVerified ? '/profile' : '/assessments')}
                className={`w-full md:w-auto px-8 py-4 rounded-[12px] text-sm font-bold transition-all duration-200 hover:-translate-y-0.5 ${
                  user?.isVerified 
                    ? 'bg-[#1E293B] text-white hover:bg-[#38BDF8] hover:shadow-[0_8px_20px_rgba(56,189,248,0.25)]' 
                    : 'bg-[#F97316] text-white hover:bg-[#EA580C] hover:shadow-[0_8px_20px_rgba(249,115,22,0.25)]'
                }`}
              >
                {user?.isVerified ? 'View Public Profile' : 'Initialize AI Proctor'}
              </button>
            </div>
          </motion.section>

        </div>
      </div>
    </DashboardLayout>
  );
}
