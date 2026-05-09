import React from 'react';
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
  ExternalLink
} from 'lucide-react';
import { Card, Badge, Button, GlassContainer } from '../components/UI';
import { Link } from 'react-router-dom';

// --- View Project Bids (Employer View) ---
export function ViewBids() {
  return (
    <div className="pt-24 pb-20 bg-[#f8f9fb] min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <header className="flex justify-between items-center mb-10">
          <div>
            <Link to="/dashboard/client" className="flex items-center gap-1 text-gray-400 hover:text-primary mb-2 transition-all group">
               <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> <span className="text-[10px] font-bold uppercase tracking-widest">Back to Dashboard</span>
            </Link>
            <h1 className="text-3xl font-bold text-secondary">Proposals for: Next.js Frontend</h1>
          </div>
          <Badge variant="primary" className="px-4 py-2">24 Total Bids</Badge>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <BidRow name="Alex Rivera" score="982" rate="$65/hr" date="2h ago" active />
            <BidRow name="Elena Chen" score="995" rate="$80/hr" date="5h ago" />
            <BidRow name="Marcus Thorne" score="945" rate="$55/hr" date="1d ago" />
            <BidRow name="Sarah Miller" score="912" rate="$60/hr" date="1d ago" />
          </div>

          <aside>
            <Card className="p-8 border-none shadow-xl sticky top-24">
              <h3 className="text-xl font-bold mb-6">AI Recommendation</h3>
              <div className="bg-primary/5 rounded-custom p-6 mb-8 border border-primary/10">
                <p className="text-sm text-gray-600 leading-relaxed italic">
                  "Based on your requirements, <strong>Elena Chen</strong> is the strongest candidate with a 99.5% match for your technical stack and accessibility requirements."
                </p>
              </div>
              <div className="space-y-4">
                <Button className="w-full">Hire Best Match</Button>
                <Button variant="outline" className="w-full">Compare Candidates</Button>
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
  return (
    <div className="pt-24 pb-20 bg-[#f8f9fb] min-h-screen">
      <div className="max-w-5xl mx-auto px-4">
        <Card className="p-10 border-none shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />
          
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-8">
              <div>
                <Badge variant="primary" className="mb-4">Verified Client</Badge>
                <h1 className="text-4xl font-bold text-secondary mb-2">Technical Rebrand for Global SaaS</h1>
                <p className="text-gray-500 font-medium">Posted by <strong>Stripe, Inc.</strong> • 10 hours ago</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-black text-primary">$12,000</p>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Fixed Price Budget</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12 border-y border-border py-8">
               <DetailItem icon={Clock} label="Duration" value="3 Months" />
               <DetailItem icon={Briefcase} label="Expertise" value="Senior level" />
               <DetailItem icon={Shield} label="AI Requirement" value="950+ Score" />
            </div>

            <div className="space-y-8">
              <section>
                <h3 className="text-xl font-bold mb-4">Project Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  We are looking for a Senior Frontend Engineer to lead the technical rebrand of our core customer dashboard. 
                  The project involves migrating legacy components to a modern React + Tailwind v4 architecture while ensuring 
                  perfect accessibility and high performance.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-bold mb-4">Required Skill Badges</h3>
                <div className="flex flex-wrap gap-3">
                   <Badge variant="neutral" className="bg-blue-50 text-blue-700 border-blue-100">React Expert</Badge>
                   <Badge variant="neutral" className="bg-purple-50 text-purple-700 border-purple-100">TypeScript Pro</Badge>
                   <Badge variant="neutral" className="bg-pink-50 text-pink-700 border-pink-100">System Design</Badge>
                </div>
              </section>

              <div className="pt-10 flex gap-4">
                 <Link to="/projects/1/apply">
                   <Button className="h-14 px-12 text-lg">Apply for Project</Button>
                 </Link>
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
                     <span className="text-gray-400">Milestone 1 Payment</span>
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
            You are initiating a direct payment to <strong>Alex Rivera</strong>. 
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
          <Link to="/dashboard/client">
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
  return (
    <div className="pt-24 pb-20 bg-[#f8f9fb] min-h-screen">
      <div className="max-w-3xl mx-auto px-4">
        <header className="mb-10">
          <Link to="/projects/1" className="flex items-center gap-1 text-gray-400 hover:text-primary mb-2 transition-all group">
             <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> <span className="text-[10px] font-bold uppercase tracking-widest">Back to Project</span>
          </Link>
          <h1 className="text-3xl font-bold text-secondary">Submit Your Proposal</h1>
        </header>

        <div className="space-y-8">
          <Card className="p-8 border-none shadow-xl">
            <h3 className="text-xl font-bold mb-6">Proposal Details</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Proposed Rate (Fixed Price)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                  <input type="number" defaultValue="12000" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-custom outline-none focus:bg-white focus:border-primary transition-all font-bold" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Cover Letter</label>
                <textarea rows={6} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-custom outline-none focus:bg-white focus:border-primary transition-all font-medium resize-none" placeholder="Explain why you are the best fit for this project..."></textarea>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Relevant Badges</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="primary" className="bg-primary/10 text-primary border-none">React Expert</Badge>
                  <Badge variant="primary" className="bg-primary/10 text-primary border-none">System Architect</Badge>
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
            <Button variant="outline" className="px-8">Save Draft</Button>
            <Button className="px-12">Submit Proposal</Button>
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
           {name.split(' ')[0][0]}{name.split(' ')[1][0]}
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
