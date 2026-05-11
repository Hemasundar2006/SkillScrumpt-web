import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Mail, ArrowRight, CheckCircle, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      await api.post('/users/forgot-password', { email });
      setIsSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Protocol failure. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden border border-slate-100"
      >
        <div className="absolute top-0 left-0 w-full h-1.5 bg-indigo-600" />
        
        <Link to="/login" className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 mb-8 transition-colors text-xs font-bold uppercase tracking-widest">
           <ChevronLeft size={16} /> Back to Login
        </Link>

        <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-8 shadow-sm">
          <Shield size={32} />
        </div>

        <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Recover Identity</h2>
        <p className="text-slate-500 text-sm font-medium mb-10">Enter your email to receive a secure reset link.</p>

        {isSent ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-10"
          >
             <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} />
             </div>
             <p className="text-lg font-bold text-slate-900 mb-2">Transmission Successful</p>
             <p className="text-sm text-slate-500 mb-8">Check your inbox for the recovery protocols.</p>
             <Link to="/login" className="text-indigo-600 font-bold text-sm hover:underline italic">Return to login interface</Link>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block ml-1">Work Email</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="email" 
                  required
                  placeholder="name@company.com"
                  className="w-full bg-slate-50 border border-slate-200 py-4 pl-14 pr-6 rounded-2xl text-sm font-medium focus:outline-none focus:border-indigo-500 transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {error && <p className="text-rose-500 text-xs font-bold italic ml-1">{error}</p>}

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 disabled:opacity-50 transition-all shadow-md flex items-center justify-center gap-3"
            >
              {isSubmitting ? 'Requesting...' : 'Initialize Recovery'}
              {!isSubmitting && <ArrowRight size={18} />}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
