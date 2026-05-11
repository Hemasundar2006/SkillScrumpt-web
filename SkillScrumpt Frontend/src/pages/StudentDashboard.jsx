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
  Star
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
    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
  >
    <motion.div 
      initial={{ scale: 0.95, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.95, y: 20 }}
      className="max-w-md w-full bg-black border border-white/20 p-12 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-white" />
      
      <div className="text-center mb-10">
        <div className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-4">Elite Access</div>
        <h3 className="text-4xl font-black text-white tracking-tighter mb-6 uppercase italic">UPGRADE <br />TO PRO.</h3>
        <div className="inline-block px-4 py-2 bg-white text-black text-[10px] font-black uppercase tracking-widest mb-6 animate-pulse">
          ₹1 SPECIAL OFFER ({pricing.remainingPromoSpots} spots left)
        </div>
      </div>
      
      <div className="space-y-6 mb-12">
        {[
          'Access to Elite AI Assessments',
          'Priority Placement for Big Tech Roles',
          'Unlimited Verified Badges',
          '24/7 Career Support'
        ].map((feature, i) => (
          <div key={i} className="flex items-center gap-4 text-[11px] font-black uppercase tracking-widest text-white/60">
            <CheckCircle size={14} className="text-white" />
            {feature}
          </div>
        ))}
      </div>
      
      <div className="flex flex-col gap-4">
        <RazorpayPayment 
          amount={pricing.currentPrice} 
          buttonText={`Authorize Upgrade (₹${pricing.currentPrice})`}
          className="w-full py-5 bg-white text-black font-black uppercase tracking-widest text-[11px] hover:bg-white/90 transition-all"
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
          className="w-full py-4 text-white/30 font-black uppercase tracking-widest text-[10px] hover:text-white transition-colors"
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
        { _id: 'ai-01', title: 'Python AI Specialist', duration: 90, difficulty: 'Expert', reward: 'Neural Network Badge' },
        { _id: 'cloud-01', title: 'Cloud Infrastructure', duration: 120, difficulty: 'Senior', reward: 'SRE Verified Badge' }
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
    if (hour < 12) return 'GOOD MORNING';
    if (hour < 18) return 'GOOD AFTERNOON';
    return 'GOOD EVENING';
  };

  if (isLoading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
      </div>
    );
  }

  return (
    <DashboardLayout user={user}>
      <AnimatePresence>
        {showUpgradeModal && <UpgradeModal onClose={() => setShowUpgradeModal(false)} />}
      </AnimatePresence>

      <header className="mb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-2 flex items-center gap-3">
            {getGreeting().toLowerCase().replace(/^\w/, c => c.toUpperCase())}, <span className="text-slate-400">{user?.firstName}</span>
            {user?.isPro && (
              <span className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-amber-400 to-amber-600 text-white text-[10px] font-black rounded-full shadow-md">
                <Zap size={12} fill="currentColor" /> PRO MEMBER
              </span>
            )}
          </h1>
          <p className="text-slate-500 text-sm font-medium flex items-center gap-2">
             <Clock size={14} /> You have 2 scheduled tests for this month
          </p>
        </motion.div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard icon={Briefcase} label="Active Contracts" value={user?.activeContractsCount || 0} color="indigo" />
        <StatCard icon={Award} label="Skill Badges" value={user?.badges?.length || 0} color="emerald" />
        <StatCard icon={Star} label="AI Rating" value={user?.rating || '0.0'} color="amber" />
        <StatCard icon={DollarSign} label="Available Credit" value={`$${user?.earnings?.toLocaleString() || 0}`} color="blue" />
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-16">
          <section>
            <div className="flex justify-between items-center mb-6 pb-2">
              <h3 className="text-lg font-bold text-slate-900">Available Projects</h3>
              <Link to="/projects" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors">
                See All <ArrowRight size={14} />
              </Link>
            </div>
            <div className="space-y-4">
              {projects.length > 0 ? projects.map(proj => (
                <ProjectRow 
                  key={proj._id}
                  id={proj._id}
                  title={proj.title} 
                  client={proj.client?.firstName || 'Elite Client'} 
                  status={proj.status} 
                  deadline={new Date(proj.deadline).toLocaleDateString()} 
                  amount={`$${proj.budget?.toLocaleString()}`}
                />
              )) : (
                <div className="py-12 text-center bg-white border border-slate-200 rounded-xl">
                  <p className="text-slate-400 text-sm font-medium">No projects available right now.</p>
                </div>
              )}
            </div>
          </section>

          <section>
            <div className="flex justify-between items-center mb-6 pb-2">
              <h3 className="text-lg font-bold text-slate-900">Recommended Tests</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              {assessments.length > 0 ? assessments.map(assessment => (
                <AssessmentCard 
                  key={assessment._id}
                  title={assessment.title} 
                  duration={`${assessment.duration} MIN`} 
                  difficulty={assessment.difficulty} 
                  reward={assessment.reward}
                />
              )) : (
                <div className="col-span-2 py-20 text-center border border-dashed border-white/10">
                  <p className="text-white/20 font-black uppercase tracking-widest text-xs">No assessment tasks available.</p>
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="space-y-12">
          <section>
            <div className={`p-6 rounded-2xl ${user?.isVerified ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-900'}`}>
              <div className="flex items-center gap-2 mb-4">
                <div className={`w-2 h-2 rounded-full ${user?.isVerified ? 'bg-white' : 'bg-indigo-500'}`} />
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">
                  {user?.isVerified ? 'VERIFIED ACCOUNT' : 'VERIFICATION PENDING'}
                </span>
              </div>
              <h4 className="text-xl font-bold mb-4">
                {user?.isVerified ? 'Verified Pro' : 'Get Verified'}
              </h4>
              <p className={`text-xs font-medium leading-relaxed mb-6 ${user?.isVerified ? 'text-indigo-100' : 'text-slate-500'}`}>
                  {user?.isVerified 
                  ? 'Your identity is verified. Your skills are validated by our AI system.' 
                  : 'Showcase your skills and unlock high-paying jobs by completing AI tests.'}
              </p>
              <button 
                onClick={() => navigate(user?.isVerified ? '/pricing' : '/assessments')}
                className={`w-full py-3 rounded-xl text-xs font-bold transition-all ${user?.isVerified ? 'bg-white text-indigo-600 hover:bg-slate-50' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
              >
                {user?.isVerified ? 'Upgrade Plan' : 'Get started'}
              </button>
            </div>
          </section>

          <section>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Quick Actions</div>
            <div className="space-y-3">
              <QuickActionButton onClick={() => setShowUpgradeModal(true)} icon={Zap} label="Upgrade Access" />
              <QuickActionButton onClick={() => navigate('/assessments')} icon={Shield} label="AI Assessment" />
              <QuickActionButton onClick={() => navigate('/projects')} icon={Briefcase} label="Find Projects" />
              <QuickActionButton icon={Users} label="Hire Partners" />
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className={`p-6 bg-white border border-slate-200 rounded-2xl shadow-sm transition-all hover:shadow-md`}>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${
        color === 'indigo' ? 'bg-indigo-50 text-indigo-600' :
        color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
        color === 'amber' ? 'bg-amber-50 text-amber-600' :
        'bg-blue-50 text-blue-600'
      }`}>
        <Icon size={24} />
      </div>
      <p className="text-xs font-semibold text-slate-400 mb-1">{label}</p>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

function ProjectRow({ id, title, client, status, deadline, amount }) {
  const navigate = useNavigate();
  return (
    <div onClick={() => navigate(`/projects/${id}`)} className="p-4 bg-white border border-slate-200 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-indigo-300 transition-all cursor-pointer shadow-sm">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center font-bold text-slate-400">
          {title[0].toUpperCase()}
        </div>
        <div>
          <h4 className="font-semibold text-slate-900">{title}</h4>
          <p className="text-xs text-slate-400 font-medium">{client}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-8">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-bold text-slate-900">{amount}</p>
          <p className="text-[10px] text-slate-400 font-medium">Deadline: {deadline}</p>
        </div>
        <div className="px-3 py-1 bg-slate-50 border border-slate-100 text-[10px] font-bold text-slate-600 rounded-lg">
          {status}
        </div>
        <ChevronRight size={18} className="text-slate-300" />
      </div>
    </div>
  );
}

function AssessmentCard({ title, duration, difficulty, reward }) {
  const navigate = useNavigate();
  return (
    <div className="p-6 bg-white border border-slate-200 rounded-2xl hover:border-indigo-300 transition-all shadow-sm">
      <div className="flex justify-between items-start mb-6">
        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
          <Zap size={18} />
        </div>
        <div className="text-[10px] font-bold text-indigo-600 px-2 py-1 bg-indigo-50 rounded-lg">
          {difficulty}
        </div>
      </div>
      <h4 className="text-lg font-bold text-slate-900 mb-2">{title}</h4>
      <div className="flex flex-col gap-1 text-xs text-slate-400 font-medium mb-8">
        <span className="flex items-center gap-2"><Clock size={14} /> Duration: {duration}</span>
        <span className="flex items-center gap-2 text-slate-500"><Award size={14} /> Reward: {reward}</span>
      </div>
      <button 
        onClick={() => navigate('/assessments')} 
        className="w-full py-3 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
      >
        Start Assessment
      </button>
    </div>
  );
}

function QuickActionButton({ icon: Icon, label, onClick }) {
  return (
    <button onClick={onClick} className="flex items-center justify-between w-full p-4 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all group shadow-sm">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-slate-50 text-slate-400 group-hover:text-indigo-600 transition-colors rounded-lg">
          <Icon size={18} />
        </div>
        <span className="text-sm font-semibold text-slate-600">{label}</span>
      </div>
      <ChevronRight size={16} className="text-slate-300" />
    </button>
  );
}
