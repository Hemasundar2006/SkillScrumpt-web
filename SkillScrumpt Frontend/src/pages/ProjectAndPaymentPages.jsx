import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
 ChevronLeft, 
 CheckCircle, 
 Shield, 
 BadgeCheck,
 DollarSign, 
 Clock, 
 ArrowRight, 
 CreditCard,
 Lock,
 Wallet,
 FileText,
 User,
 Star,
 Briefcase,
 ExternalLink,
 Loader2,
 ChevronRight,
 Cpu,
 Zap
} from 'lucide-react';
import { Card, Badge, Button } from '../components/UI';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';

// --- View Project Bids (Employer View) ---
export function ViewBids() {
 const { id } = useParams();
 const [project, setProject] = useState(null);
 const [isLoading, setIsLoading] = useState(true);

 useEffect(() => {
 fetchProjectAndBids();
 }, [id]);

 const fetchProjectAndBids = async () => {
 setIsLoading(true);
 try {
 const response = await api.get(`/projects/${id}`);
 setProject(response.data);
 } catch (err) {
 console.error('Error fetching bids:', err);
 } finally {
 setIsLoading(false);
 }
 };

 if (isLoading) return <div className="flex justify-center py-40 bg-slate-50 min-h-screen"><Loader2 className="animate-spin text-slate-400" size={48} /></div>;

 return (
 <div className="pt-24 pb-20 bg-slate-50 text-slate-900 selection:bg-indigo-100 min-h-screen font-sans">
 <div className="max-w-7xl mx-auto px-6">
 <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
 <div>
 <Link to="/dashboard/client" className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-6 transition-all group font-bold text-sm">
 <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
 Back to Dashboard
 </Link>
 <h1 className="text-4xl font-bold tracking-tight text-slate-900">Project Proposals</h1>
 <p className="text-slate-500 font-medium text-base mt-2">{project?.title}</p>
 </div>
 <div className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 shadow-sm flex items-center gap-2">
 <FileText size={16} className="text-indigo-500" />
 {project?.bids?.length || 0} Proposals Received
 </div>
 </header>

 <div className="grid lg:grid-cols-3 gap-8">
 <div className="lg:col-span-2 space-y-4">
 {project?.bids?.length > 0 ? project.bids.map((bid, i) => (
 <BidRow 
 key={bid._id || i}
 id={bid._id}
 projectId={id}
 name={`${bid.bidder?.firstName || 'Professional'} ${bid.bidder?.lastName || ''}`} 
 score={bid.bidder?.aiScore || 0} 
 isPro={bid.bidder?.isPro}
 rate={`$${bid.amount?.toLocaleString()}`} 
 date={new Date(bid.createdAt).toLocaleDateString()} 
 active={i === 0} 
 onAccept={() => fetchProjectAndBids()}
 />
 )) : (
 <div className="py-32 text-center bg-white border border-slate-200 rounded-[2rem] shadow-sm">
 <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
 <Briefcase size={24} />
 </div>
 <p className="text-slate-500 font-bold text-sm">No proposals received yet.</p>
 </div>
 )}
 </div>

 <aside>
 <div className="bg-white border border-slate-200 p-8 rounded-[2rem] shadow-sm sticky top-24">
 <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
 <Cpu size={24} className="text-indigo-600" /> AI Insights
 </h3>
 <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl mb-8">
 <p className="text-sm font-medium text-indigo-900 leading-relaxed">
 {project?.bids?.length > 0 
 ?"Based on skill matching, the highlighted professional shows the strongest correlation to your project requirements."
 :"Waiting for more proposals to analyze optimal candidates. Our AI will automatically surface the best matches."}
 </p>
 </div>
 <div className="space-y-3">
 <button className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl text-sm hover:bg-slate-800 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed" disabled={!project?.bids?.length}>Hire Top Candidate</button>
 <button className="w-full py-4 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl text-sm hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed" disabled={!project?.bids?.length}>Compare Candidates</button>
 </div>
 </div>
 </aside>
 </div>
 </div>
 </div>
 );
}

