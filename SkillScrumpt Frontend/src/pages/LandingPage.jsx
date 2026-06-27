import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Star, Shield, Target, Menu, CheckCircle, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const SectionReveal = ({ children, className, id }) => (
  <motion.div
    id={id}
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
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

  const loaderContent = (
    <motion.div 
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -100 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] bg-[#FFF0E5] flex items-center justify-center font-sans"
    >
      <div className="text-[#F97316] text-6xl font-black tracking-tighter">{count}%</div>
    </motion.div>
  );

  return createPortal(loaderContent, document.body);
};

export function LandingPage() {
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [stats, setStats] = useState({
    students: "10K+",
    assessments: "50K+",
    clients: "2K+",
    hired: "8K+"
  });
  
  const [feedbacks, setFeedbacks] = useState([
    { user: { firstName: "Sarah", lastName: "Jenkins", role: "professional" }, text: "SkillScrumpt helped me land a high-paying freelance gig at a top tech company. The verification process is tough, but it really sets you apart.", createdAt: "2024-07-31" },
    { user: { firstName: "Michael", lastName: "Chen", role: "client" }, text: "As a client, I love the peace of mind knowing that the talent I hire is actually as good as they say they are. The proctored test results don't lie.", createdAt: "2024-08-15" },
    { user: { firstName: "David", lastName: "Miller", role: "professional" }, text: "The zero brokerage model is a game-changer. I get to keep 100% of what I earn, which is a huge motivator.", createdAt: "2024-09-02" },
  ]);

  useEffect(() => {
    document.title = "SkillScrumpt.in | Master Your Next Skill";
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    
    // Simulate fetching real stats from backend
    api.get('/users/stats').then(res => {
      if(res.data && !res.data.message) setStats(res.data);
    }).catch(err => console.error(err));

    api.get('/users/feedbacks').then(res => {
      if(res.data && Array.isArray(res.data) && res.data.length > 0) {
        setFeedbacks(res.data.slice(0, 3));
      }
    }).catch(err => console.error(err));

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) return <Loader onFinish={() => setLoading(false)} />;

  return (
    <div className="bg-[#FFF0E5] text-[#1E293B] min-h-screen font-sans selection:bg-[#38BDF8] selection:text-white overflow-x-hidden">
      
      {/* NAVIGATION */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#FFF0E5]/80 backdrop-blur-xl border-b border-[#38BDF8]/10 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.02)]' : 'py-6'}`}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex items-center justify-between">
          <Link to="/" className="text-xl lg:text-2xl font-bold tracking-tight text-[#1E293B] hover:opacity-80 transition-opacity">
            Skill<span className="text-[#F97316]">Scrumpt</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8 text-[13px] font-bold text-[#1E293B] uppercase tracking-wider">
            <Link to="/about" className="hover:text-[#38BDF8] transition-colors">About</Link>
            <Link to="/proctoring" className="hover:text-[#38BDF8] transition-colors">Proctoring</Link>
            <Link to="/marketplace" className="hover:text-[#38BDF8] transition-colors">Marketplace</Link>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/login" className="hidden sm:block text-[13px] font-bold text-[#1E293B] hover:text-[#38BDF8] transition-colors uppercase tracking-wider">Log In</Link>
            <Link to="/register">
              <button className="px-6 py-2.5 bg-[#F97316] text-white text-[13px] font-bold uppercase tracking-wider rounded-[8px] hover:bg-[#EA580C] hover:shadow-[0_4px_12px_rgba(249,115,22,0.25)] transition-all">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center pt-24 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 w-full grid lg:grid-cols-2 items-center gap-12 relative z-10">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[6px] bg-white border border-[#38BDF8]/20 mb-6 shadow-sm"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-pulse" />
              <span className="text-[10px] font-bold text-[#38BDF8] uppercase tracking-wider">The Future of Work</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight mb-6 text-[#1E293B]"
            >
              Master Your Next Skill with <span className="text-[#F97316]">SkillScrumpt</span>.
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-base md:text-lg text-[#1E293B]/70 max-w-xl mb-8 leading-relaxed font-medium"
            >
              A high-energy, AI-proctored freelancing platform that verifies expertise and matches top talent with premium global clients.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center gap-4"
            >
              <Link to="/register" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-8 py-3.5 bg-[#1E293B] text-white text-[13px] font-bold uppercase tracking-wider rounded-[12px] hover:bg-[#0F172A] hover:shadow-[0_8px_20px_rgba(30,41,59,0.2)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3">
                  Start Learning Now <ArrowRight size={16} />
                </button>
              </Link>
            </motion.div>
          </div>

          <div className="relative flex justify-center lg:justify-end mt-12 lg:mt-0">
            <div className="absolute inset-0 bg-[#38BDF8] blur-[80px] opacity-10 rounded-full scale-125 animate-pulse"></div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, rotate: 2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-[500px] z-10"
            >
              <img 
                src="/hero_mineral_3d_1778513348174.png" 
                alt="SkillScrumpt 3D UI" 
                className="w-full rounded-[24px] shadow-[0_24px_60px_rgba(56,189,248,0.12)] bg-white border border-[#38BDF8]/10 object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = '<div class="w-full aspect-square bg-gradient-to-br from-[#38BDF8]/20 to-[#F97316]/20 rounded-[24px] border border-[#38BDF8]/20 flex items-center justify-center"><span class="text-[#38BDF8] font-bold uppercase tracking-wider text-sm">Dashboard Preview</span></div>'
                }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* STATS BANNER */}
      <section className="bg-[#1E293B] text-white py-12 w-full">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/10">
            {[
              { val: stats.students, label: "Active Students" },
              { val: stats.assessments, label: "Proctored Tests" },
              { val: stats.hired, label: "Successful Hires" },
              { val: "100%", label: "Zero Brokerage" }
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center justify-center">
                <div className="text-3xl md:text-4xl font-black mb-1 text-white">{s.val}</div>
                <div className="text-[10px] font-bold text-[#38BDF8] uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <SectionReveal className="py-24 bg-[#FFF0E5]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-[#1E293B] mb-4">
              Why Professionals Choose Us
            </h2>
            <p className="text-sm md:text-base text-[#1E293B]/70 font-medium">
              We provide a transparent, secure, and rewarding ecosystem designed specifically to accelerate your career growth.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Live AI Monitoring", desc: "Real-time visual verification during every assessment to ensure pure merit.", icon: Shield },
              { title: "Zero Brokerage", desc: "Keep 100% of your earnings. No hidden service fees or commission cuts.", icon: Star },
              { title: "Skill-Matched Feed", desc: "Verified talent only sees projects matching their exact badge level.", icon: Target }
            ].map((card, i) => (
              <div key={i} className="bg-white rounded-[24px] p-8 shadow-[0_4px_20px_rgba(30,41,59,0.02)] hover:shadow-[0_12px_30px_rgba(56,189,248,0.08)] transition-all duration-300 hover:-translate-y-1 border border-[#38BDF8]/10 group">
                <div className="w-12 h-12 rounded-[12px] bg-[#E0F2FE] flex items-center justify-center mb-6 group-hover:bg-[#38BDF8] transition-colors">
                  <card.icon size={20} className="text-[#F97316] group-hover:text-white transition-colors" />
                </div>
                <h4 className="text-xl font-bold mb-3 text-[#1E293B]">{card.title}</h4>
                <p className="text-[13px] text-[#1E293B]/60 leading-relaxed font-medium">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </SectionReveal>

      {/* HOW IT WORKS / TRUST PROTOCOL */}
      <SectionReveal className="py-24 bg-white border-y border-[#38BDF8]/10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-block px-3 py-1 rounded-[6px] bg-[#F97316]/10 text-[#F97316] font-bold text-[10px] uppercase tracking-wider mb-6 border border-[#F97316]/20">
              The Process
            </div>
            <h2 className="text-3xl md:text-4xl font-black mb-8 leading-tight text-[#1E293B] tracking-tight">
              Your Path to <br />Verified Expertise.
            </h2>
            
            <div className="space-y-8">
              {[
                { step: "1", title: "Verify Identity", desc: "Sign up using your college email for instant validation." },
                { step: "2", title: "Take Assessment", desc: "Perform a live-proctored skill test to prove your knowledge." },
                { step: "3", title: "Get Hired", desc: "Apply to premium projects with 100% earnings and direct access." }
              ].map((item, i) => (
                <div key={i} className="flex gap-6 group">
                  <div className="w-12 h-12 rounded-[12px] bg-[#FFF0E5] text-[#F97316] flex items-center justify-center text-lg font-bold shrink-0 group-hover:bg-[#F97316] group-hover:text-white transition-colors shadow-sm border border-[#F97316]/10">
                    {item.step}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-1 text-[#1E293B]">{item.title}</h4>
                    <p className="text-[13px] text-[#1E293B]/60 leading-relaxed font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link to="/register" className="inline-block mt-10">
              <button className="px-8 py-3 bg-[#38BDF8] text-white text-[13px] font-bold uppercase tracking-wider rounded-[12px] hover:bg-[#0284C7] transition-all shadow-[0_4px_12px_rgba(56,189,248,0.25)]">
                Join the Network
              </button>
            </Link>
          </div>
          
          <div className="relative flex justify-end mt-12 lg:mt-0">
            <div className="absolute inset-0 bg-[#F97316] blur-[100px] opacity-10 rounded-full"></div>
            <img 
              src="/proctoring_system_3d_1778513881929.png" 
              alt="System Workflow" 
              className="relative z-10 w-full max-w-md rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.08)] bg-white border border-[#38BDF8]/10"
              onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = '<div class="w-full aspect-square bg-[#E0F2FE] rounded-[24px] border border-[#38BDF8]/20 flex items-center justify-center"><span class="text-[#38BDF8] font-bold uppercase tracking-wider text-sm">System Workflow Preview</span></div>'
              }}
            />
          </div>
        </div>
      </SectionReveal>

      {/* TESTIMONIALS */}
      <section className="py-24 bg-[#FFF0E5]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-[#1E293B] tracking-tight">Loved by Professionals.</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {feedbacks.map((item, i) => (
              <div key={i} className="bg-white rounded-[24px] p-8 shadow-[0_4px_20px_rgba(30,41,59,0.02)] border border-[#38BDF8]/10 hover:border-[#38BDF8]/30 transition-colors flex flex-col justify-between h-full">
                <div className="mb-6 flex gap-1">
                  {[1,2,3,4,5].map(s => <Star key={s} size={16} className="fill-[#F97316] text-[#F97316]" />)}
                </div>
                <p className="text-[13px] text-[#1E293B]/70 font-medium mb-8 leading-relaxed">
                  "{item.text}"
                </p>
                <div className="flex items-center gap-4 border-t border-[#38BDF8]/10 pt-6 mt-auto">
                  <div className="w-10 h-10 rounded-[10px] bg-[#E0F2FE] flex items-center justify-center font-bold text-sm text-[#38BDF8]">
                    {item.user?.firstName?.[0] || "U"}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-[#1E293B]">{item.user?.firstName} {item.user?.lastName}</div>
                    <div className="text-[10px] font-bold text-[#F97316] uppercase tracking-wider mt-0.5">
                      {item.user?.role === 'professional' ? 'Talent' : 'Client'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#1E293B] text-white pt-20 pb-10 border-t-4 border-[#F97316]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-12 gap-12 mb-16">
            
            <div className="lg:col-span-5">
              <Link to="/" className="text-2xl font-bold tracking-tight mb-6 block text-white">
                Skill<span className="text-[#F97316]">Scrumpt</span>
              </Link>
              <p className="text-white/50 text-[13px] leading-relaxed max-w-sm mb-8 font-medium">
                The world's premier tech learning and AI-proctored freelancing platform. We bridge the gap between verified talent and global opportunities.
              </p>
              
              <div className="flex items-center gap-3 text-white/50 font-medium text-[13px] mb-3">
                <MapPin size={16} className="text-[#38BDF8]" /> Innovation Hub, Bangalore, India
              </div>
              <div className="flex items-center gap-3 text-white/50 font-medium text-[13px]">
                <Mail size={16} className="text-[#38BDF8]" /> hello@skillscrumpt.in
              </div>
            </div>
            
            <div className="lg:col-span-2 space-y-5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#38BDF8] mb-4">Platform</div>
              <div className="flex flex-col gap-3 font-semibold text-[13px]">
                <Link to="/marketplace" className="text-white/70 hover:text-[#F97316] transition-colors">Marketplace</Link>
                <Link to="/proctoring" className="text-white/70 hover:text-[#F97316] transition-colors">Proctoring</Link>
                <Link to="/pricing" className="text-white/70 hover:text-[#F97316] transition-colors">Pricing</Link>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#38BDF8] mb-4">Company</div>
              <div className="flex flex-col gap-3 font-semibold text-[13px]">
                <Link to="/about" className="text-white/70 hover:text-[#F97316] transition-colors">About Us</Link>
                <Link to="/terms" className="text-white/70 hover:text-[#F97316] transition-colors">Terms of Service</Link>
                <Link to="/privacy" className="text-white/70 hover:text-[#F97316] transition-colors">Privacy Policy</Link>
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#38BDF8] mb-4">Stay Updated</div>
              <div className="flex flex-col gap-3">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-[12px] focus:outline-none focus:border-[#38BDF8] focus:bg-white/10 transition-colors text-white placeholder-white/30 text-[13px]"
                />
                <button className="w-full py-3 bg-[#F97316] hover:bg-[#EA580C] text-white font-bold rounded-[12px] transition-colors shadow-sm text-[13px] uppercase tracking-wider">
                  Subscribe Now
                </button>
              </div>
            </div>

          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-white/30 text-[12px] font-bold uppercase tracking-wider">
              © 2026 SkillScrumpt.in. All Rights Reserved.
            </div>
            <div className="flex gap-6 text-[12px] font-bold text-white/50 uppercase tracking-wider">
              <span className="hover:text-white cursor-pointer transition-colors">Twitter</span>
              <span className="hover:text-white cursor-pointer transition-colors">LinkedIn</span>
              <span className="hover:text-white cursor-pointer transition-colors">Instagram</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
