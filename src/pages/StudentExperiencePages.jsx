import React from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  Search, 
  Filter, 
  ChevronRight, 
  Clock, 
  DollarSign, 
  CheckCircle,
  AlertCircle,
  Award,
  Zap,
  Star,
  Settings as SettingsIcon,
  Bell,
  Lock,
  User,
  CreditCard,
  Target,
  Code
} from 'lucide-react';
import { Card, Badge, Button, GlassContainer } from '../components/UI';
import { Link } from 'react-router-dom';

// --- Student Projects Dashboard ---
export function StudentProjects() {
  return (
    <div className="flex min-h-screen bg-[#f8f9fb]">
      {/* Reusing common layout components would be better, but for speed I'll implement the view directly */}
      <main className="flex-1 p-8">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-secondary mb-2">My Projects</h1>
          <p className="text-gray-500 font-medium text-sm">Manage your active contracts and submitted proposals.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard label="Active" value="4" color="text-primary" />
          <StatCard label="Completed" value="18" color="text-green-500" />
          <StatCard label="In Review" value="2" color="text-yellow-500" />
        </div>

        <section className="space-y-6">
           <div className="flex justify-between items-center bg-white p-4 rounded-custom border border-border">
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
             <ActiveProjectRow title="E-commerce Rebrand" client="Stripe" budget="$4,500" progress={65} />
             <ActiveProjectRow title="Web3 Dashboard" client="Uniswap" budget="$3,200" progress={100} completed />
             <ActiveProjectRow title="Mobile App Design" client="Airbnb" budget="$6,800" progress={40} />
           </div>
        </section>
      </main>
    </div>
  );
}

// --- Student Skills & Badges ---
export function StudentSkills() {
  return (
    <main className="flex-1 p-8 bg-[#f8f9fb]">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-secondary mb-2">Skills & Badges</h1>
          <p className="text-gray-500 font-medium text-sm">Your AI-verified expertise and digital credentials.</p>
        </div>
        <Link to="/assessments/add">
          <Button className="flex items-center gap-2">
            <Zap size={18} /> New Assessment
          </Button>
        </Link>
      </header>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-10">
          <section>
            <h3 className="text-xl font-bold mb-6">Verified Badges</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <BadgeCard title="React Expert" score="982" date="May 2026" color="bg-blue-500" />
              <BadgeCard title="System Architect" score="945" date="Apr 2026" color="bg-purple-500" />
              <BadgeCard title="UI/UX Verified" score="995" date="Mar 2026" color="bg-pink-500" />
              <BadgeCard title="Node.js Core" score="890" date="Feb 2026" color="bg-green-500" />
            </div>
          </section>

          <section>
             <h3 className="text-xl font-bold mb-6">Top Rated Skills</h3>
             <div className="bg-white rounded-custom border border-border overflow-hidden">
                <SkillRow label="Frontend Engineering" value={98} />
                <SkillRow label="UI/UX Design" value={95} />
                <SkillRow label="Technical Architecture" value={92} />
                <SkillRow label="Smart Contract Dev" value={85} />
             </div>
          </section>
        </div>

        <aside className="space-y-8">
          <Card className="p-6 bg-secondary text-white border-none mb-6">
            <h4 className="text-sm font-black uppercase tracking-widest text-primary mb-4">AI Verification Score</h4>
            <div className="text-5xl font-black mb-2">924</div>
            <p className="text-xs text-gray-400 leading-relaxed mb-6">Your score is in the top 1% of professionals worldwide.</p>
            <div className="w-full h-1 bg-white/10 rounded-full mb-8 overflow-hidden">
               <div className="bg-primary h-full w-[92%]" />
            </div>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-2">
              <CheckCircle size={12} className="text-green-500" /> Identity Verified: May 2026
            </p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-blue-600 to-indigo-700 border-none shadow-xl text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000" />
            <div className="relative z-10">
              <Badge className="mb-4 bg-white/20 text-white border-none font-black text-[10px] uppercase tracking-widest">Free Tool</Badge>
              <h4 className="text-xl font-bold mb-2">Build a Pro Resume</h4>
              <p className="text-xs text-blue-100 mb-6 leading-relaxed">
                Use <strong>Resusolve</strong> to create an ATS-friendly resume that complements your verified badges.
              </p>
              <a 
                href="https://resusolve.vercel.app" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest bg-white text-blue-700 px-6 py-3 rounded-custom hover:bg-blue-50 transition-colors"
              >
                Start Building <ArrowRight size={14} />
              </a>
            </div>
          </Card>
        </aside>
      </div>
    </main>
  );
}

