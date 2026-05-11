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
    <nav className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-xl border-b border-white/10 selection:bg-white selection:text-black">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex justify-between h-20">
          {/* Logo and Desktop Links */}
          <div className="flex items-center gap-12">
            <Link to="/" className="text-2xl font-black italic tracking-tighter uppercase">
              SkillScrumpt.in
            </Link>
            
            <div className="hidden md:flex space-x-10">
              {navLinks.map((link) => (
                <Link key={link.path} to={link.path} className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50 hover:text-white transition-all">
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
                   <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-white text-black">PRO</span>
                 )}
                 <button className="text-[10px] font-black uppercase tracking-widest flex items-center gap-3 group">
                   {user.role === 'admin' ? 'Admin Panel' : 'Dashboard'}
                   <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                 </button>
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-[10px] font-black uppercase tracking-widest text-white/50 hover:text-white transition-colors">Login</Link>
                <Link to="/register">
                  <button className="px-8 py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-white/90 transition-all">
                    Sign Up
                  </button>
                </Link>
              </>
            )}
          </div>

          <div className="flex md:hidden items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-black border-b border-white/10 p-6 space-y-6 animate-in slide-in-from-top duration-300">
          <div className="space-y-4">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path} className="block text-xl font-black uppercase tracking-tighter" onClick={() => setIsOpen(false)}>
                {link.label}
              </Link>
            ))}
          </div>
          <div className="pt-6 border-t border-white/10 space-y-4">
            {token ? (
              <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                <button className="w-full py-4 bg-white text-black font-black uppercase tracking-widest text-xs">Dashboard</button>
              </Link>
            ) : (
              <>
                <Link to="/login" className="block text-center text-xs font-black uppercase tracking-widest" onClick={() => setIsOpen(false)}>Login</Link>
                <Link to="/register" onClick={() => setIsOpen(false)}>
                  <button className="w-full py-4 bg-white text-black font-black uppercase tracking-widest text-xs">Join Now</button>
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
    <footer className="bg-black text-white border-t border-white/10 py-24 selection:bg-white selection:text-black">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 md:gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="text-3xl font-black italic tracking-tighter uppercase mb-8 block">
              SkillScrumpt.in
            </Link>
            <p className="text-white/40 text-[11px] font-bold uppercase tracking-widest leading-relaxed">
              AI-Proctored Skill Verification <br />& Global Freelance Marketplace. <br />Empowering verified talent with <br />global opportunities.
            </p>
          </div>
          
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 mb-8">Platform</h4>
            <ul className="space-y-4 text-[11px] font-black uppercase tracking-widest">
              <li><Link to="/marketplace" className="hover:text-white transition-colors">Marketplace</Link></li>
              <li><Link to="/proctoring" className="hover:text-white transition-colors">Proctoring</Link></li>
              <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link to="/security" className="hover:text-white transition-colors">Security</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 mb-8">Company</h4>
            <ul className="space-y-4 text-[11px] font-black uppercase tracking-widest">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/careers" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 mb-8">Legal</h4>
            <ul className="space-y-4 text-[11px] font-black uppercase tracking-widest">
              <li><Link to="/help" className="hover:text-white transition-colors">Help Center</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
              <li><Link to="/safety" className="hover:text-white transition-colors">Safety</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em]">© 2026 SkillScrumpt.in All Rights Reserved.</p>
          <div className="flex gap-12 text-white/40">
            <div className="text-[10px] font-black uppercase tracking-widest hover:text-white cursor-pointer transition-colors">Twitter</div>
            <div className="text-[10px] font-black uppercase tracking-widest hover:text-white cursor-pointer transition-colors">Discord</div>
            <div className="text-[10px] font-black uppercase tracking-widest hover:text-white cursor-pointer transition-colors">LinkedIn</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
