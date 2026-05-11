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
  Cpu,
  Zap,
  Activity
} from 'lucide-react';
import { Card, Badge, Button } from '../components/UI';
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

  if (isLoading && !user) return <div className="flex justify-center py-40 bg-black min-h-screen"><Loader2 className="animate-spin text-white" size={48} /></div>;

  return (
    <DashboardLayout user={user}>
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-12">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.4em]">Sector: Financial Relay</span>
          </div>
          <h1 className="text-6xl font-black tracking-tighter uppercase italic leading-none">INCOME <br />MANIFEST.</h1>
        </div>
        <button className="flex items-center gap-4 border border-white/10 px-10 py-5 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:border-white transition-all">
          <Download size={18} /> EXPORT_LEDGER
        </button>
      </header>

      {/* Financial Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-1 mb-16">
        <div className="md:col-span-1 p-1 border border-white/10 bg-white/5">
          <div className="p-12 border border-white/10 bg-white text-black h-full relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 italic">AVAILABLE_RELAY</p>
              <h2 className="text-7xl font-black italic tracking-tighter mb-12">${(user?.earnings || 0).toLocaleString()}.00</h2>
              <div className="flex flex-col sm:flex-row gap-6">
                <button className="bg-black text-white px-10 py-5 text-[10px] font-black uppercase tracking-widest hover:bg-black/90 transition-all">WITHDRAW_FUNDS</button>
                <div className="flex items-center gap-3 text-[8px] font-black uppercase tracking-widest text-black/40">
                  <Shield size={14} className="text-black" /> AI_SECURED_PAYOUT
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-1 p-1 border border-white/10 bg-white/5">
          <div className="p-10 border border-white/10 bg-black h-full flex flex-col justify-between">
            <div>
              <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-4 italic">AGGREGATE_YIELD (YTD)</p>
              <h3 className="text-4xl font-black italic tracking-tighter text-white mb-4">${((user?.earnings || 0) * 1.5).toLocaleString()}.00</h3>
              <p className="text-[9px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                <TrendingUp size={14} /> +12.4% PERFORMANCE_INDEX
              </p>
            </div>
            <div className="mt-12 h-16 w-full flex items-end gap-2 border-b border-white/5 pb-2">
              {[40, 70, 45, 90, 65, 80, 55, 95, 60, 85].map((h, i) => (
                <div key={i} className="flex-1 bg-white/10 hover:bg-white transition-all cursor-crosshair h-full flex items-end">
                   <div style={{ height: `${h}%` }} className="w-full bg-inherit" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="md:col-span-1 p-1 border border-white/10 bg-white/5">
          <div className="p-10 border border-white/10 bg-black h-full flex flex-col justify-between">
            <div>
              <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-4 italic">ESCROW_LOCK_VALUE</p>
              <h3 className="text-4xl font-black italic tracking-tighter text-white/20 mb-4">$0.00</h3>
              <p className="text-[9px] font-black text-white/10 uppercase tracking-widest">CURRENTLY_LOCKED_IN_PROTOCOL</p>
            </div>
            <div className="mt-12 flex items-center gap-6 p-6 border border-white/10 bg-white/[0.02]">
               <div className="p-3 border border-white/10 text-white/20">
                 <Wallet size={24} />
               </div>
               <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] leading-relaxed">
                 NEXT_RELAY_SCHEDULED_POST_DIRECTIVE_VERIFICATION.
               </p>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <section>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-8">
          <div className="flex items-center gap-6">
            <h3 className="text-4xl font-black tracking-tighter uppercase italic">RELAY_HISTORY.</h3>
            <div className="h-[1px] bg-white/10 w-32 hidden md:block" />
          </div>
          <div className="flex gap-4">
             <button className="text-[10px] font-black text-white px-8 py-3 bg-white/5 border border-white uppercase tracking-widest transition-all">ALL_ACTIVITY</button>
             <button className="text-[10px] font-black text-white/30 px-8 py-3 hover:text-white uppercase tracking-widest transition-all">PAYOUTS</button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="py-40 text-center border border-dashed border-white/10 bg-white/[0.02]">
            <p className="text-white/20 font-black uppercase tracking-[0.5em] text-[10px] italic">ZERO_TRANSACTION_SIGNALS_DETECTED_IN_CORE.</p>
          </div>
        </div>
      </section>
      
      <div className="mt-32 flex justify-center items-center gap-12 text-[9px] font-black uppercase tracking-[0.4em] text-white/10">
         <div className="flex items-center gap-2"><Shield size={14}/> ENCRYPTED_LEDGER</div>
         <div className="flex items-center gap-2"><Activity size={14}/> SkillScrumpt.in</div>
      </div>
    </DashboardLayout>
  );
}

function TransactionRow({ title, date, amount, type, status }) {
  const isIncome = type === 'income';
  return (
    <div className="p-1 border border-white/10 bg-white/5 hover:bg-white transition-all group">
      <div className="p-10 bg-black border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-10 group-hover:border-black">
        <div className="flex items-center gap-10">
          <div className={`w-16 h-16 border flex items-center justify-center font-black italic text-2xl ${
            isIncome ? 'border-white bg-white text-black' : 'border-white/10 text-white/20'
          }`}>
            {isIncome ? <ArrowDownLeft size={32} /> : <ArrowUpRight size={32} />}
          </div>
          <div>
            <h4 className="text-2xl font-black tracking-tight uppercase italic group-hover:text-black transition-colors">{title}</h4>
            <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.3em] mt-2 group-hover:text-black/40 transition-colors">SIG_DATE: {date}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-16 text-right">
          <div>
            <p className={`text-4xl font-black italic tracking-tighter group-hover:text-black transition-colors ${isIncome ? 'text-white' : 'text-white/40'}`}>{amount}</p>
            <div className="flex items-center justify-end gap-3 mt-2">
              <div className={`w-1.5 h-1.5 rounded-full ${status === 'Completed' ? 'bg-white group-hover:bg-black' : 'bg-white/20 animate-pulse'}`} />
              <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] group-hover:text-black/40 transition-colors">{status.toUpperCase()}</span>
            </div>
          </div>
          <ChevronRight size={32} className="text-white/10 group-hover:text-black transition-colors" />
        </div>
      </div>
    </div>
  );
}
