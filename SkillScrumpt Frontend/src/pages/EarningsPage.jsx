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
  Loader2
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

  if (isLoading && !user) return <div className="flex justify-center py-40"><Loader2 className="animate-spin text-primary" size={48} /></div>;

  return (
    <DashboardLayout user={user}>
      {/* Header */}
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-secondary">My Earnings</h1>
          <p className="text-gray-500 font-medium text-sm">Manage your income, view payouts, and track financial growth.</p>
        </div>
        <Button className="flex items-center gap-2 shadow-primary/20">
          <Download size={18} /> Export Report
        </Button>
      </header>

      {/* Financial Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <Card className="p-10 border-none bg-primary text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mr-24 -mt-24 group-hover:scale-150 transition-transform duration-1000" />
          <div className="relative z-10">
            <p className="text-xs font-black uppercase tracking-[0.2em] opacity-60 mb-2">Available Balance</p>
            <h2 className="text-6xl font-black mb-10">${(user?.earnings || 0).toLocaleString()}.00</h2>
            <div className="flex gap-4">
              <Button className="bg-white text-primary hover:bg-white/90 text-xs px-8 h-12">Withdraw Funds</Button>
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/80">
                <Shield size={14} className="text-white" /> AI Secured Payout
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-8 border-none shadow-xl flex flex-col justify-between bg-white">
          <div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Total Earned (YTD)</p>
            <h3 className="text-4xl font-bold text-secondary mb-2">${((user?.earnings || 0) * 1.5).toLocaleString()}.00</h3>
            <p className="text-xs font-bold text-green-500 flex items-center gap-1">
              <TrendingUp size={14} /> +12.4% from last period
            </p>
          </div>
          <div className="mt-10 h-16 w-full bg-gray-50 rounded-custom flex items-end px-3 pb-3 gap-1.5">
            {[40, 70, 45, 90, 65, 80, 55, 95, 60, 85].map((h, i) => (
              <div key={i} className="flex-1 bg-primary/20 rounded-t-sm group relative" style={{ height: `${h}%` }}>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-secondary text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                  ${h * 100}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-8 border-none shadow-xl flex flex-col justify-between bg-white">
          <div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Active Contracts Value</p>
            <h3 className="text-4xl font-bold text-secondary mb-2">$0.00</h3>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Currently locked in Escrow</p>
          </div>
          <div className="mt-10 flex items-center gap-5 p-5 bg-blue-50 rounded-custom">
             <div className="p-3 bg-primary/10 text-primary rounded-full">
               <Wallet size={24} />
             </div>
             <p className="text-xs font-medium text-gray-600 leading-relaxed">
               Next milestone payout is scheduled once active projects are completed.
             </p>
          </div>
        </Card>
      </div>

      {/* Transaction History */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-bold text-secondary">Transaction History</h3>
          <div className="flex gap-4">
             <button className="text-sm font-bold text-primary px-6 py-2.5 bg-primary/10 rounded-custom transition-all">All Activity</button>
             <button className="text-sm font-bold text-gray-400 px-6 py-2.5 hover:text-secondary hover:bg-white transition-all">Payouts</button>
          </div>
        </div>

        <div className="space-y-4">
          {/* Real transaction history would be mapped here */}
          <div className="p-20 text-center bg-white border-dashed border-2 border-gray-200 rounded-custom">
            <p className="text-gray-400 font-medium italic">No recent transactions to display.</p>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}

function TransactionRow({ title, date, amount, type, status }) {
  const isIncome = type === 'income';
  return (
    <div className="bg-white border border-border rounded-custom p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:border-primary transition-all group shadow-sm">
      <div className="flex items-center gap-8">
        <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
          isIncome ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
        }`}>
          {isIncome ? <ArrowDownLeft size={32} /> : <ArrowUpRight size={32} />}
        </div>
        <div>
          <h4 className="font-bold text-xl text-secondary group-hover:text-primary transition-colors">{title}</h4>
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">{date}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-12 text-right">
        <div>
          <p className={`text-2xl font-black ${isIncome ? 'text-green-600' : 'text-secondary'}`}>{amount}</p>
          <div className="flex items-center justify-end gap-2 mt-1">
            <div className={`w-2 h-2 rounded-full ${status === 'Completed' ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`} />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{status}</span>
          </div>
        </div>
        <button className="p-3 text-gray-200 hover:text-primary transition-colors">
          <ChevronRight size={28} />
        </button>
      </div>
    </div>
  );
}
