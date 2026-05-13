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
    document.title = "Verified Project Market | SkillScrumpt.in";
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
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black pt-32 pb-40 px-4 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <Asterisk className="absolute -top-40 -right-40 w-[800px] h-[800px] text-white/5" />
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-indigo-500/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="mb-24 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-4 mb-8">
               <div className="w-12 h-[1px] bg-white/40" />
               <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/60 italic">Open Market</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.85] uppercase italic mb-8">
              ELITE <br />
              <span className="text-white/20">DIRECTIVES.</span>
            </h1>
            <p className="text-xl text-white/60 font-bold uppercase tracking-widest max-w-xl leading-relaxed">
              ACCESS CRYPTOGRAPHICALLY VERIFIED PROJECTS. NO MIDDLEMAN. ZERO BROKERAGE. ABSOLUTE TRANSPARENCY.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full lg:w-auto"
          >
            <div className="p-1 border border-white/10 bg-white/5 overflow-hidden group">
               <div className="bg-black p-8 md:p-10 border border-white/10 flex flex-col md:flex-row items-center gap-10">
                  <div className="text-center md:text-left">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2">Platform Status</p>
                    <div className="flex items-center gap-3">
                       <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                       <span className="text-2xl font-black italic tracking-tighter">LIVE_MARKET</span>
                    </div>
                  </div>
                  <div className="h-[1px] md:h-12 w-full md:w-[1px] bg-white/10" />
                  <div className="text-center md:text-left">
                    {user ? (
                      <Link to={user.role === 'client' ? '/dashboard/client' : '/dashboard/student'}>
                        <button className="px-8 py-3 bg-white text-black font-black uppercase tracking-widest text-[10px] hover:bg-white/90 transition-all italic">Go to Dashboard</button>
                      </Link>
                    ) : (
                      <Link to="/login">
                        <button className="px-8 py-3 bg-white text-black font-black uppercase tracking-widest text-[10px] hover:bg-white/90 transition-all italic">Login to Bid</button>
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
          className="mb-20 p-1 border border-white/10 bg-white/5"
        >
          <div className="bg-black border border-white/10 p-6 flex flex-col md:flex-row gap-6">
             <div className="relative flex-1 group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-white transition-colors" size={20} />
                <input 
                  type="text" 
                  placeholder="SEARCH_MARKET_DATABASE..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-16 pr-6 py-5 bg-white/5 border border-white/5 focus:border-white/20 outline-none transition-all font-black uppercase tracking-widest text-xs italic"
                />
             </div>
             
             <div className="flex gap-4">
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="px-10 py-5 bg-white/5 border border-white/5 focus:border-white/20 outline-none transition-all font-black text-[10px] uppercase tracking-[0.3em] cursor-pointer appearance-none min-w-[240px] italic"
                >
                  <option className="bg-zinc-900">All Categories</option>
                  <option className="bg-zinc-900">Engineering</option>
                  <option className="bg-zinc-900">Design</option>
                  <option className="bg-zinc-900">AI & Data</option>
                  <option className="bg-zinc-900">Marketing</option>
                </select>

                <div className="flex p-1 bg-white/5 border border-white/5">
                  <button onClick={() => setViewMode('grid')} className={`p-4 transition-all ${viewMode === 'grid' ? 'bg-white text-black' : 'text-white/20 hover:text-white'}`}>
                    <LayoutGrid size={20} />
                  </button>
                  <button onClick={() => setViewMode('list')} className={`p-4 transition-all ${viewMode === 'list' ? 'bg-white text-black' : 'text-white/20 hover:text-white'}`}>
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
               <Asterisk className="w-24 h-24 text-white opacity-20" />
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
               </div>
            </div>
            <p className="mt-12 text-[10px] font-black uppercase tracking-[0.6em] text-white/30 animate-pulse">Syncing_Elite_Directives...</p>
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1" : "space-y-1"}>
            <AnimatePresence>
              {filteredProjects.map((project, i) => (
                <ProjectCard key={project._id} project={project} viewMode={viewMode} delay={i * 0.05} />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="py-60 text-center border border-white/10 bg-white/5">
            <Target className="w-20 h-20 text-white/10 mx-auto mb-10" />
            <h3 className="text-3xl font-black italic tracking-tighter uppercase mb-4">No Signals Detected.</h3>
            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-12 italic">REFINE_SEARCH_PARAMETERS_TO_RE_INITIATE</p>
            <button onClick={() => { setSearch(''); setCategory('All Categories'); }} className="px-16 py-6 border border-white text-white font-black uppercase tracking-[0.4em] text-xs hover:bg-white hover:text-black transition-all">Clear Protocol</button>
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
        className="group p-1 border border-white/5 bg-white/5 hover:bg-white/10 transition-all cursor-pointer overflow-hidden"
      >
        <div className="bg-black p-8 flex flex-col md:flex-row items-center justify-between gap-10 border border-white/5 group-hover:border-white/20">
          <div className="flex items-center gap-10 flex-1">
            <div className="w-16 h-16 border border-white/10 flex items-center justify-center text-white/20 font-black text-2xl italic group-hover:bg-white group-hover:text-black group-hover:border-white transition-all">
              {project.title[0]}
            </div>
            <div>
              <h3 className="text-2xl font-black italic tracking-tight uppercase group-hover:text-white transition-colors mb-2">{project.title}</h3>
              <div className="flex flex-wrap gap-6">
                <span className="flex items-center gap-3 text-[10px] font-black text-white/30 uppercase tracking-[0.2em] italic"><Clock size={14} /> {new Date(project.deadline).toLocaleDateString()}</span>
                <span className="flex items-center gap-3 text-[10px] font-black text-white/30 uppercase tracking-[0.2em] italic"><Shield size={14} /> {project.category}</span>
                <span className="flex items-center gap-3 text-[10px] font-black text-emerald-500/60 uppercase tracking-[0.2em] italic"><Zap size={14} fill="currentColor" /> Zero Brokerage</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-16">
            <div className="text-right">
               <p className="text-3xl font-black italic tracking-tighter text-white">${project.budget?.toLocaleString()}</p>
            </div>
            <ArrowRight size={24} className="text-white/20 group-hover:text-white transform group-hover:translate-x-2 transition-all" />
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
      className="group p-1 border border-white/5 bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
    >
      <div className="bg-black border border-white/5 p-10 h-full flex flex-col relative overflow-hidden group-hover:border-white/20">
        <div className="absolute top-0 right-0 w-32 h-32 border border-white/5 -mr-16 -mt-16 rotate-45 group-hover:border-white/10 transition-colors" />
        
        <div className="flex justify-between items-start mb-12">
          <div className="w-16 h-16 border border-white/10 flex items-center justify-center text-white/20 font-black text-2xl italic group-hover:bg-white group-hover:text-black group-hover:border-white transition-all">
            {project.title[0]}
          </div>
          <div className="px-4 py-1.5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-white/40 group-hover:text-white group-hover:border-white/30 transition-all italic">
            {project.category}
          </div>
        </div>
        
        <h3 className="text-3xl font-black italic tracking-tighter uppercase mb-6 leading-none group-hover:text-white transition-colors">{project.title}</h3>
        <p className="text-[11px] font-bold text-white/30 uppercase tracking-[0.2em] line-clamp-3 mb-10 leading-relaxed italic">
          {project.description}
        </p>

        <div className="mt-auto pt-10 border-t border-white/5">
          <div className="flex flex-wrap gap-2 mb-10">
            {(project.skills || ['JS', 'REACT', 'NODE']).slice(0, 3).map((skill, i) => (
              <span key={i} className="px-3 py-1 border border-white/10 text-[8px] font-black uppercase tracking-widest text-white/20">{skill}</span>
            ))}
          </div>
          
          <div className="flex items-center justify-between">
             <div>
                <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] mb-2 italic">Valuation</p>
                <p className="text-3xl font-black italic tracking-tighter text-white">${project.budget?.toLocaleString()}</p>
             </div>
             <div className="w-12 h-12 border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black group-hover:border-white transition-all">
                <ArrowRight size={20} />
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
