import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  DollarSign, 
  Clock, 
  ArrowRight, 
  Loader2, 
  Shield, 
  Zap,
  Cpu,
  Star,
  Plus,
  X,
  Check,
  Code,
  Sparkles,
  Bookmark
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

export function GigMarketplace() {
  const navigate = useNavigate();
  const [gigs, setGigs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [selectedGig, setSelectedGig] = useState(null);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(null);
  
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    fetchGigs();
    document.title = "Verified Service Market | SkillScrumpt.in";
  }, []);

  const fetchGigs = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/gigs');
      setGigs(response.data);
    } catch (err) {
      console.error('Error fetching marketplace gigs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePurchase = async (gigId) => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'client') {
      alert('Only Clients can purchase service packages.');
      return;
    }

    setIsPurchasing(true);
    try {
      const res = await api.post(`/gigs/${gigId}/buy`);
      setPurchaseSuccess(res.data.project);
    } catch (err) {
      alert(err.response?.data?.message || 'Error executing purchase protocol.');
    } finally {
      setIsPurchasing(false);
    }
  };

  const filteredGigs = gigs.filter(g => {
    const matchesSearch = g.title.toLowerCase().includes(search.toLowerCase()) || 
                          g.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'All Categories' || g.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black pt-32 pb-40 px-4 relative overflow-hidden">
      {/* Background Matrix */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <Asterisk className="absolute -top-40 -right-40 w-[800px] h-[800px] text-white/5" />
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-500/20 blur-[120px] rounded-full" />
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
               <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/60 italic">Predefined Packages</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.85] uppercase italic mb-8">
              SERVICE <br />
              <span className="text-white/20">PACKAGES.</span>
            </h1>
            <p className="text-xl text-white/60 font-bold uppercase tracking-widest max-w-2xl leading-relaxed">
              BROWSE PRE-BUILT SOLUTIONS FROM PassPass PASS-PORT VERIFIED OPERATIVES. DIRECT DISPATCH. ZERO COMPLAINTS.
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
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2">Service System Status</p>
                    <div className="flex items-center gap-3">
                       <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                       <span className="text-2xl font-black italic tracking-tighter">DISPATCH_OPERATIVE</span>
                    </div>
                  </div>
                  <div className="h-[1px] md:h-12 w-full md:w-[1px] bg-white/10" />
                  <div className="text-center md:text-left">
                    {user?.role === 'professional' ? (
                      <Link to="/dashboard/student/settings">
                        <button className="px-8 py-3 bg-white text-black font-black uppercase tracking-widest text-[10px] hover:bg-white/90 transition-all italic flex items-center gap-2">
                          <Plus size={14} /> Post Gig Package
                        </button>
                      </Link>
                    ) : (
                      <button 
                        onClick={() => navigate('/marketplace')}
                        className="px-8 py-3 border border-white text-white hover:bg-white hover:text-black font-black uppercase tracking-widest text-[10px] transition-all italic"
                      >
                        Browse Projects
                      </button>
                    )}
                  </div>
               </div>
            </div>
          </motion.div>
        </header>

        {/* Filters Panel */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 p-1 border border-white/10 bg-white/5"
        >
          <div className="bg-black border border-white/10 p-6 flex flex-col md:flex-row gap-6">
             <div className="relative flex-1 group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-white transition-colors" size={20} />
                <input 
                  type="text" 
                  placeholder="FILTER_SERVICE_DATABASE..." 
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
                  <option className="bg-zinc-900">Development</option>
                  <option className="bg-zinc-900">Design</option>
                  <option className="bg-zinc-900">AI & Data</option>
                  <option className="bg-zinc-900">Marketing</option>
                </select>
             </div>
          </div>
        </motion.div>

        {/* Gigs List */}
        {isLoading ? (
          <div className="py-60 text-center">
            <div className="inline-block relative">
               <Asterisk className="w-24 h-24 text-white opacity-20" />
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
               </div>
            </div>
            <p className="mt-12 text-[10px] font-black uppercase tracking-[0.6em] text-white/30 animate-pulse">Syncing_Service_Nodes...</p>
          </div>
        ) : filteredGigs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGigs.map((gig) => (
              <motion.div
                key={gig._id}
                layoutId={`gig-${gig._id}`}
                onClick={() => setSelectedGig(gig)}
                className="group border border-white/5 bg-[#050505] hover:bg-zinc-950 hover:border-white/20 transition-all p-8 flex flex-col justify-between cursor-pointer relative"
              >
                <div>
                  <div className="flex justify-between items-start mb-8">
                    <div className="px-4 py-1.5 border border-white/10 text-[8px] font-black uppercase tracking-widest text-white/40 italic">
                      {gig.category}
                    </div>
                    <div className="flex items-center gap-2">
                      <Star size={14} className="text-amber-500 fill-amber-500" />
                      <span className="text-xs font-black italic">{gig.professional?.rating?.toFixed(1) || '0.0'}</span>
                    </div>
                  </div>

                  <h3 className="text-2xl font-black italic uppercase tracking-tight mb-4 group-hover:text-blue-400 transition-colors leading-tight">
                    {gig.title}
                  </h3>
                  
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest line-clamp-3 mb-8 leading-relaxed italic">
                    {gig.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-white/5 mt-auto">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-zinc-800 border border-white/10 rounded-full flex items-center justify-center text-xs font-bold uppercase overflow-hidden">
                        {gig.professional?.avatar ? (
                          <img src={gig.professional.avatar} alt="avatar" className="w-full h-full object-cover" />
                        ) : (
                          gig.professional?.firstName?.[0] || 'O'
                        )}
                      </div>
                      <div>
                        <p className="text-[9px] font-black tracking-widest text-white">{gig.professional?.firstName} {gig.professional?.lastName}</p>
                        <p className="text-[8px] font-black tracking-wider text-blue-500 uppercase mt-0.5">AI_SCORE: {gig.professional?.aiScore || 0}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-[8px] font-black text-white/30 uppercase tracking-wider mb-0.5">Price</p>
                      <p className="text-2xl font-black italic tracking-tighter text-white">${gig.price}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-[0.2em] text-white/30">
                    <span className="flex items-center gap-1.5"><Clock size={12} /> {gig.deliveryTime} Days Delivery</span>
                    <span>{gig.salesCount} Direct Dispatches</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-60 text-center border border-white/10 bg-white/5">
            <Bookmark className="w-20 h-20 text-white/10 mx-auto mb-10" />
            <h3 className="text-3xl font-black italic tracking-tighter uppercase mb-4">No Services Dispatched.</h3>
            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-12 italic">REFINE_SEARCH_PARAMETERS_TO_RE_INITIATE</p>
            <button onClick={() => { setSearch(''); setCategory('All Categories'); }} className="px-16 py-6 border border-white text-white font-black uppercase tracking-[0.4em] text-xs hover:bg-white hover:text-black transition-all">Clear Protocol</button>
          </div>
        )}
      </div>

      {/* Gig Details Overlay Modal */}
      <AnimatePresence>
        {selectedGig && !purchaseSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-md"
          >
            <motion.div 
              layoutId={`gig-${selectedGig._id}`}
              className="bg-black border border-white/10 p-8 md:p-12 max-w-2xl w-full relative overflow-hidden"
            >
              <button 
                onClick={() => setSelectedGig(null)}
                className="absolute top-6 right-6 p-2 text-white/40 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              <div className="flex items-center gap-3 mb-8 text-[10px] font-black text-blue-500 uppercase tracking-widest italic">
                <Shield size={14} /> Verified Service Package Node
              </div>

              <h2 className="text-3xl md:text-4xl font-black italic tracking-tighter uppercase leading-none mb-4">
                {selectedGig.title}
              </h2>

              <div className="flex flex-wrap gap-4 items-center mb-8">
                <span className="px-3 py-1 bg-white/10 text-[9px] font-black uppercase tracking-widest">{selectedGig.category}</span>
                <span className="flex items-center gap-1.5 text-xs text-white/60 font-bold uppercase"><Clock size={12} /> {selectedGig.deliveryTime} Days Delivery</span>
                <span className="flex items-center gap-1 text-xs text-white/60 font-bold uppercase"><Star size={12} className="text-amber-500 fill-amber-500" /> {selectedGig.professional?.rating?.toFixed(1) || '0.0'} (Operative)</span>
              </div>

              <div className="space-y-6 mb-8 text-[11px] font-bold text-white/60 uppercase tracking-widest leading-relaxed italic whitespace-pre-wrap">
                {selectedGig.description}
              </div>

              <div className="bg-zinc-950 p-6 border border-white/5 mb-8">
                <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-4">Package Scope Deliverables</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {(selectedGig.features?.length ? selectedGig.features : ['Core Implementation', 'PassPro Assessment Cleared', 'Complete System Handover']).map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-xs font-bold text-white/80 uppercase tracking-wider">
                      <Check size={14} className="text-emerald-400" />
                      {feat}
                    </div>
                  ))}
                </div>
              </div>

              {/* Provider Info */}
              <div className="flex items-center justify-between p-6 border border-white/10 mb-8 bg-[#030303]">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-zinc-800 border border-white/10 rounded-full flex items-center justify-center font-bold text-lg overflow-hidden">
                    {selectedGig.professional?.avatar ? (
                      <img src={selectedGig.professional.avatar} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      selectedGig.professional?.firstName?.[0]
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-black uppercase italic text-white">{selectedGig.professional?.firstName} {selectedGig.professional?.lastName}</h4>
                    <p className="text-[9px] font-black tracking-widest text-blue-500 uppercase mt-0.5">AI_PROCTORING_SCORE: {selectedGig.professional?.aiScore || 0}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">Contract Valuation</p>
                  <p className="text-3xl font-black italic tracking-tighter text-white">${selectedGig.price}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setSelectedGig(null)}
                  className="flex-1 py-4 border border-white/10 text-white hover:bg-white/5 font-black uppercase tracking-widest text-[10px] italic transition-all"
                >
                  Terminate Request
                </button>
                <button 
                  onClick={() => handlePurchase(selectedGig._id)}
                  disabled={isPurchasing}
                  className="flex-1 py-4 bg-white text-black hover:bg-white/90 font-black uppercase tracking-widest text-[10px] italic transition-all flex items-center justify-center gap-2"
                >
                  {isPurchasing ? (
                    <>
                      <Loader2 className="animate-spin" size={14} /> SECURING_ESCROW_NODES...
                    </>
                  ) : (
                    <>
                      INITIATE PURCHASE PROTOCOL <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Glorious success check-out screen */}
      <AnimatePresence>
        {purchaseSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-black border border-emerald-500/20 p-12 max-w-xl w-full text-center relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
              
              <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-emerald-500/5">
                <Check size={40} />
              </div>

              <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-4 text-emerald-400">
                PURCHASE_SECURED
              </h2>
              <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-8 italic">
                TRANSACTION_VERIFIED_ON_LEDGER
              </p>

              <p className="text-sm font-bold text-white/60 uppercase tracking-widest mb-10 leading-relaxed italic">
                Your direct dispatch contract has been initialized. Milestone funding of <span className="text-white">${purchaseSuccess.budget?.exact}</span> has been simulated into secure Escrow. Enter your Workspace node to coordinate execution.
              </p>

              <button 
                onClick={() => {
                  const pId = purchaseSuccess._id;
                  setPurchaseSuccess(null);
                  setSelectedGig(null);
                  navigate(`/workspace/${pId}`);
                }}
                className="w-full py-5 bg-emerald-500 text-black hover:bg-emerald-400 font-black uppercase tracking-widest text-[10px] transition-all italic flex items-center justify-center gap-3 shadow-lg shadow-emerald-500/10"
              >
                ENTER PROJECT WORKSPACE <ArrowRight size={14} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
