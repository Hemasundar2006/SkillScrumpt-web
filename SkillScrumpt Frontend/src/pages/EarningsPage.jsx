import React from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Wallet, 
  Calendar, 
  Download, 
  Shield,
  ChevronRight
} from 'lucide-react';
import { Card, Badge, Button, GlassContainer } from '../components/UI';
import { Link } from 'react-router-dom';

export function StudentEarnings() {
  return (
    <div className="pt-24 pb-20 bg-[#f8f9fb] min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
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
          <Card className="p-8 border-none bg-primary text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000" />
            <div className="relative z-10">
              <p className="text-xs font-black uppercase tracking-[0.2em] opacity-60 mb-2">Available Balance</p>
              <h2 className="text-5xl font-black mb-6">$8,450.00</h2>
              <div className="flex gap-4">
                <Button className="bg-white text-primary hover:bg-white/90 text-xs px-6">Withdraw Now</Button>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/80">
                  <Shield size={14} /> Payout Secured
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-8 border-none shadow-xl flex flex-col justify-between">
            <div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Total Earned (YTD)</p>
              <h3 className="text-3xl font-bold text-secondary mb-1">$42,300.00</h3>
              <p className="text-xs font-bold text-green-500 flex items-center gap-1">
                <TrendingUp size={14} /> +12% from last month
              </p>
            </div>
            <div className="mt-8 h-12 w-full bg-gray-50 rounded-custom flex items-end px-2 pb-2 gap-1">
              {[40, 70, 45, 90, 65, 80, 55, 95].map((h, i) => (
                <div key={i} className="flex-1 bg-primary/20 rounded-t-sm group relative" style={{ height: `${h}%` }}>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-secondary text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    ${h * 100}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-8 border-none shadow-xl flex flex-col justify-between">
            <div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Active Projects Value</p>
              <h3 className="text-3xl font-bold text-secondary mb-1">$12,850.00</h3>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Locked in Escrow</p>
            </div>
            <div className="mt-8 flex items-center gap-4 p-4 bg-blue-50 rounded-custom">
               <div className="p-2 bg-primary/10 text-primary rounded-full">
                 <Wallet size={20} />
               </div>
               <p className="text-xs font-medium text-gray-600 leading-tight">
                 Your next milestone payout of <strong>$2,400</strong> is scheduled for <strong>May 12</strong>.
               </p>
            </div>
          </Card>
        </div>

        {/* Transaction History */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-secondary">Transaction History</h3>
            <div className="flex gap-4">
               <button className="text-sm font-bold text-primary px-4 py-2 bg-primary/5 rounded-custom transition-all">All</button>
               <button className="text-sm font-bold text-gray-400 px-4 py-2 hover:text-secondary transition-all">Income</button>
               <button className="text-sm font-bold text-gray-400 px-4 py-2 hover:text-secondary transition-all">Withdrawals</button>
            </div>
          </div>

          <div className="space-y-4">
            <TransactionRow 
              title="Milestone 2 - E-commerce Rebrand" 
              date="May 08, 2026" 
              amount="+$2,400.00" 
              type="income" 
              status="Completed" 
            />
            <TransactionRow 
              title="Withdrawal to Bank Account (****4290)" 
              date="May 05, 2026" 
              amount="-$5,000.00" 
              type="withdrawal" 
              status="Processing" 
            />
            <TransactionRow 
              title="Project Award Bonus - Verified Expert" 
              date="May 01, 2026" 
              amount="+$500.00" 
              type="income" 
              status="Completed" 
            />
            <TransactionRow 
              title="Milestone 1 - Web3 Dashboard" 
              date="Apr 28, 2026" 
              amount="+$1,800.00" 
              type="income" 
              status="Completed" 
            />
          </div>
        </section>
      </div>
    </div>
  );
}

function TransactionRow({ title, date, amount, type, status }) {
  const isIncome = type === 'income';
  return (
    <div className="bg-white border border-border rounded-custom p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-primary transition-all group">
      <div className="flex items-center gap-6">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
          isIncome ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
        }`}>
          {isIncome ? <ArrowDownLeft size={24} /> : <ArrowUpRight size={24} />}
        </div>
        <div>
          <h4 className="font-bold text-secondary group-hover:text-primary transition-colors">{title}</h4>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{date}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-10 text-right">
        <div>
          <p className={`text-lg font-black ${isIncome ? 'text-green-600' : 'text-secondary'}`}>{amount}</p>
          <div className="flex items-center justify-end gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${status === 'Completed' ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`} />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{status}</span>
          </div>
        </div>
        <button className="p-2 text-gray-200 hover:text-primary transition-colors">
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
