import React from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  FilePlus, 
  Users, 
  MessageSquare, 
  Settings, 
  LogOut, 
  Bell, 
  Search, 
  ChevronRight,
  Shield,
  Briefcase,
  CheckCircle,
  BadgeCheck,
  MoreVertical,
  Plus
} from 'lucide-react';
import { Card, Badge, Button, GlassContainer } from '../components/UI';
import { Link } from 'react-router-dom';

export function ClientDashboard() {
  return (
    <div className="flex min-h-screen bg-[#f8f9fb]">
      {/* Sidebar */}
      <aside className="w-64 bg-secondary text-white hidden lg:flex flex-col fixed h-full z-30">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="p-2 bg-primary rounded-custom text-white">
              <Shield size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight">SkillScrumpt</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <SidebarItem icon={LayoutDashboard} label="Overview" active />
          <SidebarItem icon={Briefcase} label="My Projects" />
          <SidebarItem icon={Users} label="Verified Talent" />
          <SidebarItem icon={MessageSquare} label="Messages" />
          <SidebarItem icon={Settings} label="Settings" />
        </nav>

        <div className="p-4 mt-auto">
          <button className="flex items-center gap-3 w-full px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-custom transition-all">
            <LogOut size={18} />
            <span className="text-sm font-semibold">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-secondary">Employer Dashboard</h1>
            <p className="text-gray-500 font-medium text-sm">Welcome back, Sarah. Ready to hire verified talent?</p>
          </div>
          
          <div className="flex items-center gap-4">
            <Link to="/post-project">
              <Button className="flex items-center gap-2 shadow-primary/20">
                <Plus size={18} /> Post New Project
              </Button>
            </Link>
            <div className="flex items-center gap-3 pl-4 border-l border-border">
              <div className="w-10 h-10 bg-blue-600 rounded-custom flex items-center justify-center text-white font-bold">
                SC
              </div>
            </div>
          </div>
        </header>

        {/* Top Section: Active Bids & Top Talent */}
        <div className="grid lg:grid-cols-3 gap-8 mb-10">
          <div className="lg:col-span-2 space-y-6">
            <section>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-secondary">Active Projects</h3>
                <Link to="/my-projects" className="text-sm font-bold text-primary hover:underline">View All</Link>
              </div>
              <div className="space-y-4">
                <ActiveProjectCard 
                  title="Next.js Frontend Developer" 
                  bids="24" 
                  status="Reviewing" 
                  budget="$3,000 - $5,000"
                />
                <ActiveProjectCard 
                  title="UI/UX Designer for Fintech" 
                  bids="15" 
                  status="Active Bidding" 
                  budget="$2,500 - $4,000"
                />
              </div>
            </section>
          </div>

          <div>
            <h3 className="text-xl font-bold text-secondary mb-6">Project Stats</h3>
            <Card className="p-6 space-y-6 border-none shadow-sm">
              <StatItem label="Total Spent" value="$42,800" color="text-green-600" />
              <StatItem label="Projects Completed" value="18" color="text-blue-600" />
              <StatItem label="Active Contracts" value="3" color="text-primary" />
            </Card>
          </div>
        </div>

        {/* Talent Section */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-secondary">AI-Verified Top Talent</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Filter</Button>
              <Button variant="outline" size="sm">Search Talent</Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <TalentCard 
              name="Alex Rivera" 
              role="Senior Fullstack Engineer" 
              rating="4.9" 
              skills={['React', 'Node.js', 'Solidity']}
              score="982"
              avatar="AR"
            />
            <TalentCard 
              name="Elena Chen" 
              role="Product Designer" 
              rating="5.0" 
              skills={['Figma', 'UI/UX', 'Framer']}
              score="995"
              avatar="EC"
            />
            <TalentCard 
              name="Marcus Thorne" 
              role="Python Backend Dev" 
              rating="4.8" 
              skills={['Django', 'AI/ML', 'PostgreSQL']}
              score="945"
              avatar="MT"
            />
          </div>
        </section>
      </main>
    </div>
  );
}

function SidebarItem({ icon: Icon, label, active = false }) {
  return (
    <button className={`flex items-center gap-3 w-full px-4 py-3 rounded-custom transition-all font-semibold text-sm ${
      active ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-400 hover:text-white hover:bg-white/5'
    }`}>
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );
}

function ActiveProjectCard({ title, bids, status, budget }) {
  return (
    <Card className="p-6 hover:border-primary transition-all group flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h4 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{title}</h4>
        <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-gray-400">
          <span>{bids} Applications</span>
          <span className="text-secondary">{budget}</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Badge variant={status === 'Reviewing' ? 'warning' : 'primary'}>{status}</Badge>
        <button className="p-2 text-gray-300 hover:text-secondary"><MoreVertical size={20} /></button>
      </div>
    </Card>
  );
}

function StatItem({ label, value, color }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">{label}</span>
      <span className={`text-lg font-bold ${color}`}>{value}</span>
    </div>
  );
}

function TalentCard({ name, role, rating, skills, score, avatar }) {
  return (
    <Card className="p-6 group hover:shadow-xl hover:-translate-y-1 transition-all border-none shadow-sm relative overflow-hidden">
      {/* Verification overlay */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700" />
      
      <div className="flex items-center gap-4 mb-6 relative z-10">
        <div className="w-12 h-12 bg-gray-100 rounded-custom flex items-center justify-center font-bold text-primary border border-primary/20">
          {avatar}
        </div>
        <div>
          <h4 className="font-bold text-secondary flex items-center gap-2">
            {name} <BadgeCheck size={18} className="text-primary fill-primary/10" />
          </h4>
          <p className="text-xs text-gray-500 font-medium">{role}</p>
        </div>
      </div>

      <div className="space-y-4 relative z-10">
        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-custom">
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">AI Score</p>
            <p className="text-lg font-bold text-primary">{score}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Rating</p>
            <p className="text-sm font-bold text-secondary flex items-center justify-end gap-1">
              <Star size={14} className="text-yellow-400 fill-yellow-400" /> {rating}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {skills.map((skill, i) => (
            <Badge key={i} variant="neutral" className="bg-white border-gray-200 text-gray-600">{skill}</Badge>
          ))}
        </div>

        <Button variant="outline" className="w-full text-xs py-2 mt-2">View Profile</Button>
      </div>
    </Card>
  );
}

function Star({ size, className }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
