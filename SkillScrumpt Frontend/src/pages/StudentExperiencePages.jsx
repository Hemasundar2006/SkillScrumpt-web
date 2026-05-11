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

  if (isLoading && !user) return <div className="flex justify-center py-40 bg-black min-h-screen"><Loader2 className="animate-spin text-white" size={48} /></div>;

  return (
    <DashboardLayout user={user}>
      <header className="mb-16">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
          <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.4em]">Sector: Operations Dashboard</span>
        </div>
        <h1 className="text-6xl font-black tracking-tighter uppercase italic">CONTRACT <br />MANIFEST.</h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-1 mb-16">
        <StatItem label="ACTIVE_CONTRACTS" value={user?.activeContractsCount || 0} color="text-white" />
        <StatItem label="COMPLETED_CYCLES" value={user?.completedProjectsCount || 0} color="text-white/40" />
        <StatItem label="OPEN_SIGNALS" value={user?.proposalsCount || 0} color="text-white/40" />
      </div>

      <section className="space-y-12">
         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8 border-b border-white/10 pb-8">
           <div className="flex gap-10">
             <button className="text-[10px] font-black text-white uppercase tracking-[0.3em] border-b-2 border-white pb-2">ACTIVE_DIRECTIVES</button>
             <button className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] hover:text-white transition-all pb-2">PENDING_SIGNALS</button>
           </div>
           <div className="flex gap-4">
             <button className="p-3 border border-white/10 text-white/20 hover:text-white hover:border-white transition-all"><Filter size={16} /></button>
             <button className="p-3 border border-white/10 text-white/20 hover:text-white hover:border-white transition-all"><Search size={16} /></button>
           </div>
         </div>

         <div className="space-y-4">
            <div className="py-32 text-center border border-dashed border-white/10 bg-white/[0.02]">
              <p className="text-white/20 font-black uppercase tracking-[0.4em] text-[10px] italic">NO_ACTIVE_DIRECTIVES_DETECTED. BROWSE_MARKETPLACE_TO_INITIALIZE.</p>
            </div>
         </div>
      </section>
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

  if (isLoading && !user) return <div className="flex justify-center py-40 bg-black min-h-screen"><Loader2 className="animate-spin text-white" size={48} /></div>;

  return (
    <DashboardLayout user={user}>
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 mb-20">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.4em]">Sector: Expertise Manifest</span>
          </div>
          <h1 className="text-6xl font-black tracking-tighter uppercase italic">SKILLS <br />& BADGES.</h1>
        </div>
        <button 
          onClick={() => navigate('/assessments')}
          className="flex items-center gap-4 bg-white text-black py-6 px-12 font-black uppercase tracking-[0.3em] text-xs hover:bg-white/90 transition-all group"
        >
          <Zap size={18} /> INITIATE_ASSESSMENT
        </button>
      </header>

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-24">
          <section>
            <div className="flex items-center gap-4 mb-12">
              <h3 className="text-3xl font-black tracking-tighter uppercase italic">VERIFIED_BADGES.</h3>
              <div className="h-[1px] bg-white/10 flex-1" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
              {user?.badges?.length > 0 ? user.badges.map((badge, i) => (
                <BadgeItem 
                  key={i} 
                  id={badge.assessmentId}
                  title={badge.name || badge.title} 
                  score={badge.score} 
                  date={new Date(badge.issuedAt || badge.earnedAt).toLocaleDateString().toUpperCase()} 
                />
              )) : (
                <div className="col-span-2 p-16 text-center border border-dashed border-white/10 bg-white/[0.02]">
                  <p className="text-white/20 font-black uppercase tracking-[0.4em] text-[10px] mb-8 italic">ZERO_VERIFIED_CREDENTIALS_RECORDED.</p>
                  <button onClick={() => navigate('/assessments')} className="px-10 py-4 border border-white text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">INITIALIZE_FIRST_TASK</button>
                </div>
              )}
            </div>
          </section>

          <section>
             <div className="flex items-center gap-4 mb-12">
               <h3 className="text-3xl font-black tracking-tighter uppercase italic">TECHNICAL_CORRELATION.</h3>
               <div className="h-[1px] bg-white/10 flex-1" />
             </div>
             <div className="border border-white/10 bg-white/5 divide-y divide-white/10">
                {user?.skills?.length > 0 ? user.skills.map((skill, i) => (
                  <SkillLevelRow key={i} label={skill} value={80 + (i * 5) % 20} />
                )) : (
                  <p className="p-16 text-white/20 text-center font-black uppercase tracking-[0.4em] text-[10px] italic">NO_SKILL_SIGNALS_RECORDED.</p>
                )}
             </div>
          </section>
        </div>

        <aside className="space-y-12">
          <div className="p-1 border border-white/10 bg-white/5">
            <div className="p-10 border border-white/10 bg-black relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 border border-white/5 -mr-16 -mt-16 rotate-45 pointer-events-none" />
              <div className="relative z-10">
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-8 italic text-center">AI_IDENTITY_SCORE</h4>
                <div className="text-7xl font-black italic tracking-tighter text-center mb-8">{user?.aiScore || 0}</div>
                <div className="w-full h-[1px] bg-white/10 mb-12 relative">
                   <div className="absolute top-0 left-0 bg-white h-full transition-all duration-1000" style={{ width: `${Math.min((user?.aiScore / 1000) * 100, 100)}%` }} />
                </div>
                <div className="flex flex-col gap-4 items-center">
                   <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-white/60">
                     <CheckCircle size={14} className={user?.isVerified ? 'text-white' : 'text-white/20'} />
                     STATUS: {user?.isVerified ? 'ELITE_VERIFIED' : 'PENDING_VALIDATION'}
                   </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-1 border border-white/10 bg-white/5">
            <div className="p-10 bg-black border border-white/10 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 border border-white/5 -mr-16 -mt-16 rotate-45 pointer-events-none" />
              <div className="relative z-10">
                <div className="inline-block px-4 py-1 border border-white/20 text-[8px] font-black uppercase tracking-widest text-white/40 mb-6">PARTNER_PROTOCOL</div>
                <h4 className="text-2xl font-black tracking-tighter italic uppercase mb-4">RESUME_SYNTHESIS.</h4>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-12 leading-relaxed">
                  USE <span className="text-white">RESUSOLVE</span> TO GENERATE AN ATS-OPTIMIZED DOSSIER THAT COMPLEMENTS YOUR SkillScrumpt.in BADGES.
                </p>
                <a 
                  href="https://resusolve.vercel.app" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block text-center py-5 bg-white text-black font-black uppercase tracking-widest text-[10px] hover:bg-white/90 transition-all"
                >
                  START_SYNTHESIS
                </a>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </DashboardLayout>
  );
}

