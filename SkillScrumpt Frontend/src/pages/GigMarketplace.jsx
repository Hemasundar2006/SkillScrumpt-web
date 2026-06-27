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
 document.title ="Verified Service Market | SkillScrumpt.in";
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
 <div className="min-h-screen bg-[#FFF0E5] text-slate-900 selection:bg-[#F97316] selection:text-white pt-32 pb-40 px-4 relative overflow-hidden">
 {/* Background Matrix */}
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
 <span className="text-xs font-bold uppercase tracking-[0.5em] text-slate-500">Predefined Packages</span>
 </div>
 <h1 className="text-5xl md:text-8xl font-bold tracking-tight leading-[0.85] uppercase mb-8">
 SERVICE <br />
 <span className="text-[#F97316]/40">PACKAGES.</span>
 </h1>
 <p className="text-xl text-slate-500 font-bold uppercase tracking-wider max-w-2xl leading-relaxed">
 BROWSE PRE-BUILT SOLUTIONS FROM PassPass PASS-PORT VERIFIED OPERATIVES. DIRECT DISPATCH. ZERO COMPLAINTS.
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
 <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Service System Status</p>
 <div className="flex items-center gap-3">
 <div className="w-2 h-2 bg-[#38BDF8] rounded-full animate-pulse" />
 <span className="text-2xl font-bold tracking-tight">DISPATCH_OPERATIVE</span>
 </div>
 </div>
 <div className="h-[1px] md:h-12 w-full md:w-[1px] bg-slate-200" />
 <div className="text-center md:text-left">
 {user?.role === 'professional' ? (
 <Link to="/dashboard/student/settings">
 <button className="px-8 py-3 bg-[#F97316] text-white font-bold uppercase tracking-wider text-xs hover:bg-orange-600 transition-all flex items-center gap-2 shadow-lg shadow-[#F97316]/20">
 <Plus size={14} /> Post Gig Package
 </button>
 </Link>
 ) : (
 <button 
 onClick={() => navigate('/marketplace')}
 className="px-8 py-3 border border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-900 font-bold uppercase tracking-wider text-xs transition-all"
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
 className="mb-16 p-1 border border-slate-200 bg-white shadow-sm"
 >
 <div className="bg-slate-50 border border-slate-200 p-6 flex flex-col md:flex-row gap-6">
 <div className="relative flex-1 group">
 <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#F97316] transition-colors" size={20} />
 <input 
 type="text" 
 placeholder="FILTER_SERVICE_DATABASE..." 
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
 <option className="bg-white">Development</option>
 <option className="bg-white">Design</option>
 <option className="bg-white">AI & Data</option>
 <option className="bg-white">Marketing</option>
 </select>
 </div>
 </div>
 </motion.div>

 {/* Gigs List */}
 {isLoading ? (
 <div className="py-60 text-center">
 <div className="inline-block relative">
 <Asterisk className="w-24 h-24 text-[#F97316] opacity-20" />
 <div className="absolute inset-0 flex items-center justify-center">
 <div className="w-8 h-8 border-2 border-[#F97316] border-t-transparent rounded-full animate-spin" />
 </div>
 </div>
 <p className="mt-12 text-xs font-bold uppercase tracking-[0.6em] text-slate-400 animate-pulse">Syncing_Service_Nodes...</p>
 </div>
 ) : filteredGigs.length > 0 ? (
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 {filteredGigs.map((gig) => (
 <motion.div
 key={gig._id}
 layoutId={`gig-${gig._id}`}
 onClick={() => setSelectedGig(gig)}
 className="group border border-slate-200 bg-white hover:bg-sky-50 hover:border-sky-300 hover:shadow-xl transition-all p-8 flex flex-col justify-between cursor-pointer relative"
 >
 <div>
 <div className="flex justify-between items-start mb-8">
 <div className="px-4 py-1.5 border border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-50">
 {gig.category}
 </div>
 <div className="flex items-center gap-2">
 <Star size={14} className="text-amber-500 fill-amber-500" />
 <span className="text-xs font-bold text-slate-900">{gig.professional?.rating?.toFixed(1) || '0.0'}</span>
 </div>
 </div>

 <h3 className="text-2xl font-bold uppercase tracking-tight mb-4 group-hover:text-[#F97316] transition-colors leading-tight text-slate-900">
 {gig.title}
 </h3>
 
 <p className="text-xs font-bold text-slate-500 uppercase tracking-wider line-clamp-3 mb-8 leading-relaxed">
 {gig.description}
 </p>
 </div>

 <div className="pt-6 border-t border-slate-100 mt-auto">
 <div className="flex items-center justify-between mb-6">
 <div className="flex items-center gap-3">
 <div className="w-8 h-8 bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center text-xs font-bold uppercase overflow-hidden text-slate-600">
 {gig.professional?.avatar ? (
 <img src={gig.professional.avatar} alt="avatar" className="w-full h-full object-cover" />
 ) : (
 gig.professional?.firstName?.[0] || 'O'
 )}
 </div>
 <div>
 <p className="text-xs font-bold tracking-wider text-slate-900">{gig.professional?.firstName} {gig.professional?.lastName}</p>
 <p className="text-xs font-bold tracking-wider text-[#38BDF8] uppercase mt-0.5">AI_SCORE: {gig.professional?.aiScore || 0}</p>
 </div>
 </div>
 
 <div className="text-right">
 <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">Price</p>
 <p className="text-2xl font-bold tracking-tight text-slate-900">${gig.price}</p>
 </div>
 </div>

 <div className="flex justify-between items-center text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
 <span className="flex items-center gap-1.5"><Clock size={12} /> {gig.deliveryTime} Days Delivery</span>
 <span>{gig.salesCount} Direct Dispatches</span>
 </div>
 </div>
 </motion.div>
 ))}
 </div>
 ) : (
 <div className="py-60 text-center border border-slate-200 bg-white shadow-sm">
 <Bookmark className="w-20 h-20 text-slate-200 mx-auto mb-10" />
 <h3 className="text-3xl font-bold tracking-tight uppercase mb-4 text-slate-900">No Services Dispatched.</h3>
 <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.4em] mb-12">REFINE_SEARCH_PARAMETERS_TO_RE_INITIATE</p>
 <button onClick={() => { setSearch(''); setCategory('All Categories'); }} className="px-16 py-6 border border-slate-300 text-slate-700 font-bold uppercase tracking-[0.4em] text-xs hover:bg-slate-100 transition-all shadow-sm">Clear Protocol</button>
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
 className="fixed inset-0 bg-slate-900/95 z-50 flex items-center justify-center p-4 backdrop-blur-md"
 >
 <motion.div 
 layoutId={`gig-${selectedGig._id}`}
 className="bg-white border border-slate-200 shadow-2xl p-8 md:p-12 max-w-2xl w-full relative overflow-hidden text-slate-900"
 >
 <button 
 onClick={() => setSelectedGig(null)}
 className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 transition-colors"
 >
 <X size={24} />
 </button>

 <div className="flex items-center gap-3 mb-8 text-xs font-bold text-[#38BDF8] uppercase tracking-wider">
 <Shield size={14} /> Verified Service Package Node
 </div>

 <h2 className="text-3xl md:text-4xl font-bold tracking-tight uppercase leading-none mb-4 text-slate-900">
 {selectedGig.title}
 </h2>

 <div className="flex flex-wrap gap-4 items-center mb-8">
 <span className="px-3 py-1 bg-slate-100 text-xs font-bold uppercase tracking-wider text-slate-600">{selectedGig.category}</span>
 <span className="flex items-center gap-1.5 text-xs text-slate-500 font-bold uppercase"><Clock size={12} /> {selectedGig.deliveryTime} Days Delivery</span>
 <span className="flex items-center gap-1 text-xs text-slate-500 font-bold uppercase"><Star size={12} className="text-amber-500 fill-amber-500" /> {selectedGig.professional?.rating?.toFixed(1) || '0.0'} (Operative)</span>
 </div>

 <div className="space-y-6 mb-8 text-xs font-bold text-slate-600 uppercase tracking-wider leading-relaxed whitespace-pre-wrap">
 {selectedGig.description}
 </div>

 <div className="bg-slate-50 p-6 border border-slate-100 mb-8 rounded-xl">
 <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Package Scope Deliverables</h4>
 <div className="grid md:grid-cols-2 gap-4">
 {(selectedGig.features?.length ? selectedGig.features : ['Core Implementation', 'PassPro Assessment Cleared', 'Complete System Handover']).map((feat, idx) => (
 <div key={idx} className="flex items-center gap-3 text-xs font-bold text-slate-700 uppercase tracking-wider">
 <Check size={14} className="text-emerald-500" />
 {feat}
 </div>
 ))}
 </div>
 </div>

 {/* Provider Info */}
 <div className="flex items-center justify-between p-6 border border-slate-200 rounded-xl mb-8 bg-slate-50">
 <div className="flex items-center gap-4">
 <div className="w-12 h-12 bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center font-bold text-lg overflow-hidden text-slate-600">
 {selectedGig.professional?.avatar ? (
 <img src={selectedGig.professional.avatar} alt="avatar" className="w-full h-full object-cover" />
 ) : (
 selectedGig.professional?.firstName?.[0]
 )}
 </div>
 <div>
 <h4 className="text-sm font-bold uppercase text-slate-900">{selectedGig.professional?.firstName} {selectedGig.professional?.lastName}</h4>
 <p className="text-xs font-bold tracking-wider text-[#38BDF8] uppercase mt-0.5">AI_PROCTORING_SCORE: {selectedGig.professional?.aiScore || 0}</p>
 </div>
 </div>

 <div className="text-right">
 <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Contract Valuation</p>
 <p className="text-3xl font-bold tracking-tight text-slate-900">${selectedGig.price}</p>
 </div>
 </div>

 <div className="flex gap-4">
 <button 
 onClick={() => setSelectedGig(null)}
 className="flex-1 py-4 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-100 font-bold uppercase tracking-wider text-xs transition-all"
 >
 Terminate Request
 </button>
 <button 
 onClick={() => handlePurchase(selectedGig._id)}
 disabled={isPurchasing}
 className="flex-1 py-4 rounded-xl bg-[#F97316] text-white hover:bg-orange-600 shadow-lg shadow-[#F97316]/20 font-bold uppercase tracking-wider text-xs transition-all flex items-center justify-center gap-2"
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
 className="fixed inset-0 bg-slate-900/95 z-50 flex items-center justify-center p-4"
 >
 <motion.div 
 initial={{ scale: 0.9, y: 30 }}
 animate={{ scale: 1, y: 0 }}
 className="bg-white border border-emerald-200 rounded-3xl p-12 max-w-xl w-full text-center relative overflow-hidden shadow-2xl"
 >
 <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
 
 <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-emerald-500/5">
 <Check size={40} />
 </div>

 <h2 className="text-4xl font-bold tracking-tight uppercase mb-4 text-emerald-600">
 PURCHASE_SECURED
 </h2>
 <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] mb-8">
 TRANSACTION_VERIFIED_ON_LEDGER
 </p>

 <p className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-10 leading-relaxed">
 Your direct dispatch contract has been initialized. Milestone funding of <span className="text-slate-900">${purchaseSuccess.budget?.exact}</span> has been simulated into secure Escrow. Enter your Workspace node to coordinate execution.
 </p>

 <button 
 onClick={() => {
 const pId = purchaseSuccess._id;
 setPurchaseSuccess(null);
 setSelectedGig(null);
 navigate(`/workspace/${pId}`);
 }}
 className="w-full py-5 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 font-bold uppercase tracking-wider text-xs transition-all flex items-center justify-center gap-3 shadow-lg shadow-emerald-500/20"
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
