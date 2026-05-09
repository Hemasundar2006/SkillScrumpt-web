import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Mail, Lock, ArrowRight, Code, Monitor, Zap } from 'lucide-react';
import { Button, Card, GlassContainer } from '../components/UI';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center pt-20 pb-12 px-4 bg-[#f8f9fb] relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="p-2 bg-primary rounded-custom text-white">
              <Shield size={24} />
            </div>
            <span className="text-2xl font-bold tracking-tight">SkillScrumpt</span>
          </Link>
          <h2 className="text-3xl font-bold text-secondary">Welcome Back</h2>
          <p className="text-gray-500 mt-2 text-sm font-medium">Please enter your details to sign in</p>
        </div>

        <Card className="p-8 shadow-2xl border-none">
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
                <input 
                  type="email" 
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-custom outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-medium"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-bold text-gray-700">Password</label>
                <Link to="/forgot-password" size="sm" className="text-xs font-bold text-primary hover:underline">Forgot password?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
                <input 
                  type="password" 
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-custom outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-medium"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 px-1">
              <input type="checkbox" id="remember" className="rounded border-gray-300 text-primary focus:ring-primary" />
              <label htmlFor="remember" className="text-xs font-bold text-gray-500 cursor-pointer">Remember me for 30 days</label>
            </div>

            <Button className="w-full h-12 text-base shadow-xl shadow-primary/30">
              Sign In
            </Button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-4 text-gray-400 font-bold tracking-widest">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-custom hover:bg-gray-50 transition-colors">
                <Monitor size={18} />
                <span className="text-sm font-bold text-gray-700">Google</span>
              </button>
              <button className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-custom hover:bg-gray-50 transition-colors">
                <Code size={18} />
                <span className="text-sm font-bold text-gray-700">Github</span>
              </button>
            </div>
          </form>
        </Card>

        <p className="text-center mt-8 text-sm text-gray-500 font-medium">
          Don't have an account? <Link to="/register" className="text-primary font-bold hover:underline">Create an account</Link>
        </p>
      </motion.div>
    </div>
  );
}

