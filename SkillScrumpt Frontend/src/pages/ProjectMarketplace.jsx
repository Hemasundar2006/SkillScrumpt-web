import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
 Search, 
 Filter, 
 Briefcase, 
 DollarSign, 
 Clock, 
 ArrowRight, 
 Loader2, 
 Shield, 
 Zap,
 Cpu,
 ChevronRight,
 LayoutGrid,
 List,
 Star,
 Globe,
 Target
} from 'lucide-react';
import { Card, Badge, Button } from '../components/UI';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { DashboardLayout } from '../layout/DashboardLayout';

const Asterisk = ({ className }) => (
 <svg viewBox="0 0 100 100" className={`asterisk-spin ${className}`} fill="currentColor">
 <path d="M50 0L54.3 35.7L85.4 14.6L64.3 45.7L100 50L64.3 54.3L85.4 85.4L54.3 64.3L50 100L45.7 64.3L14.6 85.4L35.7 54.3L0 50L35.7 45.7L14.6 14.6L45.7 35.7L50 0Z" />
 </svg>
);

export function ProjectMarketplace() {
 const navigate = useNavigate();
 const [projects, setProjects] = useState([]);
 const [isLoading, setIsLoading] = useState(true);
 const [search, setSearch] = useState('');
 const [category, setCategory] = useState('All Categories');
 const [viewMode, setViewMode] = useState('grid');
 
 const userStr = localStorage.getItem('user');
 const user = userStr ? JSON.parse(userStr) : null;

 useEffect(() => {
 fetchProjects();
 document.title ="Verified Project Market | SkillScrumpt.in";
 }, []);

 const fetchProjects = async () => {
 setIsLoading(true);
 try {
 const response = await api.get('/projects');
 setProjects(response.data.filter(p => p.status === 'open'));
 } catch (err) {
 console.error('Error fetching marketplace projects:', err);
 } finally {
 setIsLoading(false);
 }
 };

 const filteredProjects = projects.filter(p => {
 const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
 p.description.toLowerCase().includes(search.toLowerCase());
 const matchesCategory = category === 'All Categories' || p.category === category;
 return matchesSearch && matchesCategory;
 });

 const content = (
 <div className="min-h-screen bg-[#FFF0E5] text-slate-900 selection:bg-[#F97316] selection:text-white pt-32 pb-40 px-4 relative overflow-hidden">
 {/* Dynamic Background */}
 <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
 <Asterisk className="absolute -top-40 -right-40 w-[800px] h-[800px] text-[#F97316]/5" />
 <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#38BDF8]/20 blur-[120px] rounded-full" />
 <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#F97316]/10 blur-[120px] rounded-full" />
 </div>

 <div className="max-w-7xl mx-auto relative z-10">
 <header className="mb-24 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12">
 <motion.div
 initial={{ opacity: 0, x: -30 }}
 animate={{ opacity: 1, x: 0 }}
 transition={{ duration: 0.8 }}
 >
 <div className="flex items-center gap-4 mb-8">
 <div className="w-12 h-[1px] bg-slate-300" />
 <span className="text-xs font-bold uppercase tracking-[0.5em] text-slate-500">Open Market</span>
 </div>
 <h1 className="text-5xl md:text-8xl font-bold tracking-tight leading-[0.85] uppercase mb-8">
 ELITE <br />
 <span className="text-[#F97316]/40">DIRECTIVES.</span>
 </h1>
 <p className="text-xl text-slate-500 font-bold uppercase tracking-wider max-w-xl leading-relaxed">
 ACCESS CRYPTOGRAPHICALLY VERIFIED PROJECTS. NO MIDDLEMAN. ZERO BROKERAGE. ABSOLUTE TRANSPARENCY.
 </p>
 </motion.div>

 <motion.div
 initial={{ opacity: 0, scale: 0.9 }}
 animate={{ opacity: 1, scale: 1 }}
 className="w-full lg:w-auto"
 >
 <div className="p-1 border border-slate-200 bg-white overflow-hidden group shadow-lg">
 <div className="bg-[#FFF0E5] p-8 md:p-10 border border-slate-200 flex flex-col md:flex-row items-center gap-10">
 <div className="text-center md:text-left">
 <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Platform Status</p>
 <div className="flex items-center gap-3">
 <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
 <span className="text-2xl font-bold tracking-tight text-slate-900">LIVE_MARKET</span>
 </div>
 </div>
 <div className="h-[1px] md:h-12 w-full md:w-[1px] bg-slate-200" />
 <div className="text-center md:text-left">
 {user ? (
 <Link to={user.role === 'client' ? '/dashboard/client' : '/dashboard/student'}>
 <button className="px-8 py-3 bg-[#F97316] text-white font-bold uppercase tracking-wider text-xs hover:bg-orange-600 transition-all shadow-lg shadow-[#F97316]/20">Go to Dashboard</button>
 </Link>
 ) : (
 <Link to="/login">
 <button className="px-8 py-3 bg-[#F97316] text-white font-bold uppercase tracking-wider text-xs hover:bg-orange-600 transition-all shadow-lg shadow-[#F97316]/20">Login to Bid</button>
 </Link>
 )}
 </div>
 </div>
 </div>
 </motion.div>
 </header>

 {/* Global Filter Matrix */}
 <motion.div 
 initial={{ opacity: 0, y: 30 }}
 animate={{ opacity: 1, y: 0 }}
 className="mb-20 p-1 border border-slate-200 bg-white shadow-sm"
 >
 <div className="bg-slate-50 border border-slate-200 p-6 flex flex-col md:flex-row gap-6">
 <div className="relative flex-1 group">
 <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#F97316] transition-colors" size={20} />
 <input 
 type="text" 
 placeholder="SEARCH_MARKET_DATABASE..." 
 value={search}
 onChange={(e) => setSearch(e.target.value)}
 className="w-full pl-16 pr-6 py-5 bg-white border border-slate-200 focus:border-[#F97316] text-slate-900 outline-none transition-all font-bold uppercase tracking-wider text-xs"
 />
 </div>
 
 <div className="flex gap-4">
 <select 
 value={category}
 onChange={(e) => setCategory(e.target.value)}
 className="px-10 py-5 bg-white border border-slate-200 focus:border-[#F97316] text-slate-900 outline-none transition-all font-bold text-xs uppercase tracking-[0.3em] cursor-pointer appearance-none min-w-[240px]"
 >
 <option className="bg-white">All Categories</option>
 <option className="bg-white">Engineering</option>
 <option className="bg-white">Design</option>
 <option className="bg-white">AI & Data</option>
 <option className="bg-white">Marketing</option>
 </select>

 <div className="flex p-1 bg-white border border-slate-200">
 <button onClick={() => setViewMode('grid')} className={`p-4 transition-all ${viewMode === 'grid' ? 'bg-slate-100 text-[#F97316]' : 'text-slate-400 hover:text-slate-600'}`}>
 <LayoutGrid size={20} />
 </button>
 <button onClick={() => setViewMode('list')} className={`p-4 transition-all ${viewMode === 'list' ? 'bg-slate-100 text-[#F97316]' : 'text-slate-400 hover:text-slate-600'}`}>
 <List size={20} />
 </button>
 </div>
 </div>
 </div>
 </motion.div>

 {/* Project Ledger */}
 {isLoading ? (
 <div className="py-60 text-center">
 <div className="inline-block relative">
 <Asterisk className="w-24 h-24 text-[#F97316] opacity-20" />
 <div className="absolute inset-0 flex items-center justify-center">
 <div className="w-8 h-8 border-2 border-[#F97316] border-t-transparent rounded-full animate-spin" />
 </div>
 </div>
 <p className="mt-12 text-xs font-bold uppercase tracking-[0.6em] text-slate-400 animate-pulse">Syncing_Elite_Directives...</p>
 </div>
 ) : filteredProjects.length > 0 ? (
 <div className={viewMode === 'grid' ?"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1" :"space-y-1"}>
 <AnimatePresence>
 {filteredProjects.map((project, i) => (
 <ProjectCard key={project._id} project={project} viewMode={viewMode} delay={i * 0.05} />
 ))}
 </AnimatePresence>
 </div>
 ) : (
 <div className="py-60 text-center border border-slate-200 bg-white shadow-sm">
 <Target className="w-20 h-20 text-slate-200 mx-auto mb-10" />
 <h3 className="text-3xl font-bold tracking-tight uppercase mb-4 text-slate-900">No Signals Detected.</h3>
 <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.4em] mb-12">REFINE_SEARCH_PARAMETERS_TO_RE_INITIATE</p>
 <button onClick={() => { setSearch(''); setCategory('All Categories'); }} className="px-16 py-6 border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold uppercase tracking-[0.4em] text-xs transition-all">Clear Protocol</button>
 </div>
 )}
 </div>
 </div>
 );

 return content;
}

