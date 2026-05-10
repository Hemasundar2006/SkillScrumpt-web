import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Award, 
  BadgeCheck, 
  Share2, 
  Download, 
  ArrowRight, 
  Star, 
  TrendingUp,
  AlertTriangle,
  Clock,
  Briefcase,
  Check,
  CheckCircle
} from 'lucide-react';
import { Button, Card, Badge, GlassContainer } from '../components/UI';
import { Link, useLocation } from 'react-router-dom';

export function AssessmentResult() {
  const location = useLocation();
  const userStr = localStorage.getItem('user');
  const currentUser = userStr ? JSON.parse(userStr) : { name: 'Candidate' };
  
  const { score, proctoringScore, report } = location.state || { 
    score: 0, 
    proctoringScore: 100, 
    report: null 
  };

  const integrityGrade = proctoringScore >= 90 ? 'Excellent' : proctoringScore >= 75 ? 'Good' : 'Fair';
  const isPassed = score >= 70 && proctoringScore >= 60;

  return (
    <div className="pt-20 bg-[#f4f7fa] pb-24 min-h-screen font-inter">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header with Print/Share */}
        <div className="flex justify-between items-center mb-8">
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-400">Proctoring Audit Report</h2>
            <div className="flex gap-3">
              <Button variant="outline" className="text-xs bg-white border-gray-200"><Download size={14} className="mr-2" /> Export PDF</Button>
              <Button variant="outline" className="text-xs bg-white border-gray-200"><Share2 size={14} className="mr-2" /> Share</Button>
            </div>
        </div>

        {/* The Report Document */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-blue-900/5 overflow-hidden border border-white relative">
          
          {/* Certificate Header Banner */}
          <div className={`h-4 w-full ${isPassed ? 'bg-primary' : 'bg-red-500'}`} />
          
          <div className="p-12">
            <div className="flex flex-col md:flex-row justify-between gap-12 items-start mb-16">
              {/* Left: Candidate & Exam Details */}
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-8">
                   <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center text-white text-2xl font-black">
                     {(currentUser.name || 'C').charAt(0)}
                   </div>
                   <div>
                     <h1 className="text-3xl font-black text-secondary leading-none mb-1">{currentUser.name || 'Candidate'}</h1>
                     <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Candidate ID: {currentUser._id?.slice(-8).toUpperCase() || 'SS-USER'}</p>
                   </div>
                </div>

                <div className="flex flex-wrap gap-12 items-center">
                  <div className="grid grid-cols-2 gap-y-6 gap-x-12">
                    <DetailItem label="Assessment Name" value="Expert React Architect" />
                    <DetailItem label="Exam Date" value={new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} />
                    <DetailItem label="Session Duration" value="45 Minutes" />
                    <DetailItem label="Proctoring ID" value={report?.session_id?.slice(0, 8).toUpperCase() || 'LIVE-SESSION'} />
                  </div>

                  {/* PREMIUM VERIFIED STICKER */}
                  {isPassed && (
                    <motion.div 
                      initial={{ rotate: -10, scale: 0.5, opacity: 0 }}
                      animate={{ rotate: -5, scale: 1, opacity: 1 }}
                      className="relative group cursor-default"
                    >
                      <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full group-hover:bg-primary/40 transition-all" />
                      <div className="relative bg-white border-2 border-primary/30 px-6 py-3 rounded-full flex items-center gap-3 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
                         <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent opacity-50" />
                         <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white shadow-lg shadow-primary/30 flex-shrink-0">
                           <Check size={14} strokeWidth={4} />
                         </div>
                         <div className="flex flex-col">
                           <span className="text-[10px] font-black text-primary uppercase tracking-[0.15em] leading-none mb-1">Verified for: {currentUser.name || 'Candidate'}</span>
                           <span className="text-xs font-black text-secondary whitespace-nowrap uppercase tracking-wider">Expert React Architect</span>
                         </div>
                         <div className="absolute top-0 -left-full w-1/2 h-full bg-white/40 skew-x-12 animate-shine" />
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Right: Security Seal & Grade */}
              <div className="flex flex-col items-center p-8 bg-gray-50 rounded-[2rem] border border-gray-100 min-w-[240px]">
                <div className="relative mb-6">
                  <div className={`w-32 h-32 rounded-full border-8 flex items-center justify-center ${isPassed ? 'border-primary/20' : 'border-red-100'}`}>
                    <div className={`w-24 h-24 rounded-full flex items-center justify-center text-white shadow-xl ${isPassed ? 'bg-primary shadow-primary/30' : 'bg-red-500 shadow-red-500/30'}`}>
                      {isPassed ? <Award size={48} /> : <Shield size={48} />}
                    </div>
                  </div>
                  {isPassed && (
                    <motion.div 
                      className="absolute -top-2 -right-2 bg-yellow-400 text-white p-2 rounded-full shadow-lg border-2 border-white"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Star size={16} fill="white" />
                    </motion.div>
                  )}
                </div>
                <div className="text-center">
                   <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Integrity Grade</h4>
                   <span className={`text-3xl font-black ${isPassed ? 'text-primary' : 'text-red-500'}`}>{integrityGrade}</span>
                </div>
              </div>
            </div>

            {/* Performance Matrix */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <MetricCard 
                label="Technical Score" 
                value={`${score}%`} 
                sub="Based on 21 Questions" 
                color="text-secondary"
              />
              <MetricCard 
                label="Trust Score" 
                value={`${proctoringScore}%`} 
                sub="AI Behavior Analysis" 
                color={proctoringScore > 80 ? "text-primary" : "text-amber-500"}
              />
              <MetricCard 
                label="Result Status" 
                value={isPassed ? "PASSED" : "FAILED"} 
                sub="Verified Integrity" 
                color={isPassed ? "text-green-500" : "text-red-500"}
              />
            </div>

            {/* Violation Audit Log */}
            <section className="border-t border-gray-100 pt-12">
               <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-bold text-secondary flex items-center gap-3">
                    <Shield size={22} className="text-primary" /> Security Audit Log
                  </h3>
                  <Badge className="bg-gray-100 text-gray-500 border-none font-bold">
                    {report?.violations?.length || 0} Incident(s) Recorded
                  </Badge>
               </div>

               {report?.violations && report.violations.length > 0 ? (
                 <div className="space-y-3">
                    {report.violations.map((v, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="flex items-center gap-4">
                           <Badge variant={v.severity === 'critical' ? 'error' : 'warning'} className="uppercase text-[9px] w-20 justify-center">
                             {v.severity}
                           </Badge>
                           <span className="text-sm font-bold text-secondary">{v.message}</span>
                        </div>
                        <span className="text-[10px] font-mono text-gray-400">{new Date(v.timestamp).toLocaleTimeString()}</span>
                      </div>
                    ))}
                 </div>
               ) : (
                 <div className="py-12 bg-green-50/50 rounded-[2rem] border border-dashed border-green-200 text-center">
                    <CheckCircle className="text-green-500 mx-auto mb-3" size={32} />
                    <p className="text-green-700 font-bold">Pristine Session: No security violations detected.</p>
                 </div>
               )}
            </section>

            {/* Footer Seal */}
            <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                     <Shield size={24} />
                   </div>
                   <p className="text-xs text-gray-400 font-bold max-w-[200px]">
                     This document is electronically verified and tamper-proof. ID: {report?.session_id || 'N/A'}
                   </p>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mb-1">Verified By</p>
                   <p className="text-lg font-black text-secondary">SkillScrumpt <span className="text-primary">AI PROCTOR</span></p>
                </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <Link to="/dashboard/student">
            <Button variant="outline" className="px-12 py-6 rounded-full border-gray-300">Back to My Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div>
      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</h4>
      <p className="text-sm font-bold text-secondary">{value}</p>
    </div>
  );
}

function MetricCard({ label, value, sub, color }) {
  return (
    <div className="p-6 bg-gray-50/50 rounded-3xl border border-gray-100 text-center">
      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{label}</h4>
      <p className={`text-4xl font-black mb-1 ${color}`}>{value}</p>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{sub}</p>
    </div>
  );
}

function StatRow({ label, value, color = "text-secondary" }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">{label}</span>
      <span className={`text-lg font-black ${color}`}>{value}</span>
    </div>
  );
}

function NextStepCard({ icon: Icon, title, desc, link }) {
  return (
    <Link to={link} className="group p-6 bg-gray-50 rounded-custom hover:bg-primary transition-all">
      <div className="text-primary group-hover:text-white mb-4 transition-colors">
        <Icon size={24} />
      </div>
      <h4 className="font-bold text-secondary group-hover:text-white transition-colors mb-2">{title}</h4>
      <p className="text-xs text-gray-500 group-hover:text-white/70 transition-colors leading-relaxed">{desc}</p>
    </Link>
  );
}