// --- Student Settings ---
export function StudentSettings() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    bio: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const savedUser = JSON.parse(localStorage.getItem('user'));
      const response = await api.get(`/users/profile/${savedUser._id || savedUser.id}`);
      setUser(response.data);
      setFormData({
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        email: response.data.email,
        bio: response.data.bio || ''
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      await api.put('/users/profile', formData);
      alert('Profile updated successfully!');
    } catch (err) {
      alert('Error updating profile');
    }
  };

  if (isLoading && !user) return <div className="flex justify-center py-40 bg-black min-h-screen"><Loader2 className="animate-spin text-white" size={48} /></div>;

  return (
    <DashboardLayout user={user}>
       <header className="mb-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.4em]">Sector: Identity Management</span>
          </div>
          <h1 className="text-6xl font-black tracking-tighter uppercase italic">ACCOUNT <br />PARAMETERS.</h1>
      </header>

      <div className="grid lg:grid-cols-4 gap-12">
        <div className="lg:col-span-1 space-y-1">
           <SettingsLink icon={User} label="CORE_IDENTITY" active />
           <SettingsLink icon={Lock} label="SECURITY_PASS" />
           <SettingsLink icon={Bell} label="RELAY_NOTICES" />
           <SettingsLink icon={CreditCard} label="FINANCIAL_RECORDS" />
           <SettingsLink icon={Shield} label="AI_PRIVACY" />
        </div>

        <div className="lg:col-span-3">
          <div className="p-1 border border-white/10 bg-white/5">
            <div className="bg-black border border-white/10 p-12 md:p-20 space-y-12">
              <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-3">
                  <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] ml-1">GIVEN_NAME</label>
                  <input 
                    type="text" 
                    value={formData.firstName} 
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="w-full px-6 py-4 bg-transparent border border-white/20 focus:border-white outline-none transition-all font-black uppercase tracking-widest placeholder:text-white/10" 
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] ml-1">SURNAME</label>
                  <input 
                    type="text" 
                    value={formData.lastName} 
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="w-full px-6 py-4 bg-transparent border border-white/20 focus:border-white outline-none transition-all font-black uppercase tracking-widest placeholder:text-white/10" 
                  />
                </div>
                <div className="space-y-3 md:col-span-2">
                  <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] ml-1">IDENTITY_EMAIL</label>
                  <input 
                    type="email" 
                    value={formData.email} 
                    disabled
                    className="w-full px-6 py-4 bg-white/[0.02] border border-white/5 text-white/20 outline-none font-black uppercase tracking-widest cursor-not-allowed" 
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] ml-1">OPERATIVE_BIO</label>
                <textarea 
                  rows={6} 
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  className="w-full px-6 py-4 bg-transparent border border-white/20 focus:border-white outline-none transition-all font-bold placeholder:text-white/10 resize-none uppercase tracking-widest text-[11px]"
                  placeholder="ESTABLISH YOUR PROFESSIONAL DIRECTIVE..."
                ></textarea>
              </div>

              <div className="pt-12 border-t border-white/10 flex justify-end gap-8">
                 <button className="px-10 py-5 border border-white/10 text-white/40 font-black uppercase tracking-[0.3em] text-[10px] hover:text-white transition-all">ABORT_CHANGES</button>
                 <button onClick={handleUpdate} className="px-16 py-5 bg-white text-black font-black uppercase tracking-[0.3em] text-[10px] hover:bg-white/90 transition-all">SAVE_PARAMETERS</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

