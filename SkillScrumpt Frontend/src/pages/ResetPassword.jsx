import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, ArrowRight, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    setIsSubmitting(true);
    setError('');
    try {
      await api.post(`/users/reset-password/${token}`, { password });
      setIsSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Protocol failure. Token may be expired.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden border border-slate-100"
      >
        <div className="absolute top-0 left-0 w-full h-1.5 bg-indigo-600" />

        <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-8 shadow-sm">
          <Lock size={32} />
        </div>

        <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">New Password</h2>
        <p className="text-slate-500 text-sm font-medium mb-10">Configure your new secure authentication credentials.</p>

        {isSuccess ? (
          <div className="text-center py-10">
             <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} />
             </div>
             <p className="text-lg font-bold text-slate-900 mb-2">Password Reset Successful</p>
             <p className="text-sm text-slate-500 mb-8">Redirecting to login interface...</p>
             <Link to="/login" className="text-indigo-600 font-bold text-sm hover:underline italic">Go to login now</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block ml-1">New Password</label>
              <div className="relative">
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                <input 
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 py-4 px-6 rounded-2xl text-sm font-medium text-slate-900 focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block ml-1">Confirm Password</label>
              <input 
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 py-4 px-6 rounded-2xl text-sm font-medium text-slate-900 focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-400"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            {error && <p className="text-rose-500 text-xs font-bold italic ml-1">{error}</p>}

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 disabled:opacity-50 transition-all shadow-md flex items-center justify-center gap-3"
            >
              {isSubmitting ? 'Updating...' : 'Update Password'}
              {!isSubmitting && <ArrowRight size={18} />}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
