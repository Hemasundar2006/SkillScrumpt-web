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
  Loader2
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

  if (isLoading && !user) return <div className="flex justify-center py-40"><Loader2 className="animate-spin text-primary" size={48} /></div>;

  return (
    <DashboardLayout user={user}>
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-secondary mb-2">My Projects</h1>
        <p className="text-gray-500 font-medium text-sm">Manage your active contracts and submitted proposals.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard label="Active" value={user?.activeContractsCount || 0} color="text-primary" />
        <StatCard label="Completed" value={user?.completedProjectsCount || 0} color="text-green-500" />
        <StatCard label="Proposals" value={user?.proposalsCount || 0} color="text-yellow-500" />
      </div>

      <section className="space-y-6">
         <div className="flex justify-between items-center bg-white p-4 rounded-custom border border-border shadow-sm">
           <div className="flex gap-4">
             <button className="text-sm font-bold text-primary px-4 py-2 bg-primary/5 rounded-custom">Active Contracts</button>
             <button className="text-sm font-bold text-gray-400 px-4 py-2 hover:text-secondary transition-all">Pending Proposals</button>
           </div>
           <div className="flex gap-2">
             <button className="p-2 border border-border rounded-custom text-gray-400 hover:text-primary"><Filter size={18} /></button>
             <button className="p-2 border border-border rounded-custom text-gray-400 hover:text-primary"><Search size={18} /></button>
           </div>
         </div>

         <div className="space-y-4">
            {/* Real project list would be mapped here */}
            <p className="text-center py-20 text-gray-400 italic font-medium bg-white rounded-custom border border-dashed border-gray-200">
              No active contracts found. Browse projects to get started.
            </p>
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

  if (isLoading && !user) return <div className="flex justify-center py-40"><Loader2 className="animate-spin text-primary" size={48} /></div>;

  return (
    <DashboardLayout user={user}>
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-secondary mb-2">Skills & Badges</h1>
          <p className="text-gray-500 font-medium text-sm">Your AI-verified expertise and digital credentials.</p>
        </div>
        <Link to="/assessments">
          <Button className="flex items-center gap-2 shadow-primary/20">
            <Zap size={18} /> New Assessment
          </Button>
        </Link>
      </header>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-10">
          <section>
            <h3 className="text-xl font-bold mb-6">Verified Badges</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {user?.badges?.length > 0 ? user.badges.map((badge, i) => (
                <BadgeCard 
                  key={i} 
                  title={badge.title} 
                  score={badge.score} 
                  date={new Date(badge.earnedAt).toLocaleDateString()} 
                  color={i % 2 === 0 ? 'bg-blue-500' : 'bg-purple-500'} 
                />
              )) : (
                <Card className="col-span-2 p-10 text-center bg-white border-dashed border-2 border-gray-200">
                  <p className="text-gray-400 font-medium mb-4 italic">No verified badges yet.</p>
                  <Button variant="outline" onClick={() => navigate('/assessments')}>Take Your First Assessment</Button>
                </Card>
              )}
            </div>
          </section>

          <section>
             <h3 className="text-xl font-bold mb-6">Technical Skills</h3>
             <div className="bg-white rounded-custom border border-border overflow-hidden shadow-sm">
                {user?.skills?.length > 0 ? user.skills.map((skill, i) => (
                  <SkillRow key={i} label={skill} value={80 + (i * 5) % 20} />
                )) : (
                  <p className="p-6 text-gray-400 text-center italic">Add skills to your profile to track your levels.</p>
                )}
             </div>
          </section>
        </div>

        <aside className="space-y-8">
          <Card className="p-8 bg-secondary text-white border-none mb-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16" />
            <div className="relative z-10">
              <h4 className="text-xs font-black uppercase tracking-widest text-primary mb-4">AI Identity Score</h4>
              <div className="text-5xl font-black mb-2">{user?.aiScore || 0}</div>
              <p className="text-xs text-gray-400 leading-relaxed mb-6">Verification ensures you stand out to premium clients.</p>
              <div className="w-full h-1.5 bg-white/10 rounded-full mb-8 overflow-hidden">
                 <div className="bg-primary h-full transition-all duration-1000" style={{ width: `${Math.min((user?.aiScore / 1000) * 100, 100)}%` }} />
              </div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-2">
                <CheckCircle size={14} className="text-green-500" /> Profile Status: {user?.isVerified ? 'Elite Verified' : 'Standard'}
              </p>
            </div>
          </Card>

          <Card className="p-8 bg-gradient-to-br from-blue-600 to-indigo-700 border-none shadow-xl text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000" />
            <div className="relative z-10">
              <Badge className="mb-4 bg-white/20 text-white border-none font-black text-[10px] uppercase tracking-widest">Partner Tool</Badge>
              <h4 className="text-xl font-bold mb-2">Build a Pro Resume</h4>
              <p className="text-xs text-blue-100 mb-8 leading-relaxed">
                Use <strong>Resusolve</strong> to create an ATS-friendly resume that complements your SkillScrumpt badges.
              </p>
              <a 
                href="https://resusolve.vercel.app" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest bg-white text-blue-700 px-8 py-4 rounded-custom hover:bg-blue-50 transition-all shadow-xl"
              >
                Start Building <ArrowRight size={14} />
              </a>
            </div>
          </Card>
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
      // Assuming a put endpoint exists
      await api.put('/users/profile', formData);
      alert('Profile updated successfully!');
    } catch (err) {
      alert('Error updating profile');
    }
  };

  if (isLoading && !user) return <div className="flex justify-center py-40"><Loader2 className="animate-spin text-primary" size={48} /></div>;

  return (
    <DashboardLayout user={user}>
       <header className="mb-10">
        <h1 className="text-3xl font-bold text-secondary mb-2">Account Settings</h1>
        <p className="text-gray-500 font-medium text-sm">Update your profile, security, and notification preferences.</p>
      </header>

      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-2">
           <SettingsNavItem icon={User} label="General Info" active />
           <SettingsNavItem icon={Lock} label="Security & Password" />
           <SettingsNavItem icon={Bell} label="Notifications" />
           <SettingsNavItem icon={CreditCard} label="Billing & Payouts" />
           <SettingsNavItem icon={Shield} label="AI Privacy" />
        </div>

        <div className="lg:col-span-3">
          <Card className="p-10 border-none shadow-xl space-y-8 bg-white">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">First Name</label>
                <input 
                  type="text" 
                  value={formData.firstName} 
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-custom outline-none focus:bg-white focus:border-primary transition-all font-medium" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Last Name</label>
                <input 
                  type="text" 
                  value={formData.lastName} 
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-custom outline-none focus:bg-white focus:border-primary transition-all font-medium" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
                <input 
                  type="email" 
                  value={formData.email} 
                  disabled
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-custom outline-none opacity-60 font-medium cursor-not-allowed" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Professional Bio</label>
              <textarea 
                rows={5} 
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-custom outline-none focus:bg-white focus:border-primary transition-all font-medium resize-none"
                placeholder="Tell us about your experience..."
              ></textarea>
            </div>

            <div className="pt-8 border-t border-border flex justify-end gap-4">
               <Button variant="outline">Cancel</Button>
               <Button onClick={handleUpdate} className="px-12 shadow-primary/20">Save Changes</Button>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

// --- Add New Skill Assessment (Placeholder View) ---
export function AddAssessment() {
  return (
    <div className="min-h-screen bg-[#f8f9fb] p-8">
       <header className="mb-12 max-w-3xl">
        <h1 className="text-4xl font-bold text-secondary mb-4">Choose Your Next Badge</h1>
        <p className="text-gray-500 font-medium text-lg">Select a technology to start your AI-proctored assessment and earn a verified credential.</p>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AssessmentOption title="Advanced TypeScript" difficulty="Expert" time="60 min" />
        <AssessmentOption title="Smart Contract Security" difficulty="Expert" time="120 min" />
        <AssessmentOption title="Python for AI/ML" difficulty="Intermediate" time="90 min" />
      </div>
    </div>
  );
}

// --- Helper Components ---

function StatCard({ label, value, color }) {
  return (
    <Card className="p-8 border-none shadow-sm bg-white">
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{label}</p>
      <div className={`text-4xl font-black ${color}`}>{value}</div>
    </Card>
  );
}

function BadgeCard({ title, score, date, color }) {
  return (
    <Card className="p-8 border-none shadow-xl hover:-translate-y-1 transition-all group overflow-hidden relative bg-white">
      <div className={`absolute top-0 right-0 w-24 h-24 ${color} opacity-5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700`} />
      <div className="flex items-center gap-5 mb-8">
        <div className={`w-14 h-14 ${color} text-white rounded-custom flex items-center justify-center shadow-lg shadow-black/10`}>
          <Award size={32} />
        </div>
        <div>
          <h4 className="font-bold text-xl text-secondary">{title}</h4>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Earned {date}</p>
        </div>
      </div>
      <div className="flex justify-between items-end">
        <div>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">AI Match Score</p>
          <p className={`text-3xl font-black ${color.replace('bg-', 'text-')}`}>{score}</p>
        </div>
        <Badge variant="neutral" className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest">Verified ID</Badge>
      </div>
    </Card>
  );
}

function SkillRow({ label, value }) {
  return (
    <div className="p-8 flex items-center justify-between border-b border-border last:border-none group hover:bg-gray-50 transition-colors">
       <div className="flex-1">
         <h5 className="font-bold text-lg text-secondary mb-3">{label}</h5>
         <div className="w-full bg-gray-100 h-2 rounded-full max-w-md overflow-hidden">
            <div className="bg-primary h-full group-hover:bg-blue-600 transition-all duration-700" style={{ width: `${value}%` }} />
         </div>
       </div>
       <div className="text-right">
          <span className="text-2xl font-black text-secondary">{value}</span>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mt-1">Level</span>
       </div>
    </div>
  );
}

function SettingsNavItem({ icon: Icon, label, active = false }) {
  return (
    <button className={`flex items-center gap-3 w-full px-4 py-4 rounded-custom transition-all font-bold text-sm ${
      active ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-500 hover:text-secondary hover:bg-white border border-transparent hover:border-border'
    }`}>
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );
}

function AssessmentOption({ title, difficulty, time }) {
  const navigate = useNavigate();
  return (
    <Card className="p-10 group hover:border-primary transition-all flex flex-col items-center text-center bg-white">
      <div className="w-20 h-20 bg-primary/5 text-primary rounded-full flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition-all shadow-inner">
        <Target size={40} />
      </div>
      <h4 className="text-2xl font-bold mb-3">{title}</h4>
      <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-10">
        <span className="flex items-center gap-1.5"><Clock size={14} /> {time}</span>
        <span className="flex items-center gap-1.5 text-primary"><Zap size={14} /> {difficulty}</span>
      </div>
      <Button onClick={() => navigate('/assessments')} className="w-full h-12">Start Now</Button>
    </Card>
  );
}