function ProjectCard({ project, viewMode, delay }) {
 const navigate = useNavigate();
 
 const cardVariants = {
 hidden: { opacity: 0, y: 20 },
 visible: { opacity: 1, y: 0 }
 };

 if (viewMode === 'list') {
 return (
 <motion.div
 variants={cardVariants}
 initial="hidden"
 animate="visible"
 transition={{ delay }}
 onClick={() => navigate(`/projects/${project._id}`)}
 className="group p-1 border border-slate-200 bg-white hover:bg-sky-50 hover:border-sky-300 transition-all cursor-pointer overflow-hidden shadow-sm hover:shadow-lg"
 >
 <div className="bg-slate-50 p-8 flex flex-col md:flex-row items-center justify-between gap-10 border border-slate-100">
 <div className="flex items-center gap-10 flex-1">
 <div className="w-16 h-16 border border-slate-200 flex items-center justify-center text-slate-400 font-bold text-2xl group-hover:bg-[#F97316] group-hover:text-white group-hover:border-[#F97316] transition-all">
 {project.title[0]}
 </div>
 <div>
 <h3 className="text-2xl font-bold tracking-tight uppercase text-slate-900 group-hover:text-[#F97316] transition-colors mb-2">{project.title}</h3>
 <div className="flex flex-wrap gap-6">
 <span className="flex items-center gap-3 text-xs font-bold text-slate-500 uppercase tracking-[0.2em]"><Clock size={14} /> {new Date(project.deadline).toLocaleDateString()}</span>
 <span className="flex items-center gap-3 text-xs font-bold text-slate-500 uppercase tracking-[0.2em]"><Shield size={14} /> {project.category}</span>
 <span className="flex items-center gap-3 text-xs font-bold text-emerald-500 uppercase tracking-[0.2em]"><Zap size={14} fill="currentColor" /> Zero Brokerage</span>
 </div>
 </div>
 </div>
 
 <div className="flex items-center gap-16">
 <div className="text-right">
 <p className="text-3xl font-bold tracking-tight text-slate-900">${project.budget?.toLocaleString()}</p>
 </div>
 <ArrowRight size={24} className="text-slate-300 group-hover:text-[#F97316] transform group-hover:translate-x-2 transition-all" />
 </div>
 </div>
 </motion.div>
 );
 }

 return (
 <motion.div
 variants={cardVariants}
 initial="hidden"
 animate="visible"
 transition={{ delay }}
 onClick={() => navigate(`/projects/${project._id}`)}
 className="group p-1 border border-slate-200 bg-white hover:bg-sky-50 hover:border-sky-300 transition-all cursor-pointer shadow-sm hover:shadow-lg"
 >
 <div className="bg-slate-50 border border-slate-100 p-10 h-full flex flex-col relative overflow-hidden">
 <div className="absolute top-0 right-0 w-32 h-32 border border-slate-200 -mr-16 -mt-16 rotate-45 group-hover:border-sky-300 transition-colors" />
 
 <div className="flex justify-between items-start mb-12">
 <div className="w-16 h-16 border border-slate-200 flex items-center justify-center text-slate-400 font-bold text-2xl group-hover:bg-[#F97316] group-hover:text-white group-hover:border-[#F97316] transition-all z-10 bg-white">
 {project.title[0]}
 </div>
 <div className="px-4 py-1.5 border border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500 group-hover:text-[#F97316] group-hover:border-orange-300 transition-all z-10 bg-white">
 {project.category}
 </div>
 </div>
 
 <h3 className="text-3xl font-bold tracking-tight uppercase mb-6 leading-none text-slate-900 group-hover:text-[#F97316] transition-colors">{project.title}</h3>
 <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] line-clamp-3 mb-10 leading-relaxed">
 {project.description}
 </p>

 <div className="mt-auto pt-10 border-t border-slate-200">
 <div className="flex flex-wrap gap-2 mb-10">
 {(project.skills || ['JS', 'REACT', 'NODE']).slice(0, 3).map((skill, i) => (
 <span key={i} className="px-3 py-1 border border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500 bg-white">{skill}</span>
 ))}
 </div>
 
 <div className="flex items-center justify-between">
 <div>
 <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] mb-2">Valuation</p>
 <p className="text-3xl font-bold tracking-tight text-slate-900">${project.budget?.toLocaleString()}</p>
 </div>
 <div className="w-12 h-12 border border-slate-200 text-slate-400 flex items-center justify-center group-hover:bg-[#F97316] group-hover:text-white group-hover:border-[#F97316] transition-all bg-white">
 <ArrowRight size={20} />
 </div>
 </div>
 </div>
 </div>
 </motion.div>
 );
}
