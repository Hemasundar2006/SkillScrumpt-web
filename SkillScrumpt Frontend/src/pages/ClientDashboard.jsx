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
  Users
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
        <div className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-4">Employer Elite</div>
        <h3 className="text-4xl font-black text-white tracking-tighter mb-6 uppercase italic">UPGRADE <br />TO PRO.</h3>
        <div className="inline-block px-4 py-2 bg-white text-black text-[10px] font-black uppercase tracking-widest mb-6 animate-pulse">
          ₹1 SPECIAL OFFER ({pricing.remainingPromoSpots} spots left)
        </div>
      </div>
      
      <div className="space-y-6 mb-12">
        {[
          'Access to Top 1% Verified Talent',
          'Priority Project Promotion',
          'Unlimited Direct Messaging',
          'Dedicated Account Manager'
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
          buttonText={`Upgrade Now (₹${pricing.currentPrice})`}
          className="w-full py-5 bg-white text-black font-black uppercase tracking-widest text-[11px] hover:bg-white/90 transition-all"
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
          className="w-full py-4 text-white/30 font-black uppercase tracking-widest text-[10px] hover:text-white transition-colors"
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
        api.get('/projects'), 
        api.get('/users/professionals') 
      ]);

      setUser(profileRes.data);
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

      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-2 flex items-center gap-3">
            {getGreeting().toLowerCase().replace(/^\w/, c => c.toUpperCase())}, <span className="text-slate-400">{user?.firstName}</span>
            {user?.isPro && (
              <span className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-amber-400 to-amber-600 text-white text-[10px] font-black rounded-full shadow-md">
                <Zap size={12} fill="currentColor" /> PRO EMPLOYER
              </span>
            )}
          </h1>
          <p className="text-slate-500 text-sm font-medium">Find verified talent for your projects on SkillScrumpt.in</p>
        </motion.div>
        
        <Link to="/post-project">
          <button className="flex items-center gap-2 bg-indigo-600 text-white py-3 px-6 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 group">
            <Plus size={18} /> Post New Project
          </button>
        </Link>
      </header>

      <div className="grid lg:grid-cols-3 gap-12 mb-16">
        <div className="lg:col-span-2 space-y-12">
          <section>
            <div className="flex justify-between items-center mb-6 pb-2">
              <h3 className="text-lg font-bold text-slate-900">Your Projects</h3>
              <Link to="/my-projects" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors">
                All Projects <ArrowRight size={14} />
              </Link>
            </div>
            <div className="space-y-4">
              {projects.length > 0 ? projects.map(proj => (
                <ActiveProjectCard 
                  key={proj._id}
                  id={proj._id}
                  title={proj.title} 
                  bids={proj.bidsCount || 0} 
                  status={proj.status} 
                  budget={`$${proj.budget?.toLocaleString()}`}
                />
              )) : (
                <div className="py-12 text-center bg-white border border-slate-200 rounded-xl">
                  <p className="text-slate-400 text-sm font-medium">No projects found.</p>
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="space-y-12">
          <section>
             <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Performance Metrics</div>
             <Card className="p-6 space-y-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
                <StatItem label="TOTAL EXPENDITURE" value={`$${user?.totalSpent?.toLocaleString() || 0}`} />
                <StatItem label="ACTIVE CONTRACTS" value={user?.activeContractsCount || 0} />
                <StatItem label="OPEN PROJECTS" value={projects.length} />
             </Card>
          </section>

          <section>
            <div className="p-6 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-100">
              <h4 className="text-xl font-bold mb-4">Employer Pro</h4>
              <p className="text-xs font-medium leading-relaxed mb-8 opacity-90">
                Unlock verified talent and receive dedicated support.
              </p>
              <button 
                onClick={() => setShowUpgradeModal(true)} 
                className="w-full py-3 bg-white text-indigo-600 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all"
              >
                Upgrade Now
              </button>
            </div>
          </section>
        </div>
      </div>

      <section>
        <div className="flex justify-between items-end mb-10 pb-4 border-b border-white/10">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Talent Pool</div>
            <h3 className="text-lg font-bold text-slate-900 mb-8">Verified Talent</h3>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {talent.length > 0 ? talent.map(pro => (
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
            />
          )) : (
            <div className="col-span-3 py-20 text-center border border-dashed border-white/10">
              <p className="text-white/20 font-black uppercase tracking-widest text-xs">Scanning for elite talent...</p>
            </div>
          )}
        </div>
      </section>
    </DashboardLayout>
  );
}

function ActiveProjectCard({ id, title, bids, status, budget }) {
  const navigate = useNavigate();
  return (
    <div onClick={() => navigate(`/projects/${id}`)} className="p-4 bg-white border border-slate-200 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-indigo-300 transition-all cursor-pointer shadow-sm">
      <div>
        <h4 className="font-semibold text-slate-900">{title}</h4>
        <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 mt-1">
          <span>{bids} APPLICATIONS</span>
          <span className="text-indigo-600 font-bold">{budget}</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="px-3 py-1 bg-slate-50 border border-slate-100 text-[10px] font-bold text-slate-600 rounded-lg">
          {status}
        </div>
        <MoreVertical size={20} className="text-slate-300" />
      </div>
    </div>
  );
}

function StatItem({ label, value }) {
  return (
    <div className="flex justify-between items-center py-4 border-b border-slate-50">
      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</span>
      <span className="text-lg font-bold text-slate-900">{value}</span>
    </div>
  );
}

function TalentCard({ id, name, role, rating, skills, score, avatar, isPro }) {
  const navigate = useNavigate();
  return (
    <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-indigo-300 transition-all group relative">
      {isPro && (
        <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-amber-400 to-amber-600 text-white text-[9px] font-black rounded-full shadow-sm">
          <Zap size={10} fill="currentColor" /> PRO
        </div>
      )}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-slate-400 text-lg">
          {avatar}
        </div>
        <div>
          <h4 className="font-bold text-slate-900 flex items-center gap-2">
            {name} {isPro && <BadgeCheck size={18} className="text-indigo-500" />}
          </h4>
          <p className="text-xs text-slate-400 font-medium">{role}</p>
        </div>
      </div>
 
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
           <div className="p-4 bg-slate-50 rounded-xl">
             <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">AI Score</p>
             <p className="text-xl font-bold text-slate-900">{score}</p>
           </div>
           <div className="p-4 bg-slate-50 rounded-xl">
             <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Rating</p>
             <div className="flex items-center gap-1">
               <Star size={14} className="text-amber-400 fill-amber-400" />
               <span className="text-xl font-bold text-slate-900">{rating}</span>
             </div>
           </div>
        </div>
 
        <div className="flex flex-wrap gap-2">
          {skills.slice(0, 3).map((skill, i) => (
            <div key={i} className="px-2 py-1 bg-slate-100 text-[10px] font-bold text-slate-500 rounded-lg">
              {skill}
            </div>
          ))}
        </div>
 
        <button 
          onClick={() => navigate(`/profile/${id}`)} 
          className="w-full py-3 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all"
        >
          View Profile
        </button>
      </div>
    </div>
  );
}
