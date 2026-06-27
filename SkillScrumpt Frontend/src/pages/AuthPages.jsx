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
 { theme:"outline", size:"large", width:"100%", text:"continue_with" }
 );
 }
 }, []);

 return (
 <div className="h-screen flex flex-col items-center justify-center bg-[#FFF0E5] text-slate-900 selection:bg-[#F97316] selection:text-white py-4 px-4 relative overflow-hidden">
 {/* Background elements */}
 <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-50">
 <Asterisk className="absolute -top-20 -right-20 w-96 h-96 text-[#38BDF8]/10" />
 <Asterisk className="absolute -bottom-40 -left-40 w-[600px] h-[600px] text-[#F97316]/5" />
 </div>

 <motion.div
 initial={{ opacity: 0, y: 30 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
 className="w-full max-w-lg relative z-10"
 >
 <div className="text-center mb-4">
 <Link to="/" className="inline-block text-2xl font-bold tracking-tight mb-4 hover:scale-105 transition-transform text-slate-900">
 SkillScrumpt
 </Link>
 <h2 className="text-4xl font-bold tracking-tight mb-2 text-slate-900">WELCOME <br />BACK.</h2>
 <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">Secure Login Portal</p>
 </div>

 <div className="p-1">
 <div className="p-6 md:p-8 border border-white/50 bg-white/40 backdrop-blur-xl rounded-3xl shadow-xl shadow-slate-200/50">
 {error && (
 <motion.div 
 initial={{ opacity: 0, x: -10 }}
 animate={{ opacity: 1, x: 0 }}
 className="mb-8 p-4 border border-red-200 bg-red-50 text-red-600 text-xs font-bold uppercase tracking-wider flex items-center gap-3 rounded-xl"
 >
 <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
 {error}
 </motion.div>
 )}
 
 <form className="space-y-4" onSubmit={handleLogin}>
 <div className="space-y-4">
 <label className="text-sm font-bold uppercase tracking-wider text-slate-500 ml-1">Email Address</label>
 <input 
 type="email" 
 required
 value={formData.email}
 onChange={(e) => setFormData({ ...formData, email: e.target.value })}
 className="w-full px-4 py-3 bg-white/60 border border-white/50 focus:border-[#38BDF8] outline-none transition-all font-bold placeholder:text-slate-400 uppercase rounded-xl shadow-sm text-slate-900"
 placeholder="YOUR@EMAIL.COM"
 />
 </div>

 <div className="space-y-4">
 <div className="flex justify-between items-center px-1">
 <label className="text-sm font-bold uppercase tracking-wider text-slate-500">Password</label>
 <Link to="/forgot-password" size="sm" className="text-xs font-bold text-sky-600 hover:text-[#F97316] transition-colors underline">FORGOT PASSWORD?</Link>
 </div>
 <input 
 type="password" 
 required
 value={formData.password}
 onChange={(e) => setFormData({ ...formData, password: e.target.value })}
 className="w-full px-6 py-4 bg-white/60 border border-white/50 focus:border-[#38BDF8] outline-none transition-all font-bold placeholder:text-slate-400 rounded-xl shadow-sm text-slate-900"
 placeholder="••••••••"
 />
 </div>

 <div className="flex items-center gap-3 px-1">
 <input type="checkbox" id="remember" className="w-4 h-4 rounded-sm border-slate-300 text-[#F97316] focus:ring-[#F97316] cursor-pointer" />
 <label htmlFor="remember" className="text-sm font-bold text-slate-500 cursor-pointer hover:text-slate-900 transition-colors">Remember me</label>
 </div>

 <button 
 type="submit" 
 disabled={isLoading}
 className="w-full py-6 bg-[#F97316] text-white rounded-xl font-bold uppercase tracking-wider text-sm hover:bg-orange-600 transition-all flex items-center justify-center gap-4 group disabled:opacity-50 shadow-sm"
 >
 {isLoading ? <Loader2 className="animate-spin" size={20} /> : (
 <>
 Login <ArrowRight className="group-hover:translate-x-2 transition-transform" size={16} />
 </>
 )}
 </button>

 <div className="relative py-4">
 <div className="absolute inset-0 flex items-center">
 <div className="w-full border-t border-slate-200" />
 </div>
 <div className="relative flex justify-center">
 <span className="bg-[#FFF0E5] px-6 text-xs font-bold uppercase tracking-wider text-slate-400">Alternative Login</span>
 </div>
 </div>

 <div className="grid grid-cols-1 gap-4">
 <div id="googleBtn" className="w-full"></div>
 </div>
 </form>
 </div>
 </div>

 <p className="text-center mt-12 text-sm font-medium text-slate-500">
 New user? <Link to="/register" className="text-sky-600 font-bold hover:text-[#F97316] hover:underline ml-2 transition-colors">Sign Up</Link>
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
 <div className="h-screen flex flex-col items-center justify-center bg-[#FFF0E5] text-slate-900 selection:bg-[#F97316] selection:text-white py-4 px-4 relative overflow-hidden">
 <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-50">
 <Asterisk className="absolute top-1/4 -left-20 w-80 h-80 text-[#F97316]/10" />
 <div className="absolute bottom-1/4 -right-20 w-[400px] h-[400px] border border-[#38BDF8]/10 rotate-45" />
 </div>

 <motion.div
 initial={{ opacity: 0, scale: 0.98 }}
 animate={{ opacity: 1, scale: 1 }}
 transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
 className="w-full max-w-2xl relative z-10"
 >
 <div className="text-center mb-4">
 <Link to="/" className="inline-block text-2xl font-bold tracking-tight mb-4 hover:scale-105 transition-transform text-slate-900">
 SkillScrumpt
 </Link>
 <h2 className="text-4xl font-bold tracking-tight mb-2 text-slate-900">JOIN US.</h2>
 <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">Create your account to start</p>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
 <button type="button" className="text-left group relative" onClick={() => setRole('professional')}>
 <div className={`p-4 border rounded-2xl transition-all ${role === 'professional' ? 'bg-[#F97316] text-white border-[#F97316] shadow-sm' : 'bg-white/50 border-white/50 hover:border-[#F97316] text-slate-700'}`}>
 <Monitor size={24} className={role === 'professional' ? 'text-white' : 'text-slate-400'} />
 <h4 className="font-bold text-lg mt-2 mb-1">PROFESSIONAL.</h4>
 <p className="text-xs font-bold uppercase tracking-wider opacity-80">Verify Expertise</p>
 {role === 'professional' && (
 <div className="absolute top-6 right-6">
 <Star size={16} fill="white" />
 </div>
 )}
 </div>
 </button>
 
 <button type="button" className="text-left group relative" onClick={() => setRole('client')}>
 <div className={`p-8 border rounded-2xl transition-all ${role === 'client' ? 'bg-[#F97316] text-white border-[#F97316] shadow-sm' : 'bg-white/50 border-white/50 hover:border-[#F97316] text-slate-700'}`}>
 <Code size={24} className={role === 'client' ? 'text-white' : 'text-slate-400'} />
 <h4 className="font-bold text-lg mt-2 mb-1">EMPLOYER.</h4>
 <p className="text-xs font-bold uppercase tracking-wider opacity-80">Source Talent</p>
 {role === 'client' && (
 <div className="absolute top-6 right-6">
 <Star size={16} fill="white" />
 </div>
 )}
 </div>
 </button>
 </div>

 <div className="p-1">
 <div className="p-6 md:p-8 border border-white/50 bg-white/40 backdrop-blur-xl rounded-3xl shadow-xl shadow-slate-200/50">
 {error && (
 <motion.div 
 initial={{ opacity: 0, x: -10 }}
 animate={{ opacity: 1, x: 0 }}
 className="mb-8 p-4 border border-red-200 bg-red-50 text-red-600 text-xs font-bold uppercase tracking-wider rounded-xl"
 >
 {error}
 </motion.div>
 )}

 <form className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8" onSubmit={handleRegister}>
 <div className="space-y-4">
 <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">First Name</label>
 <input 
 type="text" required
 value={formData.firstName}
 onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
 className="w-full px-4 py-3 bg-white/60 border border-white/50 focus:border-[#38BDF8] outline-none transition-all font-bold placeholder:text-slate-400 uppercase rounded-xl shadow-sm text-slate-900"
 placeholder="EX: JOHN"
 />
 </div>
 <div className="space-y-4">
 <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Last Name</label>
 <input 
 type="text" required
 value={formData.lastName}
 onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
 className="w-full px-4 py-3 bg-white/60 border border-white/50 focus:border-[#38BDF8] outline-none transition-all font-bold placeholder:text-slate-400 uppercase rounded-xl shadow-sm text-slate-900"
 placeholder="EX: DOE"
 />
 </div>
 <div className="space-y-4 md:col-span-2">
 <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Email Communication</label>
 <input 
 type="email" required
 value={formData.email}
 onChange={(e) => setFormData({ ...formData, email: e.target.value })}
 className="w-full px-4 py-3 bg-white/60 border border-white/50 focus:border-[#38BDF8] outline-none transition-all font-bold placeholder:text-slate-400 uppercase rounded-xl shadow-sm text-slate-900"
 placeholder="EX: NAME@STUDENT.IN"
 />
 </div>

 {role === 'professional' && (
 <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-10">
 <div className="space-y-4">
 <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Academic Institution</label>
 <input 
 type="text" required
 value={formData.college}
 onChange={(e) => setFormData({ ...formData, college: e.target.value })}
 className="w-full px-4 py-3 bg-white/60 border border-white/50 focus:border-[#38BDF8] outline-none transition-all font-bold placeholder:text-slate-400 uppercase rounded-xl shadow-sm text-slate-900"
 placeholder="EX: IIT DELHI"
 />
 </div>
 <div className="space-y-4">
 <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Graduation Year</label>
 <select 
 value={formData.graduationYear}
 onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
 className="w-full px-6 py-4 bg-white/60 border border-white/50 focus:border-[#38BDF8] outline-none transition-all font-bold uppercase tracking-wider cursor-pointer rounded-xl text-slate-900 shadow-sm"
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
 <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Password</label>
 <input 
 type="password" required
 value={formData.password}
 onChange={(e) => setFormData({ ...formData, password: e.target.value })}
 className="w-full px-6 py-4 bg-white/60 border border-white/50 focus:border-[#38BDF8] outline-none transition-all font-bold placeholder:text-slate-400 rounded-xl shadow-sm text-slate-900"
 placeholder="MIN 8 CHARACTERS"
 />
 </div>
 
 <div className="md:col-span-2 space-y-8 pt-4">
 <div className="flex items-center gap-3 px-1">
 <input type="checkbox" required id="terms" className="w-4 h-4 rounded-sm border-slate-300 text-[#F97316] focus:ring-[#F97316] cursor-pointer" />
 <label htmlFor="terms" className="text-sm font-bold text-slate-500 cursor-pointer hover:text-slate-900 transition-colors leading-relaxed">
 I agree to the <Link to="/terms" className="text-sky-600 font-bold hover:text-[#F97316] underline">Terms</Link> and <Link to="/privacy" className="text-sky-600 font-bold hover:text-[#F97316] underline">Privacy Policy</Link>
 </label>
 </div>
 <button 
 type="submit"
 disabled={isLoading}
 className="w-full py-6 bg-[#F97316] text-white rounded-xl font-bold uppercase tracking-wider text-sm hover:bg-orange-600 transition-all flex items-center justify-center gap-4 group disabled:opacity-50 shadow-sm"
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

 <p className="text-center mt-12 text-sm font-medium text-slate-500">
 Already have an account? <Link to="/login" className="text-sky-600 font-bold hover:text-[#F97316] hover:underline ml-2 transition-colors">Login</Link>
 </p>

 <div className="mt-16 flex justify-center items-center gap-8 text-xs font-bold uppercase tracking-wider text-slate-400">
 <div className="flex items-center gap-2"><Lock size={12}/> SECURE</div>
 <div className="flex items-center gap-2"><Cpu size={12}/> AI_VERIFIED</div>
 <div className="flex items-center gap-2"><Zap size={12}/> SkillScrumpt</div>
 </div>
 </motion.div>
 </div>
 );
}