// --- Project Details (Student View) ---
export function ProjectDetails() {
 const { id } = useParams();
 const navigate = useNavigate();
 const [project, setProject] = useState(null);
 const [isLoading, setIsLoading] = useState(true);

 useEffect(() => {
 fetchProject();
 }, [id]);

 const fetchProject = async () => {
 setIsLoading(true);
 try {
 const response = await api.get(`/projects/${id}`);
 setProject(response.data);
 } catch (err) {
 console.error('Error fetching project:', err);
 } finally {
 setIsLoading(false);
 }
 };

 if (isLoading) return <div className="flex justify-center py-40 bg-slate-50 min-h-screen"><Loader2 className="animate-spin text-slate-400" size={48} /></div>;
 if (!project) return <div className="text-center py-40 bg-slate-50 text-slate-500 min-h-screen font-bold">Project not found.</div>;

 return (
 <div className="pt-24 pb-20 bg-slate-50 text-slate-900 selection:bg-indigo-100 min-h-screen font-sans">
 <div className="max-w-5xl mx-auto px-6">
 <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
 <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50 -mr-20 -mt-20 pointer-events-none" />
 
 <div className="p-10 md:p-16 relative z-10">
 <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-8">
 <div className="max-w-2xl">
 <div className="flex items-center gap-3 mb-6">
 <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-sm" />
 <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Verified Project</span>
 </div>
 <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4 leading-tight">{project.title}</h1>
 <p className="text-slate-500 font-medium text-sm flex items-center gap-2">
 <User size={16} /> Posted by {project.client?.firstName || 'Enterprise Client'} on {new Date(project.createdAt).toLocaleDateString()}
 </p>
 </div>
 <div className="md:text-right bg-slate-50 p-6 rounded-2xl border border-slate-100 min-w-[200px]">
 <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Fixed Budget</p>
 <p className="text-4xl font-bold tracking-tight text-slate-900">${project.budget?.toLocaleString()}</p>
 <div className="mt-4 flex items-center justify-end gap-1.5 text-xs font-bold uppercase text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
 <Shield size={12} /> Zero Brokerage
 </div>
 </div>
 </div>

 <div className="grid md:grid-cols-3 gap-4 mb-12">
 <ProjectDetailItem icon={Clock} label="Deadline" value={new Date(project.deadline).toLocaleDateString()} />
 <ProjectDetailItem icon={Briefcase} label="Status" value={<span className="capitalize">{project.status}</span>} />
 <ProjectDetailItem icon={Shield} label="AI Requirement" value="900+ Score" />
 </div>

 <div className="space-y-12">
 <section>
 <h3 className="text-lg font-bold text-slate-900 mb-4">Project Description</h3>
 <p className="text-base font-medium text-slate-600 leading-relaxed whitespace-pre-line bg-slate-50 p-8 rounded-2xl border border-slate-100">
 {project.description}
 </p>
 </section>

 <section>
 <h3 className="text-lg font-bold text-slate-900 mb-4">Required Skills</h3>
 <div className="flex flex-wrap gap-3">
 {project.skills?.map((skill, i) => (
 <div key={i} className="px-5 py-2.5 bg-indigo-50 text-indigo-700 rounded-xl text-sm font-bold shadow-sm">{skill}</div>
 ))}
 </div>
 </section>

 <div className="pt-8 flex flex-col sm:flex-row gap-4">
 {(() => {
 const userStr = localStorage.getItem('user');
 const user = userStr ? JSON.parse(userStr) : null;
 
 if (!user || (!user._id && !user.id)) {
 return (
 <button 
 onClick={() => navigate('/login', { state: { from: `/projects/${id}` } })} 
 className="px-10 py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-md text-sm"
 >
 Login to Apply
 </button>
 );
 }

 if (user.isPro) {
 return (
 <button 
 onClick={() => navigate(`/projects/${id}/apply`)} 
 className="px-10 py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-md text-sm"
 >
 Submit Proposal
 </button>
 );
 } else {
 return (
 <div className="flex flex-col sm:flex-row gap-4 items-center">
 <button 
 onClick={() => navigate(user.role === 'professional' ? '/dashboard/student' : '/dashboard/client', { state: { showUpgrade: true } })} 
 className="px-10 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200 text-sm w-full sm:w-auto"
 >
 Upgrade to Apply
 </button>
 <p className="text-xs font-bold text-slate-500 flex items-center gap-2">
 <Lock size={14} /> Pro Membership Required
 </p>
 </div>
 );
 }
 })()}
 <button 
 onClick={() => {
 const user = JSON.parse(localStorage.getItem('user') || '{}');
 if (!user._id && !user.id) return navigate('/login', { state: { from: `/projects/${id}` } });
 alert('Project saved to your watchlist.');
 }}
 className="px-10 py-4 border border-slate-200 bg-white text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all shadow-sm text-sm"
 >
 Save Project
 </button>
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>
 );
}

