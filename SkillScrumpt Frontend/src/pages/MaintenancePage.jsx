import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Hammer, Clock, ArrowRight, Zap, Lock, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';

export function MaintenancePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white selection:bg-white selection:text-black p-6 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-1/4 -right-20 w-80 h-80 border border-white/5 rotate-12" />
        <div className="absolute bottom-1/4 -left-20 w-[400px] h-[400px] border border-white/5 -rotate-12" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl w-full text-center relative z-10"
      >
        <div className="flex items-center justify-center gap-4 mb-12">
          <div className="w-12 h-[1px] bg-white/20" />
          <div className="px-6 py-2 border border-white/20 text-[10px] font-black uppercase tracking-[0.4em] text-white/40">SYSTEM_UPGRADE_PENDING</div>
          <div className="w-12 h-[1px] bg-white/20" />
        </div>

        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-12 uppercase italic">
          SECURE <br />MAINTENANCE.
        </h1>
        
        <p className="text-xl text-white/30 font-black uppercase tracking-widest leading-relaxed mb-16 max-w-2xl mx-auto">
          SkillScrumpt.in is currently undergoing scheduled maintenance to upgrade our AI engine. The command center will be back online shortly.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-16 text-left">
          <div className="p-8 border border-white/10 bg-white/5">
             <div className="flex items-center gap-4 mb-4">
                <Clock className="text-white/40" size={20} />
                <span className="text-[10px] font-black uppercase tracking-widest">Expected Reset</span>
             </div>
             <p className="text-lg font-black italic">T-MINUS 45 MINUTES</p>
          </div>
          <div className="p-8 border border-white/10 bg-white/5">
             <div className="flex items-center gap-4 mb-4">
                <Shield className="text-white/40" size={20} />
                <span className="text-[10px] font-black uppercase tracking-widest">System Integrity</span>
             </div>
             <p className="text-lg font-black italic">VERIFIED_SECURE</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-10">
          <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.3em]">
             Follow us for real-time updates <span className="text-white">@SkillScrumptIn</span>
          </p>
          <Link to="/" className="text-[10px] font-black uppercase tracking-widest border-b border-white pb-1">
             BACK TO HOME
          </Link>
        </div>
        
        <div className="mt-24 flex justify-center items-center gap-8 text-[9px] font-black uppercase tracking-[0.4em] text-white/10">
           <div className="flex items-center gap-2"><Lock size={12}/> ENCRYPTED</div>
           <div className="flex items-center gap-2"><Cpu size={12}/> CORE_UPGRADE</div>
           <div className="flex items-center gap-2"><Zap size={12}/> SkillScrumpt.in</div>
        </div>
      </motion.div>
    </div>
  );
}