export function Register() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const initialRole = queryParams.get('role') || 'professional';
  const [role, setRole] = React.useState(initialRole);

  const handleGoogleSignUp = (e) => {
    e.preventDefault();
    // Simulate authentication delay
    if (role === 'professional') {
      navigate('/dashboard/student', { state: { showUpgrade: true } });
    } else {
      navigate('/dashboard/client');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-28 pb-20 px-4 bg-[#f8f9fb] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/3 right-10 w-64 h-64 bg-blue-400/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl relative z-10"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="p-2 bg-primary rounded-custom text-white">
              <Shield size={24} />
            </div>
            <span className="text-2xl font-bold tracking-tight text-secondary">SkillScrumpt</span>
          </Link>
          <h2 className="text-4xl font-black text-secondary tracking-tight">Create Your Account</h2>
          <p className="text-gray-500 mt-2 text-sm font-medium">Join 150k+ students and 2k+ companies on the most trusted talent marketplace.</p>
        </div>

        {/* How It Works Steps */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          <div className="text-center group">
            <div className="w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform text-primary border border-primary/10">
              <Shield size={18} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">1. Verify Identity</p>
          </div>
          <div className="text-center group">
            <div className="w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform text-primary border border-primary/10">
              <Zap size={18} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">2. Pass Proctored Test</p>
          </div>
          <div className="text-center group">
            <div className="w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform text-primary border border-primary/10">
              <ArrowRight size={18} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">3. Get Hired Direct</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <button className="text-left group relative" onClick={() => setRole('professional')}>
            <Card className={`h-full border-2 transition-all p-6 bg-white ${role === 'professional' ? 'border-primary shadow-xl shadow-primary/5' : 'border-transparent hover:border-primary/50'}`}>
              <div className={`w-12 h-12 rounded-custom flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${role === 'professional' ? 'bg-primary text-white' : 'bg-primary/10 text-primary'}`}>
                <Monitor size={24} />
              </div>
              <h4 className="font-bold text-lg mb-1">I'm a Professional</h4>
              <p className="text-xs text-primary font-black uppercase tracking-widest mb-2 opacity-80">Get Verified & Retain 100% Pay</p>
              <p className="text-[11px] text-gray-500 font-medium leading-relaxed">Showcase your skills through AI-proctored tests and earn verified badges.</p>
              
              {role === 'professional' && (
                <div className="absolute top-4 right-4 animate-pulse">
                  <div className="bg-primary/10 text-primary p-1.5 rounded-full">
                    <Shield size={14} />
                  </div>
                </div>
              )}
            </Card>
          </button>
          
          <button className="text-left group relative" onClick={() => setRole('client')}>
            <Card className={`h-full border-2 transition-all p-6 bg-white ${role === 'client' ? 'border-primary shadow-xl shadow-primary/5' : 'border-transparent hover:border-primary/50'}`}>
              <div className={`w-12 h-12 rounded-custom flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${role === 'client' ? 'bg-secondary text-white' : 'bg-secondary/10 text-secondary'}`}>
                <Code size={24} />
              </div>
              <h4 className="font-bold text-lg mb-1">I'm a Client</h4>
              <p className="text-xs text-secondary font-black uppercase tracking-widest mb-2 opacity-80">Hire Top 1% Verified Talent</p>
              <p className="text-[11px] text-gray-500 font-medium leading-relaxed">Access a pool of pre-vetted professionals with proctored assessment data.</p>
            </Card>
          </button>
        </div>

        <Card className="p-8 shadow-2xl border-none">
          <div className="space-y-6">
            {/* Primary Social Actions */}
            <div className="grid grid-cols-1 gap-4">
              <button 
                onClick={handleGoogleSignUp}
                className="flex items-center justify-center gap-3 w-full py-4 bg-white border border-gray-200 rounded-custom hover:bg-gray-50 transition-all shadow-sm hover:shadow-md group"
              >
                <div className="w-6 h-6 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-5 h-5">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                </div>
                <span className="text-base font-black text-gray-700">Sign up with Google</span>
              </button>
              
              <button 
                onClick={handleGoogleSignUp}
                className="flex items-center justify-center gap-3 w-full py-3 bg-secondary text-white rounded-custom hover:bg-gray-800 transition-all shadow-lg shadow-secondary/20"
              >
                <Code size={20} />
                <span className="text-sm font-bold">Sign up with Github</span>
              </button>
            </div>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase">
                <span className="bg-white px-4 text-gray-400 font-black tracking-widest">Or create a direct account</span>
              </div>
            </div>

            <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">First Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-custom outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-medium"
                  placeholder="John"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Last Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-custom outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-medium"
                  placeholder="Doe"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
                <input 
                  type="email" 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-custom outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-medium"
                  placeholder="john@example.com"
                />
              </div>

              {role === 'professional' && (
                <AnimatePresence>
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6"
                  >
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 ml-1">College/University</label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-custom outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-medium"
                        placeholder="e.g. IIT Delhi"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 ml-1">Graduation Year</label>
                      <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-custom outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-medium">
                        <option>2024</option>
                        <option>2025</option>
                        <option>2026</option>
                        <option>2027</option>
                      </select>
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Password</label>
                <input 
                  type="password" 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-custom outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-medium"
                  placeholder="Minimum 8 characters"
                />
              </div>
              
              <div className="md:col-span-2 space-y-4 pt-2">
                <div className="flex items-center gap-2 px-1">
                  <input type="checkbox" id="terms" className="rounded border-gray-300 text-primary focus:ring-primary" />
                  <label htmlFor="terms" className="text-xs font-bold text-gray-500 cursor-pointer">
                    I agree to the <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                  </label>
                </div>
                <Button className="w-full h-12 text-base shadow-xl shadow-primary/30">
                  Create Account
                </Button>
              </div>
            </form>
          </div>
        </Card>

        <p className="text-center mt-8 text-sm text-gray-500 font-medium">
          Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
