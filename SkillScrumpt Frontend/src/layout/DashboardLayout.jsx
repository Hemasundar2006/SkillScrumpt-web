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
  ArrowRight,
  Zap
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
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col fixed h-full z-30">
        <div className="p-8">
          <Link to="/" className="text-xl font-bold tracking-tight text-indigo-600 hover:text-indigo-700 transition-colors inline-block">
            SkillScrumpt
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4">
          {navItems.map((item) => (
            <button 
              key={item.path}
              onClick={() => navigate(item.path)}
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
      <div className="flex-1 lg:ml-72 flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center p-8 bg-transparent sticky top-0 z-20 backdrop-blur-sm">
          <div className="flex items-center gap-8 ml-auto">
            <button className="p-2 text-slate-400 hover:text-indigo-600 transition-all relative bg-white border border-slate-200 rounded-lg">
              <Bell size={20} />
              <div className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-white" />
            </button>
            <div className="flex items-center gap-4 pl-8 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900 flex items-center gap-2 justify-end">
                  {user?.firstName} {user?.lastName} 
                  <div className="flex items-center gap-1">
                    {user?.isVerified && <BadgeCheck size={16} className="text-indigo-500" />}
                    {user?.isPro && (
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-amber-400 to-amber-600 text-white text-[9px] font-black rounded-full shadow-sm">
                        <Zap size={10} fill="currentColor" /> PRO
                      </span>
                    )}
                  </div>
                </p>
                <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-wider">
                  {user?.role === 'admin' ? 'Administrator' : (user?.isPro ? 'Pro Member' : 'Standard User')}
                </p>
              </div>
              <div className="w-10 h-10 bg-indigo-600 text-white flex items-center justify-center font-bold rounded-lg text-lg">
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
