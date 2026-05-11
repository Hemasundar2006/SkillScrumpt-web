import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, Star, Plus, Shield, ShieldCheck, Zap, Monitor, Lock, Target, ExternalLink, Mail, Instagram, Linkedin, Twitter, Menu, X, ChevronRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Asterisk = ({ className }) => (
  <svg viewBox="0 0 100 100" className={`asterisk-spin ${className}`} fill="currentColor">
    <path d="M50 0L54.3 35.7L85.4 14.6L64.3 45.7L100 50L64.3 54.3L85.4 85.4L54.3 64.3L50 100L45.7 64.3L14.6 85.4L35.7 54.3L0 50L35.7 45.7L14.6 14.6L45.7 35.7L50 0Z" />
  </svg>
);

const SectionReveal = ({ children, className, id }) => (
  <motion.div
    id={id}
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

const Marquee = ({ children, reverse = false, speed = 30 }) => (
  <div className="overflow-hidden whitespace-nowrap py-10 border-y border-white/10">
    <div 
      className={reverse ? "marquee-content-reverse" : "marquee-content"}
      style={{ animationDuration: `${speed}s` }}
    >
      {children}
      {children}
    </div>
  </div>
);

const Loader = ({ onFinish }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onFinish, 500);
          return 100;
        }
        return prev + 1;
      });
    }, 15);
    return () => clearInterval(timer);
  }, [onFinish]);

  return (
    <motion.div 
      exit={{ opacity: 0, y: -100 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="loader-container"
    >
      <div className="loader-counter">{count}%</div>
    </motion.div>
  );
};

export function LandingPage() {
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) return <Loader onFinish={() => setLoading(false)} />;

  return (
    <div className="bg-black text-white selection:bg-white selection:text-black">
      {/* NAVIGATION */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'nav-blur py-4 border-b border-white/10' : 'py-8'}`}>
        <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="text-2xl font-black tracking-tighter uppercase italic">SkillScrumpt.in</Link>
          
          <div className="hidden md:flex items-center gap-10 text-[11px] font-bold uppercase tracking-[0.2em]">
            <Link to="/about" className="hover:text-muted transition-colors">About</Link>
            <Link to="/proctoring" className="hover:text-muted transition-colors">Proctoring</Link>
            <Link to="/marketplace" className="hover:text-muted transition-colors">Marketplace</Link>
            <Link to="/pricing" className="hover:text-muted transition-colors">Pricing</Link>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/login" className="hidden sm:block text-[11px] font-bold uppercase tracking-widest hover:text-muted transition-colors">Login</Link>
            <Link to="/register" className="px-6 py-2 border border-white text-white hover:bg-white hover:text-black transition-all duration-300 text-[11px] font-bold uppercase tracking-widest">
              Join Now
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 w-full grid lg:grid-cols-2 items-center gap-20">
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-[10px] font-black uppercase tracking-[0.4em] text-muted mb-6"
            >
              The New Standard of Trust
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-[12vw] lg:text-[8rem] font-black leading-[0.85] tracking-tighter mb-10"
            >
              VERIFY <br />TALENT.
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 1 }}
              className="text-xl text-muted max-w-md mb-12 leading-relaxed"
            >
              A decentralized talent ecosystem powered by <span className="text-white font-bold italic">Live AI Proctoring</span>. Stop guessing and start hiring verified expertise.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row items-center gap-6"
            >
              <Link to="/register?role=professional" className="w-full sm:w-auto">
                <button className="w-full px-10 py-5 bg-white text-black font-black uppercase tracking-widest text-xs hover:bg-muted transition-all rounded-full">
                  Get Verified
                </button>
              </Link>
              <Link to="/register?role=client" className="w-full sm:w-auto">
                <button className="w-full px-10 py-5 border border-white text-white font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all flex items-center justify-center gap-2 rounded-full">
                  Hire Elite Talent <ArrowRight size={16} />
                </button>
              </Link>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-16 flex items-center gap-12"
            >
               <div>
                 <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-2">Volume</p>
                 <p className="text-2xl font-black">₹12.4Cr+</p>
               </div>
               <div className="w-px h-10 bg-white/10" />
               <div>
                 <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-2">Integrity</p>
                 <p className="text-2xl font-black">99.9%</p>
               </div>
            </motion.div>
          </div>

          <div className="relative flex justify-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-[600px] radius-design p-4 bg-white/5 border border-white/10"
            >
              <img 
                src="/hero_mineral_3d_1778513348174.png" 
                alt="SkillScrumpt.in Core" 
                className="w-full drop-shadow-[0_0_100px_rgba(255,255,255,0.1)] rounded-[20px]"
              />
              <Asterisk className="absolute -top-6 -right-6 w-24 h-24 text-white/20" />
            </motion.div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
          <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted">Discover</div>
          <div className="w-px h-20 bg-gradient-to-b from-white/20 to-transparent" />
        </div>
      </section>

      {/* STUDIO/INTRO SECTION */}
      <SectionReveal className="py-40 border-t border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 grid md:grid-cols-[200px_1fr] gap-20">
          <div className="text-[11px] font-black uppercase tracking-[0.3em] text-muted">Our Vision</div>
          <div className="border-l border-white/20 pl-10 md:pl-20">
            <h2 className="text-4xl md:text-7xl font-bold leading-[1.1] tracking-tight mb-12">
              We've built an ecosystem where <br /> 
              trust is the primary currency.
            </h2>
            <Link to="/about" className="inline-flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.4em] text-white/40 hover:text-white transition-colors group">
              Exploration Directive <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </div>
      </SectionReveal>

      {/* STATS MARQUEE */}
      <section className="py-20">
        <Marquee speed={20}>
          {[
            "150k+ VERIFIED TALENT", "850k+ ASSESSMENTS", "98.5% SUCCESS RATE", 
            "120+ COUNTRIES", "₹12.4Cr+ VOLUME", "ZERO BROKERAGE"
          ].map((stat, i) => (
            <div key={i} className="mx-20 flex items-center gap-10 text-5xl font-black italic text-outline hover:text-white transition-all cursor-default">
              <span>{stat}</span>
              <span className="text-white/20">✳</span>
            </div>
          ))}
        </Marquee>
      </section>

      {/* PROCTORING SECTION */}
      <SectionReveal className="py-40" id="proctoring">
        <div className="max-w-[1400px] mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <div className="text-[11px] font-black uppercase tracking-[0.3em] text-muted mb-10">AI Proctoring</div>
            <motion.h2 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-6xl md:text-8xl font-black tracking-tighter mb-20 leading-[0.9]"
            >
              The Standard <br />of Integrity.
            </motion.h2>
            
            <div className="grid gap-0 border-t border-white/10">
              {[
                { title: "Live Webcam Monitoring", desc: "Real-time visual verification during every assessment.", icon: Shield },
                { title: "Tab-Switch Detection", desc: "Strict anti-cheat environment to ensure original work.", icon: Monitor },
                { title: "Skill-Matched Feed", desc: "Verified talent only sees projects matching their badge level.", icon: Target }
              ].map((service, i) => (
                <div key={i} className="py-10 border-b border-white/10 flex items-center justify-between group hover:pl-4 transition-all">
                  <div className="flex gap-6 items-center">
                    <service.icon className="text-white/30 group-hover:text-white transition-colors" size={24} />
                    <div>
                      <h4 className="text-2xl font-bold mb-2">{service.title}</h4>
                      <p className="text-muted text-sm">{service.desc}</p>
                    </div>
                  </div>
                  <Plus className="text-white/30 group-hover:text-white transition-colors" />
                </div>
              ))}
            </div>

            <Link to="/proctoring">
              <button className="mt-20 flex items-center gap-4 text-sm font-black uppercase tracking-widest group">
                Full Security Protocol <ArrowRight className="group-hover:translate-x-2 transition-transform" />
              </button>
            </Link>
          </div>

          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="radius-design p-4 bg-white/5 border border-white/10"
            >
              <img 
                src="/proctoring_system_3d_1778513881929.png" 
                alt="AI Proctoring System" 
                className="w-full drop-shadow-[0_0_80px_rgba(255,255,255,0.05)] rounded-[20px]"
              />
            </motion.div>
          </div>
        </div>
      </SectionReveal>

      {/* CASE STUDIES / MARKETPLACE */}
      <section className="py-40 bg-white text-black" id="work">
        <div className="max-w-[1400px] mx-auto px-6 mb-20 flex justify-between items-end">
          <div>
            <div className="text-[11px] font-black uppercase tracking-[0.3em] text-black/50 mb-4">Marketplace</div>
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-6xl md:text-8xl font-black tracking-tighter"
            >
              Elite Talent.
            </motion.h2>
          </div>
          <Link to="/marketplace" className="hidden md:block mb-4 text-xs font-black uppercase tracking-widest border-b border-black">
            Enter Marketplace Hub →
          </Link>
        </div>

        <div className="border-t border-black/10">
          {[
            { client: "Fullstack Engineering", desc: "Verified experts in React, Node, and Cloud architecture.", img: "/talent_marketplace_3d_1778513912255.png" },
            { client: "AI & Data Science", desc: "Proctored talent capable of building production-grade models.", img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop" },
            { client: "UI/UX Architecture", desc: "Designers who understand depth, motion, and conversion.", img: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2000&auto=format&fit=crop" }
          ].map((project, i) => (
            <SectionReveal key={i} className={`flex flex-col lg:flex-row border-b border-black/10 ${i % 2 === 0 ? '' : 'lg:flex-row-reverse'}`}>
              <div className="flex-1 p-10 md:p-20 flex flex-col justify-center">
                <h3 className="text-4xl md:text-6xl font-black mb-6">{project.client}</h3>
                <p className="text-xl text-black/60 mb-10 max-w-md">{project.desc}</p>
                <Link to="/register" className="flex items-center gap-4 font-black uppercase tracking-widest text-[11px]">
                  Hire Now <ChevronRight size={16} />
                </Link>
              </div>
              <div className="flex-1 overflow-hidden h-[400px] lg:h-auto m-6 radius-design border border-white/10">
                <img 
                  src={project.img} 
                  alt={project.client} 
                  className="w-full h-full object-cover grayscale hover:grayscale-0 hover:scale-105 transition-all duration-1000"
                />
              </div>
            </SectionReveal>
          ))}
        </div>
      </section>

      {/* APPROACH SECTION (BENTO) */}
      <section className="py-40">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="text-[11px] font-black uppercase tracking-[0.3em] text-muted mb-4">The Advantage</div>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-20 leading-[0.9]">
            Where integrity <br />meets velocity.
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: "48h Cooling Period", desc: "Forced improvement periods between test attempts." },
              { title: "Verified Elite Badge", desc: "Earned only after scoring 70%+ on proctored tests.", large: true, img: "/verified_badge_3d_1778513897472.png" },
              { title: "College Verification", desc: "Mandatory .edu or college-domain email validation." },
              { title: "Post-Payment Chat", desc: "Secure interaction unlocked after milestone funding." },
              { title: "Zero Brokerage", desc: "Keep 100% of your earnings. No hidden service fees." },
              { title: "Resume Builder", desc: "Free premium access to ATS-friendly resume templates.", img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop" }
            ].map((card, i) => (
              <div key={i} className={`p-10 border border-white/10 relative overflow-hidden group hover:border-white/40 transition-colors radius-design ${card.large ? 'lg:col-span-2' : ''}`}>
                {card.img && <img src={card.img} className={`absolute inset-0 w-full h-full object-cover ${card.large ? 'opacity-40 group-hover:opacity-60' : 'opacity-20 group-hover:opacity-40'} transition-opacity`} alt="" />}
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <h4 className="text-2xl font-bold mb-4 italic uppercase">{card.title}</h4>
                  <p className="text-muted text-sm leading-relaxed uppercase tracking-widest font-black text-[10px]">{card.desc}</p>
                </div>
                <Asterisk className="absolute -bottom-4 -right-4 w-12 h-12 text-white/5 group-hover:text-white/20 transition-all" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-40 border-t border-white/10">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <div className="text-[11px] font-black uppercase tracking-[0.3em] text-muted mb-4">How it works</div>
              <h2 className="text-5xl font-black mb-10 leading-tight">Your journey to <br />Verified Elite.</h2>
              
              <div className="space-y-16">
                {[
                  { step: "01", title: "Verify Identity", desc: "Sign up using your college email or professional ID for immediate validation." },
                  { step: "02", title: "Take Assessment", desc: "Perform a live-proctored skill test to prove your technical expertise." },
                  { step: "03", title: "Earn Badge", desc: "Score 70%+ to unlock your 'Verified Elite' badge and appear in top search results." },
                  { step: "04", title: "Get Hired", desc: "Apply to premium projects with 100% earnings and direct client access." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-10">
                    <div className="text-3xl font-black text-muted/30">{item.step}</div>
                    <div>
                      <h4 className="text-2xl font-bold mb-4 flex items-center gap-4">
                        <Star size={16} className="text-white" /> {item.title}
                      </h4>
                      <p className="text-muted leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link to="/register">
                <button className="mt-16 px-10 py-5 bg-white text-black font-black uppercase tracking-widest text-xs hover:bg-muted transition-all">
                  Start Verification
                </button>
              </Link>
            </div>
            
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
                className="relative p-1 border border-white/10 bg-white/5"
              >
                <img 
                  src="/system_workflow_3d_1778514263388.png" 
                  alt="SkillScrumpt Workflow" 
                  className="w-full grayscale hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
              </motion.div>
              
              {/* Decorative text overlay */}
              <div className="absolute -bottom-10 -right-10 text-[120px] font-black text-white/5 tracking-tighter italic select-none">
                PROCESS
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-40">
        <div className="max-w-[1400px] mx-auto px-6 text-center mb-20">
          <div className="text-[11px] font-black uppercase tracking-[0.3em] text-muted mb-4">Testimonials</div>
          <h2 className="text-4xl md:text-6xl font-black">Trusted by Professionals.</h2>
        </div>

        <div className="flex gap-6 overflow-x-auto px-6 pb-20 no-scrollbar">
          {[
            { name: "Sarah Jenkins", role: "Fullstack Developer", text: "SkillScrumpt.in helped me land a high-paying freelance gig at a top tech company. The verification process is tough, but it really sets you apart." },
            { name: "Michael Chen", role: "Startup Founder", text: "As a client, I love the peace of mind knowing that the talent I hire is actually as good as they say they are. The proctored test results don't lie." },
            { name: "David Miller", role: "UI/UX Designer", text: "The zero brokerage model is a game-changer. I get to keep 100% of what I earn, which is a huge motivator." },
            { name: "Aria Gupta", role: "Backend Architect", text: "Finally a platform that values actual skills over bidding wars. The proctoring system ensures only the best rise to the top." }
          ].map((item, i) => (
            <div key={i} className="min-w-[400px] p-10 border border-white/10 flex flex-col justify-between hover:border-white/40 transition-colors bg-white/5">
              <p className="text-lg italic text-muted mb-10 leading-relaxed">
                "{item.text}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center font-bold text-xl">
                  {item.name[0]}
                </div>
                <div>
                  <div className="font-bold text-sm">{item.name}</div>
                  <div className="text-[10px] text-muted uppercase tracking-widest">{item.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING SECTION */}
      <section className="py-40 bg-white text-black">
        <div className="max-w-[1400px] mx-auto px-6 text-center mb-20">
          <div className="text-[11px] font-black uppercase tracking-[0.3em] text-black/50 mb-4">Pricing Model</div>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-10">Access for ₹1.</h2>
          <Link to="/pricing" className="inline-flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.4em] text-black/40 hover:text-black transition-colors group">
            View Full Tiers <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>

        <div className="max-w-[1200px] mx-auto px-6 grid md:grid-cols-2 gap-10">
          {[
            { 
              name: "Student Pro", 
              price: "1", 
              originalPrice: "69",
              tag: "FOR TALENT",
              spots: "198 Spots Left!",
              features: [
                "Verified Elite Status",
                "AI Proctoring Priority",
                "Apply to Premium Projects",
                "Zero Service Fees"
              ]
            },
            { 
              name: "Client Pro", 
              price: "1", 
              originalPrice: "49",
              tag: "FOR HIRERS",
              spots: "198 Spots Left!",
              features: [
                "Elite Verified Talent",
                "Priority Project Promotion",
                "Direct Chat Access",
                "Dedicated Support"
              ]
            }
          ].map((tier, i) => (
            <div key={i} className="p-12 border border-black/10 flex flex-col justify-between hover:border-black transition-all group relative overflow-hidden">
              <div className="absolute top-6 right-6 text-[10px] font-black bg-black text-white px-3 py-1 uppercase tracking-widest animate-pulse">
                {tier.spots}
              </div>
              
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-black/40 mb-6">{tier.tag}</div>
                <h3 className="text-4xl font-black mb-4">{tier.name}</h3>
                
                <div className="flex items-end gap-4 mb-10">
                  <div className="text-6xl font-black italic">₹{tier.price}</div>
                  <div className="text-2xl font-bold text-black/30 line-through mb-1">₹{tier.originalPrice}</div>
                </div>

                <ul className="space-y-4 mb-10">
                  {tier.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm font-bold text-black/60">
                      <CheckCircle size={16} className="text-black" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
              <Link to="/register?upgrade=true" className="w-full">
                <button className="w-full py-5 bg-black text-white font-black uppercase tracking-widest text-[10px] group-hover:scale-105 transition-transform">
                  Get {tier.name}
                </button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-60 text-center relative overflow-hidden">
        <Asterisk className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] text-white/5 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <h2 className="text-6xl md:text-9xl font-black tracking-tighter mb-10 leading-[0.8]">READY TO <br />JOIN THE <br />ELITE?</h2>
          <Link to="/register">
            <button className="px-16 py-8 bg-white text-black font-black uppercase tracking-[0.3em] text-sm hover:scale-105 transition-transform flex items-center gap-4 mx-auto group">
              Start Verification <ArrowRight className="group-hover:translate-x-2 transition-transform" />
            </button>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-20 border-t border-white/10">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid md:grid-cols-[1fr_2fr_1fr] gap-20 mb-20">
            <div>
              <div className="text-2xl font-black tracking-tighter uppercase italic mb-6">SkillScrumpt.in</div>
              <p className="text-muted text-sm leading-relaxed max-w-xs">
                The world's first AI-proctored skill verification and freelance marketplace. Bridging the gap between verified talent and global opportunities.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-10">
              <div className="space-y-4 flex flex-col">
                <div className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2">Platform</div>
                <Link to="/projects" className="text-sm font-bold hover:text-white transition-colors">Browse Jobs</Link>
                <Link to="/talent" className="text-sm font-bold hover:text-white transition-colors">Find Talent</Link>
                <Link to="/assessments" className="text-sm font-bold hover:text-white transition-colors">Assessments</Link>
              </div>
              <div className="space-y-4 flex flex-col">
                <div className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2">Legal</div>
                <Link to="/terms" className="text-sm font-bold hover:text-white transition-colors">Terms</Link>
                <Link to="/privacy" className="text-sm font-bold hover:text-white transition-colors">Privacy</Link>
                <Link to="/help" className="text-sm font-bold hover:text-white transition-colors">Support</Link>
              </div>
            </div>

            <div className="space-y-6">
              <div className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2">Social</div>
              <div className="flex gap-6">
                <Twitter size={20} className="text-muted hover:text-white transition-colors" />
                <Instagram size={20} className="text-muted hover:text-white transition-colors" />
                <Linkedin size={20} className="text-muted hover:text-white transition-colors" />
              </div>
              <div className="text-sm font-bold border-b border-white/10 pb-2 inline-block">hello@skillscrumpt.in</div>
            </div>
          </div>

          <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-muted">
            <div>© 2026 SkillScrumpt.in All Rights Reserved.</div>
            <div>Made with ❤️ for verified talent.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

