import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, 
  Award, 
  TrendingUp, 
  ChevronRight,
  Shield,
  Zap,
  Clock,
  DollarSign,
  Users,
  CheckCircle,
  Loader2,
  ArrowRight,
  Star,
  Activity,
  Code
} from 'lucide-react';
import { Card, Badge, Button } from '../components/UI';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../layout/DashboardLayout';
import api from '../utils/api';
import RazorpayPayment from '../components/RazorpayPayment';

const UpgradeModal = ({ onClose }) => {
  const [pricing, setPricing] = useState({ currentPrice: 1, isPromoActive: true, remainingPromoSpots: 198 });

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md"
    >
      <motion.div 
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="max-w-md w-full bg-white p-10 relative overflow-hidden rounded-[2rem] shadow-2xl"
      >
        <div className="absolute top-0 left-0 w-full h-1.5 bg-indigo-600" />
        
        <div className="text-center mb-10">
          <div className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-4 flex items-center justify-center gap-2">
            <Star size={14} className="fill-indigo-600" /> Elite Access
          </div>
          <h3 className="text-3xl font-bold text-slate-900 tracking-tight mb-6">Upgrade to Pro</h3>
          <div className="inline-block px-4 py-2 bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-widest mb-6 rounded-full">
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
            <div key={i} className="flex items-center gap-4 text-sm font-medium text-slate-600">
              <CheckCircle size={20} className="text-indigo-600" />
              {feature}
            </div>
          ))}
        </div>
        
        <div className="flex flex-col gap-3">
          <RazorpayPayment 
            amount={pricing.currentPrice} 
            buttonText={`Authorize Upgrade (₹${pricing.currentPrice})`}
            className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-md"
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
            className="w-full py-4 text-slate-500 font-bold rounded-2xl hover:bg-slate-50 transition-colors"
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
      const [profileRes, projectsRes, assessmentsRes] = await Promise.all([
        api.get(`/users/profile/${savedUser._id || savedUser.id}`),
        api.get('/projects'),
        api.get('/assessments')
      ]);

      setUser(profileRes.data);
      setProjects(projectsRes.data.slice(0, 3)); 
      
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
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="animate-spin text-indigo-600" size={48} />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout user={user}>
      <AnimatePresence>
        {showUpgradeModal && <UpgradeModal onClose={() => setShowUpgradeModal(false)} />}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto space-y-8">
        <header className="mb-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-4"
          >
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-1 flex items-center gap-3">
                {getGreeting()}, {user?.firstName}
                {user?.isPro && (
                  <span className="flex items-center gap-1 px-3 py-1 bg-indigo-600 text-white text-[10px] font-bold rounded-full shadow-sm">
                    <Zap size={12} fill="currentColor" /> PRO
                  </span>
                )}
              </h1>
              <p className="text-slate-500 text-sm font-medium">
                Here is what's happening with your account today.
              </p>
            </div>
          </motion.div>
        </header>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-6">
          
          {/* Stats Row */}
          <div className="lg:col-span-12 grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatCard icon={Briefcase} label="Active Contracts" value={user?.activeContractsCount || 0} delay={0.1} />
            <StatCard icon={Award} label="Skill Badges" value={user?.badges?.length || 0} delay={0.2} />
            <StatCard icon={Star} label="AI Rating" value={user?.rating || '0.0'} delay={0.3} />
            <StatCard icon={DollarSign} label="Available Credit" value={`$${user?.earnings?.toLocaleString() || 0}`} delay={0.4} />
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Proctoring Challenges - Large Bento Card */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Shield className="text-indigo-600" /> Active Proctoring Challenges
                </h3>
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                {assessments.length > 0 ? assessments.map((assessment, i) => (
                  <AssessmentCard 
                    key={assessment._id}
                    title={assessment.title} 
                    duration={`${assessment.duration} MIN`} 
                    difficulty={assessment.difficulty} 
                    reward={assessment.reward}
                    icon={assessment.icon}
                    delay={0.6 + (i * 0.1)}
                  />
                )) : (
                  <div className="col-span-2 py-16 text-center rounded-2xl bg-slate-50 border border-slate-100">
                    <p className="text-slate-500 font-semibold text-sm">No active proctoring tasks.</p>
                  </div>
                )}
              </div>
            </motion.section>

            {/* Matched Projects - Wide Bento Card */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Activity className="text-indigo-600" /> Matched Projects
                </h3>
                <Link to="/projects" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors">
                  View Market <ArrowRight size={14} />
                </Link>
              </div>
              <div className="space-y-4">
                {projects.length > 0 ? projects.map((proj, i) => (
                  <ProjectRow 
                    key={proj._id}
                    id={proj._id}
                    title={proj.title} 
                    client={proj.client?.firstName || 'Elite Client'} 
                    status={proj.status} 
                    deadline={new Date(proj.deadline).toLocaleDateString()} 
                    amount={`$${proj.budget?.toLocaleString()}`}
                    delay={0.8 + (i * 0.1)}
                  />
                )) : (
                  <div className="py-12 text-center rounded-2xl bg-slate-50 border border-slate-100">
                    <p className="text-slate-500 text-sm font-medium">No projects available matching your skill profile.</p>
                  </div>
                )}
              </div>
            </motion.section>
          </div>

          {/* Right Sidebar Area */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Status Card - Tall Bento */}
            <motion.section
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className={`p-8 rounded-[2rem] shadow-sm border ${user?.isVerified ? 'bg-indigo-600 border-indigo-700 text-white' : 'bg-white border-slate-100 text-slate-900'}`}
            >
              <div className="flex items-center gap-2 mb-6">
                <div className={`w-2.5 h-2.5 rounded-full ${user?.isVerified ? 'bg-emerald-400' : 'bg-amber-500'}`} />
                <span className="text-xs font-bold uppercase tracking-wider opacity-90">
                  {user?.isVerified ? 'SYSTEM VERIFIED' : 'VERIFICATION REQUIRED'}
                </span>
              </div>
              <h4 className="text-2xl font-bold mb-3">
                {user?.isVerified ? 'Elite Status Active' : 'Unlock Potential'}
              </h4>
              <p className={`text-sm leading-relaxed mb-8 ${user?.isVerified ? 'text-indigo-100' : 'text-slate-500'}`}>
                  {user?.isVerified 
                  ? 'Your skills are cryptographically verified by our AI proctoring system.' 
                  : 'Engage our AI proctoring system to validate your skills and access premium contracts.'}
              </p>
              <button 
                onClick={() => navigate(user?.isVerified ? '/pricing' : '/assessments')}
                className={`w-full py-4 rounded-2xl text-sm font-bold transition-all shadow-sm ${user?.isVerified ? 'bg-white text-indigo-900 hover:bg-slate-50' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
              >
                {user?.isVerified ? 'Manage Subscription' : 'Initialize AI Proctor'}
              </button>
            </motion.section>

            {/* Quick Actions */}
            <motion.section
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100"
            >
              <h3 className="text-base font-bold text-slate-900 mb-4 px-2">Command Center</h3>
              <div className="space-y-2">
                {user?.isPro ? (
                  <QuickActionButton onClick={() => {}} icon={CheckCircle} label="Already Upgraded to Pro" disabled />
                ) : (
                  <QuickActionButton onClick={() => setShowUpgradeModal(true)} icon={Zap} label="Upgrade Access Level" />
                )}
                <QuickActionButton onClick={() => navigate('/assessments')} icon={Shield} label="Launch AI Proctoring" />
                <QuickActionButton onClick={() => navigate('/projects')} icon={Briefcase} label="Browse Project Market" />
                <QuickActionButton icon={Users} label="Collaborator Network" />
              </div>
            </motion.section>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function StatCard({ icon: Icon, label, value, delay }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow group"
    >
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 bg-slate-50 text-indigo-600 group-hover:scale-110 transition-transform duration-300">
        <Icon size={24} />
      </div>
      <p className="text-sm font-medium text-slate-500 mb-1">{label}</p>
      <p className="text-3xl font-bold text-slate-900">{value}</p>
    </motion.div>
  );
}

function ProjectRow({ id, title, client, status, deadline, amount, delay }) {
  const navigate = useNavigate();
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      onClick={() => navigate(`/projects/${id}`)} 
      className="p-4 bg-white border border-slate-100 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-200 hover:bg-slate-50 transition-all cursor-pointer group"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-slate-100 text-indigo-600 rounded-2xl flex items-center justify-center font-bold text-lg group-hover:bg-white transition-colors shadow-sm">
          {title[0].toUpperCase()}
        </div>
        <div>
          <h4 className="font-bold text-slate-900 mb-0.5">{title}</h4>
          <p className="text-sm text-slate-500 font-medium">{client}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="text-right hidden sm:block">
          <p className="text-base font-bold text-slate-900">{amount}</p>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Due: {deadline}</p>
        </div>
        <div className="px-3 py-1.5 bg-slate-100 text-xs font-bold text-slate-600 rounded-lg">
          {status}
        </div>
        <ChevronRight size={18} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
      </div>
    </motion.div>
  );
}

function AssessmentCard({ title, duration, difficulty, reward, icon: Icon = Zap, delay }) {
  const navigate = useNavigate();
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className="p-6 bg-slate-50 rounded-[1.5rem] border border-slate-100 hover:shadow-md transition-all group"
    >
      <div className="flex justify-between items-start mb-6">
        <div className="w-12 h-12 bg-white text-indigo-600 shadow-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
          <Icon size={24} />
        </div>
        <div className="text-xs font-bold text-indigo-600 px-3 py-1 bg-indigo-50 rounded-full">
          {difficulty}
        </div>
      </div>
      
      <h4 className="text-lg font-bold text-slate-900 mb-4 group-hover:text-indigo-600 transition-colors">{title}</h4>
      
      <div className="flex flex-col gap-2 text-sm text-slate-600 font-medium mb-8">
        <span className="flex items-center gap-2"><Clock size={16} className="text-slate-400" /> {duration}</span>
        <span className="flex items-center gap-2"><Award size={16} className="text-slate-400" /> {reward}</span>
      </div>
      
      <button 
        onClick={() => navigate('/assessments')} 
        className="w-full py-3.5 bg-white text-slate-900 shadow-sm rounded-xl text-sm font-bold hover:bg-indigo-600 hover:text-white transition-all border border-slate-200"
      >
        Initialize Test
      </button>
    </motion.div>
  );
}

function QuickActionButton({ icon: Icon, label, onClick, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled} className={`flex items-center justify-between w-full p-4 rounded-2xl transition-all group ${disabled ? 'bg-slate-50 opacity-80 cursor-default' : 'bg-white hover:bg-slate-50'}`}>
      <div className="flex items-center gap-4">
        <div className={`p-2.5 rounded-xl transition-colors ${disabled ? 'bg-indigo-50 text-indigo-400' : 'bg-slate-50 text-indigo-600 group-hover:bg-indigo-100'}`}>
          <Icon size={20} />
        </div>
        <span className={`text-sm font-bold ${disabled ? 'text-slate-500' : 'text-slate-700'}`}>{label}</span>
      </div>
      {!disabled && <ChevronRight size={18} className="text-slate-300 group-hover:text-indigo-600 transition-colors transform group-hover:translate-x-1" />}
    </button>
  );
}
