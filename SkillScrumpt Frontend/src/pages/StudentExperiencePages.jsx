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
import { Card, Badge, Button } from '../components/UI';
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
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="animate-spin text-slate-400" size={48} />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout user={user}>
      <div className="bg-slate-50 min-h-screen pb-24 font-sans px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto pt-8">
          <header className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse shadow-sm" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Project Hub</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900">My Contracts</h1>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <StatItem label="Active Contracts" value={user?.activeContractsCount || 0} active />
            <StatItem label="Completed Projects" value={user?.completedProjectsCount || 0} />
            <StatItem label="Pending Proposals" value={user?.proposalsCount || 0} />
          </div>

          <section className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-8 md:p-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8 border-b border-slate-100 pb-6 mb-8">
              <div className="flex gap-4">
                <button 
                  onClick={() => setActiveFilter('active')}
                  className={`text-sm font-bold px-6 py-2.5 rounded-xl transition-all ${activeFilter === 'active' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
                >
                  Active Contracts
                </button>
                <button 
                  onClick={() => setActiveFilter('pending')}
                  className={`text-sm font-bold px-6 py-2.5 rounded-xl transition-all ${activeFilter === 'pending' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
                >
                  Pending Bids
                </button>
              </div>
            </div>

            <div className="space-y-6">
                {activeFilter === 'active' ? (
                  contracts.length > 0 ? contracts.map((project) => (
                    <div key={project._id} className="p-6 border border-slate-200 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-md transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-bold text-lg">
                          {project.title[0]}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900">{project.title}</h4>
                          <p className="text-xs text-slate-500 font-medium">Client: {project.client?.firstName} {project.client?.lastName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-8">
                        <div className="text-right">
                          <p className="text-sm font-black text-slate-900 tracking-tighter">${project.budget?.toLocaleString()}</p>
                          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-0.5">IN_PROGRESS</p>
                        </div>
                        <Link to={`/workspace/${project._id}`} className="px-6 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-all shadow-sm">
                          Enter Workspace
                        </Link>
                      </div>
                    </div>
                  )) : (
                    <EmptyState icon={Briefcase} title="No active contracts found." subtitle="Secure a bid to start working on elite projects." />
                  )
                ) : (
                  bids.length > 0 ? bids.map((bid) => (
                    <div key={bid._id} className="p-6 border border-slate-200 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-md transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 font-bold text-lg">
                          {bid.project?.title?.[0]}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900">{bid.project?.title}</h4>
                          <p className="text-xs text-slate-500 font-medium italic">Status: {bid.status.toUpperCase()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-8">
                        <div className="text-right">
                          <p className="text-sm font-black text-slate-900 tracking-tighter">${bid.amount?.toLocaleString()}</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{new Date(bid.createdAt).toLocaleDateString()}</p>
                        </div>
                        <Badge variant={bid.status === 'accepted' ? 'success' : bid.status === 'rejected' ? 'danger' : 'secondary'} className="uppercase text-[9px] font-black tracking-widest px-3 py-1">
                          {bid.status}
                        </Badge>
                      </div>
                    </div>
                  )) : (
                    <EmptyState icon={Zap} title="No pending bids found." subtitle="Browse the marketplace to find projects matching your skills." />
                  )
                )}
            </div>
          </section>
        </div>
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
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="animate-spin text-slate-400" size={48} />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout user={user}>
      <div className="bg-slate-50 min-h-screen pb-24 font-sans px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto pt-8">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse shadow-sm" />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Expertise Profile</span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-slate-900">Skills & Badges</h1>
            </div>
            <button 
              onClick={() => navigate('/assessments')}
              className="flex items-center gap-3 bg-indigo-600 text-white py-3.5 px-6 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-md group"
            >
              <Zap size={18} /> Take New Assessment
            </button>
          </header>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-12">
              <section className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-8 md:p-10">
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
                  <h3 className="text-2xl font-bold tracking-tight text-slate-900">Verified Badges</h3>
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
                    <div className="col-span-2 py-16 text-center bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-slate-500 font-bold text-sm mb-4">You haven't earned any verified badges yet.</p>
                      <button onClick={() => navigate('/assessments')} className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">Explore Assessments</button>
                    </div>
                  )}
                </div>
              </section>

              <section className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-8 md:p-10">
                 <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
                   <h3 className="text-2xl font-bold tracking-tight text-slate-900">Technical Proficiency</h3>
                   <Cpu size={24} className="text-indigo-600" />
                 </div>
                 <div className="space-y-2">
                    {user?.skills?.length > 0 ? user.skills.map((skill, i) => (
                      <SkillLevelRow key={i} label={skill} value={80 + (i * 5) % 20} />
                    )) : (
                      <p className="py-12 text-slate-500 text-center font-bold text-sm">No specific skills listed on profile.</p>
                    )}
                 </div>
              </section>
            </div>

            <aside className="space-y-6">
              <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-8 text-center relative overflow-hidden group hover:shadow-md transition-all">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-500" />
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6 mt-4">AI Identity Score</h4>
                <div className="text-6xl font-bold tracking-tighter text-slate-900 mb-6">{user?.aiScore || 0}</div>
                
                <div className="w-full h-2 bg-slate-100 rounded-full mb-8 overflow-hidden">
                   <div className="bg-indigo-600 h-full rounded-full transition-all duration-1000" style={{ width: `${Math.min((user?.aiScore / 1000) * 100, 100)}%` }} />
                </div>
                
                <div className="flex justify-center">
                   <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold shadow-sm ${user?.isVerified ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-slate-50 text-slate-600 border border-slate-200'}`}>
                     <CheckCircle size={16} className={user?.isVerified ? 'text-emerald-500' : 'text-slate-400'} />
                     {user?.isVerified ? 'Elite Verified' : 'Standard Profile'}
                   </div>
                </div>
              </div>

              <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-8 relative overflow-hidden group hover:shadow-md transition-all">
                <div className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold mb-6">Partner Tool</div>
                <h4 className="text-xl font-bold tracking-tight text-slate-900 mb-3">Resume Synthesis</h4>
                <p className="text-sm font-medium text-slate-500 mb-8 leading-relaxed">
                  Use <span className="font-bold text-slate-900">ResuSolve</span> to generate an ATS-optimized resume that highlights your verified SkillScrumpt badges.
                </p>
                <a 
                  href="https://resusolve.vercel.app" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center py-3.5 bg-slate-900 text-white font-bold rounded-xl text-sm hover:bg-slate-800 transition-all shadow-md"
                >
                  Create Resume
                </a>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

// StudentSettings has been migrated to SharedSettingsPage

// --- Helper Components ---

function EmptyState({ icon: Icon, title, subtitle }) {
  return (
    <div className="py-24 text-center">
      <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
        <Icon size={24} />
      </div>
      <p className="text-slate-500 font-bold text-sm">{title}</p>
      <p className="text-slate-400 text-xs mt-2">{subtitle}</p>
    </div>
  );
}

function StatItem({ label, value, active = false }) {
  return (
    <div className={`p-8 rounded-3xl border transition-all shadow-sm ${active ? 'bg-indigo-600 border-indigo-700 text-white shadow-md' : 'bg-white border-slate-200 text-slate-900 hover:shadow-md'}`}>
      <p className={`text-xs font-bold uppercase tracking-widest mb-3 ${active ? 'text-indigo-200' : 'text-slate-500'}`}>{label}</p>
      <div className="text-5xl font-bold tracking-tighter">{value}</div>
    </div>
  );
}

function BadgeItem({ title, score, date, id }) {
  const navigate = useNavigate();
  return (
    <div 
      onClick={() => id && navigate(`/dashboard/student/skills/${id}`)}
      className="p-6 border border-slate-200 bg-white rounded-2xl hover:border-indigo-300 hover:shadow-md transition-all group cursor-pointer relative"
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm group-hover:scale-110 transition-transform">
          <Award size={24} />
        </div>
        <div>
          <h4 className="text-base font-bold tracking-tight text-slate-900">{title}</h4>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Earned {date}</p>
        </div>
      </div>
      <div className="flex justify-between items-end">
        <div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">AI Correlation</p>
          <p className="text-2xl font-bold tracking-tight text-indigo-600">{score}</p>
        </div>
        <div className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded flex items-center gap-1 text-[10px] font-bold shadow-sm">
          <Shield size={10} /> Verified
        </div>
      </div>
    </div>
  );
}

function SkillLevelRow({ label, value }) {
  return (
    <div className="p-4 flex items-center justify-between group hover:bg-slate-50 rounded-xl transition-colors">
       <div className="flex-1 mr-8">
         <h5 className="text-sm font-bold tracking-tight text-slate-900 mb-3">{label}</h5>
         <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-indigo-500 h-full rounded-full transition-all duration-1000" style={{ width: `${value}%` }} />
         </div>
       </div>
       <div className="text-right w-16">
          <span className="text-xl font-bold tracking-tight text-slate-900">{value}</span>
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Score</span>
       </div>
    </div>
  );
}

function SettingsLink({ icon: Icon, label, active = false }) {
  return (
    <button className={`flex items-center justify-between w-full p-4 rounded-xl transition-all font-bold text-sm ${
      active ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
    }`}>
      <div className="flex items-center gap-3">
        <Icon size={18} className={active ? 'text-indigo-600' : 'text-slate-400'} />
        <span>{label}</span>
      </div>
      <ChevronRight size={16} className={active ? 'text-indigo-400' : 'text-slate-300 opacity-0 group-hover:opacity-100'} />
    </button>
  );
}

function BadgeCheckIcon() {
  return (
    <div className="flex -space-x-2">
      {[1,2,3].map(i => (
        <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-indigo-100 flex items-center justify-center text-indigo-500 shadow-sm z-10 relative">
          <Shield size={14} />
        </div>
      ))}
    </div>
  )
}
