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

  if (isLoading) return <div className="flex justify-center py-40 bg-black min-h-screen"><Loader2 className="animate-spin text-white" size={48} /></div>;

  return (
    <div className="pt-24 pb-20 bg-slate-50 text-slate-900 selection:bg-indigo-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <div>
            <Link to="/dashboard/client" className="flex items-center gap-3 text-slate-400 hover:text-indigo-600 mb-6 transition-all group font-bold text-xs">
               <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
               Back to Hub
            </Link>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900">Project Proposals</h1>
            <p className="text-slate-500 font-medium text-sm mt-2">{project?.title}</p>
          </div>
          <div className="px-6 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-500">
            {project?.bids?.length || 0} Proposals Received
          </div>
        </header>

        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            {project?.bids?.length > 0 ? project.bids.map((bid, i) => (
              <BidRow 
                key={bid._id || i}
                name={`${bid.professional?.firstName || 'Professional'} ${bid.professional?.lastName || ''}`} 
                score={bid.professional?.aiScore || 0} 
                isPro={bid.professional?.isPro}
                rate={`₹${bid.amount?.toLocaleString()}`} 
                date={new Date(bid.createdAt).toLocaleDateString()} 
                active={i === 0} 
              />
            )) : (
              <div className="py-32 text-center bg-white border border-slate-200 rounded-2xl">
                <p className="text-slate-400 font-bold text-sm">No proposals received yet.</p>
              </div>
            )}
          </div>

          <aside>
            <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm sticky top-24">
                <h3 className="text-lg font-bold text-slate-900 mb-8 flex items-center gap-3">
                  <Cpu size={20} className="text-indigo-600" /> AI Insights
                </h3>
                <div className="bg-slate-50 border border-slate-100 p-6 rounded-xl mb-10">
                  <p className="text-xs font-medium text-slate-600 leading-relaxed italic">
                    {project?.bids?.length > 0 
                      ? "Based on skill matching, this professional shows the strongest correlation to your project requirements."
                      : "Waiting for more proposals to analyze optimal candidates."}
                  </p>
                </div>
                <div className="space-y-4">
                  <button className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl text-sm hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100" disabled={!project?.bids?.length}>Hire Candidate</button>
                  <button className="w-full py-4 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl text-sm hover:bg-slate-50 transition-all" disabled={!project?.bids?.length}>Compare All</button>
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

  if (isLoading) return <div className="flex justify-center py-40 bg-black min-h-screen"><Loader2 className="animate-spin text-white" size={48} /></div>;
  if (!project) return <div className="text-center py-40 bg-black text-white min-h-screen">DIRECTIVE_NOT_FOUND.</div>;

  return (
    <div className="pt-24 pb-20 bg-black text-white selection:bg-white selection:text-black min-h-screen">
      <div className="max-w-6xl mx-auto px-6">
        <div className="border border-white/10 p-1 bg-white/5 relative overflow-hidden">
          <div className="bg-black border border-white/10 p-12 md:p-20 relative">
            <div className="absolute top-0 right-0 w-96 h-96 border border-white/5 -mr-48 -mt-48 rotate-45 pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row justify-between items-start mb-16 gap-12">
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">VERIFIED_DIRECTIVE // SS.CORE.IN</span>
                  </div>
                  <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic mb-4 leading-none">{project.title}</h1>
                  <p className="text-white/30 font-black text-[10px] uppercase tracking-[0.3em]">INITIATED BY: {project.client?.firstName || 'ENTERPRISE_ENTITY'} • {new Date(project.createdAt).toLocaleDateString().toUpperCase()}</p>
                </div>
                <div className="text-right">
                  <p className="text-5xl font-black italic tracking-tighter">${project.budget?.toLocaleString()}</p>
                  <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] mt-2">FIXED_PROTOCOL_BUDGET</p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-1 border-y border-white/10 py-12 mb-16">
                 <ProjectDetailItem icon={Clock} label="DEADLINE" value={new Date(project.deadline).toLocaleDateString().toUpperCase()} />
                 <ProjectDetailItem icon={Briefcase} label="STATUS" value={project.status.toUpperCase()} />
                 <ProjectDetailItem icon={Shield} label="AI_THRESHOLD" value="900+ SCORE" />
              </div>

              <div className="space-y-16">
                <section>
                  <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-6">DIRECTIVE_SCOPE</h3>
                  <p className="text-lg font-bold text-white/60 leading-relaxed uppercase tracking-widest italic whitespace-pre-line max-w-4xl">
                    {project.description}
                  </p>
                </section>

                <section>
                  <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-6">PROTOCOL_REQUISITES</h3>
                  <div className="flex flex-wrap gap-4">
                     {project.skills?.map((skill, i) => (
                       <div key={i} className="px-6 py-2 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:border-white transition-all cursor-default">{skill}</div>
                     ))}
                  </div>
                </section>

                <div className="pt-10 flex flex-col sm:flex-row gap-8">
                    {(() => {
                      const user = JSON.parse(localStorage.getItem('user') || '{}');
                      if (user.isPro) {
                        return (
                          <button 
                            onClick={() => navigate(`/projects/${id}/apply`)} 
                            className="px-16 py-6 bg-white text-black font-black uppercase tracking-[0.4em] text-xs hover:bg-white/90 transition-all"
                          >
                            AUTHORIZE_APPLICATION
                          </button>
                        );
                      } else {
                        return (
                          <div className="flex flex-col gap-3">
                            <button 
                              onClick={() => navigate(user.role === 'professional' ? '/dashboard/student' : '/dashboard/client', { state: { showUpgrade: true } })} 
                              className="px-16 py-6 border border-white text-white font-black uppercase tracking-[0.4em] text-xs hover:bg-white/10 transition-all"
                            >
                              UPGRADE_FOR_ACCESS
                            </button>
                            <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.5em] text-center">ELITE_MEMBERSHIP_REQUISITE</p>
                          </div>
                        );
                      }
                    })()}
                    <button className="px-12 py-6 border border-white/10 text-white/40 font-black uppercase tracking-[0.4em] text-xs hover:text-white transition-all">PERSIST_DIRECTIVE</button>
                </div>
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
    <div className="pt-24 pb-20 bg-black text-white selection:bg-white selection:text-black min-h-screen">
      <div className="max-w-5xl mx-auto px-6">
        <h1 className="text-5xl font-black tracking-tighter uppercase italic mb-16 text-center">SECURE_FINANCIAL <br />RELAY.</h1>
        <div className="grid md:grid-cols-2 gap-1 relative">
          <div className="p-1 border border-white/10 bg-white/5">
            <div className="p-10 border border-white/10 bg-black h-full">
               <h3 className="text-xl font-black tracking-tight mb-10 flex items-center gap-4 uppercase italic">
                 <CreditCard size={20} className="text-white/40" /> CREDIT_AUTHORIZATION
               </h3>
               <div className="space-y-10">
                  <div className="space-y-3">
                    <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] ml-1">OPERATIVE_NAME</label>
                    <input type="text" className="w-full px-6 py-4 bg-transparent border border-white/20 focus:border-white outline-none transition-all font-bold placeholder:text-white/10 uppercase" placeholder="SARAH CONNOR" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] ml-1">IDENTIFICATION_NUMBER</label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" />
                      <input type="text" className="w-full pl-16 pr-6 py-4 bg-transparent border border-white/20 focus:border-white outline-none transition-all font-bold placeholder:text-white/10" placeholder="**** **** **** 4242" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                     <div className="space-y-3">
                      <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] ml-1">EXPIRY</label>
                      <input type="text" className="w-full px-6 py-4 bg-transparent border border-white/20 focus:border-white outline-none transition-all font-bold placeholder:text-white/10" placeholder="MM/YY" />
                    </div>
                     <div className="space-y-3">
                      <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] ml-1">CVV</label>
                      <input type="password" size={3} className="w-full px-6 py-4 bg-transparent border border-white/20 focus:border-white outline-none transition-all font-bold placeholder:text-white/10" placeholder="***" />
                    </div>
                  </div>
                  <button className="w-full py-6 bg-white text-black font-black uppercase tracking-[0.4em] text-xs hover:bg-white/90 transition-all mt-6">AUTHORIZE_ESCROW_LOCK</button>
                  <p className="text-[8px] text-white/20 text-center font-black uppercase tracking-[0.4em]">ALL_TRANSACTIONS_ENCRYPTED_VIA_SKILLSCRUMPT.IN</p>
               </div>
            </div>
          </div>

          <div className="p-1 border border-white/10 bg-white/5">
            <div className="p-10 border border-white/10 bg-black h-full relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 border border-white/5 -mr-32 -mt-32 rotate-45 pointer-events-none" />
               <div className="relative z-10 h-full flex flex-col">
                  <h3 className="text-xl font-black tracking-tight mb-12 uppercase italic">ORDER_MANIFEST</h3>
                  <div className="space-y-8 flex-1">
                     <div className="flex justify-between items-end">
                       <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">PROJECT_MILESTONE</span>
                       <span className="text-lg font-black italic">$4,500.00</span>
                     </div>
                     <div className="flex justify-between items-end">
                       <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">PLATFORM_TAX (0%)</span>
                       <span className="text-lg font-black italic text-white/40">$0.00</span>
                     </div>
                  </div>
                  <div className="pt-12 border-t border-white/10 mt-auto">
                     <div className="flex justify-between items-end">
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">AGGREGATE_VALUE</span>
                        <span className="text-5xl font-black italic tracking-tighter">$4,500.00</span>
                     </div>
                  </div>
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
    <div className="pt-24 pb-20 bg-black text-white selection:bg-white selection:text-black min-h-screen flex items-center justify-center">
      <div className="max-w-3xl w-full px-6">
        <div className="border border-white/10 p-1 bg-white/5">
          <div className="bg-black border border-white/10 p-16 text-center relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <div className="w-24 h-24 border border-white/10 flex items-center justify-center mx-auto mb-12 bg-white/5">
               <Wallet size={40} className="text-white/40" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter uppercase italic mb-8">P2P_AUTHORIZATION.</h1>
            <p className="text-[11px] font-bold text-white/40 uppercase tracking-[0.2em] mb-16 leading-relaxed max-w-lg mx-auto">
              YOU ARE INITIATING A DIRECT PROTOCOL TRANSFER. FUNDS WILL BE LOCKED IN SKILLSCRUMPT.IN ESCROW UNTIL DELIVERY VERIFICATION.
            </p>
            
            <div className="bg-white/5 border border-white/10 p-12 mb-16">
               <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] mb-4">RELAY_VALUATION</p>
               <div className="text-7xl font-black italic tracking-tighter mb-4">$2,400.00</div>
               <div className="inline-block px-4 py-1 border border-white text-[8px] font-black uppercase tracking-[0.4em]">ZERO_BROKERAGE_APPLIED</div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-md mx-auto">
               <button className="py-6 bg-white text-black font-black uppercase tracking-[0.3em] text-xs hover:bg-white/90 transition-all">INITIATE_RELAY</button>
               <button className="py-6 border border-white/10 text-white/40 font-black uppercase tracking-[0.3em] text-xs hover:text-white transition-all">ABORT_CYCLE</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ConfirmReceipt() {
  return (
    <div className="pt-24 pb-20 bg-black text-white selection:bg-white selection:text-black min-h-screen flex items-center justify-center">
       <div className="max-w-xl w-full px-6">
          <div className="border border-white/10 p-1 bg-white/5">
            <div className="bg-black border border-white/10 p-16 text-center relative overflow-hidden">
              <motion.div 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-24 h-24 border border-white flex items-center justify-center mx-auto mb-12 bg-white"
              >
                 <CheckCircle size={48} className="text-black" />
              </motion.div>
              <h2 className="text-4xl font-black tracking-tighter uppercase italic mb-6">FUNDS_RELEASED.</h2>
              <p className="text-[11px] font-bold text-white/40 uppercase tracking-[0.2em] mb-12 leading-relaxed">
                SUCCESS_PROTOCOL_REACHED. THE ESCROW LOCK HAS BEEN DISENGAGED. THANK YOU FOR CHOOSING SKILLSCRUMPT.IN.
              </p>
              <Link to="/dashboard">
                <button className="w-full py-6 bg-white text-black font-black uppercase tracking-[0.3em] text-xs hover:bg-white/90 transition-all">RETURN_TO_COMMAND</button>
              </Link>
            </div>
          </div>
       </div>
    </div>
  );
}

