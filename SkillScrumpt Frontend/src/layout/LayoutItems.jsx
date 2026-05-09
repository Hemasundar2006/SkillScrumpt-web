import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/UI';
import { Menu, X, Shield, Search, User } from 'lucide-react';

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const token = localStorage.getItem('token');

  const getNavLinks = () => {
    if (!user || !token) {
      return [
        { label: 'Marketplace', path: '/marketplace' },
        { label: 'Assessments', path: '/assessments' },
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
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Desktop Links */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3 group">
              <img src="/logo.png" alt="SkillScrumpt" className="h-10 w-auto group-hover:scale-105 transition-transform" />
            </Link>
            
            <div className="hidden md:ml-8 md:flex md:space-x-8">
              {navLinks.map((link) => (
                <Link key={link.path} to={link.path} className="text-gray-600 hover:text-primary px-3 py-2 text-sm font-bold transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Search and Auth */}
          <div className="hidden md:flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary" size={18} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-10 pr-4 py-2 bg-gray-100 border-transparent focus:bg-white focus:border-primary border rounded-custom text-sm outline-none transition-all w-48 focus:w-64"
              />
            </div>
            {token ? (
              <Link to="/dashboard">
                 <Button className="flex items-center gap-2 h-10 px-6 font-bold shadow-lg shadow-primary/20">
                    <User size={18} /> {user.role === 'admin' ? 'Admin Panel' : 'Dashboard'}
                 </Button>
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-primary text-sm font-bold">Login</Link>
                <Link to="/register">
                  <Button className="h-10 px-6 font-bold shadow-lg shadow-primary/20">Join Now</Button>
                </Link>
              </>
            )}
          </div>

          <div className="flex md:hidden items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-primary">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-border animate-in slide-in-from-top duration-300">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path} className="block px-3 py-2 text-base font-bold text-gray-700 hover:bg-gray-50">
                {link.label}
              </Link>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200 px-4">
            {token ? (
              <Link to="/dashboard" className="block w-full">
                <Button className="w-full h-12 font-bold">Go to Dashboard</Button>
              </Link>
            ) : (
              <Link to="/register" className="block w-full text-center">
                <Button className="w-full h-12 font-bold">Join Now</Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="bg-white border-t border-border py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img src="/logo.png" alt="SkillScrumpt" className="h-8 w-auto" />
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed">
              The world's first AI-proctored skill verification and freelance marketplace. Bridging the gap between verified talent and global opportunities.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link to="/marketplace" className="hover:text-primary">Talent Marketplace</Link></li>
              <li><Link to="/assessments" className="hover:text-primary">Skill Assessments</Link></li>
              <li><Link to="/pricing" className="hover:text-primary">Pricing Plans</Link></li>
              <li><Link to="/security" className="hover:text-primary">AI Proctoring</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link to="/about" className="hover:text-primary">About Us</Link></li>
              <li><Link to="/careers" className="hover:text-primary">Careers</Link></li>
              <li><Link to="/blog" className="hover:text-primary">Blog</Link></li>
              <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link to="/help" className="hover:text-primary">Help Center</Link></li>
              <li><Link to="/terms" className="hover:text-primary">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
              <li><Link to="/safety" className="hover:text-primary">Safety Center</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs">© 2026 SkillScrumpt. All rights reserved.</p>
          <div className="flex gap-6">
            <div className="w-5 h-5 bg-gray-200 rounded-full hover:bg-primary transition-colors cursor-pointer" />
            <div className="w-5 h-5 bg-gray-200 rounded-full hover:bg-primary transition-colors cursor-pointer" />
            <div className="w-5 h-5 bg-gray-200 rounded-full hover:bg-primary transition-colors cursor-pointer" />
          </div>
        </div>
      </div>
    </footer>
  );
}
