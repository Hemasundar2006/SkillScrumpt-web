import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Shield, CheckCircle, BadgeCheck, Globe, Zap, Users, ArrowRight, Play, Star, Monitor, Clock, Mail, Lock, Target, GraduationCap } from 'lucide-react';
import { Button, Card, Badge, GlassContainer } from '../components/UI';
import { Link } from 'react-router-dom';
import { ParticleBackground } from '../components/ParticleBackground';
import RazorpayPayment from '../components/RazorpayPayment';

const UpgradeModal = ({ onClose, pricing }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-secondary/80 backdrop-blur-md"
  >
    <motion.div 
      initial={{ scale: 0.9, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.9, y: 20 }}
      className="max-w-md w-full bg-white rounded-[2rem] p-10 shadow-2xl relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-blue-400" />
      
      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 mx-auto">
        <Zap size={32} />
      </div>
      
      <div className="text-center mb-8">
        <h3 className="text-2xl font-black text-secondary mb-2">Upgrade to Pro</h3>
        {pricing.isPromoActive ? (
          <div className="inline-block px-4 py-1 bg-green-100 text-green-700 text-[10px] font-black uppercase tracking-widest rounded-full mb-4 animate-pulse">
            Early Bird Offer: ₹1 for first 200 users! ({pricing.remainingPromoSpots} spots left)
          </div>
        ) : null}
        <p className="text-gray-500 font-medium text-sm text-secondary">
          Join the elite 1% of talent. Get verified, get noticed, and get paid.
        </p>
      </div>
      
      <div className="space-y-3 mb-8">
        {[
          'Priority Assessment Access',
          'Exclusive Pro Badge',
          'Zero Commission Projects',
          'Premium Support'
        ].map((feature, i) => (
          <div key={i} className="flex items-center gap-3 text-sm font-bold text-gray-700">
            <CheckCircle size={16} className="text-green-500" />
            {feature}
          </div>
        ))}
      </div>
      
      <div className="flex flex-col gap-3">
        <RazorpayPayment 
          amount={pricing.currentPrice} 
          buttonText={`Pay ₹${pricing.currentPrice} & Upgrade`}
          className="w-full h-14 shadow-xl shadow-primary/20 flex items-center justify-center font-bold"
          onSuccess={(data) => {
            alert('Payment Successful! Please log in to see your Pro status.');
            onClose();
          }}
          onError={(error) => {
            alert('Payment Failed: ' + error);
          }}
        />
        <button 
          onClick={onClose}
          className="w-full h-12 text-gray-400 font-bold hover:text-secondary transition-colors"
        >
          Maybe Later
        </button>
      </div>
    </motion.div>
  </motion.div>
);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

const StatItem = ({ label, value }) => (
  <div className="text-center">
    <div className="text-3xl font-black text-secondary mb-1">{value}</div>
    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</div>
  </div>
);

