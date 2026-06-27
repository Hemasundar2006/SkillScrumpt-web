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
    <div className="pt-20 bg-[#FFF0E5] text-[#1E293B] selection:bg-[#38BDF8] selection:text-white min-h-screen font-sans overflow-x-hidden">
      {/* Hero */}
      <section className="py-24 lg:py-32 relative overflow-hidden border-b border-[#38BDF8]/10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-[2px] bg-[#38BDF8]" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#38BDF8]">Our Mission</span>
            </div>
            <motion.h1 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight tracking-tight text-[#1E293B]"
            >
              ELIMINATE <br />
              <span className="text-[#1E293B]/40">GUESSWORK.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-base md:text-lg text-[#1E293B]/70 max-w-2xl leading-relaxed font-medium"
            >
              SkillScrumpt.in was founded in 2026 with a simple mission: to create a world where talent is recognized by what they can do, not where they come from or what's on their resume.
            </motion.p>
          </motion.div>
        </div>
        
        {/* Abstract Background */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 opacity-[0.03] pointer-events-none text-[#F97316]">
          <Star className="w-[800px] h-[800px] animate-spin-slow" />
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-3 gap-8">
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
      <section className="py-24 border-t border-[#38BDF8]/10 bg-white" id="team">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-tr from-[#38BDF8]/10 to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <div className="relative overflow-hidden rounded-[24px] border border-[#38BDF8]/10 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] aspect-[4/5]">
                <img 
                  src="/founder.jpeg" 
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100" 
                  alt="Hemasundar Maroti" 
                  onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = '<div class="w-full h-full bg-[#E0F2FE] flex items-center justify-center text-[#38BDF8]"><span class="text-xs font-bold uppercase tracking-wider">Founder Profile</span></div>'
                  }}
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#F97316] text-white flex flex-col items-center justify-center rounded-[24px] shadow-[0_12px_30px_rgba(249,115,22,0.3)] p-4 text-center z-10 border-4 border-white">
                <p className="text-[10px] font-bold uppercase tracking-wider mb-1 text-white/80">Established</p>
                <p className="text-xl font-black tracking-tight">2026</p>
              </div>
            </div>

            <div className="lg:pl-8">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#38BDF8] mb-4">The Architect</div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6 leading-tight text-[#1E293B]">
                Hemasundar <br />Maroti.
              </h2>
              <div className="flex flex-wrap items-center gap-3 mb-8">
                <span className="px-4 py-1.5 bg-[#E0F2FE] text-[#38BDF8] rounded-[8px] text-[10px] font-bold uppercase tracking-wider border border-[#38BDF8]/20 shadow-sm">Founder</span>
                <span className="px-4 py-1.5 bg-[#1E293B] text-white rounded-[8px] text-[10px] font-bold uppercase tracking-wider shadow-sm">Lead Developer</span>
              </div>
              <p className="text-sm md:text-base text-[#1E293B]/70 font-medium leading-relaxed mb-10 max-w-xl">
                The visionary behind SkillScrumpt's un-cheatable AI architecture. Hemasundar is dedicated to building an ecosystem where merit is the only currency and talent is verified through absolute transparency.
              </p>
              <div className="flex gap-6">
                <a href="#" className="w-10 h-10 rounded-[10px] bg-white border border-[#38BDF8]/10 text-[#38BDF8] hover:bg-[#38BDF8] hover:text-white flex items-center justify-center transition-colors shadow-sm"><Linkedin size={18} /></a>
                <a href="#" className="w-10 h-10 rounded-[10px] bg-white border border-[#38BDF8]/10 text-[#38BDF8] hover:bg-[#38BDF8] hover:text-white flex items-center justify-center transition-colors shadow-sm"><Twitter size={18} /></a>
                <a href="#" className="w-10 h-10 rounded-[10px] bg-white border border-[#38BDF8]/10 text-[#38BDF8] hover:bg-[#38BDF8] hover:text-white flex items-center justify-center transition-colors shadow-sm"><Mail size={18} /></a>
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
    <div className="pt-24 pb-20 bg-[#FFF0E5] text-[#1E293B] selection:bg-[#38BDF8] selection:text-white min-h-screen font-sans overflow-x-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header Section */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-block px-4 py-1.5 border border-[#38BDF8]/20 bg-white text-[10px] font-bold uppercase tracking-wider text-[#38BDF8] mb-8 rounded-[6px] shadow-sm">PRICING PLANS</div>
            <motion.h2 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight tracking-tight text-[#1E293B]"
            >
              FLAT FEE. <br />
              <span className="text-[#1E293B]/30">ZERO BROKERAGE.</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-sm md:text-base text-[#1E293B]/70 font-medium max-w-2xl mx-auto leading-relaxed"
            >
              CHOOSE YOUR PATH AND START YOUR JOURNEY WITH A SINGLE SUBSCRIPTION. NO COMMISSION, NO HIDDEN FEES, JUST PURE GROWTH.
            </motion.p>
          </motion.div>
        </div>

        {/* Role Toggle */}
        <div className="flex justify-center mb-16">
          <div className="p-1.5 border border-[#38BDF8]/10 bg-white shadow-sm flex rounded-[12px]">
            <button 
              onClick={() => setRole('student')}
              className={`px-8 py-3 text-[10px] font-bold uppercase tracking-wider transition-all rounded-[8px] ${role === 'student' ? 'bg-[#38BDF8] text-white shadow-sm' : 'text-[#1E293B]/50 hover:text-[#1E293B] hover:bg-[#E0F2FE]/50'}`}
            >
              PROFESSIONAL
            </button>
            <button 
              onClick={() => setRole('client')}
              className={`px-8 py-3 text-[10px] font-bold uppercase tracking-wider transition-all rounded-[8px] ${role === 'client' ? 'bg-[#38BDF8] text-white shadow-sm' : 'text-[#1E293B]/50 hover:text-[#1E293B] hover:bg-[#E0F2FE]/50'}`}
            >
              CLIENT
            </button>
          </div>
        </div>

        {/* Dynamic Pricing Layout */}
        <div className="grid lg:grid-cols-12 gap-8 mb-24">
          {/* Main Card */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={role}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white border border-[#38BDF8]/10 shadow-[0_20px_50px_rgba(0,0,0,0.04)] p-8 md:p-12 relative overflow-hidden h-full rounded-[32px]"
              >
                <div className="absolute top-0 right-0 w-64 h-64 border border-[#38BDF8]/5 -mr-32 -mt-32 rotate-45 pointer-events-none" />
                
                <div className="relative z-10">
                  <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-8">
                    <div>
                      <h3 className="text-2xl md:text-3xl font-black text-[#1E293B] mb-2 tracking-tight uppercase">
                        {role === 'student' ? 'STUDENT PRO.' : 'CLIENT PRO.'}
                      </h3>
                      <p className="text-[10px] font-bold text-[#38BDF8] uppercase tracking-wider">ALL CORE FEATURES INCLUDED</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl md:text-5xl font-black tracking-tight text-[#1E293B]">₹1</span>
                        <span className="text-[#1E293B]/40 font-bold uppercase tracking-wider text-[10px]">/cycle</span>
                      </div>
                      <p className="text-[10px] font-bold text-[#1E293B]/40 uppercase tracking-wider mt-1">Billed per Cycle</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-x-8 gap-y-6 mb-12 border-y border-[#38BDF8]/10 py-10">
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

                  <div className="flex flex-col sm:flex-row gap-6 items-center">
                    {(() => {
                      const userStr = localStorage.getItem('user');
                      const user = userStr ? JSON.parse(userStr) : null;
                      const isAlreadyPro = user?.isPro === true;

                      if (isAlreadyPro) {
                        return (
                          <button disabled className="px-8 py-4 border border-[#38BDF8]/20 text-[#38BDF8] text-[10px] font-bold uppercase tracking-wider w-full sm:w-auto rounded-[12px] bg-[#E0F2FE]/50">
                            PRO ACCOUNT ACTIVE
                          </button>
                        );
                      }

                      return (
                        <Link to="/checkout" className="w-full sm:w-auto">
                          <button className="px-10 py-4 bg-[#F97316] text-white font-bold uppercase tracking-wider text-[10px] hover:bg-[#EA580C] hover:-translate-y-0.5 shadow-[0_8px_20px_rgba(249,115,22,0.25)] transition-all w-full rounded-[12px]">
                            Upgrade Now
                          </button>
                        </Link>
                      );
                    })()}
                    <p className="text-[10px] text-[#1E293B]/40 font-bold uppercase tracking-wider text-center sm:text-left mt-2 sm:mt-0">SECURE PAYMENT SYSTEM // SKILLSCRUMPT.IN</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bento Stats Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="flex-1">
              <div className="bg-[#1E293B] border border-[#1E293B] rounded-[24px] shadow-lg p-8 h-full relative overflow-hidden group">
                <div className="relative z-10">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#38BDF8] mb-4">MAXIMUM SAVINGS</h4>
                  <p className="text-xl font-black tracking-tight leading-tight mb-6 text-white">SAVE UP TO 20% VS TRADITIONAL PLATFORMS.</p>
                  <div className="h-[2px] w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="bg-[#F97316] h-full w-[80%] animate-pulse" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1">
              <div className="bg-white border border-[#38BDF8]/10 rounded-[24px] shadow-sm text-[#1E293B] p-8 h-full">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1E293B]/40 mb-6">BUILT_IN_TRUST</h4>
                <div className="space-y-4">
                  <TrustItem icon={Shield} label="VERIFIED IDENTITY" />
                  <TrustItem icon={Award} label="CERTIFIED BADGES" />
                  <TrustItem icon={CheckCircle} label="INSTANT ACCESS" />
                </div>
              </div>
            </div>

            <div>
              <div className="bg-[#E0F2FE] border border-[#38BDF8]/20 rounded-[24px] p-6 shadow-sm">
                <p className="text-[10px] font-bold text-[#0284C7] leading-relaxed uppercase tracking-wider text-center mb-4">
                  "SWITCHING TO THE FLAT-FEE MODEL SAVED ME $2.4K IN COMMISSIONS THIS CYCLE."
                </p>
                <div className="flex items-center justify-center gap-3">
                  <div className="w-6 h-6 border border-[#38BDF8]/30 bg-[#38BDF8] text-white rounded-[6px] flex items-center justify-center text-[10px] font-bold shadow-sm">M</div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0284C7]">Marcus</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Comparison Table */}
        <section className="mb-16">
          <div className="bg-white border border-[#38BDF8]/10 rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.03)] text-[#1E293B] overflow-hidden">
            <div className="p-8 md:p-10 border-b border-[#38BDF8]/10 flex flex-col md:flex-row justify-between items-center gap-6">
              <h3 className="text-2xl font-black tracking-tight uppercase">FEATURE BREAKDOWN.</h3>
              <div className="flex gap-8">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#1E293B] rounded-[2px]" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#1E293B]/60">PROFESSIONAL</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 border-2 border-[#1E293B]/30 rounded-[2px]" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#1E293B]/60">CLIENT</span>
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <tbody className="divide-y divide-[#E0F2FE]">
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

        <div className="flex flex-wrap justify-center items-center gap-8 text-[10px] font-bold uppercase tracking-[0.3em] text-[#1E293B]/30 pt-8 border-t border-[#38BDF8]/10">
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
    <div className="flex items-center gap-4 group">
      <div className="w-5 h-5 border border-[#38BDF8]/30 text-[#38BDF8] flex items-center justify-center flex-shrink-0 group-hover:bg-[#F97316] group-hover:border-[#F97316] group-hover:text-white transition-all rounded-[6px] bg-[#E0F2FE]/50">
        <Check size={12} strokeWidth={4} />
      </div>
      <span className="text-[10px] font-bold uppercase tracking-wider text-[#1E293B]/70 group-hover:text-[#1E293B] transition-colors">{label}</span>
    </div>
  );
}

function TrustItem({ icon: Icon, label }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-8 h-8 rounded-[8px] bg-[#E0F2FE]/50 text-[#38BDF8] flex items-center justify-center">
        <Icon size={14} />
      </div>
      <span className="text-[10px] font-bold text-[#1E293B]/70 uppercase tracking-[0.1em]">{label}</span>
    </div>
  );
}

function ComparisonRow({ label, student, client }) {
  const renderValue = (val) => {
    if (val === true) return <div className="w-6 h-6 bg-[#38BDF8]/10 text-[#38BDF8] flex items-center justify-center mx-auto rounded-[6px]"><CheckCircle size={14} /></div>;
    if (val === false) return <div className="w-2 h-2 border-2 border-[#1E293B]/10 mx-auto rounded-[2px]" />;
    return <span className="text-[#1E293B] font-bold text-[10px] uppercase tracking-wider">{val}</span>;
  };

  return (
    <tr className="hover:bg-[#FFF0E5]/50 transition-colors group">
      <td className="px-6 md:px-10 py-5 text-[10px] font-bold text-[#1E293B]/50 group-hover:text-[#1E293B] uppercase tracking-[0.2em] transition-colors">{label}</td>
      <td className="px-6 md:px-10 py-5 text-center w-24 md:w-32">{renderValue(student)}</td>
      <td className="px-6 md:px-10 py-5 text-center w-24 md:w-32">{renderValue(client)}</td>
    </tr>
  );
}

function ValueCard({ icon: Icon, title, desc }) {
  return (
    <div className="group bg-white p-6 rounded-[24px] border border-[#38BDF8]/10 shadow-sm hover:shadow-[0_12px_30px_rgba(56,189,248,0.08)] transition-all hover:-translate-y-1">
      <div className="w-12 h-12 border border-[#38BDF8]/20 bg-[#E0F2FE]/50 text-[#38BDF8] flex items-center justify-center mb-6 group-hover:bg-[#F97316] group-hover:text-white group-hover:border-[#F97316] transition-all rounded-[12px]">
        <Icon size={20} />
      </div>
      <h3 className="text-lg font-black mb-3 uppercase tracking-tight group-hover:text-[#0284C7] transition-colors text-[#1E293B]">{title}</h3>
      <p className="text-[10px] font-bold text-[#1E293B]/60 uppercase tracking-wider leading-relaxed transition-colors">{desc}</p>
    </div>
  );
}

export function ProctoringPage() {
  React.useEffect(() => {
    document.title = "AI Proctoring System | SkillScrumpt Security";
  }, []);

  return (
    <div className="pt-24 pb-20 bg-[#FFF0E5] text-[#1E293B] selection:bg-[#38BDF8] selection:text-white min-h-screen font-sans overflow-x-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <header className="mb-24">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-[2px] bg-[#38BDF8]" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#38BDF8]">Secure Testing</span>
          </div>
          <motion.h1 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight tracking-tight text-[#1E293B]"
          >
            RADICAL <br />
            <span className="text-[#1E293B]/40">INTEGRITY.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-sm md:text-base text-[#1E293B]/70 font-medium max-w-2xl leading-relaxed"
          >
            OUR AI-DRIVEN PROCTORING ENGINE ENSURES THAT EVERY BADGE EARNED ON SKILLSCRUMPT.IN IS A TESTAMENT TO GENUINE EXPERTISE.
          </motion.p>
        </header>

        <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
          <div className="space-y-8">
            <div className="grid gap-3 border border-[#38BDF8]/10 p-2 bg-white rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.03)]">
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
            
            <Link to="/register?role=professional" className="inline-block">
              <button className="px-8 py-3.5 bg-[#1E293B] text-white font-bold uppercase tracking-wider text-[10px] hover:bg-[#0F172A] shadow-sm transition-all flex items-center gap-3 rounded-[12px] hover:-translate-y-0.5">
                GET VERIFIED <ArrowRight size={14} />
              </button>
            </Link>
          </div>
          
          <div className="relative flex justify-center mt-12 lg:mt-0">
            <div className="aspect-square w-full max-w-md border border-[#38BDF8]/20 bg-white shadow-[0_20px_50px_rgba(56,189,248,0.08)] flex items-center justify-center relative overflow-hidden group rounded-full">
              <Shield size={160} className="text-[#38BDF8] relative z-10 opacity-30 group-hover:scale-110 group-hover:opacity-60 transition-all duration-1000" />
              <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent opacity-80" />
              <div className="absolute bottom-12 text-center w-full text-[10px] font-bold uppercase tracking-[0.4em] text-[#38BDF8] z-20">
                SYSTEM ACTIVE // SKILLSCRUMPT
              </div>
            </div>
          </div>
        </div>

        <section className="py-24 border-t border-[#38BDF8]/10">
          <h2 className="text-2xl font-black mb-12 tracking-tight uppercase text-center md:text-left text-[#1E293B]">SYSTEM RELIABILITY</h2>
          <div className="grid md:grid-cols-3 gap-8">
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
    <div className="pt-24 pb-20 bg-[#FFF0E5] text-[#1E293B] selection:bg-[#38BDF8] selection:text-white min-h-screen font-sans overflow-x-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <header className="mb-24">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-[2px] bg-[#38BDF8]" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#38BDF8]">Access Elite Talent</span>
          </div>
          <motion.h1 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight tracking-tight text-[#1E293B]"
          >
            THE <br />
            <span className="text-[#1E293B]/40">MARKETPLACE.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-sm md:text-base text-[#1E293B]/70 font-medium max-w-2xl leading-relaxed"
          >
            ELIMINATE THE MIDDLEMAN. CONNECT DIRECTLY WITH VERIFIED PROFESSIONALS WHO HAVE PASSED OUR RIGOROUS AI PROCTORING PROTOCOLS.
          </motion.p>
        </header>

        <div className="grid md:grid-cols-3 gap-6 mb-32">
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

        <section className="mb-24">
          <div className="bg-[#1E293B] border border-[#1E293B] text-white shadow-[0_24px_60px_rgba(30,41,59,0.15)] p-10 md:p-16 text-center rounded-[32px] relative overflow-hidden">
            <div className="absolute inset-0 bg-[#38BDF8] blur-[120px] opacity-[0.05]" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-black mb-6 tracking-tight text-white">READY TO DEPLOY?</h2>
              <p className="text-[#38BDF8] font-bold text-[10px] uppercase tracking-wider mb-10">JOIN 1200+ BUSINESSES USING SkillScrumpt.in</p>
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <button onClick={() => navigate('/register?role=client')} className="px-10 py-4 bg-[#38BDF8] text-white shadow-[0_4px_12px_rgba(56,189,248,0.2)] font-bold uppercase tracking-wider text-[10px] hover:bg-[#0284C7] hover:-translate-y-0.5 transition-all rounded-[12px]">POST JOB</button>
                <button onClick={() => navigate('/register?role=professional')} className="px-10 py-4 border border-white/20 text-white font-bold uppercase tracking-wider text-[10px] hover:bg-white/5 transition-all rounded-[12px]">BECOME A PARTNER</button>
              </div>
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
    <div className="bg-white hover:bg-[#E0F2FE]/30 rounded-[16px] p-6 flex gap-6 group transition-colors border border-transparent hover:border-[#38BDF8]/10">
      <div className="w-10 h-10 border border-[#38BDF8]/20 text-[#38BDF8] flex items-center justify-center flex-shrink-0 group-hover:text-white group-hover:bg-[#38BDF8] group-hover:border-[#38BDF8] transition-colors rounded-[10px]">
        <Icon size={18} />
      </div>
      <div>
        <h4 className="text-base font-black uppercase mb-2 text-[#1E293B] tracking-tight">{title}</h4>
        <p className="text-[10px] font-bold text-[#1E293B]/50 uppercase tracking-wider leading-relaxed group-hover:text-[#1E293B]/70 transition-colors">{desc}</p>
      </div>
    </div>
  );
}

function TrustStat({ label, value }) {
  return (
    <div className="p-8 border border-[#38BDF8]/10 bg-white rounded-[24px] shadow-[0_8px_24px_rgba(0,0,0,0.02)] text-center md:text-left">
      <p className="text-[10px] font-bold text-[#38BDF8] uppercase tracking-[0.2em] mb-3">{label}</p>
      <p className="text-4xl font-black tracking-tight text-[#1E293B]">{value}</p>
    </div>
  );
}

function CategoryCard({ title, desc, img }) {
  return (
    <div className="group relative aspect-[3/4] overflow-hidden rounded-[24px] border border-white/10 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
      <img src={img} className="absolute inset-0 w-full h-full object-cover grayscale opacity-80 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" alt={title} />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1E293B] via-[#1E293B]/40 to-transparent" />
      <div className="absolute bottom-8 left-8 right-8">
        <h3 className="text-2xl font-black mb-2 uppercase tracking-tight text-white">{title}</h3>
        <p className="text-[10px] font-bold text-white/70 uppercase tracking-wider leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