// --- Payment & Checkout Pages ---
export function PaymentCheckout() {
 return (
 <div className="pt-24 pb-20 bg-slate-50 text-slate-900 selection:bg-indigo-100 min-h-screen font-sans flex items-center justify-center">
 <div className="max-w-5xl w-full mx-auto px-6">
 <h1 className="text-4xl font-bold tracking-tight mb-12 text-center text-slate-900">Secure Checkout</h1>
 <div className="grid md:grid-cols-2 gap-8">
 <div className="bg-white rounded-[2rem] p-10 border border-slate-200 shadow-sm relative h-full">
 <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
 <CreditCard size={24} className="text-indigo-600" /> Payment Method
 </h3>
 <div className="space-y-6">
 <div className="space-y-2">
 <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Cardholder Name</label>
 <input type="text" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all font-medium placeholder:text-slate-400" placeholder="John Doe" />
 </div>
 <div className="space-y-2">
 <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Card Number</label>
 <div className="relative">
 <CreditCard size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
 <input type="text" className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all font-medium placeholder:text-slate-400" placeholder="0000 0000 0000 0000" />
 </div>
 </div>
 <div className="grid grid-cols-2 gap-6">
 <div className="space-y-2">
 <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Expiry Date</label>
 <input type="text" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all font-medium placeholder:text-slate-400" placeholder="MM/YY" />
 </div>
 <div className="space-y-2">
 <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">CVV</label>
 <input type="password" size={3} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all font-medium placeholder:text-slate-400" placeholder="123" />
 </div>
 </div>
 <button className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all mt-6 shadow-md">Pay Securely</button>
 <p className="text-xs text-slate-500 text-center font-bold flex items-center justify-center gap-1.5 mt-4">
 <Lock size={12} /> Payments are encrypted and secure
 </p>
 </div>
 </div>

 <div className="bg-slate-900 rounded-[2rem] p-10 border border-slate-800 shadow-xl text-white relative overflow-hidden h-full flex flex-col">
 <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-[80px] opacity-20 -mr-20 -mt-20 pointer-events-none" />
 <h3 className="text-xl font-bold tracking-tight mb-10 relative z-10">Order Summary</h3>
 <div className="space-y-6 flex-1 relative z-10">
 <div className="flex justify-between items-center pb-6 border-b border-white/10">
 <span className="text-sm font-medium text-slate-300">Project Milestone</span>
 <span className="text-lg font-bold">$4,500.00</span>
 </div>
 <div className="flex justify-between items-center pb-6 border-b border-white/10">
 <span className="text-sm font-medium text-slate-300">Platform Fee (0%)</span>
 <span className="text-lg font-bold text-emerald-400">Free</span>
 </div>
 </div>
 <div className="pt-8 mt-auto relative z-10">
 <div className="flex justify-between items-end bg-white/5 p-6 rounded-2xl border border-white/10">
 <span className="text-sm font-bold text-slate-300 uppercase tracking-wider">Total Amount</span>
 <span className="text-4xl font-bold tracking-tight">$4,500.00</span>
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>
 );
}

