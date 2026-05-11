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

      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.4em]">Sector: Employer Hub</span>
          </div>
          <h1 className="text-6xl font-black tracking-tighter italic uppercase">
            {getGreeting()}, <span className="text-white/40">{user?.firstName}.</span>
          </h1>
          <p className="text-white/40 font-black text-[10px] uppercase tracking-[0.2em] mt-2">Discover elite verified talent for dominant projects on SkillScrumpt.in.</p>
        </motion.div>
        
        <Link to="/post-project">
          <button className="flex items-center gap-4 bg-white text-black py-5 px-10 font-black uppercase tracking-widest text-xs hover:bg-white/90 transition-all group">
            <Plus size={18} /> Post New Project
          </button>
        </Link>
      </header>

      <div className="grid lg:grid-cols-3 gap-12 mb-16">
        <div className="lg:col-span-2 space-y-12">
          <section>
            <div className="flex justify-between items-end mb-10 pb-4 border-b border-white/10">
              <div>
                <div className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-2">Operations</div>
                <h3 className="text-3xl font-black tracking-tighter uppercase italic">YOUR PROJECTS.</h3>
              </div>
              <Link to="/my-projects" className="text-[10px] font-black text-white/40 hover:text-white uppercase tracking-widest flex items-center gap-2 transition-colors">
                All Directives <ArrowRight size={14} />
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
                <div className="py-20 text-center border border-dashed border-white/10">
                  <p className="text-white/20 font-black uppercase tracking-widest text-xs">No project signals detected.</p>
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="space-y-12">
          <section>
             <div className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mb-8">Performance Metrics</div>
             <Card className="p-8 space-y-8 bg-white/5 border border-white/10">
                <StatItem label="TOTAL EXPENDITURE" value={`$${user?.totalSpent?.toLocaleString() || 0}`} />
                <StatItem label="ACTIVE CONTRACTS" value={user?.activeContractsCount || 0} />
                <StatItem label="OPEN DIRECTIVES" value={projects.length} />
             </Card>
          </section>

          <section>
            <div className="p-1 bg-white/10 border border-white/20">
              <div className="p-8 bg-black text-white border border-white/10">
                <h4 className="text-2xl font-black tracking-tighter mb-4 uppercase italic italic">CLIENT PRO.</h4>
                <p className="text-[11px] font-bold uppercase tracking-widest leading-relaxed mb-8 text-white/60">
                  Unlock the top 1% of AI-verified operatives and receive dedicated support.
                </p>
                <button 
                  onClick={() => setShowUpgradeModal(true)} 
                  className="w-full py-4 bg-white text-black font-black uppercase tracking-widest text-[10px] hover:bg-white/90 transition-all"
                >
                  Authorize Upgrade
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>

      <section>
        <div className="flex justify-between items-end mb-10 pb-4 border-b border-white/10">
          <div>
            <div className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-2">Talent Pool</div>
            <h3 className="text-3xl font-black tracking-tighter uppercase italic">VERIFIED OPERATIVES.</h3>
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
    <div onClick={() => navigate(`/projects/${id}`)} className="p-6 border border-white/10 hover:bg-white/5 transition-all group flex flex-col sm:flex-row sm:items-center justify-between gap-6 cursor-pointer">
      <div>
        <h4 className="text-lg font-black tracking-tight uppercase group-hover:italic">{title}</h4>
        <div className="flex items-center gap-6 text-[9px] font-black uppercase tracking-widest text-white/30 mt-2">
          <span>{bids} APPLICATIONS</span>
          <span className="text-white font-black">{budget}</span>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="px-4 py-1 border border-white/10 text-[9px] font-black uppercase tracking-widest group-hover:border-white">
          {status}
        </div>
        <MoreVertical size={20} className="text-white/20 group-hover:text-white transition-colors" />
      </div>
    </div>
  );
}

function StatItem({ label, value }) {
  return (
    <div className="flex justify-between items-end border-b border-white/5 pb-4">
      <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">{label}</span>
      <span className="text-xl font-black italic">{value}</span>
    </div>
  );
}

function TalentCard({ id, name, role, rating, skills, score, avatar }) {
  const navigate = useNavigate();
  return (
    <div className="p-8 border border-white/10 hover:border-white transition-all group relative bg-white/5">
      <div className="flex items-center gap-6 mb-10">
        <div className="w-16 h-16 border border-white/10 flex items-center justify-center font-black text-2xl italic group-hover:bg-white group-hover:text-black transition-all">
          {avatar}
        </div>
        <div>
          <h4 className="text-xl font-black tracking-tight uppercase flex items-center gap-3">
            {name} <BadgeCheck size={18} className="text-white" />
          </h4>
          <p className="text-[10px] text-white/30 font-black uppercase tracking-widest mt-1">{role}</p>
        </div>
      </div>

      <div className="space-y-8">
        <div className="grid grid-cols-2 gap-4">
           <div className="p-5 border border-white/10 bg-white/5">
             <p className="text-[9px] text-white/20 font-black uppercase tracking-widest mb-2">AI Score</p>
             <p className="text-2xl font-black italic">{score}</p>
           </div>
           <div className="p-5 border border-white/10 bg-white/5">
             <p className="text-[9px] text-white/20 font-black uppercase tracking-widest mb-2">Rating</p>
             <div className="flex items-center gap-2">
               <Star size={16} className="text-white" />
               <span className="text-2xl font-black italic">{rating}</span>
             </div>
           </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {skills.slice(0, 3).map((skill, i) => (
            <div key={i} className="px-3 py-1 border border-white/5 text-[9px] font-black uppercase tracking-widest text-white/40">
              {skill}
            </div>
          ))}
        </div>

        <button 
          onClick={() => navigate(`/profile/${id}`)} 
          className="w-full py-4 border border-white/20 text-[10px] font-black uppercase tracking-widest hover:border-white hover:bg-white hover:text-black transition-all"
        >
          View Full Dossier
        </button>
      </div>
    </div>
  );
}
