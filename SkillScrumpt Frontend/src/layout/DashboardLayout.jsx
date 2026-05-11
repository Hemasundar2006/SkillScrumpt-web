import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  Award, 
  TrendingUp, 
  Settings, 
  LogOut, 
  Shield,
  Bell,
  BadgeCheck,
  Users,
  DollarSign,
  Plus,
  ArrowRight
} from 'lucide-react';
import { Badge } from '../components/UI';

export function DashboardLayout({ children, user }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getNavItems = () => {
    if (user?.role === 'admin') {
      return [
        { icon: LayoutDashboard, label: 'Overview', path: '/dashboard/admin' },
        { icon: Users, label: 'User Management', path: '/dashboard/admin/users' },
        { icon: Award, label: 'Proctoring Tests', path: '/dashboard/admin/create-test' },
        { icon: DollarSign, label: 'Financial Tracking', path: '/dashboard/admin/transactions' },
        { icon: Settings, label: 'Settings', path: '/settings' },
      ];
    }

    if (user?.role === 'client') {
      return [
        { icon: LayoutDashboard, label: 'Overview', path: '/dashboard/client' },
        { icon: Briefcase, label: 'My Projects', path: '/my-projects' },
        { icon: Users, label: 'Verified Talent', path: '/talent' },
        { icon: Plus, label: 'Post Project', path: '/post-project' },
        { icon: Settings, label: 'Settings', path: '/settings' },
      ];
    }

    // Default: Professional/Student
    return [
      { icon: LayoutDashboard, label: 'Overview', path: '/dashboard/student' },
      { icon: Briefcase, label: 'Browse Projects', path: '/projects' },
      { icon: Briefcase, label: 'My Contracts', path: '/dashboard/student/projects' },
      { icon: Award, label: 'Skill Badges', path: '/dashboard/student/skills' },
      { icon: Shield, label: 'Skill Assessments', path: '/dashboard/student/assessments' },
      { icon: TrendingUp, label: 'Earnings', path: '/dashboard/student/earnings' },
      { icon: Settings, label: 'Settings', path: '/dashboard/student/settings' },
    ];
  };

  const navItems = getNavItems();

  return (
    <div className="flex min-h-screen bg-black text-white selection:bg-white selection:text-black font-sans tracking-tight">
      {/* Sidebar */}
      <aside className="w-72 bg-black border-r border-white/10 hidden lg:flex flex-col fixed h-full z-30">
        <div className="p-8">
          <Link to="/" className="text-2xl font-black italic tracking-tighter uppercase hover:scale-105 transition-transform inline-block">
            SkillScrumpt.in
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4">
          {navItems.map((item) => (
            <button 
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-4 w-full px-6 py-4 transition-all ${
                location.pathname === item.path ? 'bg-white text-black font-black italic' : 'text-white/40 hover:text-white hover:bg-white/5 font-bold'
              }`}
            >
              <item.icon size={18} />
              <span className="text-[11px] uppercase tracking-[0.2em]">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 mt-auto">
          {user?.role === 'professional' && (
            <div className="p-6 border border-white/10 mb-6 bg-white/5">
              <p className="text-[9px] text-white/30 font-black mb-3 uppercase tracking-widest">AI Integrity Score</p>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-black italic">{user?.aiScore || 0}</div>
                {user?.aiScore > 500 && (
                  <Badge variant="primary" className="bg-white text-black border-none text-[8px]">ELITE</Badge>
                )}
              </div>
            </div>
          )}
          <button 
            onClick={handleLogout}
            className="flex items-center gap-4 w-full px-6 py-4 text-white/40 hover:text-white hover:bg-white/5 transition-all font-black uppercase tracking-[0.2em] text-[10px]"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 lg:ml-72 flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center p-8 bg-transparent sticky top-0 z-20 backdrop-blur-sm">
          <div className="flex items-center gap-8 ml-auto">
            <button className="p-2 text-white/40 hover:text-white transition-all relative">
              <Bell size={20} />
              <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-white rounded-full" />
            </button>
            <div className="flex items-center gap-5 pl-8 border-l border-white/10">
              <div className="text-right hidden sm:block">
                <p className="text-[11px] font-black uppercase tracking-widest flex items-center gap-3 justify-end">
                  {user?.firstName} {user?.lastName} 
                  {user?.isVerified && <BadgeCheck size={14} className="text-white" />}
                </p>
                <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mt-1">
                  {user?.role === 'admin' ? 'SYSTEM OVERSEER' : (user?.isPro ? 'PRO OPERATIVE' : (user?.isVerified ? 'VERIFIED TALENT' : 'STANDARD ASSET'))}
                </p>
              </div>
              <div className="w-10 h-10 bg-white text-black flex items-center justify-center font-black italic text-lg">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="px-8 pb-12 relative z-10">
          {children}
        </main>
      </div>
    </div>
  );
}