export function PeerToPeerCheckout() {
 return (
 <div className="pt-24 pb-20 bg-slate-50 text-slate-900 selection:bg-indigo-100 min-h-screen flex items-center justify-center font-sans">
 <div className="max-w-2xl w-full px-6">
 <div className="bg-white border border-slate-200 rounded-[2.5rem] p-12 md:p-16 text-center relative overflow-hidden shadow-sm hover:shadow-md transition-shadow">
 <div className="w-20 h-20 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-10 shadow-sm">
 <Wallet size={36} className="text-indigo-600" />
 </div>
 <h1 className="text-4xl font-bold tracking-tight mb-6 text-slate-900">Fund Escrow</h1>
 <p className="text-sm font-medium text-slate-500 mb-12 leading-relaxed max-w-md mx-auto">
 You are securely funding this milestone. Funds are held in escrow and will only be released to the professional upon your approval.
 </p>
 
 <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 mb-10 shadow-inner">
 <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Amount to Fund</p>
 <div className="text-6xl font-bold tracking-tight text-slate-900 mb-4">$2,400.00</div>
 <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg text-xs font-bold shadow-sm">
 <Shield size={12} /> Zero Platform Fees
 </div>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-sm mx-auto">
 <button className="py-4 bg-slate-900 text-white font-bold rounded-xl text-sm hover:bg-slate-800 transition-all shadow-md">Fund Milestone</button>
 <button className="py-4 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl text-sm hover:bg-slate-50 transition-all shadow-sm">Cancel</button>
 </div>
 </div>
 </div>
 </div>
 );
}

export function ConfirmReceipt() {
 return (
 <div className="pt-24 pb-20 bg-slate-50 text-slate-900 selection:bg-indigo-100 min-h-screen flex items-center justify-center font-sans">
 <div className="max-w-xl w-full px-6">
 <div className="bg-white border border-slate-200 rounded-[2.5rem] p-16 text-center relative overflow-hidden shadow-md">
 <motion.div 
 initial={{ scale: 0.5, opacity: 0 }}
 animate={{ scale: 1, opacity: 1 }}
 className="w-24 h-24 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center mx-auto mb-10 shadow-sm"
 >
 <CheckCircle size={48} className="text-emerald-500" />
 </motion.div>
 <h2 className="text-4xl font-bold tracking-tight mb-4 text-slate-900">Payment Successful</h2>
 <p className="text-sm font-medium text-slate-500 mb-10 leading-relaxed max-w-xs mx-auto">
 Your funds have been securely processed and placed in escrow.
 </p>
 <Link to="/dashboard" className="block">
 <button className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl text-sm hover:bg-slate-800 transition-all shadow-md">Return to Dashboard</button>
 </Link>
 </div>
 </div>
 </div>
 );
}

// --- 404 Page ---
export function NotFoundPage() {
 return (
 <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-900 selection:bg-indigo-100 px-6 font-sans">
 <div className="text-center relative">
 <h1 className="text-[12rem] md:text-[18rem] font-bold text-slate-100 leading-none tracking-tight absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 select-none">404</h1>
 <div className="relative z-10 pt-20">
 <div className="w-20 h-20 bg-white border border-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-sm text-slate-400">
 <Zap size={32} />
 </div>
 <h2 className="text-4xl font-bold tracking-tight mb-4">Page Not Found</h2>
 <p className="text-base font-medium text-slate-500 mb-10 max-w-sm mx-auto">The page you are looking for doesn't exist or has been moved.</p>
 <Link to="/">
 <button className="px-10 py-4 bg-slate-900 text-white font-bold rounded-xl text-sm hover:bg-slate-800 transition-all shadow-md">Go Back Home</button>
 </Link>
 </div>
 </div>
 </div>
 );
}