// --- Helper Components ---

function StatItem({ label, value, color }) {
  return (
    <div className="p-10 border border-white/10 bg-white/[0.02] hover:bg-white/5 transition-all">
      <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] mb-4 italic">{label}</p>
      <div className={`text-5xl font-black italic tracking-tighter ${color}`}>{value}</div>
    </div>
  );
}

function BadgeItem({ title, score, date, id }) {
  const navigate = useNavigate();
  return (
    <div 
      onClick={() => id && navigate(`/dashboard/student/skills/${id}`)}
      className="p-10 border border-white/10 bg-black hover:bg-white/5 transition-all group cursor-pointer relative"
    >
      <div className="flex items-center gap-6 mb-10">
        <div className="w-16 h-16 border border-white/10 flex items-center justify-center text-white/40 group-hover:bg-white group-hover:text-black transition-all italic">
          <Award size={32} />
        </div>
        <div>
          <h4 className="text-xl font-black tracking-tight uppercase group-hover:italic">{title}</h4>
          <p className="text-[9px] text-white/20 font-black uppercase tracking-widest mt-2">EARNED_{date}</p>
        </div>
      </div>
      <div className="flex justify-between items-end">
        <div>
          <p className="text-[9px] text-white/20 font-black uppercase tracking-[0.3em] mb-2">AI_CORRELATION</p>
          <p className="text-4xl font-black italic tracking-tighter text-white">{score}</p>
        </div>
        <div className="px-3 py-1 border border-white/10 text-[8px] font-black uppercase tracking-widest group-hover:border-white">VERIFIED_ID</div>
      </div>
    </div>
  );
}

function SkillLevelRow({ label, value }) {
  return (
    <div className="p-10 flex items-center justify-between group hover:bg-white/5 transition-colors">
       <div className="flex-1">
         <h5 className="text-xl font-black tracking-tight uppercase group-hover:italic mb-6">{label}</h5>
         <div className="w-full max-w-lg bg-white/5 h-[1px] relative">
            <div className="absolute top-0 left-0 bg-white h-full transition-all duration-1000" style={{ width: `${value}%` }} />
         </div>
       </div>
       <div className="text-right">
          <span className="text-3xl font-black italic tracking-tighter">{value}</span>
          <span className="text-[9px] font-black text-white/20 uppercase tracking-widest block mt-2">LEVEL</span>
       </div>
    </div>
  );
}

function SettingsLink({ icon: Icon, label, active = false }) {
  return (
    <button className={`flex items-center justify-between w-full p-6 transition-all font-black text-[10px] uppercase tracking-[0.3em] ${
      active ? 'bg-white text-black' : 'text-white/30 hover:text-white hover:bg-white/5 border border-transparent'
    }`}>
      <div className="flex items-center gap-4">
        <Icon size={16} />
        <span>{label}</span>
      </div>
      <ChevronRight size={14} className={active ? 'text-black' : 'text-white/10'} />
    </button>
  );
}
