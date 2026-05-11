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

  if (isLoading && !user) return <div className="flex justify-center py-40 bg-slate-50 min-h-screen"><Loader2 className="animate-spin text-slate-400" size={48} /></div>;

  return (
    <DashboardLayout user={user}>
      <div className="bg-slate-50 min-h-screen pb-24 font-sans px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto pt-8">
          {/* Header */}
          <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse shadow-sm" />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Financial Overview</span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 leading-tight">Earnings & <br />Transactions</h1>
            </div>
            <button className="flex items-center gap-3 bg-white border border-slate-200 px-6 py-3 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
              <Download size={18} className="text-indigo-600" /> Export Statement
            </button>
          </header>

          {/* Financial Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="md:col-span-1 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Wallet size={16} className="text-indigo-500" /> Available Balance</p>
                  <h2 className="text-5xl font-bold tracking-tighter text-slate-900 mb-8">${(user?.earnings || 0).toLocaleString()}.00</h2>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                  <button className="w-full bg-slate-900 text-white px-6 py-4 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-md">Withdraw Funds</button>
                </div>
              </div>
            </div>

            <div className="md:col-span-1 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Total Earnings (YTD)</p>
                <h3 className="text-3xl font-bold tracking-tight text-slate-900 mb-3">${((user?.earnings || 0) * 1.5).toLocaleString()}.00</h3>
                <p className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 bg-emerald-50 w-max px-3 py-1 rounded-lg">
                  <TrendingUp size={14} /> +12.4% vs last month
                </p>
              </div>
              <div className="mt-8 h-20 w-full flex items-end gap-1.5 border-b border-slate-100 pb-2">
                {[40, 70, 45, 90, 65, 80, 55, 95, 60, 85].map((h, i) => (
                  <div key={i} className="flex-1 bg-indigo-100 hover:bg-indigo-500 transition-colors cursor-crosshair h-full flex items-end rounded-t-sm group">
                     <div style={{ height: `${h}%` }} className="w-full bg-indigo-200 group-hover:bg-indigo-600 rounded-t-sm transition-all" />
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-1 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">In Escrow</p>
                <h3 className="text-3xl font-bold tracking-tight text-slate-400 mb-3">$0.00</h3>
                <p className="text-xs font-bold text-slate-500">Funds secured for active projects</p>
              </div>
              <div className="mt-8 flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                 <div className="p-2 bg-white rounded-lg shadow-sm text-amber-500 shrink-0">
                   <Shield size={18} />
                 </div>
                 <p className="text-xs font-medium text-slate-600 leading-relaxed">
                   Funds are automatically released to your available balance upon client approval of milestones.
                 </p>
              </div>
            </div>
          </div>

          {/* Transaction History */}
          <section className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-8 md:p-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6 border-b border-slate-100 pb-6">
              <h3 className="text-2xl font-bold tracking-tight text-slate-900">Recent Transactions</h3>
              <div className="flex gap-2">
                 <button className="text-xs font-bold text-slate-700 px-6 py-2.5 bg-slate-100 rounded-xl transition-all">All Activity</button>
                 <button className="text-xs font-bold text-slate-500 px-6 py-2.5 hover:bg-slate-50 rounded-xl transition-all">Payouts</button>
                 <button className="text-xs font-bold text-slate-500 px-6 py-2.5 hover:bg-slate-50 rounded-xl transition-all">Earnings</button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="py-24 text-center">
                <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
                  <Activity size={24} />
                </div>
                <p className="text-slate-500 font-bold text-sm">No recent transactions found.</p>
                <p className="text-slate-400 text-xs mt-2">Complete projects to see your earnings here.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}

function TransactionRow({ title, date, amount, type, status }) {
  const isIncome = type === 'income';
  return (
    <div className="p-6 bg-white border border-slate-100 rounded-2xl hover:border-slate-300 hover:shadow-sm transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer">
      <div className="flex items-center gap-6">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
          isIncome ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-600'
        }`}>
          {isIncome ? <ArrowDownLeft size={24} /> : <ArrowUpRight size={24} />}
        </div>
        <div>
          <h4 className="text-base font-bold text-slate-900">{title}</h4>
          <p className="text-xs text-slate-500 font-medium mt-1">{date}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-8 md:text-right">
        <div>
          <p className={`text-xl font-bold tracking-tight ${isIncome ? 'text-slate-900' : 'text-slate-600'}`}>{amount}</p>
          <div className="flex items-center md:justify-end gap-2 mt-1">
            <div className={`w-2 h-2 rounded-full ${status === 'Completed' ? 'bg-emerald-500' : 'bg-amber-400 animate-pulse'}`} />
            <span className="text-xs font-bold text-slate-500 capitalize">{status}</span>
          </div>
        </div>
        <ChevronRight size={20} className="text-slate-300" />
      </div>
    </div>
  );
}
