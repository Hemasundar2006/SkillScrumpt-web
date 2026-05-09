import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Shield, Globe, Award, Zap, Users, MessageSquare, DollarSign, CheckCircle, MinusCircle } from 'lucide-react';
import { Button, Card, Badge, GlassContainer } from '../components/UI';
import { Link } from 'react-router-dom';

export function AboutPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-secondary text-white py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -mr-48 -mt-48" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <Badge variant="primary" className="mb-6 bg-primary/20 text-blue-300 border-none uppercase tracking-widest">Our Vision</Badge>
            <h1 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight">Eliminating the Guesswork in Hiring.</h1>
            <p className="text-xl text-gray-400 leading-relaxed">
              SkillScrumpt was founded in 2024 with a simple mission: to create a world where talent is recognized by what they can do, not where they come from or what's on their resume.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12">
            <ValueCard 
              icon={Shield} 
              title="Radical Transparency" 
              desc="Every skill badge on our platform is backed by a live-proctored assessment. We provide the data, you make the decision."
            />
            <ValueCard 
              icon={Zap} 
              title="AI-Powered Precision" 
              desc="Our adaptive testing algorithms ensure that candidates are challenged at exactly the right level, revealing true expert potential."
            />
            <ValueCard 
              icon={Globe} 
              title="Global Equity" 
              desc="We believe in a borderless talent economy. Verified skills speak a universal language that transcends geography."
            />
          </div>
        </div>
      </section>

      {/* Team/Company Info Placeholder */}
      <section className="py-24 bg-[#f8f9fb]">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-16">The Minds Behind the Shield</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="group">
                <div className="aspect-square bg-gray-200 rounded-custom mb-4 overflow-hidden grayscale group-hover:grayscale-0 transition-all">
                  {/* Team member image placeholder */}
                </div>
                <h4 className="font-bold text-lg">Member Name</h4>
                <p className="text-sm text-gray-500 font-medium">Designation</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export function PricingPage() {
  const [role, setRole] = React.useState('student');

  return (
    <div className="pt-24 pb-20 bg-[#f8f9fb] min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block mb-4"
          >
            <Badge variant="primary" className="bg-primary/10 text-primary border-none px-6 py-2 rounded-full font-black uppercase tracking-widest text-[10px]">
              Simple, Transparent Pricing
            </Badge>
          </motion.div>
          <h2 className="text-5xl lg:text-7xl font-black text-secondary mb-6 tracking-tight">
            One Flat Fee. <span className="text-primary">Zero Brokerage.</span>
          </h2>
          <p className="text-xl text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">
            Choose your path and start your journey with a single subscription. No commission, no hidden fees, just pure growth.
          </p>
        </div>

        {/* Role Toggle */}
        <div className="flex justify-center mb-16">
          <div className="bg-white p-1.5 rounded-full shadow-xl border border-border flex gap-1 relative overflow-hidden">
            <button 
              onClick={() => setRole('student')}
              className={`relative z-10 px-8 py-3 rounded-full text-sm font-black transition-all duration-300 ${role === 'student' ? 'text-white' : 'text-gray-500 hover:text-secondary'}`}
            >
              I'm a Professional
            </button>
            <button 
              onClick={() => setRole('client')}
              className={`relative z-10 px-8 py-3 rounded-full text-sm font-black transition-all duration-300 ${role === 'client' ? 'text-white' : 'text-gray-500 hover:text-secondary'}`}
            >
              I'm a Client
            </button>
            <motion.div 
              className="absolute inset-y-1.5 bg-secondary rounded-full shadow-lg shadow-secondary/20"
              initial={false}
              animate={{ 
                x: role === 'student' ? 0 : '100%',
                width: role === 'student' ? '50%' : '50%'
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{ left: 6, width: 'calc(50% - 6px)' }}
            />
          </div>
        </div>

        {/* Dynamic Pricing Layout */}
        <div className="grid lg:grid-cols-12 gap-8 mb-24">
          {/* Main Card */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={role}
                initial={{ opacity: 0, x: role === 'student' ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: role === 'student' ? 20 : -20 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="p-12 border-none shadow-2xl bg-white relative overflow-hidden h-full">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />
                  
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-10">
                      <div>
                        <h3 className="text-3xl font-black text-secondary mb-2">
                          {role === 'student' ? 'Professional Elite' : 'Employer Plus'}
                        </h3>
                        <p className="text-gray-500 font-medium">Everything you need to {role === 'student' ? 'get hired' : 'find talent'}.</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-baseline gap-1">
                          <span className="text-5xl font-black text-primary">₹{role === 'student' ? '99' : '49'}</span>
                          <span className="text-gray-400 font-bold">/mo</span>
                        </div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Billed Monthly</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-x-12 gap-y-6 mb-12">
                      {role === 'student' ? (
                        <>
                          <PricingFeature label="Infinite AI Skill Assessments" />
                          <PricingFeature label="Verified Talent Badges" />
                          <PricingFeature label="Direct Client Communication" />
                          <PricingFeature label="100% Payout Retention" />
                          <PricingFeature label="Premium Profile Customization" />
                          <PricingFeature label="Priority Application Ranking" />
                        </>
                      ) : (
                        <>
                          <PricingFeature label="Unlimited Project Postings" />
                          <PricingFeature label="AI Talent Matchmaking" />
                          <PricingFeature label="Direct Peer-to-Peer Payments" />
                          <PricingFeature label="Zero Brokerage Fees" />
                          <PricingFeature label="Verified Student Access" />
                          <PricingFeature label="Escrow-Protected Transfers" />
                        </>
                      )}
                    </div>

                    <div className="pt-10 border-t border-border flex flex-col sm:flex-row gap-4 items-center">
                      <Link to="/checkout" className="w-full sm:w-auto">
                        <Button className="h-14 px-12 text-lg shadow-xl shadow-primary/20 w-full">
                          Get Started Now
                        </Button>
                      </Link>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">No Commitment, Cancel Anytime</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bento Stats Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="p-8 border-none bg-secondary text-white shadow-xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000" />
               <div className="relative z-10">
                 <h4 className="text-sm font-black uppercase tracking-widest text-primary mb-4">Zero Brokerage</h4>
                 <p className="text-2xl font-bold leading-tight mb-4">Save up to 20% compared to Upwork or Fiverr.</p>
                 <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                   <div className="bg-primary h-full w-[80%] animate-pulse" />
                 </div>
               </div>
            </Card>

            <Card className="p-8 border-none shadow-xl bg-white">
               <h4 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-6">Built-in Trust</h4>
               <div className="space-y-4">
                  <TrustItem icon={Shield} label="AI-Verified Identity" />
                  <TrustItem icon={Award} label="Proctored Certifications" />
                  <TrustItem icon={CheckCircle} label="Instant Payouts" />
               </div>
            </Card>

            <Card className="p-8 border-none bg-primary/5 shadow-inner">
               <p className="text-xs font-bold text-gray-500 leading-relaxed italic text-center">
                 "Switching to SkillScrumpt's flat-fee model saved me over $2,400 in commissions last year."
               </p>
               <div className="mt-4 flex items-center justify-center gap-2">
                 <div className="w-6 h-6 rounded-full bg-gray-200" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Marcus T.</span>
               </div>
            </Card>
          </div>
        </div>

        {/* Feature Comparison Table */}
        <section className="bg-white rounded-[2rem] border border-border overflow-hidden shadow-2xl">
          <div className="p-10 bg-gray-50/50 border-b border-border flex justify-between items-center">
            <h3 className="text-2xl font-bold text-secondary">Full Feature Breakdown</h3>
            <div className="flex gap-4">
               <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full bg-primary" />
                 <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Student</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full bg-secondary" />
                 <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Client</span>
               </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <tbody className="divide-y divide-border">
                <ComparisonRow label="AI Adaptive Skill Tests" student={true} client={false} />
                <ComparisonRow label="Verified Talent Profile" student={true} client={false} />
                <ComparisonRow label="Direct Project Bidding" student={true} client={false} />
                <ComparisonRow label="Post Unlimited Projects" student={false} client={true} />
                <ComparisonRow label="Access Proctored Data" student={false} client={true} />
                <ComparisonRow label="Peer-to-Peer Direct Pay" student={true} client={true} />
                <ComparisonRow label="Zero Platform Commission" student="0%" client="0%" />
                <ComparisonRow label="Live Chat & Collaboration" student={true} client={true} />
                <ComparisonRow label="Escrow-Backed Payouts" student={true} client={true} />
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

function PricingFeature({ label }) {
  return (
    <div className="flex items-center gap-3 group">
      <div className="w-5 h-5 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
        <Check size={12} strokeWidth={4} />
      </div>
      <span className="text-sm font-bold text-gray-600">{label}</span>
    </div>
  );
}

function TrustItem({ icon: Icon, label }) {
  return (
    <div className="flex items-center gap-4">
      <Icon size={18} className="text-primary" />
      <span className="text-xs font-bold text-secondary uppercase tracking-widest">{label}</span>
    </div>
  );
}

function ComparisonRow({ label, student, client }) {
  const renderValue = (val) => {
    if (val === true) return <CheckCircle className="text-primary mx-auto" size={22} />;
    if (val === false) return <div className="w-1.5 h-1.5 bg-gray-200 rounded-full mx-auto" />;
    return <span className="text-primary font-black text-xs uppercase tracking-widest">{val}</span>;
  };

  return (
    <tr className="hover:bg-gray-50/50 transition-colors">
      <td className="px-10 py-6 text-sm font-black text-gray-600 uppercase tracking-widest">{label}</td>
      <td className="px-10 py-6 text-center w-40">{renderValue(student)}</td>
      <td className="px-10 py-6 text-center w-40">{renderValue(client)}</td>
    </tr>
  );
}

function ValueCard({ icon: Icon, title, desc }) {
  return (
    <div className="group">
      <div className="w-16 h-16 bg-primary/10 text-primary rounded-custom flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        <Icon size={32} />
      </div>
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-gray-500 leading-relaxed">{desc}</p>
    </div>
  );
}
