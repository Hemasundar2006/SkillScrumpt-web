import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Wallet, 
  Download, 
  Shield,
  ChevronRight,
  Loader2,
  Activity
} from 'lucide-react';
import { DashboardLayout } from '../layout/DashboardLayout';
import api from '../utils/api';

export function StudentEarnings() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const savedUser = JSON.parse(localStorage.getItem('user'));
      const response = await api.get(`/users/profile/${savedUser._id || savedUser.id}`);
      setUser(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !user) {
    const cachedUserStr = localStorage.getItem('user');
    const cachedUser = cachedUserStr ? JSON.parse(cachedUserStr) : null;
    return (
      <DashboardLayout user={cachedUser}>
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="animate-spin text-[#38BDF8]" size={48} />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout user={user}>
      <div className="max-w-[1400px] mx-auto w-full font-sans text-[#1E293B]">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-2 h-2 bg-[#F97316] rounded-full animate-pulse shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
              <span className="text-[10px] font-bold text-[#1E293B]/50 uppercase tracking-wider">Financial Overview</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-[#1E293B] leading-tight">Earnings & Transactions</h1>
          </motion.div>
          <motion.button 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 bg-white border border-[#38BDF8]/20 px-6 py-3 rounded-[12px] text-sm font-bold text-[#1E293B] hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(56,189,248,0.15)] transition-all"
          >
            <Download size={18} className="text-[#38BDF8]" /> Export Statement
          </motion.button>
        </header>

        {/* Financial Highlights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Available Balance */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="lg:col-span-1 bg-[#1E293B] rounded-[24px] p-8 relative overflow-hidden group shadow-[0_8px_30px_rgba(30,41,59,0.1)] flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#38BDF8] opacity-10 rounded-full blur-[60px] translate-x-1/2 -translate-y-1/2" />
            <div className="relative z-10">
              <p className="text-[11px] font-bold text-white/50 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Wallet size={16} className="text-[#38BDF8]" /> Available Balance
              </p>
              <h2 className="text-5xl font-bold tracking-tight text-white mb-8">${(user?.earnings || 0).toLocaleString()}.00</h2>
            </div>
            <button className="w-full relative z-10 bg-[#F97316] text-white px-6 py-4 rounded-[12px] text-sm font-bold hover:bg-[#EA580C] transition-all hover:-translate-y-1 shadow-[0_8px_20px_rgba(249,115,22,0.3)]">
              Withdraw Funds
            </button>
          </motion.div>

          {/* Total Earnings */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="lg:col-span-1 bg-white rounded-[24px] p-8 border border-[#38BDF8]/10 shadow-[0_4px_20px_rgba(56,189,248,0.05)] flex flex-col justify-between group hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(56,189,248,0.1)] transition-all"
          >
            <div>
              <p className="text-[11px] font-bold text-[#1E293B]/50 uppercase tracking-wider mb-4">Total Earnings (YTD)</p>
              <h3 className="text-3xl font-bold tracking-tight text-[#1E293B] mb-3">${((user?.earnings || 0) * 1.5).toLocaleString()}.00</h3>
              <div className="text-[10px] font-bold text-emerald-600 flex items-center gap-1.5 bg-emerald-50 w-max px-3 py-1.5 rounded-[8px] uppercase tracking-wider">
                <TrendingUp size={14} /> +12.4% vs last month
              </div>
            </div>
            <div className="mt-8 h-16 w-full flex items-end gap-1.5 border-b border-[#E0F2FE] pb-2">
              {[40, 70, 45, 90, 65, 80, 55, 95, 60, 85].map((h, i) => (
                <div key={i} className="flex-1 bg-[#E0F2FE] hover:bg-[#38BDF8] transition-colors cursor-crosshair h-full flex items-end rounded-t-sm group/bar">
                  <div style={{ height: `${h}%` }} className="w-full bg-[#38BDF8] group-hover/bar:bg-[#38BDF8] rounded-t-sm transition-all" />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Escrow */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="lg:col-span-1 bg-white rounded-[24px] p-8 border border-[#38BDF8]/10 shadow-[0_4px_20px_rgba(56,189,248,0.05)] flex flex-col justify-between group hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(56,189,248,0.1)] transition-all"
          >
            <div>
              <p className="text-[11px] font-bold text-[#1E293B]/50 uppercase tracking-wider mb-4">In Escrow</p>
              <h3 className="text-3xl font-bold tracking-tight text-[#1E293B]/40 mb-3">$0.00</h3>
              <p className="text-[11px] font-bold text-[#1E293B]/50 uppercase tracking-wider">Funds secured for active projects</p>
            </div>
            <div className="mt-8 flex items-start gap-4 p-4 rounded-[16px] bg-[#FFF0E5] border border-[#F97316]/20">
              <div className="w-8 h-8 rounded-full bg-[#F97316] text-white flex items-center justify-center shrink-0 shadow-sm">
                <Shield size={16} />
              </div>
              <p className="text-xs font-medium text-[#1E293B]/80 leading-relaxed">
                Funds are automatically released to your available balance upon client approval.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Transaction History */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-white rounded-[24px] border border-[#38BDF8]/10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-8 md:p-10"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-6 border-b border-slate-100 pb-6">
            <h3 className="text-2xl font-bold tracking-tight text-[#1E293B]">Recent Transactions</h3>
            <div className="flex gap-2">
              <button className="text-xs font-bold text-white px-6 py-2.5 bg-[#38BDF8] rounded-[10px] shadow-[0_4px_12px_rgba(56,189,248,0.25)] hover:-translate-y-0.5 transition-all">All Activity</button>
              <button className="text-xs font-bold text-[#1E293B]/60 px-6 py-2.5 bg-[#E0F2FE]/50 hover:bg-[#E0F2FE] hover:text-[#38BDF8] rounded-[10px] transition-all">Payouts</button>
              <button className="text-xs font-bold text-[#1E293B]/60 px-6 py-2.5 bg-[#E0F2FE]/50 hover:bg-[#E0F2FE] hover:text-[#38BDF8] rounded-[10px] transition-all">Earnings</button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="py-20 text-center">
              <div className="w-16 h-16 bg-[#E0F2FE] text-[#38BDF8] rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Activity size={24} />
              </div>
              <p className="text-[#1E293B] font-bold text-base">No recent transactions found.</p>
              <p className="text-[#1E293B]/50 font-medium text-sm mt-2">Complete projects to see your earnings here.</p>
            </div>
          </div>
        </motion.section>
      </div>
    </DashboardLayout>
  );
}

function TransactionRow({ title, date, amount, type, status }) {
  const isIncome = type === 'income';
  return (
    <div className="p-6 bg-white border border-[#38BDF8]/10 rounded-[16px] hover:border-[#38BDF8]/30 hover:shadow-[0_8px_20px_rgba(56,189,248,0.08)] hover:-translate-y-0.5 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer">
      <div className="flex items-center gap-6">
        <div className={`w-12 h-12 rounded-[12px] flex items-center justify-center shadow-sm ${
          isIncome ? 'bg-emerald-50 text-emerald-600' : 'bg-[#FFF0E5] text-[#F97316]'
        }`}>
          {isIncome ? <ArrowDownLeft size={24} /> : <ArrowUpRight size={24} />}
        </div>
        <div>
          <h4 className="text-base font-bold text-[#1E293B]">{title}</h4>
          <p className="text-xs text-[#1E293B]/50 font-medium mt-1">{date}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-8 md:text-right">
        <div>
          <p className={`text-xl font-bold tracking-tight ${isIncome ? 'text-[#1E293B]' : 'text-[#1E293B]/60'}`}>{amount}</p>
          <div className="flex items-center md:justify-end gap-2 mt-1">
            <div className={`w-2 h-2 rounded-full ${status === 'Completed' ? 'bg-emerald-500' : 'bg-[#F97316] animate-pulse'}`} />
            <span className="text-[10px] font-bold text-[#1E293B]/50 uppercase tracking-wider">{status}</span>
          </div>
        </div>
        <ChevronRight size={20} className="text-[#38BDF8]/30" />
      </div>
    </div>
  );
}
