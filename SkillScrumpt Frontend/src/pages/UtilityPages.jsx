import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  ChevronRight, 
  Briefcase, 
  Shield, 
  DollarSign, 
  Clock, 
  FileText, 
  CheckCircle,
  Zap,
  Loader2,
  Cpu,
  Lock,
  ArrowRight
} from 'lucide-react';
import { Card, Badge, Button } from '../components/UI';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

import { DashboardLayout } from '../layout/DashboardLayout';

export function PostNewProject() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);

  React.useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    setUser(savedUser);
  }, []);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    skills: [],
    budget: '',
    deadline: ''
  });

  const availableSkills = [
    "React Expert", "Next.js Core", "TypeScript Pro", 
    "System Design", "Node.js Backend", "UI/UX Verified"
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleSkill = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill) 
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.description || !formData.budget || !formData.deadline) {
      return alert('Please fill all required fields');
    }

    setIsLoading(true);
    try {
      const response = await api.post('/projects', {
        ...formData,
        budget: Number(formData.budget)
      });
      alert('Project posted successfully!');
      navigate(`/projects/${response.data._id}`);
    } catch (err) {
      alert(err.response?.data?.message || 'Error posting project');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout user={user}>
      <div className="pb-32 bg-black text-white selection:bg-white selection:text-black min-h-screen">
        <div className="max-w-4xl mx-auto">
          {/* Progress Header */}
          <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-24 pt-12 gap-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.4em]">Protocol: Project Initiation</span>
              </div>
              <h1 className="text-6xl font-black tracking-tighter uppercase italic leading-none">POST <br />DIRECTIVE.</h1>
              <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mt-6">
                PHASE_0{step}_OF_03: {step === 1 ? 'PARAMETER_DEFINITION' : step === 2 ? 'SKILL_REQUISITES' : 'VALUATION_PROTOCOL'}
              </p>
            </div>
            <div className="flex gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className={`w-12 h-[2px] transition-all duration-500 ${i <= step ? 'bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'bg-white/10'}`} />
              ))}
            </div>
          </header>

          <div className="p-1 border border-white/10 bg-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 border border-white/5 -mr-32 -mt-32 rotate-45 pointer-events-none" />
            <div className="bg-black border border-white/10 p-12 md:p-20 relative z-10">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div 
                    key="step1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-12"
                  >
                    <div className="space-y-4">
                      <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] ml-1">DIRECTIVE_IDENTIFIER (TITLE)</label>
                      <input 
                        type="text" 
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full px-6 py-4 bg-transparent border border-white/20 focus:border-white outline-none transition-all font-black uppercase tracking-widest text-xl placeholder:text-white/10"
                        placeholder="E.G. CORE_SYSTEMS_REBUILD"
                        required
                      />
                    </div>

                    <div className="space-y-4">
                      <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] ml-1">MISSION_SCOPE (DESCRIPTION)</label>
                      <textarea 
                        name="description"
                        rows={8}
                        value={formData.description}
                        onChange={handleInputChange}
                        className="w-full px-6 py-4 bg-transparent border border-white/20 focus:border-white outline-none transition-all font-bold placeholder:text-white/10 resize-none uppercase tracking-widest text-[11px]"
                        placeholder="ESTABLISH GOALS, REQUIREMENTS, AND FINAL DELIVERABLES..."
                        required
                      />
                    </div>

                    <div className="pt-12 border-t border-white/10">
                      <button 
                        disabled={!formData.title || !formData.description} 
                        className="w-full py-6 bg-white text-black font-black uppercase tracking-[0.4em] text-xs hover:bg-white/90 transition-all disabled:opacity-20" 
                        onClick={() => setStep(2)}
                      >
                        AUTHORIZE_PARAMETERS
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div 
                    key="step2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-16"
                  >
                    <div className="space-y-8">
                      <div className="flex items-center gap-4">
                        <h3 className="text-2xl font-black italic tracking-tighter uppercase">REQUIRED_VERIFICATIONS.</h3>
                        <div className="h-[1px] bg-white/10 flex-1" />
                      </div>
                      <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] leading-relaxed italic">SELECT THE AI_VERIFIED BADGES THAT OPERATIVES MUST POSSESS TO BROWSE THIS DIRECTIVE.</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 bg-white/5 p-1 border border-white/10">
                        {availableSkills.map(skill => (
                          <SkillBadgeToggle 
                            key={skill}
                            label={skill} 
                            selected={formData.skills.includes(skill)}
                            onClick={() => toggleSkill(skill)}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="p-10 border border-white/10 bg-white/5 relative overflow-hidden">
                      <div className="flex gap-8 relative z-10">
                        <Shield className="text-white/40 flex-shrink-0" size={32} />
                        <div>
                          <h4 className="text-[10px] font-black uppercase tracking-[0.4em] mb-4">AI_ENFORCED_INTEGRITY</h4>
                          <p className="text-[10px] font-bold text-white/30 leading-relaxed uppercase tracking-widest">BY REQUIRING VERIFIED BADGES, ONLY ELITE OPERATIVES CAN INTERFACE WITH THIS DIRECTIVE. QUALITY IS AUTOMATICALLY ASSURED.</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-6 pt-12 border-t border-white/10">
                      <button className="flex-1 py-6 border border-white/10 text-white/40 font-black uppercase tracking-[0.4em] text-xs hover:text-white transition-all" onClick={() => setStep(1)}>REVERT</button>
                      <button className="flex-[2] py-6 bg-white text-black font-black uppercase tracking-[0.4em] text-xs hover:bg-white/90 transition-all" onClick={() => setStep(3)}>CONFIRM_SKILLS</button>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div 
                    key="step3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-16"
                  >
                    <div className="grid md:grid-cols-2 gap-12">
                      <div className="space-y-4">
                        <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] ml-1">VALUATION_MODEL</label>
                        <select className="w-full px-6 py-4 bg-transparent border border-white/20 focus:border-white outline-none transition-all font-black uppercase tracking-widest text-sm appearance-none cursor-pointer">
                          <option className="bg-black">FIXED_PROTOCOL</option>
                          <option className="bg-black">HOURLY_RELAY</option>
                        </select>
                      </div>
                      <div className="space-y-4">
                        <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] ml-1">CREDIT_AMOUNT (USD)</label>
                        <div className="relative">
                          <span className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 font-black italic">$</span>
                          <input 
                            type="number" 
                            name="budget"
                            value={formData.budget}
                            onChange={handleInputChange}
                            className="w-full pl-12 pr-6 py-4 bg-transparent border border-white/20 focus:border-white outline-none transition-all font-black italic text-xl placeholder:text-white/10"
                            placeholder="5000"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] ml-1">TERMINATION_DEADLINE</label>
                      <div className="relative">
                        <Clock className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                        <input 
                          type="date" 
                          name="deadline"
                          value={formData.deadline}
                          onChange={handleInputChange}
                          className="w-full pl-16 pr-6 py-4 bg-transparent border border-white/20 focus:border-white outline-none transition-all font-black uppercase tracking-widest text-sm text-white/40 focus:text-white"
                          required
                        />
                      </div>
                    </div>

                    <div className="p-10 bg-white/[0.02] border border-white/10 relative overflow-hidden">
                       <div className="relative z-10">
                          <h4 className="text-[10px] font-black uppercase tracking-[0.4em] mb-6 flex items-center gap-4">
                            <CheckCircle size={16} className="text-white" /> READY_FOR_BROADCAST?
                          </h4>
                          <p className="text-[10px] font-bold text-white/30 leading-relaxed mb-10 uppercase tracking-widest italic">YOUR DIRECTIVE WILL BE RELAYED TO ALL MATCHING VERIFIED OPERATIVES IMMEDIATELY AFTER AUTHORIZATION.</p>
                          <div className="flex items-center justify-between py-6 border-t border-white/5">
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/20">RELAY_FEE</span>
                            <span className="text-4xl font-black italic tracking-tighter text-white">$0.00</span>
                          </div>
                          <p className="text-[8px] text-white/20 font-black uppercase tracking-[0.4em] mt-4">ZERO_BROKERAGE_PROTOCOL_ACTIVE // SKILLSCRUMPT.IN</p>
                       </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-6 pt-12 border-t border-white/10">
                      <button className="flex-1 py-6 border border-white/10 text-white/40 font-black uppercase tracking-[0.4em] text-xs hover:text-white transition-all" onClick={() => setStep(2)}>REVERT</button>
                      <button 
                        disabled={isLoading} 
                        onClick={handleSubmit} 
                        className="flex-[2] py-6 bg-white text-black font-black uppercase tracking-[0.4em] text-xs hover:bg-white/90 transition-all flex items-center justify-center gap-4"
                      >
                        {isLoading ? <Loader2 className="animate-spin" size={18} /> : 'INITIALIZE_BROADCAST'}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function SkillBadgeToggle({ label, selected, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center justify-between p-8 bg-black border border-white/5 transition-all group ${
        selected ? 'bg-white border-white' : 'hover:bg-white/5'
      }`}
    >
      <span className={`text-[11px] font-black uppercase tracking-widest ${selected ? 'text-black italic' : 'text-white/40 group-hover:text-white'}`}>{label}</span>
      <div className={`w-5 h-5 border flex items-center justify-center transition-all ${
        selected ? 'border-black bg-black text-white' : 'border-white/10'
      }`}>
        {selected && <CheckCircle size={12} />}
      </div>
    </button>
  );
}

export function HelpCenter() {
  const [user, setUser] = useState(null);

  React.useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    setUser(savedUser);
  }, []);

  return (
    <DashboardLayout user={user}>
      <div className="bg-black text-white selection:bg-white selection:text-black min-h-screen pb-32">
        <section className="py-40 text-center relative overflow-hidden border-b border-white/10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
             <Cpu className="w-[600px] h-[600px] animate-spin-slow" />
          </div>
          <div className="max-w-4xl mx-auto px-6 relative z-10">
            <h1 className="text-7xl lg:text-9xl font-black mb-12 tracking-tighter uppercase italic leading-[0.8]">HOW CAN WE <br />RELAY?</h1>
            <div className="relative max-w-2xl mx-auto group">
              <input 
                type="text" 
                placeholder="SEARCH_PROTOCOL_ARTICLES..." 
                className="w-full px-12 py-6 bg-white/[0.02] border border-white/10 focus:border-white outline-none transition-all text-[11px] font-black uppercase tracking-[0.4em] placeholder:text-white/10"
              />
              <div className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-white transition-colors">
                 <ArrowRight size={24} />
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6 pt-24 relative z-20">
          <div className="grid md:grid-cols-3 gap-1">
            <SupportCategory 
              icon={Shield} 
              title="VERIFICATION_&_SAFETY" 
              desc="LEARN ABOUT OUR AI PROCTORING AND VERIFIED BADGE PROTOCOLS."
            />
            <SupportCategory 
              icon={Briefcase} 
              title="HIRING_&_DIRECTIVES" 
              desc="HOW TO FIND TALENT, MANAGE MILESTONES AND WORKSPACE RELAYS."
            />
            <SupportCategory 
              icon={DollarSign} 
              title="PAYMENTS_&_LEDGERS" 
              desc="EVERYTHING ABOUT OUR ZERO BROKERAGE MODEL AND SECURE RELAYS."
            />
          </div>

          <div className="mt-40">
            <div className="flex items-center gap-6 mb-16">
              <h2 className="text-4xl font-black tracking-tighter uppercase italic">FREQUENT_QUERIES.</h2>
              <div className="h-[1px] bg-white/10 flex-1" />
            </div>
            <div className="grid md:grid-cols-2 gap-1 border border-white/10 bg-white/5">
              <FaqRow question="HOW DOES THE AI PROCTORING WORK?" />
              <FaqRow question="WHAT IS THE ZERO BROKERAGE MODEL?" />
              <FaqRow question="HOW DO I EARN MY FIRST SKILL BADGE?" />
              <FaqRow question="IS MY DATA SECURED ON SKILLSCRUMPT.IN?" />
              <FaqRow question="CAN I HIRE TALENT FOR FULL-TIME ROLES?" />
              <FaqRow question="HOW ARE DISPUTES HANDLED?" />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function SupportCategory({ icon: Icon, title, desc }) {
  return (
    <div className="p-1 border border-white/10 bg-white/5 hover:bg-white transition-all group">
      <div className="p-12 bg-black border border-white/10 group-hover:border-black h-full flex flex-col">
        <div className="w-16 h-16 border border-white/10 text-white/40 flex items-center justify-center mb-10 group-hover:bg-black group-hover:text-white group-hover:border-white transition-all italic">
          <Icon size={32} />
        </div>
        <h3 className="text-xl font-black italic uppercase tracking-tight mb-6 group-hover:text-black transition-colors">{title}</h3>
        <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest leading-relaxed mb-12 group-hover:text-black/60 transition-colors">{desc}</p>
        <Link to="#" className="mt-auto text-[10px] font-black uppercase tracking-[0.4em] text-white/20 group-hover:text-black flex items-center gap-4 transition-all">
          EXPLORE_CATEGORY <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
        </Link>
      </div>
    </div>
  );
}

function FaqRow({ question }) {
  return (
    <button className="flex items-center justify-between w-full p-10 bg-black border border-white/5 hover:bg-white group transition-all text-left">
      <span className="text-[11px] font-black uppercase tracking-widest text-white/40 group-hover:text-black group-hover:italic transition-all">{question}</span>
      <ChevronRight size={18} className="text-white/10 group-hover:text-black group-hover:translate-x-2 transition-all" />
    </button>
  );
}
