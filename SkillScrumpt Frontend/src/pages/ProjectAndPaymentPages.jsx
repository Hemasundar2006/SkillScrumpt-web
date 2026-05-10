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
  ChevronRight
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

  if (isLoading) return <div className="flex justify-center py-40"><Loader2 className="animate-spin text-primary" size={48} /></div>;

  return (
    <div className="pt-24 pb-20 bg-[#f8f9fb] min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <header className="flex justify-between items-center mb-10">
          <div>
            <Link to="/dashboard/client" className="flex items-center gap-1 text-gray-400 hover:text-primary mb-2 transition-all group">
               <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> <span className="text-[10px] font-bold uppercase tracking-widest">Back to Dashboard</span>
            </Link>
            <h1 className="text-3xl font-bold text-secondary">Proposals for: {project?.title}</h1>
          </div>
          <Badge variant="primary" className="px-4 py-2">{project?.bids?.length || 0} Total Bids</Badge>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {project?.bids?.length > 0 ? project.bids.map((bid, i) => (
              <BidRow 
                key={bid._id || i}
                name={`${bid.professional?.firstName || 'Professional'} ${bid.professional?.lastName || ''}`} 
                score={bid.professional?.aiScore || 0} 
                rate={`$${bid.amount}`} 
                date={new Date(bid.createdAt).toLocaleDateString()} 
                active={i === 0} 
              />
            )) : (
              <p className="text-gray-400 font-medium italic">No proposals received yet for this project.</p>
            )}
          </div>

          <aside>
            <Card className="p-8 border-none shadow-xl sticky top-24">
              <h3 className="text-xl font-bold mb-6">AI Recommendation</h3>
              <div className="bg-primary/5 rounded-custom p-6 mb-8 border border-primary/10">
                <p className="text-sm text-gray-600 leading-relaxed italic">
                  {project?.bids?.length > 0 
                    ? `"Based on your requirements, the top professional is the strongest candidate with high matching score for your technical stack."`
                    : '"Waiting for proposals to analyze the best match for your project."'}
                </p>
              </div>
              <div className="space-y-4">
                <Button className="w-full" disabled={!project?.bids?.length}>Hire Best Match</Button>
                <Button variant="outline" className="w-full" disabled={!project?.bids?.length}>Compare Candidates</Button>
              </div>
            </Card>
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

  if (isLoading) return <div className="flex justify-center py-40"><Loader2 className="animate-spin text-primary" size={48} /></div>;
  if (!project) return <div className="text-center py-40">Project not found.</div>;

  return (
    <div className="pt-24 pb-20 bg-[#f8f9fb] min-h-screen">
      <div className="max-w-5xl mx-auto px-4">
        <Card className="p-10 border-none shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />
          
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-8">
              <div>
                <Badge variant="primary" className="mb-4">Verified Client</Badge>
                <h1 className="text-4xl font-bold text-secondary mb-2">{project.title}</h1>
                <p className="text-gray-500 font-medium">Posted by <strong>{project.client?.firstName || 'Enterprise Client'}</strong> • {new Date(project.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-black text-primary">${project.budget?.toLocaleString()}</p>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Fixed Price Budget</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12 border-y border-border py-8">
               <DetailItem icon={Clock} label="Deadline" value={new Date(project.deadline).toLocaleDateString()} />
               <DetailItem icon={Briefcase} label="Status" value={project.status} />
               <DetailItem icon={Shield} label="AI Requirement" value="900+ Score" />
            </div>

            <div className="space-y-8">
              <section>
                <h3 className="text-xl font-bold mb-4">Project Description</h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {project.description}
                </p>
              </section>

              <section>
                <h3 className="text-xl font-bold mb-4">Required Skill Badges</h3>
                <div className="flex flex-wrap gap-3">
                   {project.skills?.map((skill, i) => (
                     <Badge key={i} variant="neutral" className="bg-blue-50 text-blue-700 border-blue-100">{skill}</Badge>
                   ))}
                </div>
              </section>

              <div className="pt-10 flex gap-4">
                  {(() => {
                    const user = JSON.parse(localStorage.getItem('user') || '{}');
                    if (user.isPro) {
                      return <Button onClick={() => navigate(`/projects/${id}/apply`)} className="h-14 px-12 text-lg">Apply for Project</Button>;
                    } else {
                      return (
                        <div className="flex flex-col gap-2">
                          <Button 
                            onClick={() => navigate(user.role === 'professional' ? '/dashboard/student' : '/dashboard/client', { state: { showUpgrade: true } })} 
                            className="h-14 px-12 text-lg bg-primary/10 text-primary border-2 border-primary hover:bg-primary hover:text-white"
                          >
                            Upgrade to Apply
                          </Button>
                          <p className="text-[10px] font-black text-primary uppercase tracking-widest text-center">Pro Membership Required</p>
                        </div>
                      );
                    }
                  })()}
                  <Button variant="outline" className="h-14 px-10 text-lg">Save Project</Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// --- Payment & Checkout Pages ---
export function PaymentCheckout() {
  return (
    <div className="pt-24 pb-20 bg-[#f8f9fb] min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-10 text-center">Secure Payment Checkout</h1>
        <div className="grid md:grid-cols-2 gap-10">
          <Card className="p-8 border-none shadow-xl">
             <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
               <CreditCard size={20} className="text-primary" /> Payment Details
             </h3>
             <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Cardholder Name</label>
                  <input type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-custom outline-none focus:bg-white focus:border-primary transition-all font-bold" placeholder="Sarah Connor" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Card Number</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-custom outline-none focus:bg-white focus:border-primary transition-all font-bold" placeholder="**** **** **** 4242" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Expiry</label>
                    <input type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-custom outline-none focus:bg-white focus:border-primary transition-all font-bold" placeholder="MM/YY" />
                  </div>
                   <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">CVV</label>
                    <input type="password" size={3} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-custom outline-none focus:bg-white focus:border-primary transition-all font-bold" placeholder="***" />
                  </div>
                </div>
                <Button className="w-full h-14 text-lg mt-6">Confirm and Secure Payout</Button>
                <p className="text-[10px] text-gray-400 text-center font-bold uppercase tracking-widest">Payments secured with AI-Verified Escrow</p>
             </div>
          </Card>

          <Card className="p-8 border-none bg-secondary text-white shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16" />
             <div className="relative z-10 h-full flex flex-col">
                <h3 className="text-lg font-bold mb-8">Order Summary</h3>
                <div className="space-y-4 flex-1">
                   <div className="flex justify-between">
                     <span className="text-gray-400">Project Milestone</span>
                     <span className="font-bold">$4,500.00</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-gray-400">Platform Fee (0%)</span>
                     <span className="font-bold text-primary">$0.00</span>
                   </div>
                </div>
                <div className="pt-8 border-t border-white/10 mt-auto">
                   <div className="flex justify-between items-end">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Amount</span>
                      <span className="text-3xl font-black text-primary">$4,500.00</span>
                   </div>
                </div>
             </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export function PeerToPeerCheckout() {
  return (
    <div className="pt-24 pb-20 bg-[#f8f9fb] min-h-screen">
      <div className="max-w-2xl mx-auto px-4">
        <Card className="p-12 border-none shadow-2xl text-center">
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
             <Wallet size={40} />
          </div>
          <h1 className="text-3xl font-bold mb-4">Direct Peer-to-Peer Checkout</h1>
          <p className="text-gray-500 mb-10 leading-relaxed">
            You are initiating a direct payment. 
            Funds will be held in our AI-managed escrow until you confirm receipt of the work.
          </p>
          
          <div className="bg-gray-50 rounded-custom p-8 mb-10 border border-gray-100">
             <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Amount to Transfer</p>
             <div className="text-5xl font-black text-secondary mb-2">$2,400.00</div>
             <p className="text-[10px] text-primary font-bold uppercase tracking-widest">Zero Brokerage Fee Applied</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <Button className="h-14">Initiate Transfer</Button>
             <Button variant="outline" className="h-14">Cancel</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

export function ConfirmReceipt() {
  return (
    <div className="pt-24 pb-20 bg-[#f8f9fb] min-h-screen flex items-center justify-center">
       <Card className="max-w-md w-full p-12 border-none shadow-2xl text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-3xl -mr-16 -mt-16" />
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8"
          >
             <CheckCircle size={48} />
          </motion.div>
          <h2 className="text-3xl font-bold mb-4 text-secondary">Payment Released</h2>
          <p className="text-gray-500 mb-10 leading-relaxed">
            Success! The funds have been released from escrow to the professional. Thank you for using SkillScrumpt.
          </p>
          <Link to="/dashboard">
            <Button className="w-full h-14">Return to Dashboard</Button>
          </Link>
       </Card>
    </div>
  );
}

// --- 404 Page ---
export function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fb] px-4">
       <div className="text-center">
          <h1 className="text-[12rem] font-black text-primary/10 leading-none">404</h1>
          <div className="-mt-16 relative z-10">
            <h2 className="text-4xl font-bold text-secondary mb-4">Lost in Orbit?</h2>
            <p className="text-gray-500 mb-10 text-lg">The page you're looking for doesn't exist or has been moved.</p>
            <Link to="/">
              <Button className="h-14 px-12 text-lg shadow-xl shadow-primary/20">Return Home</Button>
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
    <div className="pt-24 pb-20 bg-[#f8f9fb] min-h-screen">
      <div className="max-w-3xl mx-auto px-4">
        <header className="mb-10">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-gray-400 hover:text-primary mb-2 transition-all group">
             <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> <span className="text-[10px] font-bold uppercase tracking-widest">Back to Project</span>
          </button>
          <h1 className="text-3xl font-bold text-secondary">Submit Your Proposal</h1>
          <p className="text-gray-500 font-medium">For: {project?.title}</p>
        </header>

        <div className="space-y-8">
          <Card className="p-8 border-none shadow-xl">
            <h3 className="text-xl font-bold mb-6">Proposal Details</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Proposed Rate (Fixed Price)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                  <input 
                    type="number" 
                    value={amount} 
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-custom outline-none focus:bg-white focus:border-primary transition-all font-bold" 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Cover Letter</label>
                <textarea 
                  rows={6} 
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-custom outline-none focus:bg-white focus:border-primary transition-all font-medium resize-none" 
                  placeholder="Explain why you are the best fit for this project..."
                ></textarea>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Relevant Badges</h4>
                <div className="flex flex-wrap gap-2">
                  {project?.skills?.map((skill, i) => (
                    <Badge key={i} variant="primary" className="bg-primary/10 text-primary border-none">{skill}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-8 border-none shadow-xl bg-secondary text-white">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-bold mb-1">SkillScrumpt Protection</h4>
                <p className="text-xs text-gray-400">Your proposal is secured by AI-Verified integrity check.</p>
              </div>
              <Shield className="text-primary" size={32} />
            </div>
          </Card>

          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => navigate(-1)} className="px-8">Cancel</Button>
            <Button onClick={handleSubmit} disabled={isSubmitting} className="px-12">
              {isSubmitting ? 'Submitting...' : 'Submit Proposal'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Helper Components ---

function BidRow({ name, score, rate, date, active = false }) {
  return (
    <Card className={`p-6 border-none shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:shadow-xl transition-all cursor-pointer ${active ? 'ring-2 ring-primary' : ''}`}>
       <div className="flex items-center gap-4">
         <div className="w-12 h-12 bg-gray-100 rounded-custom flex items-center justify-center font-bold text-primary border border-primary/10">
           {name[0]}
         </div>
         <div>
             <h4 className="font-bold text-secondary flex items-center gap-2">
               {name} <BadgeCheck size={18} className="text-primary fill-primary/10" />
             </h4>
            <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
              <span className="text-primary font-black">AI Score: {score}</span>
              <span>Applied {date}</span>
            </div>
         </div>
       </div>
       <div className="flex items-center gap-8">
          <div className="text-right">
             <p className="text-lg font-black text-secondary">{rate}</p>
             <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Proposed Rate</p>
          </div>
          <button className="p-2 text-gray-200 hover:text-primary transition-all">
             <ChevronRight size={24} />
          </button>
       </div>
    </Card>
  );
}

function DetailItem({ icon: Icon, label, value }) {
  return (
    <div className="text-center">
       <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 text-primary">
          <Icon size={20} />
       </div>
       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
       <p className="text-sm font-bold text-secondary">{value}</p>
    </div>
  );
}
