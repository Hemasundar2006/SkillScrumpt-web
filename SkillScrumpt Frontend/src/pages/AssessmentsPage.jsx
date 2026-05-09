import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Lock, Monitor, Shield, Zap, ChevronRight, CheckCircle, Video, Loader2 } from 'lucide-react';
import { Button, Card, Badge } from '../components/UI';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

export const AssessmentsPage = () => {
  const navigate = useNavigate();
  const [showVideoPreview, setShowVideoPreview] = useState(false);
  const [assessments, setAssessments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAssessments();
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
    if (title.toLowerCase().includes('react')) return Zap;
    if (title.toLowerCase().includes('python')) return Monitor;
    if (title.toLowerCase().includes('cloud')) return Shield;
    return Shield;
  };

  return (
    <div className="pt-32 pb-20 px-4 min-h-screen bg-[#f8f9fb]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-end mb-12 gap-8">
          <div className="max-w-2xl">
            <Badge variant="primary" className="mb-4">Verified Assessments</Badge>
            <h1 className="text-4xl lg:text-6xl font-black text-secondary tracking-tighter mb-4 leading-tight">
              Prove Your Skills. <br />
              <span className="text-primary">Earn Your Badge.</span>
            </h1>
            <p className="text-gray-500 text-lg">
              Take proctored tests designed by industry experts. Every successful attempt earns you a verified badge on your profile.
            </p>
          </div>
          
          <Button 
            onClick={() => setShowVideoPreview(true)}
            variant="outline" 
            className="group h-14 px-8 border-2"
          >
            <Video className="mr-2 group-hover:text-primary transition-colors" />
            Watch AI Proctoring Demo
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-primary" size={48} />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {assessments.length > 0 ? assessments.map((test) => {
              const Icon = getIcon(test.title);
              return (
                <motion.div
                  key={test._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="p-8 border-none shadow-xl bg-white h-full flex flex-col group">
                    <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-secondary group-hover:bg-primary/10 group-hover:text-primary transition-colors mb-6">
                      <Icon size={28} />
                    </div>
                    
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{test.title}</h3>
                    
                    <div className="flex items-center gap-3 mb-6">
                      <Badge variant="neutral" className="bg-gray-100 text-[10px] text-gray-500 border-none">{test.difficulty}</Badge>
                      <span className="text-xs text-gray-400 font-medium">{test.duration} mins</span>
                    </div>
                    
                    <div className="mt-auto pt-6 border-t border-gray-100">
                      <Button onClick={() => navigate('/assessments/live', { state: { testId: test._id } })} className="w-full group/btn">
                        Take Test <Lock className="ml-2 w-4 h-4 opacity-50 group-hover/btn:opacity-100 transition-opacity" />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              );
            }) : (
              <div className="col-span-4 text-center py-20 bg-white rounded-[2rem] shadow-sm">
                <p className="text-gray-400 font-medium italic">No live assessments found. Please check back later.</p>
              </div>
            )}
          </div>
        )}

        {/* AI Proctoring Video Preview Modal */}
        <AnimatePresence>
          {showVideoPreview && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-secondary/90 backdrop-blur-xl"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="max-w-5xl w-full bg-white rounded-[2.5rem] overflow-hidden shadow-2xl relative"
              >
                <button 
                  onClick={() => setShowVideoPreview(false)}
                  className="absolute top-6 right-6 w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-secondary hover:bg-gray-200 transition-colors z-20"
                >
                  ✕
                </button>
                
                <div className="grid lg:grid-cols-3">
                  <div className="lg:col-span-2 aspect-video bg-gray-50 relative flex flex-col overflow-hidden">
                    <div className="h-12 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-10">
                      <div className="flex items-center gap-2">
                        <div className="p-1 bg-primary rounded text-white">
                          <Shield size={12} />
                        </div>
                        <span className="text-xs font-bold text-secondary">SkillScrumpt Assessment</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant="neutral" className="bg-red-50 text-red-500 border-red-100 flex items-center gap-1.5 text-[10px] px-2 py-0.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> REC
                        </Badge>
                        <div className="text-sm font-bold text-gray-700 font-mono">44:59</div>
                        <Button className="h-7 text-xs px-4 bg-primary text-white">Submit</Button>
                      </div>
                    </div>

                    <div className="flex-1 p-6 flex flex-col relative z-0">
                      <div className="mb-4">
                        <h4 className="text-lg font-bold text-secondary">Question 4 of 30</h4>
                        <p className="text-sm text-gray-600 mt-1">Implement a custom React hook `useDebounce` that delays updating a value.</p>
                      </div>
                      
                      <div className="flex-1 bg-[#1e1e1e] rounded-xl border border-gray-800 p-4 font-mono text-[13px] leading-relaxed text-gray-300 relative shadow-inner">
                        <div className="flex gap-2 mb-4 border-b border-gray-700/50 pb-2">
                          <span className="text-gray-400 font-medium">useDebounce.js</span>
                        </div>
                        <div>
                          <span className="text-[#c678dd]">import</span> {'{'} useState, useEffect {'}'} <span className="text-[#c678dd]">from</span> <span className="text-[#98c379]">'react'</span>;<br/><br/>
                          <span className="text-[#c678dd]">export function</span> <span className="text-[#61afef]">useDebounce</span>(value, delay) {'{'}<br/>
                          &nbsp;&nbsp;<span className="text-[#c678dd]">const</span> [debouncedValue, setDebouncedValue] = <span className="text-[#61afef]">useState</span>(value);<br/><br/>
                          &nbsp;&nbsp;<span className="text-[#61afef]">useEffect</span>(() =&gt; {'{'}<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#c678dd]">const</span> handler = <span className="text-[#61afef]">setTimeout</span>(() =&gt; {'{'}<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-[#61afef]">setDebouncedValue</span>(value);<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;{'}'}, delay);<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;<span className="inline-block w-2 h-4 bg-gray-400 animate-pulse translate-y-1 ml-1" />
                        </div>
                      </div>
                    </div>

                    <div className="absolute bottom-6 right-6 w-48 bg-[#0f1115] rounded-xl border border-gray-700/50 overflow-hidden shadow-2xl z-20">
                      <div className="aspect-[4/3] relative flex items-center justify-center bg-[#1a1d24]">
                        <div className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
                        <div className="absolute inset-4 border border-primary/40 border-dashed rounded-lg flex items-center justify-center">
                           <div className="w-16 h-16 border border-primary/20 rounded-full absolute" />
                        </div>
                        <div className="absolute bottom-2 left-2 text-[9px] text-green-400 font-mono tracking-wider bg-black/50 px-1.5 py-0.5 rounded backdrop-blur-sm">
                          ID: MATCHED
                        </div>
                      </div>
                      <div className="bg-[#0f1115] p-3 border-t border-gray-800">
                        <div className="flex justify-between items-center text-[10px] text-gray-400 mb-1.5 font-medium">
                          <span>Focus Tracking</span>
                          <span className="text-green-400 font-mono">98%</span>
                        </div>
                        <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-green-500 h-full w-[98%]" />
                        </div>
                      </div>
                    </div>

                    <div className="absolute inset-0 bg-secondary/5 hover:bg-secondary/10 flex items-center justify-center group cursor-pointer transition-colors z-30">
                      <div className="w-16 h-16 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-primary shadow-xl scale-100 group-hover:scale-110 transition-transform border border-white/20">
                        <Play fill="currentColor" className="ml-1 w-6 h-6" />
                      </div>
                    </div>
                  </div>

                  <div className="p-10 flex flex-col justify-center bg-gray-50">
                    <h3 className="text-2xl font-black text-secondary mb-6">AI Proctoring V3</h3>
                    <div className="space-y-6">
                      {[
                        { title: 'Eye Tracking', desc: 'Real-time gaze detection to prevent external help.' },
                        { title: 'Tab Monitoring', desc: 'Instant lockout if the user leaves the window.' },
                        { title: 'Ambient Audio', desc: 'Filtering room noise from genuine voice inputs.' }
                      ].map((item, i) => (
                        <div key={i} className="flex gap-4">
                          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary mt-1">
                            <CheckCircle size={14} />
                          </div>
                          <div>
                            <p className="font-bold text-sm text-secondary">{item.title}</p>
                            <p className="text-xs text-gray-500">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Link to="/register" className="mt-10">
                      <Button className="w-full h-14">Get Started</Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
