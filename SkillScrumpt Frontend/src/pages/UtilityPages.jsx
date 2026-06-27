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
"React Expert","Next.js Core","TypeScript Pro", 
"System Design","Node.js Backend","UI/UX Verified"
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
 <div className="pb-32 bg-[#FFF0E5] text-slate-900 selection:bg-[#F97316] selection:text-white min-h-screen">
 <div className="max-w-4xl mx-auto">
 {/* Progress Header */}
 <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 pt-12 gap-8">
 <div>
 <div className="flex items-center gap-3 mb-3">
 <div className="w-1.5 h-1.5 bg-[#F97316] rounded-full animate-pulse" />
 <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Project Initiation</span>
 </div>
 <h1 className="text-4xl font-bold tracking-tight text-slate-900">Post <br />Directive.</h1>
 <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mt-4">
 Step {step} of 3: {step === 1 ? 'Parameters' : step === 2 ? 'Requirements' : 'Valuation'}
 </p>
 </div>
 <div className="flex gap-3">
 {[1, 2, 3].map(i => (
 <div key={i} className={`w-12 h-1.5 transition-all duration-500 rounded-full ${i <= step ? 'bg-[#F97316] shadow-sm' : 'bg-slate-200'}`} />
 ))}
 </div>
 </header>

 <div>
 <div className="absolute top-0 right-0 w-64 h-64 border border-slate-100 -mr-32 -mt-32 rotate-45 pointer-events-none" />
 <div className="bg-white border border-slate-200 shadow-xl rounded-3xl p-8 md:p-12 relative z-10">
 <AnimatePresence mode="wait">
 {step === 1 && (
 <motion.div 
 key="step1"
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 className="space-y-8"
 >
 <div className="space-y-3">
 <label className="text-xs font-semibold text-slate-500 ml-1">Project Title</label>
 <input 
 type="text" 
 name="title"
 value={formData.title}
 onChange={handleInputChange}
 className="w-full px-6 py-4 bg-transparent border border-slate-200 focus:border-[#F97316] outline-none transition-all font-semibold text-lg text-slate-900 placeholder:text-slate-300 rounded-xl"
 placeholder="e.g. Core Systems Rebuild"
 required
 />
 </div>

 <div className="space-y-3">
 <label className="text-xs font-semibold text-slate-500 ml-1">Project Description</label>
 <textarea 
 name="description"
 rows={8}
 value={formData.description}
 onChange={handleInputChange}
 className="w-full px-6 py-4 bg-transparent border border-slate-200 focus:border-[#F97316] outline-none transition-all placeholder:text-slate-300 resize-none text-sm text-slate-900 rounded-xl"
 placeholder="Establish goals, requirements, and final deliverables..."
 required
 />
 </div>

 <div className="pt-8 border-t border-slate-100">
 <button 
 disabled={!formData.title || !formData.description} 
 className="w-full py-4 bg-[#F97316] text-white font-semibold text-sm hover:bg-orange-600 shadow-md transition-all disabled:opacity-50 rounded-xl" 
 onClick={() => setStep(2)}
 >
 Authorize Parameters
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
 className="space-y-10"
 >
 <div className="space-y-6">
 <div className="flex items-center gap-4">
 <h3 className="text-xl font-bold text-slate-900">Required Skills</h3>
 <div className="h-[1px] bg-slate-200 flex-1" />
 </div>
 <p className="text-sm font-medium text-slate-500">Select the skills required for this project.</p>
 
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 border border-slate-200 rounded-2xl">
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

 <div className="p-6 border border-sky-200 bg-sky-50 rounded-2xl relative overflow-hidden">
 <div className="flex gap-6 relative z-10">
 <Shield className="text-[#38BDF8] flex-shrink-0" size={28} />
 <div>
 <h4 className="text-sm font-bold mb-2 text-sky-900">Enforced Integrity</h4>
 <p className="text-xs font-medium text-sky-700 leading-relaxed">By requiring verified skills, only capable professionals can bid on this project. Quality is automatically assured.</p>
 </div>
 </div>
 </div>

 <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-slate-100">
 <button className="flex-1 py-4 border border-slate-200 text-slate-500 font-semibold text-sm hover:text-slate-900 bg-white hover:bg-slate-50 transition-all rounded-xl" onClick={() => setStep(1)}>Revert</button>
 <button className="flex-[2] py-4 bg-[#F97316] text-white font-semibold text-sm hover:bg-orange-600 shadow-md transition-all rounded-xl" onClick={() => setStep(3)}>Confirm Skills</button>
 </div>
 </motion.div>
 )}

 {step === 3 && (
 <motion.div 
 key="step3"
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 className="space-y-10"
 >
 <div className="grid md:grid-cols-2 gap-8">
 <div className="space-y-3">
 <label className="text-xs font-semibold text-slate-500 ml-1">Valuation Model</label>
 <select className="w-full px-6 py-4 bg-transparent border border-slate-200 focus:border-[#F97316] text-slate-900 outline-none transition-all font-medium text-sm appearance-none cursor-pointer rounded-xl">
 <option className="bg-white text-slate-900">Fixed Rate</option>
 <option className="bg-white text-slate-900">Hourly Rate</option>
 </select>
 </div>
 <div className="space-y-3">
 <label className="text-xs font-semibold text-slate-500 ml-1">Budget (USD)</label>
 <div className="relative">
 <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
 <input 
 type="number" 
 name="budget"
 value={formData.budget}
 onChange={handleInputChange}
 className="w-full pl-10 pr-6 py-4 bg-transparent border border-slate-200 focus:border-[#F97316] text-slate-900 placeholder:text-slate-300 outline-none transition-all font-semibold text-lg rounded-xl"
 placeholder="5000"
 required
 />
 </div>
 </div>
 </div>

 <div className="space-y-3">
 <label className="text-xs font-semibold text-slate-500 ml-1">Deadline</label>
 <div className="relative">
 <Clock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
 <input 
 type="date" 
 name="deadline"
 value={formData.deadline}
 onChange={handleInputChange}
 className="w-full pl-14 pr-6 py-4 bg-transparent border border-slate-200 focus:border-[#F97316] outline-none transition-all font-medium text-sm text-slate-500 focus:text-slate-900 rounded-xl"
 required
 />
 </div>
 </div>

 <div className="p-8 bg-slate-50 border border-slate-200 rounded-2xl relative overflow-hidden">
 <div className="relative z-10">
 <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-3">
 <CheckCircle size={18} className="text-[#F97316]" /> Ready for Broadcast?
 </h4>
 <p className="text-xs font-medium text-slate-500 leading-relaxed mb-6">Your directive will be relayed to all matching verified operatives immediately after authorization.</p>
 <div className="flex items-center justify-between py-4 border-t border-slate-200">
 <span className="text-xs font-semibold text-slate-500">Platform Fee</span>
 <span className="text-2xl font-bold tracking-tight text-slate-900">$0.00</span>
 </div>
 <p className="text-xs text-slate-400 font-medium mt-2">Zero Brokerage Protocol Active</p>
 </div>
 </div>

 <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-slate-100">
 <button className="flex-1 py-4 border border-slate-200 text-slate-500 font-semibold text-sm hover:text-slate-900 bg-white hover:bg-slate-50 transition-all rounded-xl" onClick={() => setStep(2)}>Revert</button>
 <button 
 disabled={isLoading} 
 onClick={handleSubmit} 
 className="flex-[2] py-4 bg-[#F97316] text-white font-semibold text-sm hover:bg-orange-600 shadow-md transition-all flex items-center justify-center gap-3 rounded-xl"
 >
 {isLoading ? <Loader2 className="animate-spin" size={18} /> : 'Initialize Broadcast'}
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
 className={`flex items-center justify-between p-4 bg-white border border-slate-200 transition-all group rounded-xl ${
 selected ? 'border-[#F97316] bg-orange-50 shadow-sm' : 'hover:bg-slate-50'
 }`}
 >
 <span className={`text-sm font-semibold ${selected ? 'text-orange-600' : 'text-slate-500 group-hover:text-slate-700'}`}>{label}</span>
 <div className={`w-5 h-5 border flex items-center justify-center transition-all ${
 selected ? 'border-[#F97316] bg-[#F97316] text-white rounded-full' : 'border-slate-200 rounded-full'
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
 <div className="bg-[#FFF0E5] text-slate-900 selection:bg-[#F97316] selection:text-white min-h-screen pb-32">
 <section className="py-24 md:py-32 text-center relative overflow-hidden border-b border-slate-200">
 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none text-[#F97316]">
 <Cpu className="w-[400px] h-[400px] animate-spin-slow" />
 </div>
 <div className="max-w-3xl mx-auto px-6 relative z-10">
 <h1 className="text-4xl lg:text-6xl font-bold mb-8 tracking-tight text-slate-900">How can we <br />help?</h1>
 <div className="relative max-w-xl mx-auto group">
 <input 
 type="text" 
 placeholder="Search articles..." 
 className="w-full px-8 py-4 bg-white border border-slate-200 focus:border-[#F97316] outline-none transition-all text-sm font-medium placeholder:text-slate-400 rounded-xl shadow-sm text-slate-900"
 />
 <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#F97316] transition-colors">
 <ArrowRight size={20} />
 </div>
 </div>
 </div>
 </section>

 <div className="max-w-6xl mx-auto px-6 pt-16 relative z-20">
 <div className="grid md:grid-cols-3 gap-6">
 <SupportCategory 
 icon={Shield} 
 title="Verification & Safety" 
 desc="Learn about our AI proctoring and verified badge protocols."
 />
 <SupportCategory 
 icon={Briefcase} 
 title="Hiring & Projects" 
 desc="How to find talent, manage milestones and workspace deliveries."
 />
 <SupportCategory 
 icon={DollarSign} 
 title="Payments & Escrow" 
 desc="Everything about our zero brokerage model and secure payments."
 />
 </div>

 <div className="mt-32">
 <div className="flex items-center gap-6 mb-12">
 <h2 className="text-3xl font-bold tracking-tight text-slate-900">Frequently Asked Questions</h2>
 <div className="h-[1px] bg-slate-200 flex-1" />
 </div>
 <div className="grid md:grid-cols-2 gap-4 border border-transparent bg-transparent">
 <FaqRow question="How does the AI proctoring work?" />
 <FaqRow question="What is the zero brokerage model?" />
 <FaqRow question="How do I earn my first skill badge?" />
 <FaqRow question="Is my data secured on SkillScrumpt.in?" />
 <FaqRow question="Can I hire talent for full-time roles?" />
 <FaqRow question="How are disputes handled?" />
 </div>
 </div>
 </div>
 </div>
 </DashboardLayout>
 );
}

function SupportCategory({ icon: Icon, title, desc }) {
 return (
 <div className="border-transparent bg-transparent group">
 <div className="p-8 md:p-10 bg-white border border-slate-200 group-hover:border-orange-300 rounded-3xl shadow-sm hover:shadow-md transition-all h-full flex flex-col">
 <div className="w-14 h-14 border border-slate-200 text-slate-400 flex items-center justify-center mb-6 group-hover:bg-[#F97316] group-hover:text-white group-hover:border-[#F97316] rounded-2xl transition-all">
 <Icon size={24} />
 </div>
 <h3 className="text-xl font-bold tracking-tight mb-4 text-slate-900 transition-colors">{title}</h3>
 <p className="text-sm font-medium text-slate-500 leading-relaxed mb-8 transition-colors">{desc}</p>
 <Link to="#" className="mt-auto text-sm font-semibold text-slate-400 group-hover:text-[#F97316] flex items-center gap-3 transition-all">
 Explore Category <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
 </Link>
 </div>
 </div>
 );
}

function FaqRow({ question }) {
 return (
 <button className="flex items-center justify-between w-full p-6 bg-white border border-slate-200 hover:border-sky-300 hover:shadow-sm group rounded-2xl transition-all text-left">
 <span className="text-sm font-semibold text-slate-600 group-hover:text-sky-700 transition-all">{question}</span>
 <ChevronRight size={20} className="text-slate-300 group-hover:text-[#38BDF8] group-hover:translate-x-1 transition-all" />
 </button>
 );
}
