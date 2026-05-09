import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Hammer, Clock, ArrowRight } from 'lucide-react';
import { Button } from '../components/UI';
import { Link } from 'react-router-dom';

export function MaintenancePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fb] px-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl animate-pulse" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full text-center relative z-10"
      >
        <div className="inline-flex p-4 bg-primary/10 text-primary rounded-[2rem] mb-10">
          <Hammer size={48} className="animate-bounce" />
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black text-secondary tracking-tight mb-8">
          Under <span className="text-primary">Maintenance</span>
        </h1>
        
        <p className="text-xl text-gray-500 font-medium leading-relaxed mb-12">
          SkillScrumpt is currently undergoing scheduled maintenance to upgrade our AI engine. 
          We'll be back online with elite projects and verified badges shortly.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
           <div className="bg-white p-6 rounded-custom border border-border flex items-center gap-4 text-left">
              <div className="p-3 bg-gray-50 rounded-custom text-primary"><Clock size={24} /></div>
              <div>
                 <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Expected Duration</p>
                 <p className="text-sm font-bold text-secondary">~ 2 Hours</p>
              </div>
           </div>
           <div className="bg-white p-6 rounded-custom border border-border flex items-center gap-4 text-left">
              <div className="p-3 bg-gray-50 rounded-custom text-primary"><Shield size={24} /></div>
              <div>
                 <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Admin Access</p>
                 <p className="text-sm font-bold text-secondary">Operational</p>
              </div>
           </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
           <Link to="/login">
             <Button className="px-12 h-14 text-base shadow-xl shadow-primary/20">Admin Login</Button>
           </Link>
           <Link to="/">
             <Button variant="outline" className="px-12 h-14 text-base">Refresh Page</Button>
           </Link>
        </div>

        <p className="mt-16 text-xs text-gray-400 font-bold uppercase tracking-widest">
           Follow us on Twitter for real-time updates @SkillScrumpt
        </p>
      </motion.div>
    </div>
  );
}
