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
      { icon: Briefcase, label: 'Browse Projects', path: '/marketplace' },
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
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`w-64 bg-white border-r border-slate-200 flex-col fixed h-full z-50 transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0 flex' : '-translate-x-full lg:translate-x-0 lg:flex'}`}>
        <div className="p-8 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold tracking-tight text-indigo-600 hover:text-indigo-700 transition-colors inline-block">
            SkillScrumpt
          </Link>
          <button className="lg:hidden p-2 text-slate-400 hover:text-slate-900" onClick={() => setMobileMenuOpen(false)}>
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
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-all mx-2 w-[calc(100%-1rem)] ${
                location.pathname === item.path ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 font-medium'
              }`}
            >
              <item.icon size={18} />
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 mt-auto">
          {user?.role === 'professional' && (
            <div className="p-4 bg-slate-50 rounded-xl mb-6">
              <p className="text-xs text-slate-500 font-medium mb-2">AI Integrity Score</p>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-slate-900">{user?.aiScore || 0}</div>
                {user?.aiScore > 500 && (
                  <Badge variant="primary" className="bg-indigo-600 text-white border-none text-[10px]">ELITE</Badge>
                )}
              </div>
            </div>
          )}
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-6 py-4 text-slate-400 hover:text-red-600 transition-all font-medium text-sm"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        {/* Header */}
        <header className="flex justify-between items-center p-6 lg:p-8 bg-transparent sticky top-0 z-20 backdrop-blur-sm">
          <button 
            className="lg:hidden p-2 text-slate-400 hover:text-indigo-600 bg-white border border-slate-200 rounded-lg"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-4 lg:gap-8 ml-auto">
            <button className="p-2 text-slate-400 hover:text-indigo-600 transition-all relative bg-white border border-slate-200 rounded-lg hidden sm:block">
              <Bell size={20} />
              <div className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-white" />
            </button>
            <div className="flex items-center gap-4 lg:pl-8 lg:border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-bold text-slate-900 flex items-center gap-2 justify-end">
                  {user?.firstName} {user?.lastName} 
                  <div className="flex items-center gap-1">
                    {user?.isVerified && <BadgeCheck size={16} className="text-indigo-500" />}
                    {user?.isPro && (
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-amber-400 to-amber-600 text-white text-[9px] font-black rounded-full shadow-sm">
                        <Zap size={10} fill="currentColor" /> PRO
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-wider">
                  {user?.role === 'admin' ? 'Administrator' : (user?.isPro ? 'Pro Member' : 'Standard User')}
                </p>
              </div>
              <div className="w-10 h-10 bg-indigo-600 text-white flex items-center justify-center font-bold rounded-lg text-lg flex-shrink-0">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="px-4 sm:px-6 lg:px-8 pb-12 relative z-10">
          {children}
        </main>
      </div>
    </div>
  );
}
