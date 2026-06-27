import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Hammer, Clock, ArrowRight, Zap, Lock, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';

export function MaintenancePage() {
 return (
 <div className="min-h-screen flex items-center justify-center bg-[#FFF0E5] text-slate-900 selection:bg-[#F97316] selection:text-white p-6 relative overflow-hidden">
 {/* Background elements */}
 <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
 <div className="absolute top-1/4 -right-20 w-80 h-80 border border-slate-200 rotate-12" />
 <div className="absolute bottom-1/4 -left-20 w-[400px] h-[400px] border border-slate-200 -rotate-12" />
 </div>

 <motion.div 
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.8 }}
 className="max-w-3xl w-full text-center relative z-10"
 >
 <div className="flex items-center justify-center gap-4 mb-8">
 <div className="w-12 h-[1px] bg-slate-300" />
 <div className="px-4 py-1.5 border border-slate-300 text-xs font-semibold uppercase tracking-wide text-slate-500 rounded-full">System Upgrade Pending</div>
 <div className="w-12 h-[1px] bg-slate-300" />
 </div>

 <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">
 Scheduled <br /><span className="text-[#F97316]">Maintenance.</span>
 </h1>
 
 <p className="text-lg text-slate-600 font-medium leading-relaxed mb-12 max-w-2xl mx-auto">
 SkillScrumpt.in is currently undergoing scheduled maintenance to upgrade our infrastructure. We will be back online shortly.
 </p>

 <div className="grid md:grid-cols-2 gap-6 mb-16 text-left">
 <div className="p-8 border border-slate-200 bg-white rounded-3xl shadow-sm">
 <div className="flex items-center gap-3 mb-3">
 <Clock className="text-[#F97316]" size={20} />
 <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Expected Reset</span>
 </div>
 <p className="text-lg font-bold text-slate-900">~ 45 Minutes</p>
 </div>
 <div className="p-8 border border-slate-200 bg-white rounded-3xl shadow-sm">
 <div className="flex items-center gap-3 mb-3">
 <Shield className="text-[#F97316]" size={20} />
 <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">System Integrity</span>
 </div>
 <p className="text-lg font-bold text-emerald-600">Secure</p>
 </div>
 </div>

 <div className="flex flex-col sm:flex-row justify-center items-center gap-8">
 <p className="text-sm text-slate-500 font-medium">
 Follow us for real-time updates <span className="text-slate-900 font-semibold cursor-pointer">@SkillScrumptIn</span>
 </p>
 <Link to="/" className="text-sm font-semibold text-[#F97316] hover:text-orange-600 border-b border-[#F97316] hover:border-orange-600 transition-colors pb-0.5">
 Return to Home
 </Link>
 </div>
 
 <div className="mt-20 flex justify-center items-center gap-6 text-xs font-medium text-slate-400">
 <div className="flex items-center gap-1.5"><Lock size={14}/> Encrypted</div>
 <div className="flex items-center gap-1.5"><Cpu size={14}/> Core Upgrade</div>
 <div className="flex items-center gap-1.5"><Zap size={14}/> SkillScrumpt.in</div>
 </div>
 </motion.div>
 </div>
 );
}
