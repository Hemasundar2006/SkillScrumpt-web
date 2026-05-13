import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Code, Briefcase, Globe, Lock, Monitor, Shield, Zap, Video, Loader2, Play, CheckCircle, ArrowRight, Star, Clock } from 'lucide-react';
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
      <div className="pb-32 font-sans bg-slate-50 min-h-screen">
        <div className="max-w-[1400px] mx-auto pt-12 px-6">
          <header className="flex flex-col lg:flex-row justify-between items-start mb-16 gap-12 pb-12 border-b border-slate-200">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Skill Verification Center</span>
              </div>
              <h1 className="text-5xl font-bold tracking-tight text-slate-900 mb-6">
                Prove Your Expertise. <br />
                <span className="text-slate-400">Secure Your Badges.</span>
              </h1>
              <p className="text-slate-500 text-base font-medium leading-relaxed max-w-xl">
                Take proctored assessments designed by industry leaders. <br />
                Successfully passing these grants you verifiable skill badges to showcase on your profile.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search 100+ skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-medium w-full sm:w-80 outline-none focus:border-indigo-500 transition-all shadow-sm"
                />
              </div>
              <button 
                onClick={() => setShowVideoPreview(true)}
                className="px-8 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all flex items-center justify-center gap-3 group shadow-sm"
              >
                <Video size={18} className="text-indigo-600" />
                Watch Demo
              </button>
            </div>
          </header>

          <div className="flex flex-wrap gap-2 mb-12">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeCategory === cat 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' 
                  : 'bg-white border border-slate-200 text-slate-500 hover:border-slate-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="flex justify-center py-40">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="animate-spin text-indigo-600" size={48} />
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Accessing Assessment Vault...</p>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAssessments.length > 0 ? filteredAssessments.map((test) => {
                const Icon = getIcon(test.category);
                return (
                  <motion.div
                    key={test._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-md transition-all group"
                  >
                    <div className="p-8 flex flex-col h-full">
                      <div className="flex justify-between items-start mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm">
                          <Icon size={24} />
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] font-black text-slate-300 uppercase tracking-tighter mb-1">REFERENCE_ID</p>
                          <p className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{test.testId}</p>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold tracking-tight text-slate-900 mb-4">{test.title}</h3>
                      
                      <div className="flex items-center gap-4 mb-10">
                        <div className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 capitalize">
                          {test.difficulty}
                        </div>
                        <span className="text-xs text-slate-500 font-bold flex items-center gap-1.5">
                          <Clock size={14} /> {test.duration} min
                        </span>
                      </div>
                      
                      <div className="mt-auto pt-6 border-t border-slate-100">
                        <button 
                          onClick={() => navigate(`/assessments/setup/${test._id}`)} 
                          className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl text-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-2 group/btn shadow-md"
                        >
                          Start Assessment <Lock size={14} className="opacity-70 group-hover/btn:opacity-100" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              }) : (
                <div className="col-span-1 md:col-span-2 lg:col-span-3 py-32 text-center bg-white border border-slate-200 rounded-[2rem] shadow-sm">
                  <p className="text-slate-500 font-bold text-sm">No assessments found matching your search parameters.</p>
                  <button onClick={() => {setSearchQuery(''); setActiveCategory('All');}} className="mt-4 text-indigo-600 text-xs font-black uppercase tracking-widest underline">Reset Filters</button>
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
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md"
            >
              <motion.div 
                initial={{ scale: 0.98, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.98, y: 20 }}
                className="max-w-6xl w-full bg-white rounded-[2rem] border border-slate-200 overflow-hidden relative shadow-2xl"
              >
                <button 
                  onClick={() => setShowVideoPreview(false)}
                  className="absolute top-6 right-6 w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-all z-20 font-bold shadow-sm"
                >
                  ✕
                </button>
                
                <div className="flex flex-col lg:flex-row items-stretch min-h-[600px]">
                  <div className="lg:w-[70%] bg-slate-950 relative flex flex-col border-r border-slate-200 overflow-hidden">
                    <video 
                      src="/the_new_standard_of_trust_unlock_your_potential_wi.mp4" 
                      className="w-full h-full object-contain"
                      controls 
                      autoPlay
                    />
                  </div>

                  <div className="lg:w-[30%] p-12 flex flex-col justify-center bg-white">
                    <h3 className="text-3xl font-bold tracking-tight text-slate-900 mb-8">AI Proctoring <br /><span className="text-slate-400">Security</span></h3>
                    <div className="space-y-6">
                      {[
                        { title: 'Gaze Tracking', desc: 'Ensures focus remains on the assessment.' },
                        { title: 'Audio Analysis', desc: 'Detects unauthorized background noise.' },
                        { title: 'Browser Lock', desc: 'Prevents switching tabs or windows.' }
                      ].map((item, i) => (
                        <div key={i} className="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                           <div className="mt-0.5"><Shield size={16} className="text-indigo-500" /></div>
                           <div>
                             <p className="text-sm font-bold text-slate-900 mb-1">{item.title}</p>
                             <p className="text-xs text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                           </div>
                        </div>
                      ))}
                    </div>
                    <Link to="/register" className="mt-10 block">
                      <button className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl text-sm hover:bg-slate-800 transition-all shadow-md">
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
