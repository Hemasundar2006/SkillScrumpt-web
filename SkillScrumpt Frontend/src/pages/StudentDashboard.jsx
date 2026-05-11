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
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 className="animate-spin text-white" size={48} />
      </div>
    );
  }

  return (
    <DashboardLayout user={user}>
      <AnimatePresence>
        {showUpgradeModal && <UpgradeModal onClose={() => setShowUpgradeModal(false)} />}
      </AnimatePresence>

      <header className="mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.4em]">Professional Dashboard</span>
          </div>
          <h1 className="text-6xl font-black tracking-tighter mb-4 italic uppercase">
            {getGreeting()}, <span className="text-white/40">{user?.firstName}.</span>
          </h1>
          <p className="text-white/40 font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3">
             <Clock size={14} /> You have 2 scheduled tests for this month // SkillScrumpt.in
          </p>
        </motion.div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
        <StatCard icon={Briefcase} label="Active Contracts" value={user?.activeContractsCount || 0} />
        <StatCard icon={Award} label="Skill Badges" value={user?.badges?.length || 0} />
        <StatCard icon={Star} label="AI Rating" value={user?.rating || '0.0'} />
        <StatCard icon={DollarSign} label="Available Credit" value={`$${user?.earnings?.toLocaleString() || 0}`} />
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-16">
          <section>
            <div className="flex justify-between items-end mb-10 pb-4 border-b border-white/10">
              <div>
                <div className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-2">Marketplace</div>
                <h3 className="text-3xl font-black tracking-tighter uppercase italic">AVAILABLE PROJECTS.</h3>
              </div>
              <Link to="/projects" className="text-[10px] font-black text-white/40 hover:text-white uppercase tracking-widest flex items-center gap-2 transition-colors">
                See All Projects <ArrowRight size={14} />
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
                <div className="py-20 text-center border border-dashed border-white/10">
                  <p className="text-white/20 font-black uppercase tracking-widest text-xs">No project signals detected.</p>
                </div>
              )}
            </div>
          </section>

          <section>
            <div className="flex justify-between items-end mb-10 pb-4 border-b border-white/10">
              <div>
                <div className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-2">Skill Verification</div>
                <h3 className="text-3xl font-black tracking-tighter uppercase italic">RECOMMENDED TESTS.</h3>
              </div>
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
            <div className="p-1 bg-white/10 border border-white/20">
              <div className={`p-8 border border-white/10 ${user?.isVerified ? 'bg-white text-black' : 'bg-black text-white'}`}>
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-2 h-2 rounded-full animate-pulse ${user?.isVerified ? 'bg-black' : 'bg-white'}`} />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">
                    {user?.isVerified ? 'ACCOUNT: VERIFIED' : 'ACCOUNT: PENDING'}
                  </span>
                </div>
                <h4 className="text-3xl font-black tracking-tighter mb-6 uppercase italic">
                  {user?.isVerified ? 'VERIFIED PRO.' : 'GET VERIFIED.'}
                </h4>
                <p className={`text-[11px] font-bold uppercase tracking-widest leading-relaxed mb-8 ${user?.isVerified ? 'text-black/60' : 'text-white/60'}`}>
                    {user?.isVerified 
                    ? 'Your identity is verified. Your skills are validated by our AI proctoring system.' 
                    : 'Showcase your skills and unlock high-paying jobs by completing AI tests.'}
                </p>
                <button 
                  onClick={() => navigate(user?.isVerified ? '/pricing' : '/assessments')}
                  className={`w-full py-5 text-[10px] font-black uppercase tracking-widest transition-all ${user?.isVerified ? 'bg-black text-white hover:bg-black/80' : 'bg-white text-black hover:bg-white/80'}`}
                >
                  {user?.isVerified ? 'Upgrade to Pro' : 'Get started'}
                </button>
              </div>
            </div>
          </section>

          <section>
            <div className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mb-8">Quick Actions</div>
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

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="p-8 border border-white/10 hover:border-white/30 transition-all bg-white/5 group">
      <div className="text-white/30 group-hover:text-white transition-colors mb-6">
        <Icon size={24} />
      </div>
      <p className="text-[9px] text-white/30 font-black uppercase tracking-[0.3em] mb-2">{label}</p>
      <p className="text-3xl font-black italic">{value}</p>
    </div>
  );
}

function ProjectRow({ id, title, client, status, deadline, amount }) {
  const navigate = useNavigate();
  return (
    <div onClick={() => navigate(`/projects/${id}`)} className="p-6 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-white/5 transition-all cursor-pointer group">
      <div className="flex items-center gap-6">
        <div className="w-12 h-12 border border-white/10 flex items-center justify-center font-black text-xl italic group-hover:bg-white group-hover:text-black transition-all">
          {title[0]}
        </div>
        <div>
          <h4 className="text-lg font-black tracking-tight uppercase group-hover:italic">{title}</h4>
          <p className="text-[9px] text-white/30 font-black uppercase tracking-widest mt-1">{client}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-12">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-black italic">{amount}</p>
          <p className="text-[9px] text-white/20 font-black uppercase tracking-widest mt-1">DEADLINE: {deadline}</p>
        </div>
        <div className="px-4 py-1 border border-white/20 text-[9px] font-black uppercase tracking-widest group-hover:border-white">
          {status}
        </div>
        <ChevronRight size={18} className="text-white/20 group-hover:text-white group-hover:translate-x-2 transition-all" />
      </div>
    </div>
  );
}

function AssessmentCard({ title, duration, difficulty, reward }) {
  const navigate = useNavigate();
  return (
    <div className="p-8 border border-white/10 hover:border-white transition-all group relative overflow-hidden bg-white/5">
      <div className="flex justify-between items-start mb-8">
        <div className="w-10 h-10 border border-white/10 flex items-center justify-center text-white/40 group-hover:bg-white group-hover:text-black transition-all">
          <Zap size={18} />
        </div>
        <div className="text-[9px] font-black uppercase tracking-widest px-3 py-1 border border-white/10 group-hover:border-white">
          {difficulty}
        </div>
      </div>
      <h4 className="text-2xl font-black tracking-tighter uppercase italic mb-4">{title}</h4>
      <div className="flex flex-col gap-2 text-[9px] text-white/30 font-black uppercase tracking-widest mb-10">
        <span className="flex items-center gap-2"><Clock size={14} /> DURATION: {duration}</span>
        <span className="flex items-center gap-2 text-white/50"><Award size={14} /> REWARD: {reward}</span>
      </div>
      <button 
        onClick={() => navigate('/assessments')} 
        className="w-full py-4 border border-white text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all"
      >
        INITIATE TASK
      </button>
    </div>
  );
}

function QuickActionButton({ icon: Icon, label, onClick }) {
  return (
    <button onClick={onClick} className="flex items-center justify-between w-full p-6 border border-white/10 hover:border-white transition-all group text-left">
      <div className="flex items-center gap-5">
        <div className="text-white/20 group-hover:text-white transition-colors">
          <Icon size={18} />
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.2em]">{label}</span>
      </div>
      <ChevronRight size={16} className="text-white/10 group-hover:text-white group-hover:translate-x-2 transition-all" />
    </button>
  );
}
