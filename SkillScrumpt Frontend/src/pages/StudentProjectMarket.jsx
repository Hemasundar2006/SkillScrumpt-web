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
  Activity,
  ArrowRight,
  Shield,
  LayoutGrid,
  List
} from 'lucide-react';
import { Card, Badge, Button } from '../components/UI';
import { useNavigate, Link } from 'react-router-dom';
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
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Marketplace</h1>
              <p className="text-slate-500 font-medium">Browse verified opportunities matched to your skill profile.</p>
            </div>
            
            <div className="flex items-center gap-3">
               <div className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold border border-emerald-100 flex items-center gap-2">
                 <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                 {projects.length} ACTIVE PROJECTS
               </div>
               <div className="flex p-1 bg-slate-100 rounded-xl">
                  <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}>
                    <LayoutGrid size={18} />
                  </button>
                  <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}>
                    <List size={18} />
                  </button>
               </div>
            </div>
          </div>
        </header>

        {/* Filters Area */}
        <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm mb-8 flex flex-col md:flex-row gap-4">
           <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search projects by title, skills or keywords..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:border-indigo-500 outline-none transition-all font-medium text-sm"
              />
           </div>
           
           <select 
             value={category}
             onChange={(e) => setCategory(e.target.value)}
             className="px-6 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:border-indigo-500 outline-none transition-all font-bold text-xs uppercase tracking-widest cursor-pointer appearance-none min-w-[200px] text-slate-700"
           >
             <option>All Categories</option>
             <option>Engineering</option>
             <option>Design</option>
             <option>AI & Data</option>
             <option>Marketing</option>
           </select>
        </div>

        {/* Project List */}
        {isLoading ? (
          <div className="py-40 flex flex-col items-center justify-center gap-4">
             <Loader2 className="animate-spin text-indigo-600" size={40} />
             <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Sourcing Projects...</p>
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
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
          <div className="py-32 text-center bg-white rounded-[2rem] border border-slate-100 shadow-sm">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                <Briefcase size={32} />
             </div>
             <h3 className="text-xl font-bold text-slate-900 mb-2">No projects found</h3>
             <p className="text-slate-500 text-sm mb-8">Try adjusting your search or category filters.</p>
             <button onClick={() => { setSearch(''); setCategory('All Categories'); }} className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl text-sm hover:bg-indigo-700 transition-all">Reset Filters</button>
          </div>
        )}
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
        className="group bg-white p-4 border border-slate-100 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-indigo-200 hover:shadow-md transition-all cursor-pointer"
      >
        <div className="flex items-center gap-5 flex-1">
          <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-bold text-xl shadow-sm group-hover:scale-105 transition-transform">
            {project.title[0]}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">{project.title}</h3>
            <div className="flex flex-wrap gap-4 items-center">
               <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400"><Clock size={14} /> {new Date(project.deadline).toLocaleDateString()}</span>
               <span className="w-1 h-1 bg-slate-200 rounded-full" />
               <span className="flex items-center gap-1.5 text-xs font-bold text-indigo-500 bg-indigo-50 px-2.5 py-1 rounded-lg uppercase tracking-wider">{project.category}</span>
               <span className="w-1 h-1 bg-slate-200 rounded-full" />
               <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600"><Zap size={14} fill="currentColor" /> Zero Fee</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-8">
           <div className="text-right">
              <p className="text-xl font-bold text-slate-900">${project.budget?.toLocaleString()}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Fixed Budget</p>
           </div>
           <ChevronRight size={20} className="text-slate-300 group-hover:text-indigo-600 transition-colors transform group-hover:translate-x-1" />
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
      className="group bg-white p-8 rounded-[2rem] border border-slate-100 hover:border-indigo-200 hover:shadow-xl transition-all cursor-pointer flex flex-col h-full"
    >
      <div className="flex justify-between items-start mb-8">
        <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-bold text-xl shadow-sm group-hover:scale-110 transition-transform">
          {project.title[0]}
        </div>
        <div className="px-3 py-1.5 bg-slate-50 border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400 rounded-lg group-hover:text-indigo-600 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-all">
          {project.category}
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-indigo-600 transition-colors line-clamp-2">{project.title}</h3>
      <p className="text-sm text-slate-500 font-medium line-clamp-3 mb-8 leading-relaxed">
        {project.description}
      </p>

      <div className="mt-auto pt-6 border-t border-slate-50">
        <div className="flex flex-wrap gap-2 mb-8">
          {(project.skills || []).slice(0, 3).map((skill, i) => (
            <span key={i} className="px-3 py-1.5 bg-slate-50 text-slate-600 text-[10px] font-bold rounded-lg border border-slate-100">{skill}</span>
          ))}
        </div>
        
        <div className="flex items-center justify-between">
           <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Budget</p>
              <p className="text-2xl font-bold text-slate-900">${project.budget?.toLocaleString()}</p>
           </div>
           <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
              <ArrowRight size={18} />
           </div>
        </div>
      </div>
    </motion.div>
  );
}
