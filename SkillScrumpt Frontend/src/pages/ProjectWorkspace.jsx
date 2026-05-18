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
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 className="animate-spin text-white" size={48} />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black p-4 text-center">
        <h2 className="text-2xl font-black text-white uppercase italic mb-8">DIRECTIVE_NOT_FOUND.</h2>
        <button onClick={() => navigate('/dashboard')} className="px-10 py-4 border border-white text-white font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">RETURN_TO_COMMAND</button>
      </div>
    );
  }

  const isClient = user?.role === 'client';
  const isActiveTracker = isTracking;

  return (
    <div className="flex h-screen bg-black text-white selection:bg-white selection:text-black overflow-hidden pt-16">
      {/* Side Details Panel */}
      <aside className="w-80 border-r border-white/10 bg-black hidden xl:flex flex-col">
        <div className="p-8 border-b border-white/10">
          <button onClick={() => navigate(-1)} className="flex items-center gap-3 text-white/30 hover:text-white mb-8 transition-all group">
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Dashboard</span>
          </button>
          <h2 className="text-2xl font-black tracking-tight uppercase italic mb-6 leading-tight">{project.title}</h2>
          <div className="flex items-center gap-4 mb-8">
             <div className="px-4 py-1 border border-white/10 text-[9px] font-black uppercase tracking-widest text-blue-400">{project.status.toUpperCase()}</div>
             <div className="flex -space-x-3">
                <div className="w-8 h-8 border border-white bg-white text-black flex items-center justify-center text-[10px] font-black italic rounded-full" title="Client operative">
                  {project.client?.firstName?.[0] || 'C'}
                </div>
                {project.assignedTo && (
                  <div className="w-8 h-8 border border-white bg-zinc-900 text-white flex items-center justify-center text-[10px] font-black italic rounded-full" title="Freelance operative">
                    {project.assignedTo.firstName?.[0] || 'P'}
                  </div>
                )}
             </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-12">
          <section>
            <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-6">DIRECTIVE_SCOPE</h4>
            <p className="text-[11px] font-bold text-white/40 leading-relaxed uppercase tracking-widest italic">
              {project.description || 'NO_DESCRIPTION_SIGNAL_DETECTED.'}
            </p>
          </section>

          <section>
            <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-6">VALUATION_&_TIME</h4>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <DollarSign size={16} className="text-white/40" />
                <span className="text-sm font-black italic tracking-tighter">${project.budget?.exact || project.budget?.min}</span>
              </div>
              <div className="flex items-center gap-4">
                <Clock size={16} className="text-white/40" />
                <span className="text-[10px] font-black uppercase tracking-widest">{new Date(project.deadline).toLocaleDateString().toUpperCase()}</span>
              </div>
            </div>
          </section>

          <section>
            <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-6">PROTOCOL_BADGES</h4>
            <div className="flex flex-wrap gap-2">
              {project.skills?.map((skill, i) => (
                <div key={i} className="px-3 py-1 border border-white/10 text-[8px] font-black uppercase tracking-widest">{skill}</div>
              ))}
            </div>
          </section>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-black">
        <div className="flex flex-col md:flex-row items-center justify-between px-10 py-6 border-b border-white/10 bg-black z-20 gap-8">
          <div className="flex gap-12">
            <TabItem active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} label="ENCRYPTED_RELAY" />
            <TabItem active={activeTab === 'contract'} onClick={() => setActiveTab('contract')} label="ESCROW_LEDGER" />
            <TabItem active={activeTab === 'tracker'} onClick={() => setActiveTab('tracker')} label="TIME_TRACKER" />
            <TabItem active={activeTab === 'files'} onClick={() => setActiveTab('files')} label="DATA_VAULT" />
          </div>
          <div className="flex items-center gap-6">
            <div className="px-4 py-1.5 border border-white text-black bg-white text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
              <Shield size={12} /> AI_SECURED
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* TAB 1: Chat Relay */}
          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto p-12 space-y-10">
                <div className="flex justify-center my-8 text-center">
                  <div>
                    <div className="px-6 py-2 border border-white/10 text-[9px] font-black text-white/30 uppercase tracking-[0.5em] mb-4 italic">
                      SECURE_WORKSPACE_INITIALIZED
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">ALL_MESSAGES_ENCRYPTED_VIA_SKILLSCRUMPT.IN_AI_CORE</p>
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

              <form onSubmit={handleSendMessage} className="p-10 border-t border-white/10">
                <div className="max-w-5xl mx-auto relative group">
                  <input 
                    type="text" 
                    value={newMsg}
                    onChange={(e) => setNewMsg(e.target.value)}
                    placeholder="ENTER_DATA_RELAY..." 
                    className="w-full pl-10 pr-20 py-6 bg-white/[0.02] border border-white/10 focus:border-white outline-none transition-all font-black uppercase tracking-widest text-xs"
                  />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2">
                    <button type="submit" className="p-3 bg-white text-black hover:bg-white/90 transition-all">
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
                  <h3 className="text-3xl font-black italic tracking-tighter uppercase mb-2">ESCROW_CONTRACT_TELEMETRY</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Secure Milestone-based Escrow Release Platform. Direct P2P. $0 Brokerage Fee.</p>
                </div>
                
                <div className="px-6 py-3 border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-[10px] font-black uppercase tracking-wider">
                  PLATFORM_COMMISSION: $0.00 (DIRECT P2P)
                </div>
              </div>

              {/* Milestones Card Loops */}
              <div className="space-y-6">
                {(project.milestones?.length ? project.milestones : [
                  { title: 'Project Deliverable Scope', amount: project.budget?.exact || 500, status: 'pending' }
                ]).map((milestone, idx) => (
                  <div key={idx} className="border border-white/10 bg-zinc-950/60 p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Milestone #{idx + 1}</span>
                        <div className={`px-3 py-0.5 text-[8px] font-black uppercase tracking-widest border ${
                          milestone.status === 'released' ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5' :
                          milestone.status === 'completed' ? 'border-amber-500/30 text-amber-400 bg-amber-500/5' :
                          milestone.status === 'funded' ? 'border-blue-500/30 text-blue-400 bg-blue-500/5' :
                          'border-white/10 text-white/30'
                        }`}>
                          {milestone.status.toUpperCase()}
                        </div>
                      </div>
                      <h4 className="text-xl font-black italic uppercase tracking-tight text-white mb-2">{milestone.title}</h4>
                      <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Funds simulation index: SEC_M_{idx}</p>
                    </div>

                    <div className="flex items-center gap-10">
                      <div className="text-right">
                        <p className="text-[9px] font-black text-white/30 uppercase tracking-wider mb-0.5">Value</p>
                        <p className="text-2xl font-black italic tracking-tighter text-white">${milestone.amount}</p>
                      </div>

                      {/* Interactive Actions */}
                      <div className="flex items-center gap-3">
                        {/* CLIENT ACTIONS */}
                        {isClient && milestone.status === 'pending' && (
                          <button 
                            onClick={() => fundMilestone(idx)}
                            disabled={isSubmittingAction}
                            className="px-6 py-3.5 bg-blue-500 hover:bg-blue-400 text-black font-black uppercase tracking-widest text-[9px] transition-all italic flex items-center gap-2"
                          >
                            <Lock size={12} /> SECURE_ESCROW_FUND
                          </button>
                        )}
                        {isClient && milestone.status === 'completed' && (
                          <>
                            <button 
                              onClick={() => releaseMilestone(idx)}
                              disabled={isSubmittingAction}
                              className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-widest text-[9px] transition-all italic"
                            >
                              RELEASE_PAYMENT
                            </button>
                            <button 
                              onClick={() => setSelectedMilestoneIdx(idx)}
                              className="px-6 py-3.5 border border-amber-500 text-amber-400 hover:bg-amber-500 hover:text-black font-black uppercase tracking-widest text-[9px] transition-all italic"
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
                            className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-widest text-[9px] transition-all italic"
                          >
                            CLAIM_COMPLETION
                          </button>
                        )}

                        {/* Static Badge indicating release */}
                        {milestone.status === 'released' && (
                          <div className="flex items-center gap-2 text-emerald-400 text-[10px] font-black uppercase tracking-wider italic">
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
                <div className="p-8 border border-amber-500/20 bg-amber-500/5 max-w-xl">
                  <h4 className="flex items-center gap-2 text-amber-400 text-sm font-black uppercase tracking-wider mb-4">
                    <AlertTriangle size={16} /> RAISE_DISPUTE_PROTOCOL
                  </h4>
                  <form onSubmit={raiseDispute} className="space-y-4">
                    <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest leading-relaxed">
                      You are raising a formal payment dispute on Milestone #{selectedMilestoneIdx + 1}. Detail the missing deliverables or requirements.
                    </p>
                    <textarea 
                      value={disputeReason}
                      onChange={(e) => setDisputeReason(e.target.value)}
                      required
                      placeholder="ENTER_DISPUTE_DETAILS..."
                      rows={3}
                      className="w-full px-4 py-3 bg-black border border-white/10 outline-none focus:border-amber-500 font-bold uppercase tracking-widest text-xs resize-none"
                    />
                    <div className="flex gap-4">
                      <button 
                        type="submit" 
                        disabled={isSubmittingAction}
                        className="px-8 py-3 bg-amber-500 text-black hover:bg-amber-400 font-black uppercase tracking-widest text-[9px]"
                      >
                        SUBMIT_TO_ARBITRATION
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setSelectedMilestoneIdx(null)}
                        className="px-8 py-3 border border-white/10 text-white hover:bg-white/5 font-black uppercase tracking-widest text-[9px]"
                      >
                        CANCEL
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Active Disputes Log */}
              {project.disputes && project.disputes.length > 0 && (
                <div className="space-y-6 pt-12 border-t border-white/10">
                  <h4 className="text-base font-black italic tracking-tight uppercase text-amber-500">ACTIVE DISPUTES LEDGER</h4>
                  
                  {project.disputes.map((disp, idx) => (
                    <div key={idx} className="border border-amber-500/20 bg-zinc-950/40 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="px-2.5 py-0.5 border border-amber-500/30 text-[8px] font-black uppercase text-amber-400 bg-amber-500/5">
                            DISPUTE #{idx + 1}
                          </span>
                          <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">
                            Milestone index: {disp.milestoneIndex}
                          </span>
                          <span className="text-[9px] text-white/30 font-bold uppercase">
                            STATUS: {disp.status?.toUpperCase() || 'RESOLVED'}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-white/70 uppercase tracking-wider italic leading-relaxed">
                          "Reason: {disp.reason}"
                        </p>
                      </div>

                      {/* Dispute Arbitrator Resolutions (For client only, in sandbox mode) */}
                      {isClient && disp.status === 'open' && (
                        <div className="flex gap-2">
                          <button 
                            onClick={() => resolveDispute(disp._id, 'release')}
                            disabled={isSubmittingAction}
                            className="px-5 py-2.5 bg-emerald-500 text-black hover:bg-emerald-400 font-black uppercase tracking-widest text-[9px] italic"
                          >
                            RELEASE_TO_PRO
                          </button>
                          <button 
                            onClick={() => resolveDispute(disp._id, 'refund')}
                            disabled={isSubmittingAction}
                            className="px-5 py-2.5 bg-rose-500 text-white hover:bg-rose-400 font-black uppercase tracking-widest text-[9px] italic"
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
                <div className="pt-12 border-t border-white/10">
                  <h3 className="text-2xl font-black italic tracking-tighter uppercase text-teal-400 mb-2">VERIFIED_TRANSACTION_REVIEW</h3>
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-6">Leave rating feedback to finalize other operative's platform reputation.</p>
                  
                  {hasReviewed ? (
                    <div className="p-6 border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs font-black uppercase tracking-widest italic flex items-center gap-2">
                      <CheckCircle size={16} /> VERIFIED_FEEDBACK_RECORDED_ON_MUTABLE_LEDGER.
                    </div>
                  ) : (
                    <form onSubmit={handleLeaveReview} className="space-y-6 max-w-2xl bg-[#030303] border border-white/5 p-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">Feedback Rating Score (1 to 5 Stars)</label>
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
                                className={stars <= reviewRating ? "text-amber-500 fill-amber-500" : "text-white/20"} 
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">Comment Details</label>
                        <textarea 
                          required
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          placeholder="Write detailed experience comment..."
                          rows={4}
                          className="w-full px-4 py-3 bg-black border border-white/10 outline-none focus:border-white font-bold uppercase tracking-widest text-xs resize-none"
                        />
                      </div>

                      <button 
                        type="submit" 
                        disabled={isSubmittingAction}
                        className="px-10 py-4 bg-white text-black hover:bg-white/90 font-black uppercase tracking-[0.2em] text-[10px] transition-all italic flex items-center justify-center gap-2"
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
                <h3 className="text-3xl font-black italic tracking-tighter uppercase mb-2">TELEMETRY_SESSION_TRACKER</h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Log developer hours dynamically into contract database for audit logs.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {/* Stopwatch Card */}
                {!isClient && (
                  <div className="md:col-span-1 border border-white/10 bg-[#050505] p-8 flex flex-col justify-between min-h-[300px]">
                    <div>
                      <h4 className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-6">SESSION_STOPWATCH</h4>
                      
                      <div className="text-4xl font-black italic tracking-tighter text-white mb-6 font-mono">
                        {formatStopwatch(trackSeconds)}
                      </div>

                      <div className="space-y-4 mb-6">
                        <label className="text-[8px] font-black text-white/40 uppercase tracking-widest">Active Target Task</label>
                        <input 
                          type="text"
                          value={taskDescription}
                          onChange={(e) => setTaskDescription(e.target.value)}
                          disabled={isActiveTracker}
                          placeholder="E.G. API INTERACTION FLOW"
                          className="w-full px-3 py-2 bg-black border border-white/10 text-white font-bold uppercase tracking-wider text-[10px] outline-none focus:border-white disabled:opacity-50"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3">
                      {!isActiveTracker ? (
                        <button 
                          onClick={startStopwatch}
                          className="w-full py-4 bg-white text-black hover:bg-white/90 font-black uppercase tracking-widest text-[9px] italic flex items-center justify-center gap-2"
                        >
                          <Play size={12} fill="currentColor" /> START_TRACKER
                        </button>
                      ) : (
                        <button 
                          onClick={stopStopwatch}
                          disabled={isSubmittingAction}
                          className="w-full py-4 bg-rose-600 text-white hover:bg-rose-500 font-black uppercase tracking-widest text-[9px] italic flex items-center justify-center gap-2"
                        >
                          {isSubmittingAction ? <Loader2 className="animate-spin" size={12} /> : <Square size={12} fill="currentColor" />}
                          STOP_&_LOG_TIME
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Telemetry Logs Table */}
                <div className={`${isClient ? 'md:col-span-3' : 'md:col-span-2'} border border-white/10 bg-zinc-950 p-8`}>
                  <h4 className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-6">SESSION_LOGS_TELEMETRY</h4>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/10 text-[8px] font-black uppercase tracking-[0.2em] text-white/30">
                          <th className="pb-3">Operative</th>
                          <th className="pb-3">Task Details</th>
                          <th className="pb-3">Hours</th>
                          <th className="pb-3 text-right">Logged Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {project.timeLogs && project.timeLogs.length > 0 ? project.timeLogs.map((log, i) => (
                          <tr key={i} className="text-[10px] font-bold text-white/70 uppercase tracking-widest italic">
                            <td className="py-4">Operative #{i + 1}</td>
                            <td className="py-4 text-white/80">{log.taskDescription}</td>
                            <td className="py-4 text-white font-black">{log.hours} Hrs</td>
                            <td className="py-4 text-right text-white/30">{new Date(log.loggedAt).toLocaleDateString()}</td>
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan={4} className="py-12 text-center text-white/20 font-black tracking-widest uppercase italic">
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
                <h3 className="text-3xl font-black italic tracking-tighter uppercase mb-2">SECURE_DATA_VAULT</h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Secure static vault containing system config assets, certificates, and handover codes.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <Card className="p-6 border border-white/10 bg-zinc-950 flex flex-col justify-between min-h-[180px]">
                  <div>
                    <FileText className="text-blue-400 mb-4" size={24} />
                    <h4 className="font-black italic uppercase tracking-tight text-white mb-2">System Blueprint Specification</h4>
                    <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Blueprint detailing execution flow.</p>
                  </div>
                  <button className="w-full py-2 border border-white/10 text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:border-white transition-all">
                    <Download size={12} /> DOWNLOAD_SIGNATURE
                  </button>
                </Card>

                <Card className="p-6 border border-white/10 bg-zinc-950 flex flex-col justify-between min-h-[180px]">
                  <div>
                    <Shield className="text-emerald-400 mb-4" size={24} />
                    <h4 className="font-black italic uppercase tracking-tight text-white mb-2">Verified Contract Escrow Certificate</h4>
                    <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Cryptographic token validating simulated funds.</p>
                  </div>
                  <button className="w-full py-2 border border-white/10 text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:border-white transition-all">
                    <Download size={12} /> SECURE_EXPORT
                  </button>
                </Card>

                <Card className="p-6 border border-white/10 bg-zinc-950 flex flex-col justify-between min-h-[180px]">
                  <div>
                    <FolderOpen className="text-amber-400 mb-4" size={24} />
                    <h4 className="font-black italic uppercase tracking-tight text-white mb-2">Handover Keys Repository</h4>
                    <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Final repository assets for project delivery.</p>
                  </div>
                  <button className="w-full py-2 border border-white/10 text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:border-white transition-all">
                    <Download size={12} /> CLONE_VAULT
                  </button>
                </Card>
              </div>
            </div>
          )}

          {/* Activity Logs Sidebar */}
          <aside className="w-80 border-l border-white/10 bg-black hidden lg:flex flex-col">
            <div className="p-10">
              <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-10 text-center">ACTIVITY_LOG</h4>
              <div className="space-y-10">
                <ActivityRow user="SYSTEM" action="WORKSPACE_ENCRYPTED" time="NOW" icon={Shield} color="text-white" />
                <ActivityRow user={project.client?.firstName || 'CLIENT'} action="RELAY_ACTIVE" time="ACTIVE" icon={Eye} color="text-white/40" />
                
                {project.timeLogs && project.timeLogs.slice(0, 3).map((log, i) => (
                  <ActivityRow 
                    key={i} 
                    user="PRO" 
                    action={`LOGGED_${log.hours}_HOURS`} 
                    time={`${new Date(log.loggedAt).toLocaleTimeString()}`} 
                    icon={Clock} 
                    color="text-blue-400" 
                  />
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
      
      <div className="fixed bottom-8 right-8 z-[100] pointer-events-none opacity-20">
         <Cpu className="w-32 h-32 animate-spin-slow" />
      </div>
    </div>
  );
}

function TabItem({ active, onClick, label }) {
  return (
    <button 
      onClick={onClick}
      className={`py-4 text-[10px] font-black uppercase tracking-[0.3em] border-b-2 transition-all ${
        active ? 'border-white text-white' : 'border-transparent text-white/20 hover:text-white'
      }`}
    >
      {label}
    </button>
  );
}

function RelayMessage({ user, time, message, isClient = false }) {
  return (
    <div className={`flex gap-6 ${isClient ? '' : 'flex-row-reverse text-right'}`}>
      <div className={`flex-shrink-0 w-12 h-12 border flex items-center justify-center font-black text-xl italic ${
        isClient ? 'border-white bg-white text-black' : 'border-white/10 text-white'
      }`}>
        {user[0]}
      </div>
      <div className="max-w-xl">
        <div className={`flex items-center gap-4 mb-3 ${isClient ? '' : 'justify-end'}`}>
          <span className="text-[11px] font-black uppercase tracking-widest">{user}</span>
          <span className="text-[9px] text-white/20 font-black uppercase tracking-widest">{time}</span>
        </div>
        <div className={`p-6 border text-[11px] font-bold leading-relaxed uppercase tracking-widest italic ${
          isClient ? 'border-white/10 bg-white/5 text-white/80' : 'border-white bg-black text-white'
        }`}>
          {message}
        </div>
      </div>
    </div>
  );
}

function ActivityRow({ user, action, time, icon: Icon, color = 'text-white/20' }) {
  return (
    <div className="flex gap-4">
      <div className={`flex-shrink-0 mt-1 ${color}`}>
        <Icon size={16} />
      </div>
      <div>
        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-relaxed">
          <span className="font-black text-white">{user}</span> {action}
        </p>
        <p className="text-[8px] text-white/20 font-black uppercase tracking-[0.3em] mt-1">{time}</p>
      </div>
    </div>
  );
}