// --- Submit Project Bid (Student Flow) ---
export function SubmitBid() {
 const { id } = useParams();
 const navigate = useNavigate();
 const [project, setProject] = useState(null);
 const [amount, setAmount] = useState('');
 const [deliveryTime, setDeliveryTime] = useState(7);
 const [coverLetter, setCoverLetter] = useState('');
 const [isSubmitting, setIsSubmitting] = useState(false);

 useEffect(() => {
 const userStr = localStorage.getItem('user');
 const user = userStr ? JSON.parse(userStr) : null;
 
 if (!user || (!user._id && !user.id)) {
 navigate('/login', { state: { from: `/projects/${id}/apply` } });
 return;
 }

 if (!user.isPro) {
 alert('PRO_ACCESS_REQUIRED: Only SkillScrumpt Pro members can place bids.');
 navigate(`/projects/${id}`);
 return;
 }
 fetchProject();
 }, [id]);

 const fetchProject = async () => {
 try {
 const response = await api.get(`/projects/${id}`);
 setProject(response.data);
 setAmount(response.data.budget);
 } catch (err) {
 console.error('Error fetching project:', err);
 }
 };

 const handleSubmit = async () => {
 if (!amount || !coverLetter || !deliveryTime) return alert('Please fill all fields');
 setIsSubmitting(true);
 try {
 await api.post(`/projects/${id}/bid`, { 
 amount: Number(amount), 
 deliveryTime: Number(deliveryTime), 
 coverLetter 
 });
 alert('Proposal submitted successfully! Zero brokerage applied.');
 navigate(`/projects/${id}`);
 } catch (err) {
 alert(err.response?.data?.message || 'Error submitting proposal');
 } finally {
 setIsSubmitting(false);
 }
 };

 return (
 <div className="pt-24 pb-20 bg-slate-50 text-slate-900 selection:bg-indigo-100 min-h-screen font-sans">
 <div className="max-w-4xl mx-auto px-6">
 <header className="mb-12">
 <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-6 transition-all font-bold text-sm">
 <ChevronLeft size={18} /> Back to Project
 </button>
 <h1 className="text-4xl font-bold tracking-tight text-slate-900">Submit Proposal</h1>
 <p className="text-slate-500 font-medium text-base mt-2 flex items-center gap-2">
 <Briefcase size={16} /> {project?.title}
 </p>
 </header>

 <div className="space-y-8">
 <div className="bg-white rounded-[2rem] p-10 border border-slate-200 shadow-sm">
 <h3 className="text-xl font-bold tracking-tight mb-8">Proposal Details</h3>
 <div className="grid md:grid-cols-2 gap-8 mb-8">
 <div className="space-y-2">
 <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Your Bid Amount ($)</label>
 <div className="relative">
 <DollarSign size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
 <input 
 type="number" 
 value={amount} 
 onChange={(e) => setAmount(e.target.value)}
 className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all font-bold text-lg text-slate-900" 
 placeholder="0.00"
 required
 />
 </div>
 <p className="text-xs font-bold text-emerald-600 mt-1 flex items-center gap-1"><Zap size={10}/> No hidden fees. You keep 100%.</p>
 </div>

 <div className="space-y-2">
 <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Delivery Time (Days)</label>
 <div className="relative">
 <Clock size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
 <input 
 type="number" 
 value={deliveryTime} 
 onChange={(e) => setDeliveryTime(e.target.value)}
 className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all font-bold text-lg text-slate-900" 
 placeholder="7"
 required
 />
 </div>
 </div>
 </div>

 <div className="space-y-2 mb-8">
 <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Cover Letter</label>
 <textarea 
 rows={8} 
 value={coverLetter}
 onChange={(e) => setCoverLetter(e.target.value)}
 className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400 resize-none" 
 placeholder="Explain why you are the best fit for this project..."
 required
 ></textarea>
 </div>

 {project?.skills?.length > 0 && (
 <div className="space-y-3 pt-6 border-t border-slate-100">
 <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Relevant Skills Required</label>
 <div className="flex flex-wrap gap-2">
 {project.skills.map((skill, i) => (
 <div key={i} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-lg text-xs font-bold">{skill}</div>
 ))}
 </div>
 </div>
 )}
 </div>

 <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
 <div className="flex gap-4">
 <div className="p-2 bg-white rounded-lg shadow-sm text-emerald-600 h-fit">
 <Shield size={20} />
 </div>
 <div>
 <h4 className="text-sm font-bold text-emerald-900 mb-1">Secure Application</h4>
 <p className="text-xs font-medium text-emerald-700">Your proposal is protected by our AI integrity system.</p>
 </div>
 </div>
 <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider">
 <CheckCircle size={16} /> Verified Protocol
 </div>
 </div>

 <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4">
 <button onClick={() => navigate(-1)} className="px-8 py-4 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl text-sm hover:bg-slate-50 transition-all shadow-sm">Cancel</button>
 <button 
 onClick={handleSubmit} 
 disabled={isSubmitting} 
 className="px-10 py-4 bg-indigo-600 text-white font-bold rounded-xl text-sm hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 shadow-md shadow-indigo-200 disabled:opacity-50"
 >
 {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : 'Submit Proposal'}
 </button>
 </div>
 </div>
 </div>
 </div>
 );
}

