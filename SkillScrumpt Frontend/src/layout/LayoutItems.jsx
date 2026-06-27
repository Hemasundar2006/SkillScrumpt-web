import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/UI';
import { Menu, X, Shield, Search, User, ArrowRight } from 'lucide-react';

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const token = localStorage.getItem('token');

  const getNavLinks = () => {
    if (!user || !token) {
      return [
        { label: 'Marketplace', path: '/marketplace' },
        { label: 'Proctoring', path: '/proctoring' },
        { label: 'Pricing', path: '/pricing' },
        { label: 'About', path: '/about' },
      ];
    }

    if (user.role === 'admin') {
      return [
        { label: 'Overview', path: '/dashboard/admin' },
        { label: 'Users', path: '/dashboard/admin/users' },
        { label: 'Tests', path: '/admin/create-test' },
        { label: 'Transactions', path: '/dashboard/admin/transactions' },
      ];
    }

    if (user.role === 'client') {
      return [
        { label: 'My Projects', path: '/my-projects' },
        { label: 'Post Project', path: '/post-project' },
        { label: 'Find Talent', path: '/talent' },
        { label: 'Support', path: '/help' },
      ];
    }

    // Professional
    return [
      { label: 'Browse Jobs', path: '/projects' },
      { label: 'My Contracts', path: '/dashboard/student/projects' },
      { label: 'Skill Badges', path: '/dashboard/student/skills' },
      { label: 'Earnings', path: '/dashboard/student/earnings' },
    ];
  };

  const navLinks = getNavLinks();

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-white/50 selection:bg-orange-500 selection:text-white">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex justify-between h-20">
          {/* Logo and Desktop Links */}
          <div className="flex items-center gap-12">
            <div className="flex flex-col">
              <Link to="/" className="text-2xl font-bold tracking-tight text-slate-900">
                SkillScrumpt
              </Link>
              <span className="text-xs font-semibold text-sky-600 hidden lg:block mt-1">
                AI-Proctored Freelance Network
              </span>
            </div>
            
            <div className="hidden md:flex space-x-10">
              {navLinks.map((link) => (
                <Link key={link.path} to={link.path} className="text-sm font-semibold text-slate-600 hover:text-orange-500 transition-all">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-8">
            {token ? (
              <Link to="/dashboard" className="flex items-center gap-6">
                 {user?.isPro && (
                   <span className="text-xs font-bold px-3 py-1 bg-orange-500 text-white rounded-full">PRO</span>
                 )}
                 <button className="text-sm font-semibold flex items-center gap-2 group text-slate-700 hover:text-orange-500">
                   {user.role === 'admin' ? 'Admin Panel' : 'Dashboard'}
                   <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                 </button>
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-orange-500 transition-colors">Login</Link>
                <Link to="/register">
                  <button className="px-8 py-3 bg-orange-500 text-white text-sm font-bold hover:bg-orange-600 transition-all rounded-xl shadow-sm">
                    Sign Up
                  </button>
                </Link>
              </>
            )}
          </div>

          <div className="flex md:hidden items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-900">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 p-6 space-y-6 animate-in slide-in-from-top duration-300">
          <div className="space-y-4">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path} className="block text-lg font-bold text-slate-900 hover:text-orange-500" onClick={() => setIsOpen(false)}>
                {link.label}
              </Link>
            ))}
          </div>
          <div className="pt-6 border-t border-slate-100 space-y-4">
            {token ? (
              <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                <button className="w-full py-4 bg-orange-500 text-white rounded-xl font-bold text-sm">Dashboard</button>
              </Link>
            ) : (
              <>
                <Link to="/login" className="block text-center text-sm font-semibold text-slate-700 hover:text-orange-500" onClick={() => setIsOpen(false)}>Login</Link>
                <Link to="/register" onClick={() => setIsOpen(false)}>
                  <button className="w-full py-4 bg-orange-500 text-white rounded-xl font-bold text-sm shadow-sm">Join Now</button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white border-t border-slate-800 py-24 selection:bg-sky-500 selection:text-white">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 md:gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="text-3xl font-bold tracking-tight mb-6 block text-white">
              SkillScrumpt
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              SkillScrumpt is a premium freelancing platform for students where every skill is verified through our advanced AI proctoring system to ensure absolute integrity.
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-bold text-sky-500 mb-6 uppercase tracking-wider">Platform</h4>
            <ul className="space-y-4 text-sm font-medium text-slate-300">
              <li><Link to="/marketplace" className="hover:text-sky-400 transition-colors">Marketplace</Link></li>
              <li><Link to="/proctoring" className="hover:text-sky-400 transition-colors">Proctoring</Link></li>
              <li><Link to="/pricing" className="hover:text-sky-400 transition-colors">Pricing</Link></li>
              <li><Link to="/security" className="hover:text-sky-400 transition-colors">Security</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-sky-500 mb-6 uppercase tracking-wider">Company</h4>
            <ul className="space-y-4 text-sm font-medium text-slate-300">
              <li><Link to="/about" className="hover:text-sky-400 transition-colors">About Us</Link></li>
              <li><Link to="/careers" className="hover:text-sky-400 transition-colors">Careers</Link></li>
              <li><Link to="/blog" className="hover:text-sky-400 transition-colors">Blog</Link></li>
              <li><Link to="/contact" className="hover:text-sky-400 transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-sky-500 mb-6 uppercase tracking-wider">Legal</h4>
            <ul className="space-y-4 text-sm font-medium text-slate-300">
              <li><Link to="/help" className="hover:text-sky-400 transition-colors">Help Center</Link></li>
              <li><Link to="/terms" className="hover:text-sky-400 transition-colors">Terms</Link></li>
              <li><Link to="/privacy" className="hover:text-sky-400 transition-colors">Privacy</Link></li>
              <li><Link to="/safety" className="hover:text-sky-400 transition-colors">Safety</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-24 pt-12 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-slate-500 text-sm">© 2026 SkillScrumpt. All Rights Reserved.</p>
          <div className="flex gap-8 text-slate-400 text-sm font-medium">
            <div className="hover:text-sky-400 cursor-pointer transition-colors">Twitter</div>
            <div className="hover:text-sky-400 cursor-pointer transition-colors">Discord</div>
            <div className="hover:text-sky-400 cursor-pointer transition-colors">LinkedIn</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
