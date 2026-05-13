import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Shield, Globe, Award, Zap, Users, MessageSquare, DollarSign, CheckCircle, MinusCircle, Star, Cpu, Lock, Monitor, Target, ArrowRight, User, Linkedin, Twitter, Mail } from 'lucide-react';
import { Button, Card, Badge } from '../components/UI';
import { Link, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../layout/DashboardLayout';

export function AboutPage() {
  React.useEffect(() => {
    document.title = "About SkillScrumpt | The Future of Student Freelancing";
  }, []);
  return (
    <div className="pt-20 bg-black text-white selection:bg-white selection:text-black">
      {/* Hero */}
      <section className="py-32 lg:py-48 relative overflow-hidden border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-4 mb-8">
               <div className="w-12 h-[1px] bg-white" />
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Our Mission</span>
            </div>
            <motion.h1 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-7xl lg:text-[8rem] font-black mb-12 leading-[0.85] tracking-tighter uppercase italic"
            >
              ELIMINATE <br />
              <span className="text-white/30">GUESSWORK.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-xl text-white/40 max-w-3xl leading-relaxed font-bold uppercase tracking-widest"
            >
              SkillScrumpt.in was founded in 2024 with a simple mission: to create a world where talent is recognized by what they can do, not where they come from or what's on their resume.
            </motion.p>
          </motion.div>
        </div>
        
        {/* Abstract Background */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 opacity-5 pointer-events-none">
           <Star className="w-[600px] h-[600px] animate-spin-slow" />
        </div>
      </section>

      {/* Core Values */}
      <section className="py-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-16">
            <ValueCard 
              icon={Shield} 
              title="RADICAL TRANSPARENCY" 
              desc="Every skill badge on our platform is backed by a live-proctored assessment. We provide the data, you make the decision."
            />
            <ValueCard 
              icon={Zap} 
              title="AI PRECISION" 
              desc="Our adaptive testing algorithms ensure that candidates are challenged at exactly the right level, revealing true expert potential."
            />
            <ValueCard 
              icon={Globe} 
              title="GLOBAL OPPORTUNITY" 
              desc="We believe in a borderless talent economy. Verified skills speak a universal language that transcends geography."
            />
          </div>
        </div>
      </section>

      {/* TEAM SECTION */}
      <section className="py-40 border-t border-white/10" id="team">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
             <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-500/20 to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                <div className="relative radius-design overflow-hidden border border-white/10 aspect-[4/5] bg-zinc-900">
                   <img 
                     src="/founder.jpeg" 
                     className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100" 
                     alt="Hemasundar Maroti" 
                   />
                </div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white text-black flex flex-col items-center justify-center radius-design shadow-2xl p-6 text-center z-10">
                   <p className="text-[10px] font-black uppercase tracking-widest mb-2 text-black/40">Established</p>
                   <p className="text-2xl font-black italic">2026</p>
                </div>
             </div>

             <div className="lg:pl-10">
                <div className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40 mb-6">The Architect</div>
                <h2 className="text-5xl md:text-8xl font-black tracking-tighter mb-10 leading-[0.9] uppercase italic">
                  Hemasundar <br />Maroti.
                </h2>
                <div className="flex items-center gap-4 mb-10">
                   <span className="px-5 py-2 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-white border border-white/10">Founder</span>
                   <span className="px-5 py-2 bg-white text-black rounded-full text-[10px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(255,255,255,0.2)]">Lead Developer</span>
                </div>
                <p className="text-xl text-white/40 font-bold uppercase tracking-widest leading-relaxed mb-12 max-w-lg">
                  The visionary behind SkillScrumpt's un-cheatable AI architecture. Hemasundar is dedicated to building an ecosystem where merit is the only currency and talent is verified through absolute transparency.
                </p>
                <div className="flex gap-8">
                   <a href="#" className="text-white hover:text-white/60 transition-colors"><Linkedin size={24} /></a>
                   <a href="#" className="text-white hover:text-white/60 transition-colors"><Twitter size={24} /></a>
                   <a href="#" className="text-white hover:text-white/60 transition-colors"><Mail size={24} /></a>
                </div>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export function PricingPage() {
  const [role, setRole] = React.useState('student');
  React.useEffect(() => {
    document.title = "Zero Brokerage Pricing | SkillScrumpt.in";
  }, []);

  return (
    <div className="pt-24 pb-20 bg-black text-white selection:bg-white selection:text-black min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <div className="text-center mb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-block px-8 py-2 border border-white/10 text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mb-12">PRICING PLANS</div>
            <motion.h2 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="text-4xl md:text-7xl lg:text-[10rem] font-black mb-12 leading-[0.8] tracking-tighter uppercase italic"
            >
              FLAT FEE. <br />
              <span className="text-white/30">ZERO BROKERAGE.</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-xl text-white/40 font-bold uppercase tracking-widest max-w-3xl mx-auto leading-relaxed"
            >
              CHOOSE YOUR PATH AND START YOUR JOURNEY WITH A SINGLE SUBSCRIPTION. NO COMMISSION, NO HIDDEN FEES, JUST PURE GROWTH.
            </motion.p>
          </motion.div>
        </div>

        {/* Role Toggle */}
        <div className="flex justify-center mb-24">
          <div className="p-1 border border-white/10 bg-white/5 flex">
            <button 
              onClick={() => setRole('student')}
              className={`px-6 md:px-12 py-5 text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${role === 'student' ? 'bg-white text-black' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
            >
              PROFESSIONAL
            </button>
            <button 
              onClick={() => setRole('client')}
              className={`px-6 md:px-12 py-5 text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${role === 'client' ? 'bg-white text-black' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
            >
              CLIENT
            </button>
          </div>
        </div>

        {/* Dynamic Pricing Layout */}
        <div className="grid lg:grid-cols-12 gap-1 mb-32">
          {/* Main Card */}
          <div className="lg:col-span-8 p-1 border border-white/10 bg-white/5">
            <AnimatePresence mode="wait">
              <motion.div
                key={role}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-black border border-white/10 p-8 md:p-20 relative overflow-hidden h-full radius-design"
              >
                <div className="absolute top-0 right-0 w-64 h-64 border border-white/5 -mr-32 -mt-32 rotate-45 pointer-events-none" />
                
                <div className="relative z-10">
                  <div className="flex flex-col md:flex-row justify-between items-start mb-16 gap-12">
                    <div>
                      <h3 className="text-4xl font-black text-white mb-4 italic tracking-tight uppercase">
                        {role === 'student' ? 'STUDENT PRO.' : 'CLIENT PRO.'}
                      </h3>
                      <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">ALL CORE FEATURES INCLUDED</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-baseline gap-2">
                        <span className="text-6xl font-black italic tracking-tighter text-white">₹1</span>
                        <span className="text-white/20 font-black uppercase tracking-widest text-xs">/cycle</span>
                      </div>
                      <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mt-2">Billed per Cycle</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-x-12 gap-y-10 mb-20 border-y border-white/10 py-16">
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

                  <div className="flex flex-col sm:flex-row gap-10 items-center">
                    {(() => {
                      const userStr = localStorage.getItem('user');
                      const user = userStr ? JSON.parse(userStr) : null;
                      const isAlreadyPro = user?.isPro === true;

                      if (isAlreadyPro) {
                        return (
                          <button disabled className="px-12 py-6 border border-white/20 text-white/20 text-[10px] font-black uppercase tracking-[0.4em] w-full sm:w-auto italic">
                            PRO ACCOUNT ACTIVE
                          </button>
                        );
                      }

                      return (
                        <Link to="/checkout" className="w-full sm:w-auto">
                          <button className="px-16 py-6 bg-white text-black font-black uppercase tracking-[0.4em] text-xs hover:bg-white/90 transition-all w-full rounded-full">
                            Upgrade Now
                          </button>
                        </Link>
                      );
                    })()}
                    <p className="text-[8px] text-white/20 font-black uppercase tracking-[0.4em] mt-4">SECURE PAYMENT SYSTEM // SKILLSCRUMPT.IN</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bento Stats Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-1">
            <div className="p-1 border border-white/10 bg-white/5 flex-1">
              <div className="bg-black border border-white/10 p-10 h-full relative overflow-hidden group">
                 <div className="relative z-10">
                   <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-6 italic">MAXIMUM SAVINGS</h4>
                   <p className="text-3xl font-black italic tracking-tighter leading-tight mb-8">SAVE UP TO 20% VS TRADITIONAL PLATFORMS.</p>
                   <div className="h-[1px] w-full bg-white/10">
                     <div className="bg-white h-full w-[80%] animate-pulse" />
                   </div>
                 </div>
              </div>
            </div>

            <div className="p-1 border border-white/10 bg-white/5 flex-1">
              <div className="bg-black border border-white/10 p-10 h-full">
                 <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-8 italic">BUILT_IN_TRUST</h4>
                 <div className="space-y-6">
                    <TrustItem icon={Shield} label="VERIFIED IDENTITY" />
                    <TrustItem icon={Award} label="CERTIFIED BADGES" />
                    <TrustItem icon={CheckCircle} label="INSTANT ACCESS" />
                 </div>
              </div>
            </div>

            <div className="p-1 border border-white/10 bg-white/5">
              <div className="bg-white/5 border border-white/10 p-8">
                 <p className="text-[11px] font-bold text-white/40 leading-relaxed uppercase tracking-widest italic text-center mb-6">
                   "SWITCHING TO THE FLAT-FEE MODEL SAVED ME $2.4K IN COMMISSIONS THIS CYCLE."
                 </p>
                 <div className="flex items-center justify-center gap-4">
                   <div className="w-8 h-8 border border-white/10 bg-white text-black flex items-center justify-center font-black italic">M</div>
                   <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Marcus</span>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Comparison Table */}
        <section className="p-1 border border-white/10 bg-white/5">
          <div className="bg-black border border-white/10 overflow-hidden">
            <div className="p-12 border-b border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
              <h3 className="text-3xl font-black tracking-tighter uppercase italic">FEATURE BREAKDOWN.</h3>
              <div className="flex gap-10">
                 <div className="flex items-center gap-3">
                   <div className="w-2 h-2 bg-white" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-white/40">PROFESSIONAL</span>
                 </div>
                 <div className="flex items-center gap-3">
                   <div className="w-2 h-2 border border-white/40" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-white/40">CLIENT</span>
                 </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <tbody className="divide-y divide-white/10">
                  <ComparisonRow label="ADAPTIVE SKILL TESTS" student={true} client={false} />
                  <ComparisonRow label="VERIFIED MEMBER PROFILE" student={true} client={false} />
                  <ComparisonRow label="DIRECT PROJECT BIDS" student={true} client={false} />
                  <ComparisonRow label="POST UNLIMITED JOBS" student={false} client={true} />
                  <ComparisonRow label="ACCESS CERTIFIED DATA" student={false} client={true} />
                  <ComparisonRow label="DIRECT SECURE PAYMENTS" student={true} client={true} />
                  <ComparisonRow label="ZERO PLATFORM FEES" student="0%" client="0%" />
                  <ComparisonRow label="SECURE COLLABORATION" student={true} client={true} />
                  <ComparisonRow label="PROTECTED PAYOUTS" student={true} client={true} />
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <div className="mt-32 flex justify-center items-center gap-10 text-[9px] font-black uppercase tracking-[0.4em] text-white/10">
           <div className="flex items-center gap-2"><Lock size={12}/> SECURE DATA</div>
           <div className="flex items-center gap-2"><Cpu size={12}/> VERIFIED</div>
           <div className="flex items-center gap-2"><Zap size={12}/> SkillScrumpt.in</div>
        </div>
      </div>
    </div>
  );
}

function PricingFeature({ label }) {
  return (
    <div className="flex items-center gap-6 group">
      <div className="w-6 h-6 border border-white text-white flex items-center justify-center flex-shrink-0 group-hover:bg-white group-hover:text-black transition-all">
        <Check size={14} strokeWidth={4} />
      </div>
      <span className="text-[11px] font-black uppercase tracking-widest text-white/60 group-hover:text-white transition-colors">{label}</span>
    </div>
  );
}

function TrustItem({ icon: Icon, label }) {
  return (
    <div className="flex items-center gap-6">
      <Icon size={20} className="text-white/40" />
      <span className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em]">{label}</span>
    </div>
  );
}

function ComparisonRow({ label, student, client }) {
  const renderValue = (val) => {
    if (val === true) return <div className="w-8 h-8 bg-white flex items-center justify-center mx-auto"><CheckCircle className="text-black" size={18} /></div>;
    if (val === false) return <div className="w-2 h-2 border border-white/10 mx-auto" />;
    return <span className="text-white font-black italic text-xs uppercase tracking-widest">{val}</span>;
  };

  return (
    <tr className="hover:bg-white/5 transition-colors group">
      <td className="px-6 md:px-12 py-6 md:py-8 text-[9px] md:text-[11px] font-black text-white/40 group-hover:text-white uppercase tracking-[0.3em] transition-colors italic">{label}</td>
      <td className="px-6 md:px-12 py-6 md:py-8 text-center w-32 md:w-48">{renderValue(student)}</td>
      <td className="px-6 md:px-12 py-6 md:py-8 text-center w-32 md:w-48">{renderValue(client)}</td>
    </tr>
  );
}

function ValueCard({ icon: Icon, title, desc }) {
  return (
    <div className="group">
      <div className="w-20 h-20 border border-white/10 text-white/40 flex items-center justify-center mb-10 group-hover:bg-white group-hover:text-black group-hover:border-white transition-all italic">
        <Icon size={32} />
      </div>
      <h3 className="text-2xl font-black mb-6 italic uppercase tracking-tight group-hover:text-white transition-colors">{title}</h3>
      <p className="text-[11px] font-bold text-white/30 uppercase tracking-widest leading-relaxed group-hover:text-white/50 transition-colors">{desc}</p>
    </div>
  );
}

export function ProctoringPage() {
  React.useEffect(() => {
    document.title = "AI Proctoring System | SkillScrumpt Security";
  }, []);

  return (
    <div className="pt-24 pb-20 bg-black text-white selection:bg-white selection:text-black min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <header className="mb-32">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-[1px] bg-white" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Secure Testing</span>
          </div>
          <motion.h1 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-7xl lg:text-[10rem] font-black mb-12 leading-[0.8] tracking-tighter uppercase italic"
          >
            RADICAL <br />
            <span className="text-white/30">INTEGRITY.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-xl text-white/40 font-bold uppercase tracking-widest max-w-3xl leading-relaxed"
          >
            OUR AI-DRIVEN PROCTORING ENGINE ENSURES THAT EVERY BADGE EARNED ON SKILLSCRUMPT.IN IS A TESTAMENT TO GENUINE EXPERTISE.
          </motion.p>
        </header>

        <div className="grid lg:grid-cols-2 gap-20 items-center mb-40">
          <div className="space-y-12">
            <div className="grid gap-1 border border-white/10 p-1 bg-white/5">
              <ProctoringFeature 
                icon={Monitor} 
                title="Visual Surveillance" 
                desc="Continuous biometric validation via live camera feed ensures the candidate's presence throughout the assessment." 
              />
              <ProctoringFeature 
                icon={Lock} 
                title="Environment Lock" 
                desc="Strict browser restrictions and tab-switch detection prevent external assistance and unauthorized resource access." 
              />
              <ProctoringFeature 
                icon={Cpu} 
                title="AI Behavior Audit" 
                desc="Machine learning models analyze behavior patterns to flag suspicious activities in real-time." 
              />
            </div>
            
            <Link to="/register?role=professional">
              <button className="px-12 py-6 bg-white text-black font-black uppercase tracking-[0.4em] text-xs hover:bg-white/90 transition-all flex items-center gap-4">
                GET VERIFIED <ArrowRight size={16} />
              </button>
            </Link>
          </div>
          
          <div className="relative">
            <div className="aspect-square border border-white/10 bg-white/5 flex items-center justify-center relative overflow-hidden group radius-design">
               <Shield size={200} className="text-white relative z-10 opacity-20 group-hover:scale-110 transition-transform duration-1000" />
               <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60" />
               <div className="absolute bottom-10 left-10 text-[10px] font-black uppercase tracking-[0.5em] text-white/20 italic z-20">
                 SYSTEM ACTIVE // SKILLSCRUMPT
               </div>
            </div>
          </div>
        </div>

        <section className="py-40 border-t border-white/10">
           <h2 className="text-3xl font-black mb-16 tracking-tighter uppercase italic">SYSTEM RELIABILITY</h2>
           <div className="grid md:grid-cols-3 gap-12">
              <TrustStat label="ACCURACY" value="99.9%" />
              <TrustStat label="LATENCY" value="<200MS" />
              <TrustStat label="SESSIONS" value="850K+" />
           </div>
        </section>
      </div>
    </div>
  );
}

export function MarketplacePage() {
  const navigate = useNavigate();
  React.useEffect(() => {
    document.title = "Verified Talent Marketplace | SkillScrumpt.in";
  }, []);

  const content = (
    <div className="pt-24 pb-20 bg-black text-white selection:bg-white selection:text-black min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <header className="mb-32">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-[1px] bg-white" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Access Elite Talent</span>
          </div>
          <motion.h1 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-7xl lg:text-[10rem] font-black mb-12 leading-[0.8] tracking-tighter uppercase italic"
          >
            THE <br />
            <span className="text-white/30">MARKETPLACE.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-xl text-white/40 font-bold uppercase tracking-widest max-w-3xl leading-relaxed"
          >
            ELIMINATE THE MIDDLEMAN. CONNECT DIRECTLY WITH VERIFIED PROFESSIONALS WHO HAVE PASSED OUR RIGOROUS AI PROCTORING PROTOCOLS.
          </motion.p>
        </header>

        <div className="grid md:grid-cols-3 gap-8 mb-40">
           <CategoryCard 
             title="ENGINEERING" 
             desc="Experts in React, Node.js, and Cloud Infrastructure."
             img="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2000&auto=format&fit=crop"
           />
           <CategoryCard 
             title="AI & DATA" 
             desc="Verified practitioners building production-grade models."
             img="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop"
           />
           <CategoryCard 
             title="DESIGN" 
             desc="UI/UX architects specializing in high-fidelity motion."
             img="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop"
           />
        </div>

        <section className="p-1 border border-white/10 bg-white/5 mb-40 radius-design">
          <div className="bg-black border border-white/10 p-12 md:p-20 text-center radius-design">
             <h2 className="text-4xl md:text-6xl font-black mb-10 tracking-tighter uppercase italic">READY TO DEPLOY?</h2>
             <p className="text-white/40 font-black text-[11px] uppercase tracking-[0.4em] mb-12 italic">JOIN 1200+ BUSINESSES USING SkillScrumpt.in</p>
             <div className="flex flex-col sm:flex-row justify-center gap-8">
               <button onClick={() => navigate('/register?role=client')} className="px-16 py-6 bg-white text-black font-black uppercase tracking-[0.4em] text-xs hover:bg-white/90 transition-all rounded-full">POST JOB</button>
               <button onClick={() => navigate('/register?role=professional')} className="px-16 py-6 border border-white text-white font-black uppercase tracking-[0.4em] text-xs hover:bg-white/10 transition-all rounded-full">BECOME A PARTNER</button>
             </div>
          </div>
        </section>
      </div>
    </div>
  );

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  if (user) {
    return <DashboardLayout user={user}>{content}</DashboardLayout>;
  }

  return content;
}

function ProctoringFeature({ icon: Icon, title, desc }) {
  return (
    <div className="bg-black border border-white/10 p-10 flex gap-8 group hover:bg-white/5 transition-all">
      <div className="w-12 h-12 border border-white/10 text-white/20 flex items-center justify-center flex-shrink-0 group-hover:text-white transition-colors italic">
        <Icon size={24} />
      </div>
      <div>
        <h4 className="text-xl font-black uppercase italic mb-3">{title}</h4>
        <p className="text-[11px] font-bold text-white/30 uppercase tracking-widest leading-relaxed group-hover:text-white/50 transition-colors">{desc}</p>
      </div>
    </div>
  );
}

function TrustStat({ label, value }) {
  return (
    <div className="p-10 border border-white/10 bg-white/5">
       <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] mb-4">{label}</p>
       <p className="text-5xl font-black italic tracking-tighter">{value}</p>
    </div>
  );
}

function CategoryCard({ title, desc, img }) {
  return (
    <div className="group relative aspect-[3/4] overflow-hidden radius-design border border-white/10">
       <img src={img} className="absolute inset-0 w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 hover:scale-110" alt={title} />
       <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80" />
       <div className="absolute bottom-10 left-10 right-10">
          <h3 className="text-3xl font-black italic mb-4 uppercase tracking-tight">{title}</h3>
          <p className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-relaxed">{desc}</p>
       </div>
    </div>
  );
}