// --- Helper Components ---

function BidRow({ id, projectId, name, score, rate, date, isPro, active = false, onAccept }) {
 return (
 <div className={`bg-white border transition-all rounded-2xl overflow-hidden shadow-sm hover:shadow-md ${active ? 'border-indigo-400 ring-1 ring-indigo-400' : 'border-slate-200 hover:border-slate-300'}`}>
 <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 cursor-pointer">
 <div className="flex items-center gap-5">
 <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center font-bold text-indigo-600 text-lg shadow-sm">
 {name[0]}
 </div>
 <div>
 <h4 className="font-bold text-slate-900 flex items-center gap-2">
 {name} 
 {isPro && (
 <span className="flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold rounded-md shadow-sm">
 <Star size={10} fill="currentColor" /> PRO
 </span>
 )}
 <BadgeCheck size={18} className="text-emerald-500" />
 </h4>
 <div className="flex items-center gap-3 text-xs font-bold text-slate-500 mt-1">
 <span className="text-indigo-600 flex items-center gap-1"><Cpu size={12}/> AI Score: {score}</span>
 <span className="w-1 h-1 bg-slate-300 rounded-full" />
 <span>{date}</span>
 </div>
 </div>
 </div>
 <div className="flex items-center gap-6">
 <div className="text-right">
 <p className="text-xl font-bold text-slate-900">{rate}</p>
 <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Proposed Rate</p>
 </div>
 <button 
 onClick={async (e) => {
 e.stopPropagation();
 if(window.confirm('Accept this bid and start the project?')) {
 try {
 await api.post(`/projects/${projectId}/bids/${id}/accept`);
 alert('Bid accepted!');
 onAccept();
 } catch (err) {
 alert(err.response?.data?.message || 'Error accepting bid');
 }
 }
 }}
 className="px-4 py-2 bg-slate-900 text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-indigo-600 transition-all"
 >
 Accept
 </button>
 </div>
 </div>
 </div>
 );
}

function ProjectDetailItem({ icon: Icon, label, value }) {
 return (
 <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
 <div className="p-3 bg-white rounded-xl shadow-sm text-indigo-500">
 <Icon size={20} />
 </div>
 <div>
 <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">{label}</p>
 <p className="text-sm font-bold text-slate-900">{value}</p>
 </div>
 </div>
 );
}
