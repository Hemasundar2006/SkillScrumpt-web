import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  FilePlus, 
  Users, 
  MessageSquare, 
  Settings, 
  LogOut, 
  Bell, 
  ChevronRight,
  Shield,
  Briefcase,
  BadgeCheck,
  MoreVertical,
  Plus,
  Loader2,
  Star
} from 'lucide-react';
import { Card, Badge, Button } from '../components/UI';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

export function ClientDashboard() {
  const navigate = useNavigate();
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
        api.get('/projects'), // In a real app, this would be /projects/my-projects
        api.get('/users/professionals') // I'll need to create this endpoint or filter users
      ]);

      setUser(profileRes.data);
      // Filter projects to only show ones created by this client (mocked for now as we don't have the filter yet)
      setProjects(projectsRes.data.slice(0, 3)); 
      setTalent(talentRes.data.slice(0, 3));
    } catch (err) {
      console.error('Error fetching client data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (isLoading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fb]">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

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
          <SidebarItem icon={Briefcase} label="My Projects" onClick={() => navigate('/my-projects')} />
          <SidebarItem icon={Users} label="Verified Talent" onClick={() => navigate('/talent')} />
          <SidebarItem icon={MessageSquare} label="Messages" onClick={() => navigate('/messages')} />
          <SidebarItem icon={Settings} label="Settings" onClick={() => navigate('/settings')} />
        </nav>

        <div className="p-4 mt-auto">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-custom transition-all"
          >
            <LogOut size={18} />
            <span className="text-sm font-semibold">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-8">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-secondary">Employer Dashboard</h1>
            <p className="text-gray-500 font-medium text-sm">Welcome back, {user?.firstName}. Ready to hire verified talent?</p>
          </div>
          
          <div className="flex items-center gap-4">
            <Link to="/post-project">
              <Button className="flex items-center gap-2 shadow-primary/20">
                <Plus size={18} /> Post New Project
              </Button>
            </Link>
            <div className="flex items-center gap-3 pl-4 border-l border-border">
              <div className="text-right hidden sm:block mr-3">
                <p className="text-sm font-bold text-secondary">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs font-bold text-primary">Enterprise Client</p>
              </div>
              <div className="w-10 h-10 bg-blue-600 rounded-custom flex items-center justify-center text-white font-bold">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
            </div>
          </div>
        </header>

        {/* Top Section: Active Bids & Top Talent */}
        <div className="grid lg:grid-cols-3 gap-8 mb-10">
          <div className="lg:col-span-2 space-y-6">
            <section>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-secondary">Your Projects</h3>
                <Link to="/my-projects" className="text-sm font-bold text-primary hover:underline">View All</Link>
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
                  <p className="text-gray-400 font-medium italic">You haven't posted any projects yet.</p>
                )}
              </div>
            </section>
          </div>

          <div>
            <h3 className="text-xl font-bold text-secondary mb-6">Project Stats</h3>
            <Card className="p-6 space-y-6 border-none shadow-sm">
              <StatItem label="Total Spent" value={`$${user?.totalSpent?.toLocaleString() || 0}`} color="text-green-600" />
              <StatItem label="Active Contracts" value={user?.activeContractsCount || 0} color="text-primary" />
              <StatItem label="Open Projects" value={projects.length} color="text-blue-600" />
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
              <p className="text-gray-400 font-medium italic col-span-3">Loading top talent...</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

function SidebarItem({ icon: Icon, label, active = false, onClick }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-3 w-full px-4 py-3 rounded-custom transition-all font-semibold text-sm ${
      active ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-400 hover:text-white hover:bg-white/5'
    }`}>
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );
}

function ActiveProjectCard({ id, title, bids, status, budget }) {
  const navigate = useNavigate();
  return (
    <Card onClick={() => navigate(`/projects/${id}`)} className="p-6 hover:border-primary transition-all group flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer">
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

function TalentCard({ id, name, role, rating, skills, score, avatar }) {
  const navigate = useNavigate();
  return (
    <Card className="p-6 group hover:shadow-xl hover:-translate-y-1 transition-all border-none shadow-sm relative overflow-hidden">
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
          {skills.slice(0, 3).map((skill, i) => (
            <Badge key={i} variant="neutral" className="bg-white border-gray-200 text-gray-600">{skill}</Badge>
          ))}
          {skills.length > 3 && <Badge variant="neutral">+{skills.length - 3}</Badge>}
        </div>

        <Button onClick={() => navigate(`/profile/${id}`)} variant="outline" className="w-full text-xs py-2 mt-2">View Profile</Button>
      </div>
    </Card>
  );
}
