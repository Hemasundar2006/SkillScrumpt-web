import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/UI';
import { Menu, X, Shield, Search, Bell, User } from 'lucide-react';

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="p-2 bg-primary rounded-custom text-white group-hover:rotate-12 transition-transform">
                <Shield size={24} />
              </div>
              <span className="text-xl font-bold tracking-tight">SkillScrumpt</span>
            </Link>
            
            <div className="hidden md:ml-8 md:flex md:space-x-8">
              <Link to="/marketplace" className="text-gray-600 hover:text-primary px-3 py-2 text-sm font-medium">Marketplace</Link>
              <Link to="/assessments" className="text-gray-600 hover:text-primary px-3 py-2 text-sm font-medium">Assessments</Link>
              <Link to="/pricing" className="text-gray-600 hover:text-primary px-3 py-2 text-sm font-medium">Pricing</Link>
              <Link to="/about" className="text-gray-600 hover:text-primary px-3 py-2 text-sm font-medium">About</Link>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary" size={18} />
              <input 
                type="text" 
                placeholder="Search talent..." 
                className="pl-10 pr-4 py-2 bg-gray-100 border-transparent focus:bg-white focus:border-primary border rounded-custom text-sm outline-none transition-all w-64"
              />
            </div>
            <Link to="/login" className="text-gray-600 hover:text-primary text-sm font-semibold">Login</Link>
            <Link to="/register">
              <Button>Join Now</Button>
            </Link>
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
            <Link to="/marketplace" className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50">Marketplace</Link>
            <Link to="/assessments" className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50">Assessments</Link>
            <Link to="/pricing" className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50">Pricing</Link>
            <Link to="/about" className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50">About</Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200 px-4">
            <Link to="/register" className="block w-full text-center">
              <Button className="w-full">Join Now</Button>
            </Link>
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
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-primary rounded-custom text-white">
                <Shield size={20} />
              </div>
              <span className="text-xl font-bold tracking-tight">SkillScrumpt</span>
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
            {/* Social icons placeholder */}
            <div className="w-5 h-5 bg-gray-200 rounded-full hover:bg-primary transition-colors cursor-pointer" />
            <div className="w-5 h-5 bg-gray-200 rounded-full hover:bg-primary transition-colors cursor-pointer" />
            <div className="w-5 h-5 bg-gray-200 rounded-full hover:bg-primary transition-colors cursor-pointer" />
          </div>
        </div>
      </div>
    </footer>
  );
}
