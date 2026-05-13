import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Loader2, 
  Star,
  BadgeCheck,
  MoreVertical,
  ChevronRight,
  Zap,
  CheckCircle,
  ArrowRight,
  Briefcase,
  Users,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { Card, Badge, Button } from '../components/UI';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../layout/DashboardLayout';
import api from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
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
            <Star size={14} className="fill-indigo-600" /> Employer Elite
          </div>
          <h3 className="text-3xl font-bold text-slate-900 tracking-tight mb-6">Upgrade to Pro</h3>
          <div className="inline-block px-4 py-2 bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-widest mb-6 rounded-full">
            ₹1 SPECIAL OFFER ({pricing.remainingPromoSpots} spots left)
          </div>
        </div>
        
        <div className="space-y-4 mb-10">
          {[
            'Access to Top 1% Verified Talent',
            'Priority Project Promotion',
            'Unlimited Direct Messaging',
            'Dedicated Account Manager'
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
            buttonText={`Upgrade Now (₹${pricing.currentPrice})`}
            className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-md"
            onSuccess={async (data) => {
              alert('Account Upgraded to Pro Status.');
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
            Keep Current Plan
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export function ClientDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showUpgradeModal, setShowUpgradeModal] = useState(location.state?.showUpgrade || false);
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [talent, setTalent] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const savedUser = JSON.parse(localStorage.getItem('user'));
      const [profileRes, projectsRes, talentRes] = await Promise.all([
        api.get(`/users/profile/${savedUser._id || savedUser.id}`),
        api.get('/projects?mine=true'), 
        api.get('/users/professionals') 
      ]);

      setUser(profileRes.data);
      localStorage.setItem('user', JSON.stringify(profileRes.data));
      setProjects(projectsRes.data.slice(0, 3)); 
      setTalent(talentRes.data.slice(0, 3));
    } catch (err) {
      console.error('Error fetching client data:', err);
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
        <header className="mb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-1 flex items-center gap-3">
              {getGreeting()}, <span className="text-slate-700">{user?.firstName}</span>
              {user?.isPro && (
                <span className="flex items-center gap-1 px-3 py-1 bg-indigo-600 text-white text-[10px] font-bold rounded-full shadow-sm">
                  <Zap size={12} fill="currentColor" /> PRO
                </span>
              )}
            </h1>
            <p className="text-slate-500 text-sm font-medium">Find verified talent and manage projects efficiently.</p>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Link to="/post-project">
              <button className="flex items-center gap-2 bg-indigo-600 text-white py-3 px-6 rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg shadow-indigo-200">
                <Plus size={18} /> Post New Project
              </button>
            </Link>
          </motion.div>
        </header>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-6">
          
          {/* Main Projects Column */}
          <div className="lg:col-span-8 space-y-6">
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 h-full"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Briefcase className="text-indigo-600" /> Active Projects
                </h3>
                <Link to="/my-projects" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors">
                  All Projects <ArrowRight size={14} />
                </Link>
              </div>
              <div className="space-y-4">
                {projects.length > 0 ? projects.map((proj, i) => (
                  <ActiveProjectCard 
                    key={proj._id}
                    id={proj._id}
                    title={proj.title} 
                    bids={proj.bidsCount || 0} 
                    status={proj.status} 
                    budget={`$${proj.budget?.toLocaleString()}`}
                    delay={0.3 + (i * 0.1)}
                  />
                )) : (
                  <div className="py-16 text-center rounded-2xl bg-slate-50 border border-slate-100">
                    <p className="text-slate-500 font-semibold text-sm">No active projects found.</p>
                  </div>
                )}
              </div>
            </motion.section>
          </div>

          {/* Right Metrics Column */}
          <div className="lg:col-span-4 space-y-6">
            <motion.section
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100"
            >
              <h3 className="text-base font-bold text-slate-900 mb-6 flex items-center gap-2">
                <TrendingUp className="text-indigo-600" /> Performance Metrics
              </h3>
              <div className="space-y-2">
                <StatItem icon={DollarSign} label="Total Expenditure" value={`$${user?.totalSpent?.toLocaleString() || 0}`} />
                <StatItem icon={Briefcase} label="Active Contracts" value={user?.activeContractsCount || 0} />
                <StatItem icon={Star} label="Open Projects" value={projects.length} />
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-8 bg-indigo-600 border-indigo-700 text-white rounded-[2rem] shadow-sm border"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-wider opacity-90">Employer Pro</span>
              </div>
              <h4 className="text-2xl font-bold mb-3">Maximize Reach</h4>
              <p className="text-sm leading-relaxed mb-8 text-indigo-100">
                Unlock verified talent profiles, secure priority listings, and receive dedicated support.
              </p>
              {user?.isPro ? (
                <button 
                  disabled
                  className="w-full py-4 bg-indigo-500 text-indigo-100 rounded-2xl text-sm font-bold shadow-sm cursor-default flex items-center justify-center gap-2"
                >
                  <CheckCircle size={18} /> Already Upgraded to Pro
                </button>
              ) : (
                <button 
                  onClick={() => setShowUpgradeModal(true)} 
                  className="w-full py-4 bg-white text-indigo-900 rounded-2xl text-sm font-bold hover:bg-slate-50 transition-all shadow-sm"
                >
                  Upgrade Account
                </button>
              )}
            </motion.section>
          </div>
        </div>

        {/* Talent Pool Section - Full Width */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Users className="text-indigo-600" /> Verified Talent Pool
            </h3>
            <Link to="/talent" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors">
              Browse All <ArrowRight size={14} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {talent.length > 0 ? talent.map((pro, i) => (
              <TalentCard 
                key={pro._id}
                id={pro._id}
                name={`${pro.firstName} ${pro.lastName}`} 
                role={pro.skills?.[0] || 'Software Engineer'} 
                rating={pro.rating || '0.0'} 
                skills={pro.skills || []}
                score={pro.aiScore || 0}
                isPro={pro.isPro}
                avatar={`${pro.firstName?.[0]}${pro.lastName?.[0]}`}
                delay={0.6 + (i * 0.1)}
              />
            )) : (
              <div className="col-span-3 py-16 text-center rounded-[2rem] bg-slate-50 border border-slate-100">
                <p className="text-slate-500 font-semibold text-sm flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin text-slate-400" size={18} /> Scanning for elite talent...
                </p>
              </div>
            )}
          </div>
        </motion.section>
      </div>
    </DashboardLayout>
  );
}

function ActiveProjectCard({ id, title, bids, status, budget, delay }) {
  const navigate = useNavigate();
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      onClick={() => navigate(`/projects/${id}`)} 
      className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-200 hover:bg-slate-100 transition-all cursor-pointer group"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-white text-indigo-600 rounded-2xl flex items-center justify-center font-bold text-lg shadow-sm">
          {title[0].toUpperCase()}
        </div>
        <div>
          <h4 className="font-bold text-slate-900 mb-0.5">{title}</h4>
          <div className="flex items-center gap-3 text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-1"><Users size={12}/> {bids} Bids</span>
            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
            <span className="text-indigo-600">{budget}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="px-3 py-1.5 bg-white border border-slate-100 text-xs font-bold text-slate-600 rounded-lg shadow-sm">
          {status}
        </div>
        <ChevronRight size={18} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
      </div>
    </motion.div>
  );
}

function StatItem({ icon: Icon, label, value }) {
  return (
    <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white text-indigo-600 rounded-xl shadow-sm">
          <Icon size={18} />
        </div>
        <span className="text-sm font-semibold text-slate-600">{label}</span>
      </div>
      <span className="text-lg font-bold text-slate-900">{value}</span>
    </div>
  );
}

function TalentCard({ id, name, role, rating, skills, score, avatar, isPro, delay }) {
  const navigate = useNavigate();
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className="p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:shadow-md transition-all group relative flex flex-col h-full"
    >
      {isPro && (
        <div className="absolute top-6 right-6 flex items-center gap-1 px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-full">
          <Zap size={12} fill="currentColor" /> PRO
        </div>
      )}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 bg-slate-50 text-indigo-600 border border-slate-100 rounded-2xl flex items-center justify-center font-bold text-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
          {avatar}
        </div>
        <div>
          <h4 className="font-bold text-slate-900 text-lg flex items-center gap-2">
            {name} {isPro && <BadgeCheck size={18} className="text-indigo-500" />}
          </h4>
          <p className="text-sm text-slate-500 font-medium">{role}</p>
        </div>
      </div>
 
      <div className="grid grid-cols-2 gap-4 mb-6">
         <div className="p-4 bg-slate-50 rounded-[1.25rem] border border-slate-100">
           <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">AI Match Score</p>
           <p className="text-2xl font-bold text-slate-900">{score}<span className="text-sm text-slate-400">/100</span></p>
         </div>
         <div className="p-4 bg-slate-50 rounded-[1.25rem] border border-slate-100">
           <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Client Rating</p>
           <div className="flex items-center gap-1">
             <Star size={20} className="text-amber-400 fill-amber-400" />
             <span className="text-2xl font-bold text-slate-900">{rating}</span>
           </div>
         </div>
      </div>
 
      <div className="flex flex-wrap gap-2 mb-8 flex-grow">
        {skills.slice(0, 3).map((skill, i) => (
          <div key={i} className="px-3 py-1.5 bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-600 rounded-xl">
            {skill}
          </div>
        ))}
      </div>
 
      <button 
        onClick={() => navigate(`/profile/${id}`)} 
        className="w-full py-3.5 bg-white border border-slate-200 text-slate-900 rounded-xl text-sm font-bold hover:bg-indigo-600 hover:text-white transition-all shadow-sm mt-auto"
      >
        View Full Profile
      </button>
    </motion.div>
  );
}
