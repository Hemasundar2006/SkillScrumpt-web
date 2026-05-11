import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Monitor, Shield, Zap, Video, Loader2, Play, CheckCircle, ArrowRight, Star, Clock } from 'lucide-react';
import { Button, Card, Badge } from '../components/UI';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { DashboardLayout } from '../layout/DashboardLayout';

export const AssessmentsPage = () => {
  const navigate = useNavigate();
  const [showVideoPreview, setShowVideoPreview] = useState(false);
  const [assessments, setAssessments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchAssessments();
    const savedUser = JSON.parse(localStorage.getItem('user'));
    setUser(savedUser);
  }, []);

  const fetchAssessments = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/assessments');
      setAssessments(response.data);
    } catch (err) {
      console.error('Error fetching assessments:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getIcon = (title) => {
    const t = title.toLowerCase();
    if (t.includes('react')) return Zap;
    if (t.includes('python')) return Monitor;
    return Shield;
  };

  return (
    <DashboardLayout user={user}>
      <div className="pb-32">
        <div className="max-w-[1400px] mx-auto pt-12">
          <header className="flex flex-col lg:flex-row justify-between items-end mb-20 gap-12 pb-12 border-b border-white/10">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.4em]">Sector: Verification Engine</span>
              </div>
              <h1 className="text-6xl font-black tracking-tighter uppercase italic mb-8">
                PROVE EXPERTISE. <br />
                <span className="text-white/30">SECURE THE BADGE.</span>
              </h1>
              <p className="text-white/40 text-[11px] font-bold uppercase tracking-widest leading-relaxed max-w-xl">
                Execute proctored assessments engineered by global leads. <br />
                Every successful cycle generates a permanent cryptographic badge.
              </p>
            </div>
            
            <button 
              onClick={() => setShowVideoPreview(true)}
              className="px-10 py-5 border border-white text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center gap-4 group"
            >
              <Video size={18} />
              Protocol Demo <ArrowRight className="group-hover:translate-x-2 transition-transform" size={16} />
            </button>
          </header>

          {isLoading ? (
            <div className="flex justify-center py-40">
              <Loader2 className="animate-spin text-white/20" size={64} />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {assessments.length > 0 ? assessments.map((test) => {
                const Icon = getIcon(test.title);
                return (
                  <motion.div
                    key={test._id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="p-1 border border-white/10 hover:border-white/40 transition-all bg-white/5 group"
                  >
                    <div className="p-10 border border-white/10 flex flex-col h-full bg-black">
                      <div className="w-14 h-14 border border-white/10 flex items-center justify-center text-white/20 group-hover:bg-white group-hover:text-black transition-all mb-10">
                        <Icon size={24} />
                      </div>
                      
                      <h3 className="text-2xl font-black tracking-tight uppercase italic mb-4 group-hover:text-white transition-colors">{test.title}</h3>
                      
                      <div className="flex items-center gap-6 mb-12">
                        <div className="px-3 py-1 border border-white/10 text-[9px] font-black uppercase tracking-widest text-white/40">
                          {test.difficulty}
                        </div>
                        <span className="text-[10px] text-white/20 font-black uppercase tracking-widest flex items-center gap-2">
                          <Clock size={14} /> {test.duration} MIN
                        </span>
                      </div>
                      
                      <div className="mt-auto pt-10 border-t border-white/5">
                        <button 
                          onClick={() => navigate(`/assessments/setup/${test._id}`)} 
                          className="w-full py-5 bg-white text-black font-black uppercase tracking-widest text-[11px] hover:bg-white/80 transition-all flex items-center justify-center gap-3 group/btn"
                        >
                          INITIATE TASK <Lock size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              }) : (
                <div className="col-span-3 py-40 text-center border border-dashed border-white/10">
                  <p className="text-white/20 font-black uppercase tracking-widest text-xs">No active assessments found in this sector.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* AI Proctoring Video Preview Modal */}
        <AnimatePresence>
          {showVideoPreview && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl"
            >
              <motion.div 
                initial={{ scale: 0.98, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.98, y: 20 }}
                className="max-w-6xl w-full bg-black border border-white/20 overflow-hidden relative"
              >
                <button 
                  onClick={() => setShowVideoPreview(false)}
                  className="absolute top-8 right-8 w-12 h-12 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white transition-all z-20 font-black uppercase tracking-widest text-xs"
                >
                  ✕
                </button>
                
                <div className="grid lg:grid-cols-12">
                  <div className="lg:col-span-8 aspect-video bg-black relative flex flex-col border-r border-white/10">
                    {/* Simulator Header */}
                    <div className="h-14 border-b border-white/10 flex items-center justify-between px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/50 italic">AI.PROCTOR.IN.V4_SIMULATOR // SKILLSCRUMPT.IN</span>
                      </div>
                      <div className="flex items-center gap-8">
                        <div className="text-white font-mono text-sm tracking-widest">00:44:59:02</div>
                        <div className="px-3 py-1 bg-white text-black text-[9px] font-black uppercase tracking-widest">SUBMIT DIRECTIVE</div>
                      </div>
                    </div>

                    <div className="flex-1 p-10 flex flex-col relative overflow-hidden">
                      <div className="mb-10">
                        <div className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-2">Requirement 04/30</div>
                        <h4 className="text-2xl font-black tracking-tighter uppercase italic">IMPLEMENT DEBOUNCE HOOK.</h4>
                      </div>
                      
                      <div className="flex-1 bg-white/[0.02] border border-white/10 p-8 font-mono text-[13px] leading-loose text-white/60 relative">
                        <div className="flex gap-4 mb-8 text-[10px] font-black text-white/20 uppercase tracking-widest">
                          <span className="text-white italic">useDebounce.js</span>
                          <span>|</span>
                          <span>Source Code</span>
                        </div>
                        <div className="space-y-1">
                          <p><span className="text-white font-bold italic">import</span> {'{'} useState, useEffect {'}'} <span className="text-white font-bold italic">from</span> 'react';</p>
                          <p><span className="text-white font-bold italic">export function</span> useDebounce(value, delay) {'{'}</p>
                          <p>&nbsp;&nbsp;<span className="text-white font-bold italic">const</span> [debouncedValue, setDebouncedValue] = useState(value);</p>
                          <p>&nbsp;&nbsp;useEffect(() =&gt; {'{'}</p>
                          <p>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-white font-bold italic">const</span> handler = setTimeout(() =&gt; {'{'}</p>
                          <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;setDebouncedValue(value);</p>
                          <p>&nbsp;&nbsp;&nbsp;&nbsp;{'}'}, delay);</p>
                          <div className="w-2 h-4 bg-white animate-pulse inline-block align-middle" />
                        </div>
                      </div>
                    </div>

                    {/* PIP View */}
                    <div className="absolute bottom-10 right-10 w-56 border border-white/20 bg-black shadow-2xl overflow-hidden group/pip">
                      <div className="aspect-[4/3] relative flex items-center justify-center bg-white/5">
                        <div className="absolute top-3 right-3 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_white]" />
                        <div className="absolute inset-6 border border-white/20 border-dashed animate-[spin_10s_linear_infinite]" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        <div className="absolute bottom-3 left-3 text-[8px] text-white font-black tracking-[0.2em] uppercase italic">
                          ID: AUTHORIZED
                        </div>
                      </div>
                      <div className="p-4 bg-white/5 border-t border-white/10">
                        <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-white/40 mb-2">
                          <span>FOCUS ANALYSIS</span>
                          <span className="text-white italic">98%</span>
                        </div>
                        <div className="w-full bg-white/5 h-1">
                          <div className="bg-white h-full w-[98%] shadow-[0_0_10px_white]" />
                        </div>
                      </div>
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center z-30 group cursor-pointer">
                      <div className="w-20 h-20 border border-white/20 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white scale-100 group-hover:scale-110 transition-all duration-500">
                        <Play size={24} fill="white" className="ml-1" />
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-4 p-12 flex flex-col justify-center">
                    <h3 className="text-4xl font-black tracking-tighter uppercase italic mb-8">AI.INTEGRITY <br /><span className="text-white/30">V.4_CORE</span></h3>
                    <div className="space-y-8">
                      {[
                        { title: 'GAZE DETECTION', desc: 'Real-time eye tracking prevents external data leakage.' },
                        { title: 'ENVIRONMENT SCAN', desc: 'Proprietary audio filtering isolates operative voice.' },
                        { title: 'SECURE WINDOW', desc: 'Immediate session termination on window focus loss.' }
                      ].map((item, i) => (
                        <div key={i} className="space-y-2">
                          <div className="flex items-center gap-3">
                            <div className="w-1 h-1 bg-white" />
                            <p className="text-[11px] font-black uppercase tracking-[0.2em]">{item.title}</p>
                          </div>
                          <p className="text-[10px] text-white/30 font-black uppercase tracking-widest leading-relaxed ml-4">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                    <Link to="/register" className="mt-16">
                      <button className="w-full py-6 bg-white text-black font-black uppercase tracking-[0.4em] text-xs hover:bg-white/90 transition-all">
                        Establish Identity
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
};