// --- Student Settings ---
export function StudentSettings() {
  return (
    <main className="flex-1 p-8 bg-[#f8f9fb]">
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
          <Card className="p-8 border-none shadow-xl space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Full Name</label>
                <input type="text" defaultValue="Alex Rivera" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-custom outline-none focus:bg-white focus:border-primary transition-all font-medium" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
                <input type="email" defaultValue="alex@arivera.dev" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-custom outline-none focus:bg-white focus:border-primary transition-all font-medium" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Professional Bio</label>
              <textarea rows={4} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-custom outline-none focus:bg-white focus:border-primary transition-all font-medium resize-none">Senior Fullstack Engineer with a passion for high-performance React applications and decentralized systems.</textarea>
            </div>

            <div className="pt-6 border-t border-border flex justify-end gap-4">
               <Button variant="outline">Cancel</Button>
               <Button className="px-10">Save Changes</Button>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}

// --- Add New Skill Assessment ---
export function AddAssessment() {
  return (
    <main className="flex-1 p-8 bg-[#f8f9fb]">
       <header className="mb-12 max-w-3xl">
        <h1 className="text-4xl font-bold text-secondary mb-4">Choose Your Next Badge</h1>
        <p className="text-gray-500 font-medium text-lg">Select a technology to start your AI-proctored assessment and earn a verified credential.</p>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AssessmentOption title="Advanced TypeScript" difficulty="Expert" time="60 min" />
        <AssessmentOption title="Smart Contract Security" difficulty="Expert" time="120 min" />
        <AssessmentOption title="Python for AI/ML" difficulty="Intermediate" time="90 min" />
        <AssessmentOption title="Tailwind CSS v4" difficulty="Intermediate" time="45 min" />
        <AssessmentOption title="Cloud Architecture" difficulty="Senior" time="150 min" />
        <AssessmentOption title="Mobile Dev (React Native)" difficulty="Intermediate" time="90 min" />
      </div>
    </main>
  );
}

// --- Helper Components ---

function StatCard({ label, value, color }) {
  return (
    <Card className="p-6 border-none shadow-sm">
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{label}</p>
      <div className={`text-3xl font-black ${color}`}>{value}</div>
    </Card>
  );
}

function ActiveProjectRow({ title, client, budget, progress, completed = false }) {
  return (
    <Card className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 group hover:border-primary transition-all">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-custom flex items-center justify-center font-bold text-white ${completed ? 'bg-green-500' : 'bg-primary'}`}>
          {completed ? <CheckCircle size={24} /> : <Briefcase size={24} />}
        </div>
        <div>
          <h4 className="font-bold text-secondary group-hover:text-primary transition-colors">{title}</h4>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{client}</p>
        </div>
      </div>
      
      <div className="flex-1 max-w-xs">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Progress</span>
          <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">{progress}%</span>
        </div>
        <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
          <div className="bg-primary h-full transition-all duration-1000" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-right">
          <p className="text-sm font-bold text-secondary">{budget}</p>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Fixed Price</p>
        </div>
        <button className="p-2 text-gray-200 hover:text-primary transition-all">
          <ChevronRight size={24} />
        </button>
      </div>
    </Card>
  );
}

function BadgeCard({ title, score, date, color }) {
  return (
    <Card className="p-6 border-none shadow-xl hover:-translate-y-1 transition-all group overflow-hidden relative">
      <div className={`absolute top-0 right-0 w-24 h-24 ${color} opacity-5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700`} />
      <div className="flex items-center gap-4 mb-6">
        <div className={`w-12 h-12 ${color} text-white rounded-custom flex items-center justify-center shadow-lg shadow-black/10`}>
          <Award size={24} />
        </div>
        <div>
          <h4 className="font-bold text-secondary">{title}</h4>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Earned {date}</p>
        </div>
      </div>
      <div className="flex justify-between items-end">
        <div>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">AI Score</p>
          <p className={`text-2xl font-black ${color.replace('bg-', 'text-')}`}>{score}</p>
        </div>
        <Badge variant="neutral" className="text-[10px]">Verified ID</Badge>
      </div>
    </Card>
  );
}

function SkillRow({ label, value }) {
  return (
    <div className="p-6 flex items-center justify-between border-b border-border last:border-none group">
       <div className="flex-1">
         <h5 className="font-bold text-secondary mb-2">{label}</h5>
         <div className="w-full bg-gray-100 h-1.5 rounded-full max-w-md overflow-hidden">
            <div className="bg-primary h-full group-hover:bg-blue-600 transition-all duration-700" style={{ width: `${value}%` }} />
         </div>
       </div>
       <div className="text-right">
          <span className="text-xl font-black text-secondary">{value}</span>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Level</span>
       </div>
    </div>
  );
}

function SettingsNavItem({ icon: Icon, label, active = false }) {
  return (
    <button className={`flex items-center gap-3 w-full px-4 py-3 rounded-custom transition-all font-bold text-sm ${
      active ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-500 hover:text-secondary hover:bg-white'
    }`}>
      <Icon size={18} />
      <span>{label}</span>
    </button>
  );
}

function AssessmentOption({ title, difficulty, time }) {
  return (
    <Card className="p-8 group hover:border-primary transition-all flex flex-col items-center text-center">
      <div className="w-16 h-16 bg-primary/5 text-primary rounded-full flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all shadow-inner">
        <Target size={32} />
      </div>
      <h4 className="text-xl font-bold mb-2">{title}</h4>
      <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-8">
        <span className="flex items-center gap-1"><Clock size={12} /> {time}</span>
        <span className="flex items-center gap-1 text-primary"><Zap size={12} /> {difficulty}</span>
      </div>
      <Link to="/assessments/live" className="w-full">
        <Button className="w-full">Start Now</Button>
      </Link>
    </Card>
  );
}