// --- 404 Page ---
export function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white selection:bg-white selection:text-black px-6">
       <div className="text-center">
          <h1 className="text-[15rem] font-black text-white/5 leading-none tracking-tighter italic">404</h1>
          <div className="-mt-24 relative z-10">
            <h2 className="text-5xl font-black tracking-tighter uppercase italic mb-6">SIGNAL_LOST.</h2>
            <p className="text-[11px] font-bold text-white/30 uppercase tracking-[0.3em] mb-12">THE REQUESTED COORDINATES DO NOT CORRELATE TO ANY KNOWN SECTOR.</p>
            <Link to="/">
              <button className="px-16 py-6 border border-white text-white font-black uppercase tracking-[0.3em] text-xs hover:bg-white hover:text-black transition-all">RESET_TO_CORE</button>
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
  const [coverLetter, setCoverLetter] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
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
    if (!amount || !coverLetter) return alert('Please fill all fields');
    setIsSubmitting(true);
    try {
      await api.post(`/projects/${id}/bid`, { amount, coverLetter });
      alert('Proposal submitted successfully!');
      navigate(`/projects/${id}`);
    } catch (err) {
      alert(err.response?.data?.message || 'Error submitting proposal');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-24 pb-20 bg-black text-white selection:bg-white selection:text-black min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        <header className="mb-16">
          <button onClick={() => navigate(-1)} className="flex items-center gap-3 text-white/30 hover:text-white mb-6 transition-all group">
             <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
             <span className="text-[10px] font-black uppercase tracking-[0.3em]">Back to Directive</span>
          </button>
          <h1 className="text-5xl font-black tracking-tighter uppercase italic">PROPOSAL <br />INITIATION.</h1>
          <p className="text-white/40 font-black text-[10px] uppercase tracking-[0.2em] mt-4 italic">DIRECTIVE: {project?.title}</p>
        </header>

        <div className="space-y-12">
          <div className="p-1 border border-white/10 bg-white/5">
            <div className="p-10 border border-white/10 bg-black">
              <h3 className="text-xl font-black tracking-tight mb-10 uppercase italic">OPERATIVE_DETAILS</h3>
              <div className="space-y-10">
                <div className="space-y-3">
                  <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] ml-1">PROPOSED_VALUATION (USD)</label>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 font-black italic">$</span>
                    <input 
                      type="number" 
                      value={amount} 
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full pl-12 pr-6 py-4 bg-transparent border border-white/20 focus:border-white outline-none transition-all font-black italic text-xl placeholder:text-white/10" 
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] ml-1">CAPABILITY_MANIFEST (COVER_LETTER)</label>
                  <textarea 
                    rows={8} 
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    className="w-full px-6 py-4 bg-transparent border border-white/20 focus:border-white outline-none transition-all font-bold placeholder:text-white/10 resize-none uppercase tracking-widest text-[11px]" 
                    placeholder="DEMONSTRATE CORRELATION TO DIRECTIVE CORE..."
                  ></textarea>
                </div>

                <div className="space-y-6">
                  <h4 className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] ml-1">CORRELATED_BADGES</h4>
                  <div className="flex flex-wrap gap-3">
                    {project?.skills?.map((skill, i) => (
                      <div key={i} className="px-4 py-1 border border-white/10 text-[9px] font-black uppercase tracking-widest">{skill}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-10 border border-white/10 bg-white/5 flex flex-col sm:flex-row justify-between items-center gap-8">
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-2 flex items-center gap-3">
                <Shield size={16} className="text-white/40" /> SkillScrumpt.in SECURITY
              </h4>
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">PROPOSAL_LOCKED_VIA_AI_INTEGRITY_CHECK.</p>
            </div>
            <Zap className="text-white animate-pulse" size={32} />
          </div>

          <div className="flex justify-end gap-8">
            <button onClick={() => navigate(-1)} className="px-12 py-6 border border-white/10 text-white/40 font-black uppercase tracking-[0.3em] text-xs hover:text-white transition-all">ABORT</button>
            <button 
              onClick={handleSubmit} 
              disabled={isSubmitting} 
              className="px-16 py-6 bg-white text-black font-black uppercase tracking-[0.3em] text-xs hover:bg-white/90 transition-all flex items-center gap-4"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : 'INITIALIZE_RELAY'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Helper Components ---

function BidRow({ name, score, rate, date, isPro, active = false }) {
  return (
    <div className={`bg-white border transition-all rounded-2xl overflow-hidden shadow-sm ${active ? 'border-indigo-600 ring-1 ring-indigo-600' : 'border-slate-200 hover:border-slate-300'}`}>
      <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-8 cursor-pointer">
         <div className="flex items-center gap-6">
           <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-slate-400 text-xl">
             {name[0]}
           </div>
           <div>
               <h4 className="font-bold text-slate-900 flex items-center gap-2">
                 {name} 
                 {isPro && (
                   <span className="flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-amber-400 to-amber-600 text-white text-[9px] font-black rounded-full shadow-sm">
                     <Zap size={10} fill="currentColor" /> PRO
                   </span>
                 )}
                 <BadgeCheck size={18} className="text-indigo-500" />
               </h4>
              <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
                <span className="text-indigo-600">AI Score: {score}</span>
                <span>Submitted {date}</span>
              </div>
           </div>
         </div>
         <div className="flex items-center gap-8">
            <div className="text-right">
               <p className="text-xl font-bold text-slate-900">{rate}</p>
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Proposed Rate</p>
            </div>
            <ChevronRight size={20} className="text-slate-300" />
         </div>
      </div>
    </div>
  );
}

function ProjectDetailItem({ icon: Icon, label, value }) {
  return (
    <div className="p-8 text-center bg-white/[0.02] border-x border-white/5 first:border-l-0 last:border-r-0">
       <Icon size={24} className="text-white/40 mx-auto mb-6" />
       <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] mb-3">{label}</p>
       <p className="text-sm font-black italic tracking-widest">{value}</p>
    </div>
  );
}
