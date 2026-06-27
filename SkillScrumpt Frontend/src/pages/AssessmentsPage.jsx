import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Code, Briefcase, Globe, Lock, Monitor, Shield, Zap, Video, Loader2, Play, CheckCircle, ArrowRight, Star, Clock } from 'lucide-react';
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

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Programming', 'Web Development', 'Mobile Development', 'Data & AI', 'Cloud & DevOps', 'Cybersecurity', 'Design & UX', 'Professional & Management'];

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

  const filteredAssessments = assessments.filter(test => {
    const matchesSearch = test.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          test.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          test.testId?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || test.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const getIcon = (category) => {
    const c = category.toLowerCase();
    if (c.includes('programming')) return Code;
    if (c.includes('web')) return Monitor;
    if (c.includes('data') || c.includes('ai')) return Zap;
    if (c.includes('security')) return Shield;
    if (c.includes('cloud') || c.includes('devops')) return Globe;
    if (c.includes('design')) return Zap;
    return Briefcase;
  };

  return (
    <DashboardLayout user={user}>
      <div className="max-w-[1400px] mx-auto w-full flex flex-col h-full font-sans">
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-10 gap-8 shrink-0">
          <div className="max-w-2xl">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-2 bg-[#F97316] rounded-full animate-pulse shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
                <span className="text-[10px] font-bold text-[#1E293B]/50 uppercase tracking-wider">Skill Verification Center</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-[#1E293B] mb-4 leading-tight">
                Prove Your Expertise. <br />
                <span className="text-[#38BDF8]">Secure Your Badges.</span>
              </h1>
              <p className="text-[#1E293B]/60 text-sm font-medium leading-relaxed">
                Take proctored assessments designed by industry leaders. <br className="hidden sm:block" />
                Successfully passing grants you verifiable skill badges to showcase on your profile.
              </p>
            </motion.div>
          </div>
          
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="relative flex-1 sm:w-72">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1E293B]/30" />
              <input 
                type="text" 
                placeholder="Search 100+ skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-6 py-3.5 bg-white border border-[#38BDF8]/20 rounded-[16px] text-sm font-medium w-full outline-none focus:border-[#38BDF8] focus:shadow-[0_0_0_4px_rgba(56,189,248,0.1)] transition-all shadow-sm text-[#1E293B]"
              />
            </div>
            <button 
              onClick={() => setShowVideoPreview(true)}
              className="px-6 py-3.5 bg-white border border-[#38BDF8]/20 rounded-[16px] text-sm font-bold text-[#1E293B] hover:border-[#38BDF8]/50 hover:shadow-[0_8px_20px_rgba(56,189,248,0.1)] transition-all flex items-center justify-center gap-3 group shrink-0"
            >
              <Video size={18} className="text-[#F97316]" />
              Watch Demo
            </button>
          </motion.div>
        </header>

        <div className="flex flex-wrap gap-2 mb-8 shrink-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-[12px] text-[10px] font-bold uppercase tracking-wider transition-all ${
                activeCategory === cat 
                ? 'bg-[#1E293B] text-white shadow-[0_4px_12px_rgba(30,41,59,0.25)] border border-[#1E293B]' 
                : 'bg-white border border-[#38BDF8]/10 text-[#1E293B]/60 hover:border-[#38BDF8]/40 hover:text-[#1E293B]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-hidden min-h-0 flex flex-col">
          {isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center">
              <Loader2 className="animate-spin text-[#38BDF8]" size={48} />
              <p className="text-[10px] font-bold text-[#1E293B]/40 uppercase tracking-wider mt-4">Accessing Assessment Vault...</p>
            </div>
          ) : (
            <div className="h-full overflow-y-auto custom-scrollbar pr-2 pb-8">
              {filteredAssessments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
                  {filteredAssessments.map((test, i) => {
                    const Icon = getIcon(test.category);
                    return (
                      <motion.div
                        key={test._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="bg-white rounded-[24px] border border-[#38BDF8]/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:border-[#38BDF8]/30 hover:shadow-[0_12px_30px_rgba(56,189,248,0.08)] hover:-translate-y-1 transition-all group flex flex-col h-full"
                      >
                        <div className="p-8 flex flex-col h-full">
                          <div className="flex justify-between items-start mb-8">
                            <div className="w-14 h-14 rounded-[16px] bg-[#E0F2FE] flex items-center justify-center text-[#38BDF8] shadow-inner group-hover:scale-110 transition-transform">
                              <Icon size={24} />
                            </div>
                            <div className="text-right">
                              <p className="text-[10px] font-bold text-[#1E293B]/30 uppercase tracking-wider mb-1.5">REFERENCE_ID</p>
                              <p className="text-[10px] font-bold text-[#1E293B]/60 bg-[#1E293B]/5 px-2.5 py-1 rounded-[8px] tracking-widest">{test.testId}</p>
                            </div>
                          </div>
                          
                          <h3 className="text-xl font-bold tracking-tight text-[#1E293B] mb-4 group-hover:text-[#38BDF8] transition-colors line-clamp-2">{test.title}</h3>
                          
                          <div className="flex items-center gap-4 mb-8 mt-auto">
                            <div className="px-3 py-1.5 bg-[#FFF0E5] border border-[#F97316]/20 rounded-[8px] text-[10px] font-bold text-[#F97316] uppercase tracking-wider">
                              {test.difficulty}
                            </div>
                            <span className="text-[11px] text-[#1E293B]/50 font-bold flex items-center gap-1.5 uppercase tracking-wider">
                              <Clock size={14} className="text-[#38BDF8]" /> {test.duration} min
                            </span>
                          </div>
                          
                          <div className="pt-6 border-t border-[#E0F2FE]">
                            <button 
                              onClick={() => navigate(`/assessments/setup/${test._id}`)} 
                              className="w-full py-4 bg-[#1E293B] text-white font-bold rounded-[12px] text-sm hover:bg-[#0F172A] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group/btn shadow-[0_8px_20px_rgba(30,41,59,0.2)]"
                            >
                              Start Assessment <Lock size={14} className="opacity-50 group-hover/btn:opacity-100 transition-opacity" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center bg-white border border-[#38BDF8]/10 rounded-[24px] shadow-sm">
                  <div className="w-16 h-16 bg-[#E0F2FE] text-[#38BDF8] rounded-full flex items-center justify-center mb-4">
                    <Search size={24} />
                  </div>
                  <p className="text-[#1E293B] font-bold text-lg mb-2">No assessments found</p>
                  <p className="text-[#1E293B]/50 font-medium text-sm mb-6">Try adjusting your search parameters.</p>
                  <button onClick={() => {setSearchQuery(''); setActiveCategory('All');}} className="px-6 py-2 bg-[#F97316] text-white text-xs font-bold rounded-[8px] hover:bg-[#EA580C] transition-colors">Reset Filters</button>
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
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#1E293B]/80 backdrop-blur-md"
            >
              <motion.div 
                initial={{ scale: 0.98, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.98, y: 20 }}
                className="max-w-6xl w-full bg-white rounded-[32px] border border-[#38BDF8]/20 overflow-hidden relative shadow-[0_30px_60px_rgba(0,0,0,0.3)]"
              >
                <button 
                  onClick={() => setShowVideoPreview(false)}
                  className="absolute top-6 right-6 w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 hover:scale-110 transition-all z-20 font-bold shadow-lg"
                >
                  ✕
                </button>
                
                <div className="flex flex-col lg:flex-row items-stretch min-h-[600px]">
                  <div className="lg:w-[70%] bg-black relative flex flex-col border-r border-[#38BDF8]/20 overflow-hidden">
                    <video 
                      src="/the_new_standard_of_trust_unlock_your_potential_wi.mp4" 
                      className="w-full h-full object-contain"
                      controls 
                      autoPlay
                    />
                  </div>

                  <div className="lg:w-[30%] p-12 flex flex-col justify-center bg-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#38BDF8] opacity-5 rounded-full blur-[60px] translate-x-1/2 -translate-y-1/2" />
                    
                    <h3 className="text-3xl font-bold tracking-tight text-[#1E293B] mb-8 relative z-10">AI Proctoring <br /><span className="text-[#38BDF8]">Security</span></h3>
                    <div className="space-y-4 relative z-10">
                      {[
                        { title: 'Gaze Tracking', desc: 'Ensures focus remains on the assessment.' },
                        { title: 'Audio Analysis', desc: 'Detects unauthorized background noise.' },
                        { title: 'Browser Lock', desc: 'Prevents switching tabs or windows.' }
                      ].map((item, i) => (
                        <div key={i} className="flex gap-4 p-4 bg-[#F8FAFC] rounded-[16px] border border-[#38BDF8]/10 hover:border-[#38BDF8]/30 transition-colors">
                          <div className="mt-0.5"><Shield size={16} className="text-[#F97316]" /></div>
                          <div>
                            <p className="text-sm font-bold text-[#1E293B] mb-1">{item.title}</p>
                            <p className="text-[11px] text-[#1E293B]/60 font-medium leading-relaxed">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Link to="/register" className="mt-10 block relative z-10">
                      <button className="w-full py-4 bg-[#F97316] text-white font-bold rounded-[12px] text-sm hover:bg-[#EA580C] transition-all shadow-[0_8px_20px_rgba(249,115,22,0.25)] hover:-translate-y-0.5">
                        Create Account to Start
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
