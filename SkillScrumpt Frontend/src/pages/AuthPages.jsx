import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Mail, Lock, ArrowRight, Code, Monitor, Zap, Loader2, CheckCircle, ChevronRight, Star, Cpu } from 'lucide-react';
import { Button, Card } from '../components/UI';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const Asterisk = ({ className }) => (
  <svg viewBox="0 0 100 100" className={`asterisk-spin ${className}`} fill="currentColor">
    <path d="M50 0L54.3 35.7L85.4 14.6L64.3 45.7L100 50L64.3 54.3L85.4 85.4L54.3 64.3L50 100L45.7 64.3L14.6 85.4L35.7 54.3L0 50L35.7 45.7L14.6 14.6L45.7 35.7L50 0Z" />
  </svg>
);

export function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await api.post('/users/login', formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
      
      if (response.data.role === 'admin') {
        navigate('/dashboard/admin');
      } else if (response.data.role === 'professional') {
        navigate('/dashboard/student');
      } else {
        navigate('/dashboard/client');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'AUTHORIZATION_FAILED: INVALID_CREDENTIALS');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleResponse = async (response) => {
    setIsLoading(true);
    try {
      const res = await api.post('/users/google-login', { token: response.credential });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      
      if (res.data.role === 'admin') navigate('/dashboard/admin');
      else if (res.data.role === 'professional') navigate('/dashboard/student');
      else navigate('/dashboard/client');
    } catch (err) {
      setError('GOOGLE_AUTH_FAILED: ' + (err.response?.data?.message || 'Unknown Error'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    /* global google */
    if (window.google) {
      google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse
      });
      google.accounts.id.renderButton(
        document.getElementById("googleBtn"),
        { theme: "outline", size: "large", width: "100%", text: "continue_with" }
      );
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white selection:bg-white selection:text-black pt-20 px-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <Asterisk className="absolute -top-20 -right-20 w-96 h-96 text-white/10" />
        <Asterisk className="absolute -bottom-40 -left-40 w-[600px] h-[600px] text-white/5" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="text-center mb-12">
          <Link to="/" className="inline-block text-3xl font-black tracking-tighter uppercase italic mb-8 hover:scale-105 transition-transform">
            SkillScrumpt.in
          </Link>
          <h2 className="text-5xl font-black tracking-tighter mb-4">WELCOME <br />BACK.</h2>
          <p className="text-muted text-[10px] font-black uppercase tracking-[0.4em]">Secure Login Portal</p>
        </div>

        <div className="p-1 border border-white/10 bg-white/5">
          <div className="p-8 md:p-12 border border-white/10 bg-black">
            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-8 p-4 border border-white/20 bg-white/10 text-[10px] font-black uppercase tracking-widest flex items-center gap-3"
              >
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                {error}
              </motion.div>
            )}
            
            <form className="space-y-8" onSubmit={handleLogin}>
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted ml-1">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-6 py-4 bg-transparent border border-white/20 focus:border-white outline-none transition-all font-bold placeholder:text-white/20 uppercase"
                  placeholder="YOUR@EMAIL.COM"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted">Password</label>
                  <Link to="/forgot-password" size="sm" className="text-[10px] font-black text-muted hover:text-white transition-colors underline">FORGOT PASSWORD?</Link>
                </div>
                <input 
                  type="password" 
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-6 py-4 bg-transparent border border-white/20 focus:border-white outline-none transition-all font-bold placeholder:text-white/20"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex items-center gap-3 px-1">
                <input type="checkbox" id="remember" className="w-4 h-4 rounded-none bg-transparent border-white/20 text-white focus:ring-0 cursor-pointer" />
                <label htmlFor="remember" className="text-[10px] font-black uppercase tracking-widest text-muted cursor-pointer hover:text-white transition-colors">Remember me</label>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full py-6 bg-white text-black font-black uppercase tracking-[0.4em] text-xs hover:bg-white/90 transition-all flex items-center justify-center gap-4 group disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : (
                  <>
                    Login <ArrowRight className="group-hover:translate-x-2 transition-transform" size={16} />
                  </>
                )}
              </button>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-black px-6 text-[9px] font-black uppercase tracking-[0.5em] text-white/30 italic">Alternative Login</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div id="googleBtn" className="w-full"></div>
              </div>
            </form>
          </div>
        </div>

        <p className="text-center mt-12 text-[10px] font-black uppercase tracking-[0.2em] text-muted">
          New user? <Link to="/register" className="text-white hover:underline ml-2">Sign Up</Link>
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
  
  const [role, setRole] = useState(initialRole);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    college: '',
    graduationYear: '2024'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await api.post('/users/register', {
        ...formData,
        role
      });
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));

      const isUpgradeRequested = queryParams.get('upgrade') === 'true';
      
      if (role === 'professional') {
        navigate('/dashboard/student', { state: { showUpgrade: isUpgradeRequested } });
      } else {
        navigate('/dashboard/client');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'REGISTRATION_FAILED: SYSTEM_ERROR');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white selection:bg-white selection:text-black pt-32 pb-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <Asterisk className="absolute top-1/4 -left-20 w-80 h-80 text-white/10" />
        <div className="absolute bottom-1/4 -right-20 w-[400px] h-[400px] border border-white/5 rotate-45" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-2xl relative z-10"
      >
        <div className="text-center mb-16">
          <Link to="/" className="inline-block text-3xl font-black tracking-tighter uppercase italic mb-8 hover:scale-105 transition-transform">
            SkillScrumpt.in
          </Link>
          <h2 className="text-6xl font-black tracking-tighter mb-4">JOIN US.</h2>
          <p className="text-muted text-[10px] font-black uppercase tracking-[0.4em]">Create your account to start</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          <button type="button" className="text-left group relative" onClick={() => setRole('professional')}>
            <div className={`p-8 border transition-all ${role === 'professional' ? 'bg-white text-black border-white' : 'border-white/10 hover:border-white/30 text-white'}`}>
              <Monitor size={24} className={role === 'professional' ? 'text-black' : 'text-white/40'} />
              <h4 className="font-black text-xl mt-6 mb-2">PROFESSIONAL.</h4>
              <p className="text-[9px] font-black uppercase tracking-widest opacity-60">Verify Expertise</p>
              {role === 'professional' && (
                <div className="absolute top-6 right-6">
                  <Star size={16} fill="black" />
                </div>
              )}
            </div>
          </button>
          
          <button type="button" className="text-left group relative" onClick={() => setRole('client')}>
            <div className={`p-8 border transition-all ${role === 'client' ? 'bg-white text-black border-white' : 'border-white/10 hover:border-white/30 text-white'}`}>
              <Code size={24} className={role === 'client' ? 'text-black' : 'text-white/40'} />
              <h4 className="font-black text-xl mt-6 mb-2">EMPLOYER.</h4>
              <p className="text-[9px] font-black uppercase tracking-widest opacity-60">Source Talent</p>
              {role === 'client' && (
                <div className="absolute top-6 right-6">
                  <Star size={16} fill="black" />
                </div>
              )}
            </div>
          </button>
        </div>

        <div className="p-1 border border-white/10 bg-white/5">
          <div className="p-8 md:p-12 border border-white/10 bg-black">
            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-8 p-4 border border-white/20 bg-white/10 text-[10px] font-black uppercase tracking-widest"
              >
                {error}
              </motion.div>
            )}

            <form className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8" onSubmit={handleRegister}>
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted ml-1">First Name</label>
                <input 
                  type="text" required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-6 py-4 bg-transparent border border-white/20 focus:border-white outline-none transition-all font-bold placeholder:text-white/10 uppercase"
                  placeholder="EX: JOHN"
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted ml-1">Last Name</label>
                <input 
                  type="text" required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-6 py-4 bg-transparent border border-white/20 focus:border-white outline-none transition-all font-bold placeholder:text-white/10 uppercase"
                  placeholder="EX: DOE"
                />
              </div>
              <div className="space-y-4 md:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted ml-1">Email Communication</label>
                <input 
                  type="email" required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-6 py-4 bg-transparent border border-white/20 focus:border-white outline-none transition-all font-bold placeholder:text-white/10 uppercase"
                  placeholder="EX: NAME@STUDENT.IN"
                />
              </div>

              {role === 'professional' && (
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted ml-1">Academic Institution</label>
                    <input 
                      type="text" required
                      value={formData.college}
                      onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                      className="w-full px-6 py-4 bg-transparent border border-white/20 focus:border-white outline-none transition-all font-bold placeholder:text-white/10 uppercase"
                      placeholder="EX: IIT DELHI"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted ml-1">Graduation Year</label>
                    <select 
                      value={formData.graduationYear}
                      onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                      className="w-full px-6 py-4 bg-black border border-white/20 focus:border-white outline-none transition-all font-bold uppercase tracking-widest cursor-pointer rounded-full"
                    >
                      <option>2024</option>
                      <option>2025</option>
                      <option>2026</option>
                      <option>2027</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="space-y-4 md:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted ml-1">Password</label>
                <input 
                  type="password" required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-6 py-4 bg-transparent border border-white/20 focus:border-white outline-none transition-all font-bold placeholder:text-white/10"
                  placeholder="MIN 8 CHARACTERS"
                />
              </div>
              
              <div className="md:col-span-2 space-y-8 pt-4">
                <div className="flex items-center gap-3 px-1">
                  <input type="checkbox" required id="terms" className="w-4 h-4 rounded-none bg-transparent border-white/20 text-white focus:ring-0 cursor-pointer" />
                  <label htmlFor="terms" className="text-[9px] font-black uppercase tracking-widest text-muted cursor-pointer hover:text-white transition-colors leading-relaxed">
                    I agree to the <Link to="/terms" className="text-white underline">Terms</Link> and <Link to="/privacy" className="text-white underline">Privacy Policy</Link>
                  </label>
                </div>
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-6 bg-white text-black font-black uppercase tracking-[0.4em] text-xs hover:bg-white/90 transition-all flex items-center justify-center gap-4 group disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="animate-spin" size={20} /> : (
                    <>
                      Create Account <ChevronRight className="group-hover:translate-x-2 transition-transform" size={16} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        <p className="text-center mt-12 text-[10px] font-black uppercase tracking-[0.2em] text-muted">
          Already have an account? <Link to="/login" className="text-white hover:underline ml-2">Login</Link>
        </p>

        <div className="mt-16 flex justify-center items-center gap-8 text-[9px] font-black uppercase tracking-[0.3em] text-white/20">
           <div className="flex items-center gap-2"><Lock size={12}/> SECURE</div>
           <div className="flex items-center gap-2"><Cpu size={12}/> AI_VERIFIED</div>
           <div className="flex items-center gap-2"><Zap size={12}/> SkillScrumpt.in</div>
        </div>
      </motion.div>
    </div>
  );
}
