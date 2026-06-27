import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  Search, 
  Filter, 
  ChevronRight, 
  Clock, 
  DollarSign, 
  CheckCircle,
  Award,
  Zap,
  Shield,
  ArrowRight,
  User,
  Lock,
  Bell,
  CreditCard,
  Target,
  Loader2,
  Cpu,
  Star
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../layout/DashboardLayout';
import api from '../utils/api';

// --- Student Projects Dashboard ---
export function StudentProjects() {
  const [user, setUser] = useState(null);
  const [bids, setBids] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('active');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const savedUser = JSON.parse(localStorage.getItem('user'));
      const [profileRes, bidsRes, projectsRes] = await Promise.all([
        api.get(`/users/profile/${savedUser._id || savedUser.id}`),
        api.get('/projects/my-bids'),
        api.get('/projects')
      ]);

      setUser(profileRes.data);
      setBids(bidsRes.data);
      setContracts(projectsRes.data.filter(p => p.professional && p.professional._id === savedUser._id));
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !user) {
    const cachedUserStr = localStorage.getItem('user');
    const cachedUser = cachedUserStr ? JSON.parse(cachedUserStr) : null;
    return (
      <DashboardLayout user={cachedUser}>
        <div className="flex-1 flex flex-col items-center justify-center">
          <Loader2 className="animate-spin text-[#38BDF8]" size={48} />
          <p className="text-[10px] font-bold text-[#1E293B]/40 uppercase tracking-wider mt-4">Loading Contracts...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout user={user}>
      <div className="max-w-[1400px] mx-auto w-full flex flex-col h-full font-sans">
        <header className="mb-8 shrink-0">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-2 h-2 bg-[#F97316] rounded-full animate-pulse shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
              <span className="text-[10px] font-bold text-[#1E293B]/50 uppercase tracking-wider">Project Hub</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-[#1E293B]">My Contracts</h1>
          </motion.div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 shrink-0">
          <StatItem label="Active Contracts" value={user?.activeContractsCount || 0} active />
          <StatItem label="Completed Projects" value={user?.completedProjectsCount || 0} />
          <StatItem label="Pending Proposals" value={user?.proposalsCount || 0} />
        </div>

        <motion.section 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="bg-white rounded-[24px] border border-[#38BDF8]/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-8 md:p-10 flex-1 flex flex-col min-h-0"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8 border-b border-slate-100 pb-6 mb-6 shrink-0">
            <div className="flex gap-2 p-1 bg-[#FFF0E5]/50 rounded-[12px] border border-[#F97316]/10">
              <button 
                onClick={() => setActiveFilter('active')}
                className={`text-xs font-bold px-6 py-2.5 rounded-[10px] transition-all ${activeFilter === 'active' ? 'bg-[#F97316] text-white shadow-[0_4px_12px_rgba(249,115,22,0.25)]' : 'text-[#1E293B]/50 hover:text-[#F97316]'}`}
              >
                Active Contracts
              </button>
              <button 
                onClick={() => setActiveFilter('pending')}
                className={`text-xs font-bold px-6 py-2.5 rounded-[10px] transition-all ${activeFilter === 'pending' ? 'bg-[#F97316] text-white shadow-[0_4px_12px_rgba(249,115,22,0.25)]' : 'text-[#1E293B]/50 hover:text-[#F97316]'}`}
              >
                Pending Bids
              </button>
            </div>
          </div>

          <div className="overflow-y-auto custom-scrollbar pr-2 flex-1 space-y-4">
            {activeFilter === 'active' ? (
              contracts.length > 0 ? contracts.map((project, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  key={project._id} 
                  className="p-6 border border-[#38BDF8]/10 rounded-[16px] flex flex-col md:flex-row items-center justify-between gap-6 hover:border-[#38BDF8]/30 hover:shadow-[0_8px_24px_rgba(56,189,248,0.08)] hover:-translate-y-0.5 transition-all group"
                >
                  <div className="flex items-center gap-5 w-full md:w-auto">
                    <div className="w-12 h-12 bg-[#E0F2FE] text-[#38BDF8] rounded-[12px] flex items-center justify-center font-bold text-xl shadow-inner group-hover:scale-105 transition-transform">
                      {project.title[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-[#1E293B] group-hover:text-[#38BDF8] transition-colors tracking-tight">{project.title}</h4>
                      <p className="text-[11px] text-[#1E293B]/50 font-bold uppercase tracking-wider mt-1">Client: {project.client?.firstName} {project.client?.lastName}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between w-full md:w-auto gap-8 border-t border-slate-100 md:border-t-0 pt-4 md:pt-0">
                    <div className="text-left md:text-right">
                      <p className="text-lg font-bold text-[#1E293B] tracking-tight">${project.budget?.toLocaleString()}</p>
                      <p className="text-[10px] font-bold text-[#F97316] uppercase tracking-wider mt-0.5 animate-pulse">IN_PROGRESS</p>
                    </div>
                    <Link to={`/workspace/${project._id}`} className="px-6 py-2.5 bg-[#38BDF8] text-white text-xs font-bold rounded-[10px] hover:bg-[#0284C7] hover:-translate-y-0.5 transition-all shadow-[0_4px_12px_rgba(56,189,248,0.25)] flex items-center gap-2">
                      Workspace <ArrowRight size={14} />
                    </Link>
                  </div>
                </motion.div>
              )) : (
                <EmptyState icon={Briefcase} title="No active contracts found." subtitle="Secure a bid to start working on elite projects." />
              )
            ) : (
              bids.length > 0 ? bids.map((bid, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  key={bid._id} 
                  className="p-6 border border-[#38BDF8]/10 rounded-[16px] flex flex-col md:flex-row items-center justify-between gap-6 hover:border-[#38BDF8]/30 hover:shadow-[0_8px_24px_rgba(56,189,248,0.08)] hover:-translate-y-0.5 transition-all group"
                >
                  <div className="flex items-center gap-5 w-full md:w-auto">
                    <div className="w-12 h-12 bg-[#FFF0E5] text-[#F97316] rounded-[12px] flex items-center justify-center font-bold text-xl shadow-inner group-hover:scale-105 transition-transform">
                      {bid.project?.title?.[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-[#1E293B] group-hover:text-[#38BDF8] transition-colors tracking-tight">{bid.project?.title}</h4>
                      <p className="text-[11px] text-[#1E293B]/50 font-bold uppercase tracking-wider mt-1">Status: {bid.status}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between w-full md:w-auto gap-8 border-t border-slate-100 md:border-t-0 pt-4 md:pt-0">
                    <div className="text-left md:text-right">
                      <p className="text-lg font-bold text-[#1E293B] tracking-tight">${bid.amount?.toLocaleString()}</p>
                      <p className="text-[10px] font-bold text-[#1E293B]/40 uppercase tracking-wider mt-0.5">{new Date(bid.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className={`px-4 py-1.5 rounded-[8px] uppercase text-[10px] font-bold tracking-wider ${
                      bid.status === 'accepted' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 
                      bid.status === 'rejected' ? 'bg-red-50 text-red-600 border border-red-100' : 
                      'bg-[#FFF0E5] text-[#F97316] border border-[#F97316]/20'
                    }`}>
                      {bid.status}
                    </div>
                  </div>
                </motion.div>
              )) : (
                <EmptyState icon={Zap} title="No pending bids found." subtitle="Browse the marketplace to find projects matching your skills." />
              )
            )}
          </div>
        </motion.section>
      </div>
    </DashboardLayout>
  );
}

// --- Student Skills & Badges ---
export function StudentSkills() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const savedUser = JSON.parse(localStorage.getItem('user'));
      const response = await api.get(`/users/profile/${savedUser._id || savedUser.id}`);
      setUser(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !user) {
    const cachedUserStr = localStorage.getItem('user');
    const cachedUser = cachedUserStr ? JSON.parse(cachedUserStr) : null;
    return (
      <DashboardLayout user={cachedUser}>
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="animate-spin text-[#38BDF8]" size={48} />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout user={user}>
      <div className="max-w-[1400px] mx-auto w-full flex flex-col h-full font-sans">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 shrink-0">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-2 h-2 bg-[#F97316] rounded-full animate-pulse shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
              <span className="text-[10px] font-bold text-[#1E293B]/50 uppercase tracking-wider">Expertise Profile</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-[#1E293B]">Skills & Badges</h1>
          </motion.div>
          <motion.button 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            onClick={() => navigate('/assessments')}
            className="flex items-center gap-3 bg-[#F97316] text-white py-3.5 px-6 rounded-[12px] font-bold text-sm hover:bg-[#EA580C] hover:-translate-y-0.5 transition-all shadow-[0_8px_20px_rgba(249,115,22,0.25)] group"
          >
            <Zap size={18} className="group-hover:scale-110 transition-transform" /> Take New Assessment
          </motion.button>
        </header>

        <div className="flex-1 overflow-hidden min-h-0 flex flex-col lg:flex-row gap-6">
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-6">
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[24px] border border-[#38BDF8]/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-8 md:p-10">
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
                <h3 className="text-2xl font-bold tracking-tight text-[#1E293B]">Verified Badges</h3>
                <BadgeCheckIcon />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {user?.badges?.length > 0 ? user.badges.map((badge, i) => (
                  <BadgeItem 
                    key={i} 
                    id={badge.assessmentId}
                    title={badge.name || badge.title} 
                    score={badge.score} 
                    date={new Date(badge.issuedAt || badge.earnedAt).toLocaleDateString()} 
                  />
                )) : (
                  <div className="col-span-1 sm:col-span-2 py-16 text-center bg-[#E0F2FE]/30 rounded-[16px] border border-[#38BDF8]/20">
                    <p className="text-[#1E293B]/60 font-bold text-sm mb-4">You haven't earned any verified badges yet.</p>
                    <button onClick={() => navigate('/assessments')} className="px-6 py-2.5 bg-white border border-[#38BDF8]/20 rounded-[10px] text-sm font-bold text-[#38BDF8] hover:bg-[#E0F2FE] transition-all shadow-sm">Explore Assessments</button>
                  </div>
                )}
              </div>
            </motion.section>

            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-[24px] border border-[#38BDF8]/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-8 md:p-10">
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
                <h3 className="text-2xl font-bold tracking-tight text-[#1E293B]">Technical Proficiency</h3>
                <Cpu size={24} className="text-[#38BDF8]" />
              </div>
              <div className="space-y-2">
                {user?.skills?.length > 0 ? user.skills.map((skill, i) => (
                  <SkillLevelRow key={i} label={skill} value={80 + (i * 5) % 20} />
                )) : (
                  <p className="py-12 text-[#1E293B]/40 text-center font-bold text-sm">No specific skills listed on profile.</p>
                )}
              </div>
            </motion.section>
          </div>

          <aside className="w-full lg:w-[380px] shrink-0 space-y-6 overflow-y-auto custom-scrollbar">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-[#1E293B] rounded-[24px] p-8 text-center relative overflow-hidden group shadow-[0_8px_30px_rgba(30,41,59,0.1)]">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#38BDF8] opacity-10 rounded-full blur-[50px] translate-x-1/2 -translate-y-1/2" />
              <div className="relative z-10">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-white/50 mb-6 mt-2">AI Identity Score</h4>
                <div className="text-7xl font-bold tracking-tight text-white mb-6 drop-shadow-md">{user?.aiScore || 0}</div>
                
                <div className="w-full h-1.5 bg-white/10 rounded-full mb-8 overflow-hidden">
                  <div className="bg-[#38BDF8] h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(56,189,248,0.5)]" style={{ width: `${Math.min((user?.aiScore / 1000) * 100, 100)}%` }} />
                </div>
                
                <div className="flex justify-center">
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-[10px] text-[10px] font-bold uppercase tracking-wider shadow-sm ${user?.isVerified ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/10 text-white/70 border border-white/20'}`}>
                    <CheckCircle size={14} className={user?.isVerified ? 'text-emerald-400' : 'text-white/40'} />
                    {user?.isVerified ? 'Elite Verified' : 'Standard Profile'}
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-[24px] border border-[#38BDF8]/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-8 relative overflow-hidden group hover:shadow-[0_12px_30px_rgba(56,189,248,0.08)] transition-all hover:-translate-y-1">
              <div className="inline-block px-3 py-1.5 bg-[#FFF0E5] text-[#F97316] rounded-[8px] text-[10px] font-bold uppercase tracking-wider mb-6">Partner Tool</div>
              <h4 className="text-xl font-bold tracking-tight text-[#1E293B] mb-3">Resume Synthesis</h4>
              <p className="text-sm font-medium text-[#1E293B]/60 mb-8 leading-relaxed">
                Use <span className="font-bold text-[#1E293B]">ResuSolve</span> to generate an ATS-optimized resume highlighting your verified SkillScrumpt badges.
              </p>
              <a 
                href="https://resusolve.vercel.app" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center py-3.5 bg-[#38BDF8] text-white font-bold rounded-[12px] text-sm hover:bg-[#0284C7] transition-all shadow-[0_4px_12px_rgba(56,189,248,0.25)] hover:-translate-y-0.5"
              >
                Create Resume
              </a>
            </motion.div>
          </aside>
        </div>
      </div>
    </DashboardLayout>
  );
}

// --- Helper Components ---

function EmptyState({ icon: Icon, title, subtitle }) {
  return (
    <div className="py-24 text-center">
      <div className="w-16 h-16 bg-[#E0F2FE] border border-[#38BDF8]/20 rounded-[16px] flex items-center justify-center mx-auto mb-4 text-[#38BDF8] shadow-inner">
        <Icon size={24} />
      </div>
      <p className="text-[#1E293B] font-bold text-base">{title}</p>
      <p className="text-[#1E293B]/50 font-medium text-sm mt-2">{subtitle}</p>
    </div>
  );
}

function StatItem({ label, value, active = false }) {
  return (
    <div className={`p-8 rounded-[24px] border transition-all shadow-sm ${active ? 'bg-[#1E293B] border-[#1E293B] text-white shadow-[0_8px_30px_rgba(30,41,59,0.15)] relative overflow-hidden' : 'bg-white border-[#38BDF8]/10 text-[#1E293B] hover:shadow-[0_8px_20px_rgba(0,0,0,0.04)]'}`}>
      {active && <div className="absolute top-0 right-0 w-32 h-32 bg-[#38BDF8] opacity-20 blur-[30px] rounded-full translate-x-1/2 -translate-y-1/2" />}
      <p className={`text-[10px] font-bold uppercase tracking-wider mb-3 relative z-10 ${active ? 'text-white/50' : 'text-[#1E293B]/40'}`}>{label}</p>
      <div className="text-5xl font-bold tracking-tight relative z-10">{value}</div>
    </div>
  );
}

function BadgeItem({ title, score, date, id }) {
  const navigate = useNavigate();
  return (
    <div 
      onClick={() => id && navigate(`/dashboard/student/skills/${id}`)}
      className="p-6 border border-[#38BDF8]/10 bg-white rounded-[16px] hover:border-[#38BDF8]/30 hover:shadow-[0_8px_24px_rgba(56,189,248,0.08)] hover:-translate-y-0.5 transition-all group cursor-pointer relative"
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-[12px] bg-[#E0F2FE] flex items-center justify-center text-[#38BDF8] shadow-inner group-hover:scale-110 transition-transform">
          <Award size={24} />
        </div>
        <div>
          <h4 className="text-base font-bold tracking-tight text-[#1E293B] group-hover:text-[#38BDF8] transition-colors">{title}</h4>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#1E293B]/40 mt-1">Earned {date}</p>
        </div>
      </div>
      <div className="flex justify-between items-end">
        <div>
          <p className="text-[10px] text-[#1E293B]/40 font-bold uppercase tracking-wider mb-0.5">AI Correlation</p>
          <p className="text-2xl font-bold tracking-tight text-[#F97316]">{score}</p>
        </div>
        <div className="px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-[6px] flex items-center gap-1 text-[10px] font-bold border border-emerald-100 uppercase tracking-wider">
          <Shield size={10} /> Verified
        </div>
      </div>
    </div>
  );
}

function SkillLevelRow({ label, value }) {
  return (
    <div className="p-4 flex items-center justify-between group hover:bg-[#E0F2FE]/30 rounded-[12px] transition-colors">
      <div className="flex-1 mr-8">
        <h5 className="text-sm font-bold tracking-tight text-[#1E293B] mb-2">{label}</h5>
        <div className="w-full bg-[#1E293B]/5 h-1.5 rounded-full overflow-hidden">
          <div className="bg-[#38BDF8] h-full rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(56,189,248,0.5)]" style={{ width: `${value}%` }} />
        </div>
      </div>
      <div className="text-right w-16">
        <span className="text-xl font-bold tracking-tight text-[#1E293B]">{value}</span>
        <span className="text-[10px] font-bold text-[#1E293B]/40 uppercase tracking-wider block">Score</span>
      </div>
    </div>
  );
}

function BadgeCheckIcon() {
  return (
    <div className="flex -space-x-3">
      {[1,2,3].map(i => (
        <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-[#38BDF8] flex items-center justify-center text-white shadow-sm z-10 relative">
          <Shield size={12} fill="currentColor" />
        </div>
      ))}
    </div>
  )
}
