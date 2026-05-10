import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Mail, Lock, ArrowRight, Code, Monitor, Zap, Loader2, CheckCircle } from 'lucide-react';
import { Button, Card, GlassContainer } from '../components/UI';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../utils/api';

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
      setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 pb-12 px-4 bg-[#f8f9fb] relative overflow-hidden">
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
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-custom text-xs font-bold border border-red-100 animate-shake">
              {error}
            </div>
          )}
          
          <form className="space-y-5" onSubmit={handleLogin}>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-custom outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-medium"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 px-1">
              <input type="checkbox" id="remember" className="rounded border-gray-300 text-primary focus:ring-primary" />
              <label htmlFor="remember" className="text-xs font-bold text-gray-500 cursor-pointer">Remember me for 30 days</label>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-12 text-base shadow-xl shadow-primary/30 flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Sign In'}
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
              <button type="button" className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-custom hover:bg-gray-50 transition-colors">
                <Monitor size={18} />
                <span className="text-sm font-bold text-gray-700">Google</span>
              </button>
              <button type="button" className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-custom hover:bg-gray-50 transition-colors">
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
        navigate('/dashboard/client', { state: { showUpgrade: isUpgradeRequested } });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check your information.');
    } finally {
      setIsLoading(false);
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <button type="button" className="text-left group relative" onClick={() => setRole('professional')}>
            <Card className={`h-full border-2 transition-all p-6 bg-white ${role === 'professional' ? 'border-primary shadow-xl shadow-primary/10' : 'border-transparent hover:border-primary/50'}`}>
              <div className={`w-12 h-12 rounded-custom flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${role === 'professional' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-primary/10 text-primary'}`}>
                <Monitor size={24} />
              </div>
              <h4 className={`font-bold text-lg mb-1 ${role === 'professional' ? 'text-primary' : 'text-secondary'}`}>I'm a Professional</h4>
              <p className="text-[10px] text-primary font-black uppercase tracking-widest mb-2 opacity-80">Get Verified & Retain 100% Pay</p>
              <p className="text-[11px] text-gray-500 font-medium leading-relaxed">Showcase your skills through AI-proctored tests and earn verified badges.</p>
              {role === 'professional' && (
                <div className="absolute top-4 right-4 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center">
                  <CheckCircle size={14} />
                </div>
              )}
            </Card>
          </button>
          
          <button type="button" className="text-left group relative" onClick={() => setRole('client')}>
            <Card className={`h-full border-2 transition-all p-6 bg-white ${role === 'client' ? 'border-secondary shadow-xl shadow-secondary/10' : 'border-transparent hover:border-secondary/50'}`}>
              <div className={`w-12 h-12 rounded-custom flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${role === 'client' ? 'bg-secondary text-white shadow-lg shadow-secondary/20' : 'bg-secondary/10 text-secondary'}`}>
                <Code size={24} />
              </div>
              <h4 className={`font-bold text-lg mb-1 ${role === 'client' ? 'text-secondary' : 'text-secondary'}`}>I'm a Client</h4>
              <p className="text-[10px] text-secondary font-black uppercase tracking-widest mb-2 opacity-80">Hire Top 1% Verified Talent</p>
              <p className="text-[11px] text-gray-500 font-medium leading-relaxed">Access a pool of pre-vetted professionals with proctored assessment data.</p>
              {role === 'client' && (
                <div className="absolute top-4 right-4 w-6 h-6 bg-secondary text-white rounded-full flex items-center justify-center">
                  <CheckCircle size={14} />
                </div>
              )}
            </Card>
          </button>
        </div>

        <Card className="p-8 shadow-2xl border-none">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-custom text-xs font-bold border border-red-100">
              {error}
            </div>
          )}

          <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleRegister}>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">First Name</label>
              <input 
                type="text" required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-custom outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-medium"
                placeholder="John"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Last Name</label>
              <input 
                type="text" required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-custom outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-medium"
                placeholder="Doe"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
              <input 
                type="email" required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                      type="text" required
                      value={formData.college}
                      onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-custom outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-medium"
                      placeholder="e.g. IIT Delhi"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Graduation Year</label>
                    <select 
                      value={formData.graduationYear}
                      onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-custom outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-medium"
                    >
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
                type="password" required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-custom outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-medium"
                placeholder="Minimum 8 characters"
              />
            </div>
            
            <div className="md:col-span-2 space-y-4 pt-2">
              <div className="flex items-center gap-2 px-1">
                <input type="checkbox" required id="terms" className="rounded border-gray-300 text-primary focus:ring-primary" />
                <label htmlFor="terms" className="text-xs font-bold text-gray-500 cursor-pointer">
                  I agree to the <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                </label>
              </div>
              <Button 
                type="submit"
                disabled={isLoading}
                className="w-full h-12 text-base shadow-xl shadow-primary/30 flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Create Account'}
              </Button>
            </div>
          </form>
        </Card>

        <p className="text-center mt-8 text-sm text-gray-500 font-medium">
          Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
