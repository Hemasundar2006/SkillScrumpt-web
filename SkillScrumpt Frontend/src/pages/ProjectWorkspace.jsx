import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
 Shield, 
 MessageSquare, 
 Paperclip, 
 Send, 
 FileText, 
 CheckCircle, 
 Clock, 
 MoreHorizontal,
 ChevronLeft,
 Settings,
 Download,
 Eye,
 Loader2,
 Cpu,
 Zap,
 Lock,
 User,
 DollarSign,
 AlertTriangle,
 Play,
 Square,
 Star,
 RefreshCw,
 FolderOpen
} from 'lucide-react';
import { Card, Badge, Button } from '../components/UI';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';

export function ProjectWorkspace() {
 const { id } = useParams();
 const navigate = useNavigate();
 const [activeTab, setActiveTab] = useState('chat');
 const [project, setProject] = useState(null);
 const [isLoading, setIsLoading] = useState(true);
 const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

 // Chat State
 const [messages, setMessages] = useState([]);
 const [newMsg, setNewMsg] = useState('');
 const chatEndRef = useRef(null);

 // Time Tracker State
 const [isTracking, setIsTracking] = useState(false);
 const [trackSeconds, setTrackSeconds] = useState(0);
 const [taskDescription, setTaskDescription] = useState('');
 const trackerInterval = useRef(null);

 // Dispute / Escrow State
 const [selectedMilestoneIdx, setSelectedMilestoneIdx] = useState(null);
 const [disputeReason, setDisputeReason] = useState('');
 const [isSubmittingAction, setIsSubmittingAction] = useState(false);

 // Reviews State
 const [hasReviewed, setHasReviewed] = useState(false);
 const [reviewRating, setReviewRating] = useState(5);
 const [reviewComment, setReviewComment] = useState('');

 useEffect(() => {
 fetchProject();
 // Poll project detail & messages
 const interval = setInterval(() => {
 silentFetchProject();
 }, 4000);

 return () => {
 clearInterval(interval);
 if (trackerInterval.current) clearInterval(trackerInterval.current);
 };
 }, [id]);

 useEffect(() => {
 if (chatEndRef.current) {
 chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
 }
 }, [messages]);

 const fetchProject = async () => {
 setIsLoading(true);
 try {
 const response = await api.get(`/projects/${id}`);
 setProject(response.data);
 setMessages(response.data.messages || []);
 // Check if user already reviewed this project
 const reviewCheck = response.data.reviews?.some(r => r.from === user?._id || r.from === user?.id);
 setHasReviewed(!!reviewCheck);
 } catch (err) {
 console.error('Error fetching project:', err);
 } finally {
 setIsLoading(false);
 }
 };

 const silentFetchProject = async () => {
 try {
 const response = await api.get(`/projects/${id}`);
 setProject(response.data);
 setMessages(response.data.messages || []);
 } catch (err) {
 console.error('Silent project fetch failed:', err);
 }
 };

 // Chat Action
 const handleSendMessage = async (e) => {
 if (e) e.preventDefault();
 if (!newMsg.trim()) return;

 try {
 const res = await api.post(`/projects/${id}/messages`, { content: newMsg });
 setMessages(res.data.messages || []);
 setNewMsg('');
 } catch (err) {
 console.error('Error sending message:', err);
 }
 };

 // Time Tracker stopwatch actions
 const startStopwatch = () => {
 if (!taskDescription.trim()) {
 alert('Please state active mission target (task description).');
 return;
 }
 setIsTracking(true);
 trackerInterval.current = setInterval(() => {
 setTrackSeconds(prev => prev + 1);
 }, 1000);
 };

 const stopStopwatch = async () => {
 setIsTracking(false);
 clearInterval(trackerInterval.current);
 
 const hoursLogged = Math.max(0.01, Number((trackSeconds / 3600).toFixed(2)));
 setIsSubmittingAction(true);
 try {
 const res = await api.post(`/projects/${id}/time-logs`, {
 hours: hoursLogged,
 taskDescription
 });
 setProject(res.data.project);
 alert(`Stopwatch Secured: ${hoursLogged} Hours logged to telemetry ledger.`);
 setTrackSeconds(0);
 setTaskDescription('');
 } catch (err) {
 alert('Failed saving time-log to project ledger.');
 } finally {
 setIsSubmittingAction(false);
 }
 };

 // Escrow / Milestone actions
 const fundMilestone = async (mIdx) => {
 setIsSubmittingAction(true);
 try {
 const res = await api.post(`/projects/${id}/milestones/${mIdx}/fund`);
 setProject(res.data.project);
 } catch (err) {
 alert(err.response?.data?.message || 'Error funding milestone.');
 } finally {
 setIsSubmittingAction(false);
 }
 };

 const claimCompleteMilestone = async (mIdx) => {
 setIsSubmittingAction(true);
 try {
 const res = await api.post(`/projects/${id}/milestones/${mIdx}/complete`);
 setProject(res.data.project);
 } catch (err) {
 alert(err.response?.data?.message || 'Error claiming completion.');
 } finally {
 setIsSubmittingAction(false);
 }
 };

 const releaseMilestone = async (mIdx) => {
 setIsSubmittingAction(true);
 try {
 const res = await api.post(`/projects/${id}/milestones/${mIdx}/release`);
 setProject(res.data.project);
 } catch (err) {
 alert(err.response?.data?.message || 'Error releasing payment.');
 } finally {
 setIsSubmittingAction(false);
 }
 };

 // Dispute actions
 const raiseDispute = async (e) => {
 e.preventDefault();
 if (!disputeReason.trim()) return;

 setIsSubmittingAction(true);
 try {
 const res = await api.post(`/projects/${id}/disputes`, {
 milestoneIndex: selectedMilestoneIdx,
 reason: disputeReason
 });
 setProject(res.data.project);
 setDisputeReason('');
 setSelectedMilestoneIdx(null);
 } catch (err) {
 alert(err.response?.data?.message || 'Error raising dispute.');
 } finally {
 setIsSubmittingAction(false);
 }
 };

 const resolveDispute = async (disputeId, resolution) => {
 setIsSubmittingAction(true);
 try {
 const res = await api.post(`/projects/${id}/disputes/${disputeId}/resolve`, {
 resolution
 });
 setProject(res.data.project);
 } catch (err) {
 alert(err.response?.data?.message || 'Error resolving dispute.');
 } finally {
 setIsSubmittingAction(false);
 }
 };

 // Reviews action
 const handleLeaveReview = async (e) => {
 e.preventDefault();
 if (!reviewComment.trim()) return;

 setIsSubmittingAction(true);
 try {
 await api.post('/reviews', {
 projectId: id,
 rating: Number(reviewRating),
 comment: reviewComment
 });
 setHasReviewed(true);
 fetchProject();
 } catch (err) {
 alert(err.response?.data?.message || 'Error publishing review score.');
 } finally {
 setIsSubmittingAction(false);
 }
 };

 const formatStopwatch = (totalSeconds) => {
 const hrs = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
 const mins = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
 const secs = (totalSeconds % 60).toString().padStart(2, '0');
 return `${hrs}:${mins}:${secs}`;
 };

 if (isLoading) {
 return (
 <div className="min-h-screen flex items-center justify-center bg-[#FFF0E5]">
 <Loader2 className="animate-spin text-[#F97316]" size={48} />
 </div>
 );
 }

 if (!project) {
 return (
 <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFF0E5] p-4 text-center">
 <h2 className="text-2xl font-bold text-slate-900 uppercase mb-8">DIRECTIVE_NOT_FOUND.</h2>
 <button onClick={() => navigate('/dashboard')} className="px-10 py-4 border border-slate-300 text-slate-700 font-bold uppercase tracking-wider hover:bg-slate-100 hover:text-slate-900 transition-all shadow-sm">RETURN_TO_COMMAND</button>
 </div>
 );
 }

 const isClient = user?.role === 'client';
 const isActiveTracker = isTracking;

 return (
 <div className="flex h-screen bg-[#FFF0E5] text-slate-900 selection:bg-[#F97316] selection:text-white overflow-hidden pt-16">
 {/* Side Details Panel */}
 <aside className="w-80 border-r border-slate-200 bg-[#FFF0E5] hidden xl:flex flex-col z-10 shadow-sm">
 <div className="p-8 border-b border-slate-200">
 <button onClick={() => navigate(-1)} className="flex items-center gap-3 text-slate-400 hover:text-[#F97316] mb-8 transition-all group">
 <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
 <span className="text-xs font-bold uppercase tracking-[0.3em]">Dashboard</span>
 </button>
 <h2 className="text-2xl font-bold tracking-tight uppercase mb-6 leading-tight text-slate-900">{project.title}</h2>
 <div className="flex items-center gap-4 mb-8">
 <div className="px-4 py-1 border border-slate-200 text-xs font-bold uppercase tracking-wider text-[#38BDF8] bg-slate-50">{project.status.toUpperCase()}</div>
 <div className="flex -space-x-3">
 <div className="w-8 h-8 border border-slate-200 bg-[#F97316] text-white shadow-sm flex items-center justify-center text-xs font-bold rounded-full" title="Client operative">
 {project.client?.firstName?.[0] || 'C'}
 </div>
 {project.assignedTo && (
 <div className="w-8 h-8 border border-slate-200 bg-white text-slate-700 shadow-sm flex items-center justify-center text-xs font-bold rounded-full" title="Freelance operative">
 {project.assignedTo.firstName?.[0] || 'P'}
 </div>
 )}
 </div>
 </div>
 </div>

 <div className="flex-1 overflow-y-auto p-8 space-y-12">
 <section>
 <h4 className="text-xs font-bold text-slate-400 uppercase tracking-[0.4em] mb-6">DIRECTIVE_SCOPE</h4>
 <p className="text-xs font-bold text-slate-500 leading-relaxed uppercase tracking-wider">
 {project.description || 'NO_DESCRIPTION_SIGNAL_DETECTED.'}
 </p>
 </section>

 <section>
 <h4 className="text-xs font-bold text-slate-400 uppercase tracking-[0.4em] mb-6">VALUATION_&_TIME</h4>
 <div className="space-y-6">
 <div className="flex items-center gap-4">
 <DollarSign size={16} className="text-slate-500" />
 <span className="text-sm font-bold tracking-tight">${project.budget?.exact || project.budget?.min}</span>
 </div>
 <div className="flex items-center gap-4">
 <Clock size={16} className="text-slate-500" />
 <span className="text-xs font-bold uppercase tracking-wider">{new Date(project.deadline).toLocaleDateString().toUpperCase()}</span>
 </div>
 </div>
 </section>

 <section>
 <h4 className="text-xs font-bold text-slate-400 uppercase tracking-[0.4em] mb-6">PROTOCOL_BADGES</h4>
 <div className="flex flex-wrap gap-2">
 {project.skills?.map((skill, i) => (
 <div key={i} className="px-3 py-1 border border-slate-200 text-slate-500 bg-white shadow-sm text-xs font-bold uppercase tracking-wider">{skill}</div>
 ))}
 </div>
 </section>
 </div>
 </aside>

 {/* Main Workspace Area */}
 <main className="flex-1 flex flex-col min-w-0 bg-white">
 <div className="flex flex-col md:flex-row items-center justify-between px-10 py-6 border-b border-slate-200 bg-white shadow-sm z-20 gap-8">
 <div className="flex gap-12">
 <TabItem active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} label="ENCRYPTED_RELAY" />
 <TabItem active={activeTab === 'contract'} onClick={() => setActiveTab('contract')} label="ESCROW_LEDGER" />
 <TabItem active={activeTab === 'tracker'} onClick={() => setActiveTab('tracker')} label="TIME_TRACKER" />
 <TabItem active={activeTab === 'files'} onClick={() => setActiveTab('files')} label="DATA_VAULT" />
 </div>
 <div className="flex items-center gap-6">
 <div className="px-4 py-1.5 border border-sky-200 text-sky-600 bg-sky-50 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
 <Shield size={12} /> AI_SECURED
 </div>
 </div>
 </div>

 {/* Content Area */}
 <div className="flex-1 flex overflow-hidden">
 
 {/* TAB 1: Chat Relay */}
 {activeTab === 'chat' && (
 <div className="flex-1 flex flex-col">
 <div className="flex-1 overflow-y-auto p-12 space-y-10 bg-slate-50">
 <div className="flex justify-center my-8 text-center">
 <div>
 <div className="px-6 py-2 border border-slate-200 bg-white shadow-sm text-xs font-bold text-slate-500 uppercase tracking-[0.5em] mb-4">
 SECURE_WORKSPACE_INITIALIZED
 </div>
 <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400">ALL_MESSAGES_ENCRYPTED_VIA_SKILLSCRUMPT.IN_AI_CORE</p>
 </div>
 </div>
 
 {messages.map((msg, i) => (
 <RelayMessage 
 key={msg._id || i}
 user={`${msg.sender?.firstName || 'Operative'} (${msg.sender?.role?.toUpperCase()})`} 
 time={new Date(msg.timestamp).toLocaleTimeString()} 
 message={msg.content}
 isClient={msg.sender?.role === 'client'}
 />
 ))}
 <div ref={chatEndRef} />
 </div>

 <form onSubmit={handleSendMessage} className="p-10 border-t border-slate-200 bg-slate-50">
 <div className="max-w-5xl mx-auto relative group">
 <input 
 type="text" 
 value={newMsg}
 onChange={(e) => setNewMsg(e.target.value)}
 placeholder="ENTER_DATA_RELAY..." 
 className="w-full pl-10 pr-20 py-6 bg-white border border-slate-200 focus:border-[#F97316] shadow-sm text-slate-900 outline-none transition-all font-bold uppercase tracking-wider text-xs"
 />
 <div className="absolute right-6 top-1/2 -translate-y-1/2">
 <button type="submit" className="p-3 bg-[#F97316] text-white hover:bg-orange-600 shadow-md transition-all rounded-xl">
 <Send size={18} />
 </button>
 </div>
 </div>
 </form>
 </div>
 )}

 {/* TAB 2: Escrow Ledger / Milestones */}
 {activeTab === 'contract' && (
 <div className="flex-1 overflow-y-auto p-12 space-y-12">
 <div className="flex justify-between items-start">
 <div>
 <h3 className="text-3xl font-bold tracking-tight uppercase mb-2 text-slate-900">ESCROW_CONTRACT_TELEMETRY</h3>
 <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Secure Milestone-based Escrow Release Platform. Direct P2P. $0 Brokerage Fee.</p>
 </div>
 
 <div className="px-6 py-3 border border-emerald-200 bg-emerald-50 text-emerald-600 text-xs font-bold uppercase tracking-wider shadow-sm rounded-lg">
 PLATFORM_COMMISSION: $0.00 (DIRECT P2P)
 </div>
 </div>

 {/* Milestones Card Loops */}
 <div className="space-y-6">
 {(project.milestones?.length ? project.milestones : [
 { title: 'Project Deliverable Scope', amount: project.budget?.exact || 500, status: 'pending' }
 ]).map((milestone, idx) => (
 <div key={idx} className="border border-slate-200 bg-white shadow-sm p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden rounded-xl">
 <div className="flex-1">
 <div className="flex items-center gap-3 mb-3">
 <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Milestone #{idx + 1}</span>
 <div className={`px-3 py-0.5 text-xs font-bold uppercase tracking-wider border ${
 milestone.status === 'released' ? 'border-emerald-200 text-emerald-600 bg-emerald-50' :
 milestone.status === 'completed' ? 'border-amber-200 text-amber-600 bg-amber-50' :
 milestone.status === 'funded' ? 'border-sky-200 text-sky-600 bg-sky-50' :
 'border-slate-200 text-slate-500 bg-slate-50'
 }`}>
 {milestone.status.toUpperCase()}
 </div>
 </div>
 <h4 className="text-xl font-bold uppercase tracking-tight text-slate-900 mb-2">{milestone.title}</h4>
 <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Funds simulation index: SEC_M_{idx}</p>
 </div>

 <div className="flex items-center gap-10">
 <div className="text-right">
 <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">Value</p>
 <p className="text-2xl font-bold tracking-tight text-slate-900">${milestone.amount}</p>
 </div>

 {/* Interactive Actions */}
 <div className="flex items-center gap-3">
 {/* CLIENT ACTIONS */}
 {isClient && milestone.status === 'pending' && (
 <button 
 onClick={() => fundMilestone(idx)}
 disabled={isSubmittingAction}
 className="px-6 py-3.5 bg-[#38BDF8] hover:bg-sky-600 text-white shadow-sm font-bold uppercase tracking-wider text-xs transition-all flex items-center gap-2 rounded-lg"
 >
 <Lock size={12} /> SECURE_ESCROW_FUND
 </button>
 )}
 {isClient && milestone.status === 'completed' && (
 <>
 <button 
 onClick={() => releaseMilestone(idx)}
 disabled={isSubmittingAction}
 className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm font-bold uppercase tracking-wider text-xs transition-all rounded-lg"
 >
 RELEASE_PAYMENT
 </button>
 <button 
 onClick={() => setSelectedMilestoneIdx(idx)}
 className="px-6 py-3.5 border border-[#F97316] text-[#F97316] hover:bg-[#F97316] hover:text-white font-bold uppercase tracking-wider text-xs transition-all rounded-lg"
 >
 CONTEST / DISPUTE
 </button>
 </>
 )}

 {/* PROFESSIONAL ACTIONS */}
 {!isClient && milestone.status === 'funded' && (
 <button 
 onClick={() => claimCompleteMilestone(idx)}
 disabled={isSubmittingAction}
 className="px-6 py-3.5 bg-[#F97316] hover:bg-orange-600 text-white shadow-sm font-bold uppercase tracking-wider text-xs transition-all rounded-lg"
 >
 CLAIM_COMPLETION
 </button>
 )}

 {/* Static Badge indicating release */}
 {milestone.status === 'released' && (
 <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
 <CheckCircle size={14} /> RELEASED_TO_OPERATIVE
 </div>
 )}
 </div>
 </div>
 </div>
 ))}
 </div>

 {/* Dispute Modal/Form */}
 {selectedMilestoneIdx !== null && (
 <div className="p-8 border border-[#F97316]/20 bg-orange-50 max-w-xl rounded-xl shadow-sm">
 <h4 className="flex items-center gap-2 text-orange-600 text-sm font-bold uppercase tracking-wider mb-4">
 <AlertTriangle size={16} /> RAISE_DISPUTE_PROTOCOL
 </h4>
 <form onSubmit={raiseDispute} className="space-y-4">
 <p className="text-xs font-bold text-slate-600 uppercase tracking-wider leading-relaxed">
 You are raising a formal payment dispute on Milestone #{selectedMilestoneIdx + 1}. Detail the missing deliverables or requirements.
 </p>
 <textarea 
 value={disputeReason}
 onChange={(e) => setDisputeReason(e.target.value)}
 required
 placeholder="ENTER_DISPUTE_DETAILS..."
 rows={3}
 className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-[#F97316] text-slate-900 shadow-sm outline-none font-bold uppercase tracking-wider text-xs resize-none rounded-lg"
 />
 <div className="flex gap-4">
 <button 
 type="submit" 
 disabled={isSubmittingAction}
 className="px-8 py-3 bg-[#F97316] text-white hover:bg-orange-600 shadow-sm font-bold uppercase tracking-wider text-xs rounded-lg"
 >
 SUBMIT_TO_ARBITRATION
 </button>
 <button 
 type="button" 
 onClick={() => setSelectedMilestoneIdx(null)}
 className="px-8 py-3 border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold uppercase tracking-wider text-xs rounded-lg"
 >
 CANCEL
 </button>
 </div>
 </form>
 </div>
 )}

 {/* Active Disputes Log */}
 {project.disputes && project.disputes.length > 0 && (
 <div className="space-y-6 pt-12 border-t border-slate-200">
 <h4 className="text-base font-bold tracking-tight uppercase text-[#F97316]">ACTIVE DISPUTES LEDGER</h4>
 
 {project.disputes.map((disp, idx) => (
 <div key={idx} className="border border-orange-200 bg-orange-50 shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 rounded-xl">
 <div>
 <div className="flex items-center gap-3 mb-2">
 <span className="px-2.5 py-0.5 border border-[#F97316]/30 text-xs font-bold uppercase text-orange-600 bg-white">
 DISPUTE #{idx + 1}
 </span>
 <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">
 Milestone index: {disp.milestoneIndex}
 </span>
 <span className="text-xs text-slate-500 font-bold uppercase">
 STATUS: {disp.status?.toUpperCase() || 'RESOLVED'}
 </span>
 </div>
 <p className="text-xs font-bold text-slate-700 uppercase tracking-wider leading-relaxed">
"Reason: {disp.reason}"
 </p>
 </div>

 {/* Dispute Arbitrator Resolutions (For client only, in sandbox mode) */}
 {isClient && disp.status === 'open' && (
 <div className="flex gap-2">
 <button 
 onClick={() => resolveDispute(disp._id, 'release')}
 disabled={isSubmittingAction}
 className="px-5 py-2.5 bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm font-bold uppercase tracking-wider text-xs rounded-lg"
 >
 RELEASE_TO_PRO
 </button>
 <button 
 onClick={() => resolveDispute(disp._id, 'refund')}
 disabled={isSubmittingAction}
 className="px-5 py-2.5 bg-red-500 text-white hover:bg-red-600 shadow-sm font-bold uppercase tracking-wider text-xs rounded-lg"
 >
 REFUND_TO_CLIENT
 </button>
 </div>
 )}
 </div>
 ))}
 </div>
 )}

 {/* Leaf Feedback Form when all Milestones Released */}
 {project.status === 'completed' && (
 <div className="pt-12 border-t border-slate-200">
 <h3 className="text-2xl font-bold tracking-tight uppercase text-emerald-500 mb-2">VERIFIED_TRANSACTION_REVIEW</h3>
 <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-6">Leave rating feedback to finalize other operative's platform reputation.</p>
 
 {hasReviewed ? (
 <div className="p-6 border border-emerald-200 bg-emerald-50 text-emerald-600 text-xs font-bold uppercase tracking-wider flex items-center gap-2 rounded-xl">
 <CheckCircle size={16} /> VERIFIED_FEEDBACK_RECORDED_ON_MUTABLE_LEDGER.
 </div>
 ) : (
 <form onSubmit={handleLeaveReview} className="space-y-6 max-w-2xl bg-slate-50 border border-slate-200 shadow-sm p-8 rounded-xl">
 <div className="space-y-2">
 <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Feedback Rating Score (1 to 5 Stars)</label>
 <div className="flex gap-3">
 {[1, 2, 3, 4, 5].map((stars) => (
 <button 
 key={stars}
 type="button"
 onClick={() => setReviewRating(stars)}
 className="p-2 transition-transform hover:scale-125"
 >
 <Star 
 size={24} 
 className={stars <= reviewRating ?"text-amber-500 fill-amber-500" :"text-slate-200"} 
 />
 </button>
 ))}
 </div>
 </div>

 <div className="space-y-2">
 <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Comment Details</label>
 <textarea 
 required
 value={reviewComment}
 onChange={(e) => setReviewComment(e.target.value)}
 placeholder="Write detailed experience comment..."
 rows={4}
 className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-[#F97316] text-slate-900 shadow-sm outline-none font-bold uppercase tracking-wider text-xs resize-none rounded-lg"
 />
 </div>

 <button 
 type="submit" 
 disabled={isSubmittingAction}
 className="px-10 py-4 bg-[#F97316] text-white hover:bg-orange-600 shadow-md shadow-[#F97316]/20 font-bold uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center gap-2 rounded-xl"
 >
 {isSubmittingAction ? <Loader2 className="animate-spin" size={14} /> : 'BROADCAST_FEEDBACK_SIGNALS'}
 </button>
 </form>
 )}
 </div>
 )}
 </div>
 )}

 {/* TAB 3: Stopwatch / Time Tracker */}
 {activeTab === 'tracker' && (
 <div className="flex-1 overflow-y-auto p-12 space-y-12">
 <div>
 <h3 className="text-3xl font-bold tracking-tight uppercase mb-2">TELEMETRY_SESSION_TRACKER</h3>
 <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Log developer hours dynamically into contract database for audit logs.</p>
 </div>

 <div className="grid md:grid-cols-3 gap-8">
 {/* Stopwatch Card */}
 {!isClient && (
 <div className="md:col-span-1 border border-slate-200 bg-white shadow-sm p-8 flex flex-col justify-between min-h-[300px] rounded-2xl">
 <div>
 <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">SESSION_STOPWATCH</h4>
 
 <div className="text-4xl font-bold tracking-tight text-slate-900 mb-6 font-mono">
 {formatStopwatch(trackSeconds)}
 </div>

 <div className="space-y-4 mb-6">
 <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Target Task</label>
 <input 
 type="text"
 value={taskDescription}
 onChange={(e) => setTaskDescription(e.target.value)}
 disabled={isActiveTracker}
 placeholder="E.G. API INTERACTION FLOW"
 className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-slate-900 focus:border-[#F97316] shadow-inner disabled:opacity-50 font-bold uppercase tracking-wider text-xs outline-none rounded-lg"
 />
 </div>
 </div>

 <div className="flex gap-3">
 {!isActiveTracker ? (
 <button 
 onClick={startStopwatch}
 className="w-full py-4 bg-[#F97316] text-white hover:bg-orange-600 shadow-md font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 rounded-xl"
 >
 <Play size={12} fill="currentColor" /> START_TRACKER
 </button>
 ) : (
 <button 
 onClick={stopStopwatch}
 disabled={isSubmittingAction}
 className="w-full py-4 bg-red-500 text-white hover:bg-red-600 shadow-md font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 rounded-xl"
 >
 {isSubmittingAction ? <Loader2 className="animate-spin" size={12} /> : <Square size={12} fill="currentColor" />}
 STOP_&_LOG_TIME
 </button>
 )}
 </div>
 </div>
 )}

 {/* Telemetry Logs Table */}
 <div className={`${isClient ? 'md:col-span-3' : 'md:col-span-2'} border border-slate-200 bg-white shadow-sm p-8 rounded-2xl`}>
 <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">SESSION_LOGS_TELEMETRY</h4>
 
 <div className="overflow-x-auto">
 <table className="w-full text-left border-collapse">
 <thead>
 <tr className="border-b border-slate-100 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
 <th className="pb-3">Operative</th>
 <th className="pb-3">Task Details</th>
 <th className="pb-3">Hours</th>
 <th className="pb-3 text-right">Logged Date</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100">
 {project.timeLogs && project.timeLogs.length > 0 ? project.timeLogs.map((log, i) => (
 <tr key={i} className="text-xs font-bold text-slate-600 uppercase tracking-wider">
 <td className="py-4">Operative #{i + 1}</td>
 <td className="py-4 text-slate-700">{log.taskDescription}</td>
 <td className="py-4 text-slate-900 font-bold">{log.hours} Hrs</td>
 <td className="py-4 text-right text-slate-400">{new Date(log.loggedAt).toLocaleDateString()}</td>
 </tr>
 )) : (
 <tr>
 <td colSpan={4} className="py-12 text-center text-slate-400 font-bold tracking-wider uppercase">
 NO_TELEMETRY_LOGS_FOUND_IN_VAULT.
 </td>
 </tr>
 )}
 </tbody>
 </table>
 </div>
 </div>
 </div>
 </div>
 )}

 {/* TAB 4: Data Vault */}
 {activeTab === 'files' && (
 <div className="flex-1 p-12 overflow-y-auto space-y-12">
 <div>
 <h3 className="text-3xl font-bold tracking-tight uppercase mb-2">SECURE_DATA_VAULT</h3>
 <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Secure static vault containing system config assets, certificates, and handover codes.</p>
 </div>

 <div className="grid md:grid-cols-3 gap-6">
 <Card className="p-6 border border-slate-200 bg-white shadow-sm flex flex-col justify-between min-h-[180px] rounded-xl">
 <div>
 <FileText className="text-[#38BDF8] mb-4" size={24} />
 <h4 className="font-bold uppercase tracking-tight text-slate-900 mb-2">System Blueprint Specification</h4>
 <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Blueprint detailing execution flow.</p>
 </div>
 <button className="w-full py-2 border border-slate-200 hover:border-[#F97316] hover:text-[#F97316] text-slate-600 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all rounded-lg">
 <Download size={12} /> DOWNLOAD_SIGNATURE
 </button>
 </Card>

 <Card className="p-6 border border-slate-200 bg-white shadow-sm flex flex-col justify-between min-h-[180px] rounded-xl">
 <div>
 <Shield className="text-emerald-400 mb-4" size={24} />
 <h4 className="font-bold uppercase tracking-tight text-slate-900 mb-2">Verified Contract Escrow Certificate</h4>
 <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cryptographic token validating simulated funds.</p>
 </div>
 <button className="w-full py-2 border border-slate-200 hover:border-[#F97316] hover:text-[#F97316] text-slate-600 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all rounded-lg">
 <Download size={12} /> SECURE_EXPORT
 </button>
 </Card>

 <Card className="p-6 border border-slate-200 bg-white shadow-sm flex flex-col justify-between min-h-[180px] rounded-xl">
 <div>
 <FolderOpen className="text-[#F97316] mb-4" size={24} />
 <h4 className="font-bold uppercase tracking-tight text-slate-900 mb-2">Handover Keys Repository</h4>
 <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Final repository assets for project delivery.</p>
 </div>
 <button className="w-full py-2 border border-slate-200 hover:border-[#F97316] hover:text-[#F97316] text-slate-600 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all rounded-lg">
 <Download size={12} /> CLONE_VAULT
 </button>
 </Card>
 </div>
 </div>
 )}

 {/* Activity Logs Sidebar */}
 <aside className="w-80 border-l border-slate-200 bg-slate-50 hidden lg:flex flex-col shadow-sm">
 <div className="p-10">
 <h4 className="text-xs font-bold text-slate-400 uppercase tracking-[0.4em] mb-10 text-center">ACTIVITY_LOG</h4>
 <div className="space-y-10">
 <ActivityRow user="SYSTEM" action="WORKSPACE_ENCRYPTED" time="NOW" icon={Shield} color="text-slate-900" />
 <ActivityRow user={project.client?.firstName || 'CLIENT'} action="RELAY_ACTIVE" time="ACTIVE" icon={Eye} color="text-slate-500" />
 
 {project.timeLogs && project.timeLogs.slice(0, 3).map((log, i) => (
 <ActivityRow 
 key={i} 
 user="PRO" 
 action={`LOGGED_${log.hours}_HOURS`} 
 time={`${new Date(log.loggedAt).toLocaleTimeString()}`} 
 icon={Clock} 
 color="text-[#38BDF8]" 
 />
 ))}
 </div>
 </div>
 </aside>
 </div>
 </main>
 
 <div className="fixed bottom-8 right-8 z-[100] pointer-events-none opacity-20">
 <Cpu className="w-32 h-32 text-[#F97316] animate-spin-slow" />
 </div>
 </div>
 );
}

function TabItem({ active, onClick, label }) {
 return (
 <button 
 onClick={onClick}
 className={`py-4 text-xs font-bold uppercase tracking-[0.3em] border-b-2 transition-all ${
 active ? 'border-[#F97316] text-[#F97316]' : 'border-transparent text-slate-400 hover:text-slate-700'
 }`}
 >
 {label}
 </button>
 );
}

function RelayMessage({ user, time, message, isClient = false }) {
 return (
 <div className={`flex gap-6 ${isClient ? '' : 'flex-row-reverse text-right'}`}>
 <div className={`flex-shrink-0 w-12 h-12 border flex items-center justify-center font-bold text-xl ${
 isClient ? 'border-[#F97316] bg-[#F97316] text-white shadow-sm' : 'border-slate-200 text-slate-500 bg-white shadow-sm'
 }`}>
 {user[0]}
 </div>
 <div className="max-w-xl">
 <div className={`flex items-center gap-4 mb-3 ${isClient ? '' : 'justify-end'}`}>
 <span className="text-xs font-bold uppercase tracking-wider">{user}</span>
 <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">{time}</span>
 </div>
 <div className={`p-6 border text-xs font-bold leading-relaxed uppercase tracking-wider ${
 isClient ? 'border-slate-200 bg-white text-slate-700 shadow-sm rounded-lg' : 'border-slate-200 bg-slate-50 text-slate-900 shadow-sm rounded-lg'
 }`}>
 {message}
 </div>
 </div>
 </div>
 );
}

function ActivityRow({ user, action, time, icon: Icon, color = 'text-slate-400' }) {
 return (
 <div className="flex gap-4">
 <div className={`flex-shrink-0 mt-1 ${color}`}>
 <Icon size={16} />
 </div>
 <div>
 <p className="text-xs font-bold text-slate-500 uppercase tracking-wider leading-relaxed">
 <span className="font-bold text-slate-900">{user}</span> {action}
 </p>
 <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.3em] mt-1">{time}</p>
 </div>
 </div>
 );
}