export function LandingPage() {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [pricing, setPricing] = useState({ currentPrice: 49, isPromoActive: false, remainingPromoSpots: 0 });

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const { data } = await api.get('/payments/pricing-info');
        if (data.success) setPricing(data);
      } catch (err) {
        console.error('Error fetching pricing:', err);
      }
    };
    
    fetchPricing();
    const interval = setInterval(fetchPricing, 30000); // Poll every 30s for real-time slot updates
    
    return () => clearInterval(interval);
  }, []);

  const { scrollYProgress } = useScroll();
  const rotateX = useTransform(scrollYProgress, [0, 0.2], [0, 5]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.8]);
  const uspRotateX = useTransform(scrollYProgress, [0.1, 0.3], [5, 0]);
  const uspScale = useTransform(scrollYProgress, [0.1, 0.3], [0.9, 1]);

  return (
    <div className="pt-20 overflow-x-hidden bg-white perspective-1000 relative">
      {/* Hero Section */}
      <motion.section 
        style={{ rotateX, scale, opacity, transformStyle: 'preserve-3d' }}
        className="relative py-20 lg:py-32 px-4 overflow-hidden min-h-[90vh] flex items-center bg-transparent"
      >
        <ParticleBackground />
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="primary" className="mb-6 px-6 py-2 uppercase tracking-[0.3em] font-black text-[10px] bg-primary/10 text-primary border-none rounded-full shadow-lg shadow-primary/5">
              Next-Gen Verification
            </Badge>
          </motion.div>
          
          <h1 className="text-6xl lg:text-8xl font-black tracking-tighter text-secondary mb-8 leading-[0.9]">
            Verify Talent. <br />
            <span className="text-primary bg-clip-text">Eliminate Risk.</span>
          </h1>
          
          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
            The world's first decentralized talent marketplace powered by live AI proctoring. Stop guessing and start hiring verified expertise.
          </p>
 
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link to="/register?role=professional">
              <Button className="h-16 px-12 text-xl shadow-2xl shadow-primary/30 group hover:scale-105 transition-transform">
                Join as Student
              </Button>
            </Link>
            <Link to="/assessments">
              <Button variant="secondary" className="h-16 px-12 text-xl group hover:bg-gray-800 transition-all border-2">
                Explore Assessments
              </Button>
            </Link>
            <Link to="/register?role=client">
              <Button variant="outline" className="h-16 px-12 text-xl group hover:bg-gray-50 transition-all border-2">
                Hire Talent <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
              </Button>
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-20 max-w-4xl mx-auto perspective-1000"
          >
            <Card className="p-10 border-none bg-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] rounded-[2rem] transform hover:rotateX-2 hover:rotateY-2 transition-transform duration-500">
               <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
                  <StatItem label="Verified Talent" value="150k+" />
                  <StatItem label="Avg. Test Score" value="84%" />
                  <StatItem label="Fraud Prevention" value="100%" />
                  <StatItem label="Payout Ratio" value="1:1" />
               </div>
            </Card>
          </motion.div>
        </div>
      </motion.section>


      {/* Feature Section */}
      <motion.section 
        style={{ rotateX: uspRotateX, scale: uspScale, transformStyle: 'preserve-3d' }}
        className="py-24 bg-secondary text-white relative"
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
            >
              <Badge variant="primary" className="mb-6 bg-primary/20 text-blue-300 border-none">
                How it works
              </Badge>
              <h2 className="text-4xl lg:text-5xl font-bold mb-8 leading-tight">
                AI Proctoring: The New Standard for <span className="text-primary">Trust</span>
              </h2>
              <div className="space-y-6">
                {[
                  { title: 'Dynamic Skill Testing', desc: 'Real-time coding and problem-solving challenges that adapt to the user\'s level.', icon: Zap },
                  { title: 'Secure Proctored Environment', desc: 'Advanced AI monitoring ensures the integrity of every assessment.', icon: Shield },
                  { title: 'Verified Badge System', desc: 'Successful assessments earn unique digital credentials verifiable on the blockchain.', icon: CheckCircle }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 group">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/20 rounded-custom flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      <item.icon size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">{item.title}</h4>
                      <p className="text-gray-400 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square bg-primary/10 rounded-[3rem] border border-primary/20 flex items-center justify-center overflow-hidden">
                <Monitor size={200} className="text-primary opacity-20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-64 h-64 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Free Career Tools Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-gradient-to-r from-secondary to-gray-800 rounded-[2.5rem] p-8 lg:p-16 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -mr-48 -mt-48" />
            
            <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
              <div>
                <Badge variant="primary" className="mb-6 bg-primary/20 text-primary border-none font-black text-[10px] py-2 px-6 rounded-full uppercase tracking-widest">
                  Student Exclusive
                </Badge>
                <h2 className="text-4xl lg:text-5xl font-black mb-6 leading-tight">
                  Free Resume Builder <br />
                  <span className="text-primary">Powered by Resusolve.</span>
                </h2>
                <p className="text-lg text-gray-400 mb-10 leading-relaxed max-w-xl font-medium">
                  We've partnered with <strong>Resusolve</strong> to give our students free access to premium, ATS-friendly resume templates. Build a profile that gets you noticed by the top 1% of employers.
                </p>
                <div className="flex flex-wrap gap-4">
                  <a 
                    href="https://resusolve.vercel.app" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Button className="h-14 px-10 text-lg shadow-xl shadow-primary/20">
                      Build My Resume Now
                    </Button>
                  </a>
                  <div className="flex -space-x-3 items-center">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-secondary bg-gray-700 overflow-hidden" />
                    ))}
                    <span className="ml-6 text-xs font-bold text-gray-400 uppercase tracking-widest">+5,000 resumes built today</span>
                  </div>
                </div>
              </div>
              
              <div className="relative group">
                <div className="rounded-2xl border border-white/10 overflow-hidden shadow-2xl rotate-2 group-hover:rotate-0 transition-transform duration-700">
                  <img 
                    src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=1200" 
                    alt="Resume Builder Preview" 
                    className="w-full grayscale hover:grayscale-0 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary via-transparent to-transparent opacity-60" />
                </div>
                {/* Float Badge */}
                <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-2xl text-secondary animate-bounce">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Status</p>
                      <p className="text-sm font-bold">100% Free Access</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { label: 'Verified Talent', value: '150k+' },
              { label: 'Assessments Passed', value: '850k+' },
              { label: 'Success Rate', value: '98.5%' },
              { label: 'Countries', value: '120+' }
            ].map((stat, i) => (
              <motion.div key={i} variants={itemVariants} className="text-center">
                <div className="text-4xl lg:text-5xl font-black text-secondary mb-2">{stat.value}</div>
                <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why SkillScrumpt - Core USPs */}
      <section className="py-32 bg-[#0a0e1a] text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <Badge variant="primary" className="mb-6 bg-primary/20 text-blue-300 border-none uppercase tracking-widest font-black text-[10px] py-2 px-6 rounded-full">
              The Standard of Integrity
            </Badge>
            <h2 className="text-5xl lg:text-6xl font-black mb-6 tracking-tight">
              Why SkillScrumpt?
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              We've built a ecosystem focused on trust, transparency, and top-tier talent.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <USPCard icon={Shield} title="AI Proctoring" desc="Desktop-only assessments with webcam feed and tab-switch detection for 100% integrity." badge="Security" />
            <USPCard icon={Clock} title="48h Cooling Period" desc="Forced improvement periods between test attempts to prevent brute-force retrying." badge="Quality" />
            <USPCard icon={Mail} title="College Verification" desc="Mandatory .edu or college-domain email verification for all student accounts." badge="Authenticity" />
            <USPCard icon={BadgeCheck} title="Verified Badges" desc="Earned only after scoring 70%+ on proctored tests. Displayed everywhere." badge="Reputation" />
            <USPCard icon={Lock} title="Post-Payment Chat" desc="Chat unlocks only after payment, preventing off-platform hiring and protecting the model." badge="Business" />
            <USPCard icon={Target} title="Skill-Matched Feed" desc="Students see projects matching their verified skills, improving bid quality and results." badge="Efficiency" />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-[#f8f9fb]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-secondary mb-4">What Our Users Say</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Join thousands of students and clients who have found success on SkillScrumpt.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard text="SkillScrumpt helped me land a high-paying freelance gig at a top tech company. The verification process is tough, but it really sets you apart." author="Sarah Jenkins" role="Fullstack Developer" />
            <TestimonialCard text="As a client, I love the peace of mind knowing that the talent I hire is actually as good as they say they are. The proctored test results don't lie." author="Michael Chen" role="Startup Founder" />
            <TestimonialCard text="The zero brokerage model is a game-changer. I get to keep 100% of what I earn, which is a huge motivator." author="David Miller" role="UI/UX Designer" />
          </div>
        </div>
      </section>

      {/* Pricing/Upgrade Section */}
      <section className="py-24 bg-white relative">
        <AnimatePresence>
          {showUpgradeModal && <UpgradeModal onClose={() => setShowUpgradeModal(false)} pricing={pricing} />}
        </AnimatePresence>

        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="primary" className="mb-4 bg-primary/10 text-primary border-none">Limited Time Offer</Badge>
            <h2 className="text-4xl lg:text-5xl font-black text-secondary mb-4 tracking-tight">Become a Pro Member</h2>
            <p className="text-gray-500 max-w-2xl mx-auto font-medium">Join the next generation of verified talent and unlock high-paying global opportunities.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
             {/* Student Pro Card */}
             <Card className="p-8 border-2 border-primary/20 bg-white shadow-2xl rounded-[3rem] relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl -mr-24 -mt-24 group-hover:scale-150 transition-transform duration-1000" />
                <div className="relative z-10">
                   <div className="flex items-center gap-3 mb-6">
                     <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center"><Zap size={24} /></div>
                     <h3 className="text-2xl font-black text-secondary">Student Pro</h3>
                   </div>
                   <ul className="space-y-4 mb-8">
                     {['Verified Elite Status', 'AI Proctoring Priority', 'Apply to Premium Projects', 'Zero Service Fees'].map((feature, i) => (
                       <li key={i} className="flex items-center gap-3 text-sm font-bold text-gray-600">
                         <CheckCircle size={18} className="text-green-500" /> {feature}
                       </li>
                     ))}
                   </ul>
                   <div className="bg-gray-50 p-6 rounded-[2rem] text-center border border-gray-100">
                      <div className="flex items-baseline justify-center gap-2 mb-2">
                        <span className="text-4xl font-black text-secondary">₹{pricing.professionalPrice || pricing.currentPrice}</span>
                        {pricing.isPromoActive && <span className="text-lg text-gray-400 line-through font-bold">₹69</span>}
                      </div>
                      {pricing.isPromoActive && <p className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-4">{pricing.remainingPromoSpots} Spots Left!</p>}
                      <Link to={`/register?role=professional&upgrade=true`} className="block">
                        <Button className="w-full h-12 text-sm shadow-xl shadow-primary/20 font-black">Get Student Pro</Button>
                      </Link>
                   </div>
                </div>
             </Card>

             {/* Client Pro Card */}
             <Card className="p-8 border-2 border-secondary/20 bg-white shadow-2xl rounded-[3rem] relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-48 h-48 bg-secondary/5 rounded-full blur-3xl -mr-24 -mt-24 group-hover:scale-150 transition-transform duration-1000" />
                <div className="relative z-10">
                   <div className="flex items-center gap-3 mb-6">
                     <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center"><Shield size={24} /></div>
                     <h3 className="text-2xl font-black text-secondary">Client Pro</h3>
                   </div>
                   <ul className="space-y-4 mb-8">
                     {['Elite Verified Talent', 'Priority Project Promotion', 'Direct Chat Access', 'Dedicated Support'].map((feature, i) => (
                       <li key={i} className="flex items-center gap-3 text-sm font-bold text-gray-600">
                         <CheckCircle size={18} className="text-blue-500" /> {feature}
                       </li>
                     ))}
                   </ul>
                   <div className="bg-gray-50 p-6 rounded-[2rem] text-center border border-gray-100">
                      <div className="flex items-baseline justify-center gap-2 mb-2">
                        <span className="text-4xl font-black text-secondary">₹{pricing.clientPrice || pricing.currentPrice}</span>
                        {pricing.isPromoActive && <span className="text-lg text-gray-400 line-through font-bold">₹49</span>}
                      </div>
                      {pricing.isPromoActive && <p className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-4">{pricing.remainingPromoSpots} Spots Left!</p>}
                      <Link to={`/register?role=client&upgrade=true`} className="block">
                        <Button variant="secondary" className="w-full h-12 text-sm shadow-xl shadow-secondary/20 font-black">Get Client Pro</Button>
                      </Link>
                   </div>
                </div>
             </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

function TestimonialCard({ text, author, role }) {
  return (
    <Card className="p-8 border-none shadow-xl bg-white hover:-translate-y-2 transition-all">
       <div className="flex gap-1 text-yellow-400 mb-6">
         {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill="currentColor" />)}
       </div>
       <p className="text-gray-600 mb-8 italic leading-relaxed">"{text}"</p>
       <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
            {author[0]}
          </div>
          <div>
             <h4 className="font-bold text-secondary">{author}</h4>
             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{role}</p>
          </div>
       </div>
    </Card>
  );
}

function USPCard({ icon: Icon, title, desc, badge }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <Card className="p-8 bg-white/5 border-white/10 hover:border-primary/50 transition-all duration-500 h-full group relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000" />
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div className="w-14 h-14 bg-primary/20 text-primary rounded-custom flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-lg shadow-primary/10">
              <Icon size={28} />
            </div>
            <Badge variant="neutral" className="bg-white/5 text-[10px] text-gray-400 border-none uppercase tracking-widest font-black">{badge}</Badge>
          </div>
          <h4 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors">{title}</h4>
          <p className="text-gray-400 text-sm leading-relaxed font-medium">
            {desc}
          </p>
        </div>
      </Card>
    </motion.div>
  );
}
