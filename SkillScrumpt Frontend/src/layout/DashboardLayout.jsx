import React, { useState } from 'react';
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
  ArrowRight,
  Zap,
  User,
  Menu,
  X
} from 'lucide-react';
import { Badge } from '../components/UI';

export function DashboardLayout({ children, user }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);

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
        { icon: User, label: 'My Profile', path: `/profile/${user?._id || user?.id}` },
        { icon: Settings, label: 'Settings', path: '/settings' },
      ];
    }

    if (user?.role === 'client') {
      return [
        { icon: LayoutDashboard, label: 'Overview', path: '/dashboard/client' },
        { icon: Briefcase, label: 'My Projects', path: '/my-projects' },
        { icon: Users, label: 'Verified Talent', path: '/talent' },
        { icon: Plus, label: 'Post Project', path: '/post-project' },
        { icon: User, label: 'My Profile', path: `/profile/${user?._id || user?.id}` },
        { icon: Settings, label: 'Settings', path: '/settings' },
      ];
    }

    // Default: Professional/Student
    return [
      { icon: LayoutDashboard, label: 'Overview', path: '/dashboard/student' },
      { icon: Briefcase, label: 'Browse Projects', path: '/dashboard/student/browse' },
      { icon: Briefcase, label: 'My Contracts', path: '/dashboard/student/projects' },
      { icon: Award, label: 'Skill Badges', path: '/dashboard/student/skills' },
      { icon: Shield, label: 'Skill Assessments', path: '/dashboard/student/assessments' },
      { icon: TrendingUp, label: 'Earnings', path: '/dashboard/student/earnings' },
      { icon: User, label: 'My Profile', path: `/profile/${user?._id || user?.id}` },
      { icon: Settings, label: 'Settings', path: '/dashboard/student/settings' },
    ];
  };

  const navItems = getNavItems();

  return (
    <div className="flex h-screen overflow-hidden bg-[#FFF0E5] text-slate-900 font-sans" style={{ scrollbarGutter: 'stable' }}>
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        onMouseEnter={() => setIsSidebarHovered(true)}
        onMouseLeave={() => setIsSidebarHovered(false)}
        className={`bg-white/40 backdrop-blur-xl border-r border-white/50 shadow-[4px_0_24px_rgba(0,0,0,0.02)] flex-col fixed h-full z-50 transition-all duration-300 ease-in-out overflow-hidden ${
          mobileMenuOpen ? 'w-64 translate-x-0 flex' : '-translate-x-full lg:translate-x-0 lg:flex'
        } ${!mobileMenuOpen && (isSidebarHovered ? 'lg:w-64 shadow-2xl' : 'lg:w-20')}`}
      >
        <div className={`p-8 flex items-center transition-all duration-300 ${isSidebarHovered ? 'justify-between' : 'justify-center'}`}>
          <div className="flex flex-col">
            <Link to="/" className="text-xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600 hover:opacity-80 transition-all inline-block whitespace-nowrap leading-none">
              {isSidebarHovered ? 'SkillScrumpt' : 'SS'}
            </Link>
            {isSidebarHovered && (
              <span className="text-[7px] font-black uppercase tracking-widest text-slate-500 mt-1 animate-in fade-in duration-500">
                AI-Proctored Freelancing for Students
              </span>
            )}
          </div>
          <button className={`${isSidebarHovered ? 'lg:hidden' : 'hidden'} p-2 text-slate-400 hover:text-slate-900`} onClick={() => setMobileMenuOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto">
          {navItems.map((item) => (
            <button 
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setMobileMenuOpen(false);
              }}
              className={`flex items-center transition-all duration-300 w-full rounded-xl mx-auto px-4 py-3.5 ${
                location.pathname === item.path ? 'bg-[#E0F2FE] text-[#38BDF8] font-bold shadow-sm border border-[#38BDF8]/20' : 'text-slate-500 hover:text-[#38BDF8] hover:bg-[#E0F2FE]/50 font-medium'
              } ${isSidebarHovered ? 'gap-4 w-[calc(100%-2rem)]' : 'justify-center w-12'}`}
            >
              <item.icon size={20} className="flex-shrink-0" />
              <span className={`text-[13px] whitespace-nowrap transition-all duration-300 ${isSidebarHovered ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                {item.label}
              </span>
            </button>
          ))}
        </nav>

        <div className={`p-6 mt-auto transition-all duration-300 ${isSidebarHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          {user?.role === 'professional' && (
            <div className="p-4 bg-white/40 border border-white/50 rounded-xl mb-6 backdrop-blur-sm">
              <p className="text-xs text-slate-500 font-bold mb-2">AI Integrity Score</p>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-black text-slate-900">{user?.aiScore || 0}</div>
                {user?.aiScore > 500 && (
                  <Badge variant="primary" className="bg-sky-500 text-white border-none text-[10px]">ELITE</Badge>
                )}
              </div>
            </div>
          )}
          <button 
            onClick={handleLogout}
            className={`flex items-center transition-all duration-300 w-full text-slate-500 hover:text-red-500 hover:bg-white/60 rounded-xl font-bold text-sm ${isSidebarHovered ? 'gap-4 px-6 py-4' : 'justify-center p-4'}`}
          >
            <LogOut size={18} className="flex-shrink-0" />
            <span className={`transition-all duration-300 ${isSidebarHovered ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className={`flex-1 transition-all duration-300 lg:ml-20 flex flex-col min-w-0`}>
        {/* Header */}
        <header className="flex justify-between items-center p-6 lg:px-12 lg:py-6 bg-white/40 backdrop-blur-xl sticky top-0 z-20 border-b border-white/50">
          <button 
            className="lg:hidden p-2 text-slate-500 hover:text-slate-900 bg-white/60 border border-white/50 rounded-lg backdrop-blur-md"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-4 lg:gap-8 ml-auto">
            <Link to="/notifications" className="p-2 text-slate-500 hover:text-[#38BDF8] transition-all relative bg-white/60 border border-white/50 rounded-[12px] hidden sm:block backdrop-blur-md hover:-translate-y-0.5">
              <Bell size={20} />
              <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#F97316] rounded-full border-2 border-white shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
            </Link>
            <div className="flex items-center gap-4 lg:pl-8 lg:border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-bold text-slate-900 flex items-center gap-2 justify-end">
                  {user?.firstName} {user?.lastName} 
                  <div className="flex items-center gap-1">
                    {user?.isVerified && <BadgeCheck size={16} className="text-blue-400" />}
                    {user?.isPro && (
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-orange-400 to-orange-600 text-white text-[9px] font-black rounded-full shadow-sm">
                        <Zap size={10} fill="currentColor" /> PRO
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-[10px] font-bold text-slate-500 mt-0.5 uppercase tracking-wider">
                  {user?.role === 'admin' ? 'Administrator' : (user?.isPro ? 'Pro Member' : 'Standard User')}
                </p>
              </div>
              <div className="w-10 h-10 bg-[#38BDF8] shadow-sm text-white flex items-center justify-center font-bold rounded-[12px] text-lg flex-shrink-0">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="px-4 sm:px-6 lg:px-8 pt-6 pb-6 relative z-10 flex-1 overflow-y-auto custom-scrollbar flex flex-col">
          {children}
        </main>
      </div>
    </div>
  );
}
