import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Briefcase, 
  DollarSign, 
  Clock, 
  ChevronRight, 
  Loader2, 
  Zap,
  ArrowRight,
  LayoutGrid,
  List
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { DashboardLayout } from '../layout/DashboardLayout';

export function StudentProjectMarket() {
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
  }, []);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/projects');
      setProjects(response.data.filter(p => p.status === 'open'));
    } catch (err) {
      console.error('Error fetching student marketplace:', err);
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

  return (
    <DashboardLayout user={user}>
      <div className="max-w-[1400px] mx-auto w-full flex flex-col h-full font-sans">
        <header className="mb-8 shrink-0">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-2 h-2 bg-[#F97316] rounded-full animate-pulse shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
                <span className="text-[10px] font-bold text-[#1E293B]/50 uppercase tracking-wider">Marketplace</span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-[#1E293B] mb-2">Available Projects</h1>
              <p className="text-[#1E293B]/60 font-medium">Browse verified opportunities matched to your profile.</p>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
              <div className="px-4 py-2 bg-[#E0F2FE] text-[#38BDF8] rounded-[10px] text-[10px] font-bold border border-[#38BDF8]/20 flex items-center gap-2 uppercase tracking-wider shadow-sm">
                <div className="w-1.5 h-1.5 bg-[#38BDF8] rounded-full animate-pulse" />
                {projects.length} ACTIVE PROJECTS
              </div>
              <div className="flex p-1 bg-white border border-[#38BDF8]/10 rounded-[12px] shadow-sm">
                <button onClick={() => setViewMode('grid')} className={`p-2 rounded-[8px] transition-all ${viewMode === 'grid' ? 'bg-[#FFF0E5] shadow-sm text-[#F97316]' : 'text-[#1E293B]/40 hover:text-[#38BDF8]'}`}>
                  <LayoutGrid size={18} />
                </button>
                <button onClick={() => setViewMode('list')} className={`p-2 rounded-[8px] transition-all ${viewMode === 'list' ? 'bg-[#FFF0E5] shadow-sm text-[#F97316]' : 'text-[#1E293B]/40 hover:text-[#38BDF8]'}`}>
                  <List size={18} />
                </button>
              </div>
            </motion.div>
          </div>
        </header>

        {/* Filters Area */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-4 rounded-[20px] border border-[#38BDF8]/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] mb-8 flex flex-col md:flex-row gap-4 shrink-0">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1E293B]/30 group-focus-within:text-[#38BDF8] transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search projects by title, skills or keywords..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-5 py-3 bg-[#E0F2FE]/30 border border-transparent rounded-[14px] focus:border-[#38BDF8]/30 focus:bg-white outline-none transition-all font-medium text-sm text-[#1E293B]"
            />
          </div>
          
          <select 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-6 py-3 bg-[#E0F2FE]/30 border border-transparent rounded-[14px] focus:border-[#38BDF8]/30 focus:bg-white outline-none transition-all font-bold text-xs uppercase tracking-wider cursor-pointer appearance-none min-w-[200px] text-[#1E293B]"
          >
            <option>All Categories</option>
            <option>Engineering</option>
            <option>Design</option>
            <option>AI & Data</option>
            <option>Marketing</option>
          </select>
        </motion.div>

        {/* Project List */}
        <div className="flex-1 overflow-hidden flex flex-col min-h-0 relative">
          {isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
              <Loader2 className="animate-spin text-[#38BDF8]" size={40} />
              <p className="text-[10px] font-bold text-[#1E293B]/40 uppercase tracking-wider">Sourcing Projects...</p>
            </div>
          ) : filteredProjects.length > 0 ? (
            <div className={`h-full overflow-y-auto custom-scrollbar pr-2 ${viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max" : "space-y-4"}`}>
              <AnimatePresence>
                {filteredProjects.map((project, i) => (
                  <MarketProjectCard 
                    key={project._id} 
                    project={project} 
                    viewMode={viewMode} 
                    delay={i * 0.05} 
                  />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center bg-white rounded-[24px] border border-[#38BDF8]/10 shadow-sm p-12">
              <div className="w-20 h-20 bg-[#E0F2FE] rounded-full flex items-center justify-center mx-auto mb-6 text-[#38BDF8] shadow-inner">
                <Briefcase size={32} />
              </div>
              <h3 className="text-2xl font-bold text-[#1E293B] mb-2 tracking-tight">No projects found</h3>
              <p className="text-[#1E293B]/50 text-sm mb-8 font-medium">Try adjusting your search or category filters.</p>
              <button onClick={() => { setSearch(''); setCategory('All Categories'); }} className="px-8 py-3 bg-[#F97316] text-white font-bold rounded-[12px] text-sm hover:bg-[#EA580C] hover:-translate-y-0.5 shadow-[0_8px_20px_rgba(249,115,22,0.25)] transition-all">Reset Filters</button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

function MarketProjectCard({ project, viewMode, delay }) {
  const navigate = useNavigate();
  
  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay }}
        onClick={() => navigate(`/projects/${project._id}`)}
        className="group bg-white p-6 border border-[#38BDF8]/10 rounded-[16px] flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-[#38BDF8]/30 hover:shadow-[0_8px_24px_rgba(56,189,248,0.08)] hover:-translate-y-0.5 transition-all cursor-pointer"
      >
        <div className="flex items-center gap-6 flex-1">
          <div className="w-14 h-14 bg-[#E0F2FE] text-[#38BDF8] rounded-[12px] flex items-center justify-center font-bold text-xl shadow-inner group-hover:scale-105 transition-transform">
            {project.title[0]}
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#1E293B] mb-2 group-hover:text-[#38BDF8] transition-colors">{project.title}</h3>
            <div className="flex flex-wrap gap-3 items-center">
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-[#1E293B]/50 uppercase tracking-wider"><Clock size={14} className="text-[#38BDF8]" /> {new Date(project.deadline).toLocaleDateString()}</span>
              <span className="w-1 h-1 bg-[#1E293B]/20 rounded-full" />
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-[#F97316] bg-[#FFF0E5] px-2.5 py-1 rounded-[8px] uppercase tracking-wider">{project.category}</span>
              <span className="w-1 h-1 bg-[#1E293B]/20 rounded-full" />
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 uppercase tracking-wider"><Zap size={14} fill="currentColor" /> Zero Fee</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-8 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-8">
          <div className="text-left md:text-right">
            <p className="text-2xl font-bold text-[#1E293B] tracking-tight">${project.budget?.toLocaleString()}</p>
            <p className="text-[10px] font-bold text-[#1E293B]/40 uppercase tracking-wider mt-1">Fixed Budget</p>
          </div>
          <div className="w-10 h-10 bg-slate-50 rounded-[10px] flex items-center justify-center text-slate-300 group-hover:bg-[#F97316] group-hover:text-white transition-all shadow-sm transform group-hover:translate-x-1 shrink-0 hidden md:flex">
            <ArrowRight size={18} />
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      onClick={() => navigate(`/projects/${project._id}`)}
      className="group bg-white p-8 rounded-[24px] border border-[#38BDF8]/10 hover:border-[#38BDF8]/30 hover:shadow-[0_12px_30px_rgba(56,189,248,0.08)] hover:-translate-y-1 transition-all cursor-pointer flex flex-col h-[320px]"
    >
      <div className="flex justify-between items-start mb-6">
        <div className="w-14 h-14 bg-[#E0F2FE] text-[#38BDF8] rounded-[16px] flex items-center justify-center font-bold text-xl shadow-inner group-hover:scale-110 transition-transform">
          {project.title[0]}
        </div>
        <div className="px-3 py-1.5 bg-[#FFF0E5] text-[#F97316] text-[10px] font-bold uppercase tracking-wider rounded-[8px] transition-colors">
          {project.category}
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-[#1E293B] mb-3 group-hover:text-[#38BDF8] transition-colors line-clamp-2 tracking-tight">{project.title}</h3>
      <p className="text-sm text-[#1E293B]/60 font-medium line-clamp-2 mb-6 leading-relaxed">
        {project.description}
      </p>

      <div className="mt-auto pt-6 border-t border-[#E0F2FE]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-[#1E293B]/40 uppercase tracking-wider mb-1">Budget</p>
            <p className="text-2xl font-bold text-[#1E293B] tracking-tight">${project.budget?.toLocaleString()}</p>
          </div>
          <div className="w-12 h-12 bg-[#E0F2FE]/50 rounded-[12px] flex items-center justify-center text-[#38BDF8] group-hover:bg-[#F97316] group-hover:text-white group-hover:shadow-[0_4px_12px_rgba(249,115,22,0.3)] transition-all transform group-hover:translate-x-1">
            <ArrowRight size={20} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
