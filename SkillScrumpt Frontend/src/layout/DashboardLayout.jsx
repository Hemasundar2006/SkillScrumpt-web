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
  Plus
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
        { icon: Award, label: 'Proctoring Tests', path: '/admin/create-test' },
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
      { icon: Briefcase, label: 'My Projects', path: '/dashboard/student/projects' },
      { icon: Award, label: 'Skill Badges', path: '/dashboard/student/skills' },
      { icon: TrendingUp, label: 'Earnings', path: '/dashboard/student/earnings' },
      { icon: Settings, label: 'Settings', path: '/dashboard/student/settings' },
    ];
  };

  const navItems = getNavItems();

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
          {navItems.map((item) => (
            <button 
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-custom transition-all font-semibold text-sm ${
                location.pathname === item.path ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 mt-auto">
          {user?.role === 'professional' && (
            <div className="bg-white/5 rounded-custom p-4 mb-4 border border-white/10">
              <p className="text-xs text-gray-400 font-bold mb-2 uppercase tracking-widest">Your AI Score</p>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold text-primary">{user?.aiScore || 0}</div>
                {user?.aiScore > 500 && (
                  <Badge variant="primary" className="bg-primary/20 text-blue-300 border-none text-[10px]">TOP {user?.aiScore > 800 ? '1%' : '5%'}</Badge>
                )}
              </div>
            </div>
          )}
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-custom transition-all"
          >
            <LogOut size={18} />
            <span className="text-sm font-semibold">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 lg:ml-64 flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center p-8 bg-transparent">
          <div className="flex items-center gap-4 ml-auto">
            <button className="p-2 bg-white border border-border rounded-custom text-gray-500 hover:text-primary transition-all relative">
              <Bell size={20} />
              <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-border">
              <div className="text-right hidden sm:block mr-3">
                <p className="text-sm font-bold text-secondary flex items-center gap-1 justify-end">
                  {user?.firstName} {user?.lastName} {user?.isVerified && <BadgeCheck size={14} className="text-primary fill-primary/10" />}
                </p>
                <p className="text-xs font-bold text-primary">{user?.role === 'admin' ? 'Super Admin' : (user?.isVerified ? 'Verified Expert' : 'Standard Account')}</p>
              </div>
              <div className="w-10 h-10 bg-primary rounded-custom flex items-center justify-center text-white font-bold">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="px-8 pb-8">
          {children}
        </div>
      </div>
    </div>
  );
}
