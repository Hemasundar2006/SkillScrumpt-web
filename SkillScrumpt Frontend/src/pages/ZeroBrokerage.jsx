import React from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  TrendingUp, 
  ShieldCheck, 
  Users, 
  ArrowRight, 
  Zap, 
  PieChart, 
  CheckCircle,
  HelpCircle,
  Star,
  Shield
} from 'lucide-react';
import { Card, Badge, Button } from '../components/UI';
import { Link } from 'react-router-dom';

export function ZeroBrokeragePage() {
  return (
    <div className="pt-20 bg-black text-white selection:bg-white selection:text-black">
      {/* Hero Section */}
      <section className="relative py-32 lg:py-48 overflow-hidden border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-4 mb-8">
               <div className="w-12 h-[1px] bg-white" />
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">The Economic Protocol</span>
            </div>
            <h1 className="text-6xl lg:text-[8rem] font-black mb-12 leading-[0.85] tracking-tighter">
              ZERO <br />
              <span className="text-white/30 italic">BROKERAGE.</span>
            </h1>
            <p className="text-xl text-white/40 max-w-2xl leading-relaxed font-bold uppercase tracking-widest">
              We've dismantled the traditional commission-based model. On SkillScrumpt.in, 100% of the project budget goes exactly where it belongs: to the professional who did the work.
            </p>
          </motion.div>
        </div>
        
        {/* Abstract Background */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 opacity-5 pointer-events-none">
           <Star className="w-[600px] h-[600px] animate-spin-slow" />
        </div>
      </section>

      {/* Comparison Grid */}
      <section className="py-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-end mb-32">
            <div>
              <h2 className="text-5xl font-black tracking-tighter uppercase italic mb-8">Protocol <br />Differentiation.</h2>
              <p className="text-white/30 font-black text-xs uppercase tracking-widest">No middleman cuts. No hidden fees. Pure value exchange.</p>
            </div>
            <div className="h-[1px] bg-white/10 w-full" />
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            <ComparisonCard 
              title="TRADITIONAL MODEL" 
              type="negative"
              items={[
                "20% commission on every milestone",
                "Delayed payouts (14-30 days)",
                "Hidden service fees for clients",
                "Opaque bidding systems",
                "Revenue-driven algorithms"
              ]}
            />
            <ComparisonCard 
              title="SKILLSCRUMPT.IN MODEL" 
              type="positive"
              items={[
                "0% brokerage fee on projects",
                "Instant AI-verified payouts",
                "Fixed subscription for employers",
                "Skill-verified meritocracy",
                "Transparency-driven algorithms"
              ]}
            />
          </div>
        </div>
      </section>

      {/* The Math Section */}
      <section className="py-40 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-6">
           <div className="border border-white/10 bg-white/5 p-1">
              <div className="bg-black border border-white/10 overflow-hidden grid lg:grid-cols-2">
                <div className="p-12 lg:p-20 border-b lg:border-b-0 lg:border-r border-white/10">
                  <h3 className="text-4xl font-black tracking-tighter uppercase italic mb-10">THE IMPACT <br />OF 20%.</h3>
                  <p className="text-white/40 mb-16 leading-relaxed font-bold uppercase tracking-widest text-xs">
                    On a $10,000 project, a traditional platform takes <span className="text-white">$2,000</span>. Over a year of freelancing, that could be <span className="text-white">$20,000+</span> lost to fees. 
                    SkillScrumpt.in keeps that money in the pockets of the talent.
                  </p>
                  <div className="space-y-8">
                     <MathRow label="Project Budget" value="$10,000" />
                     <MathRow label="Platform Fee" value="-$2,000" negative />
                     <div className="pt-8 border-t border-white/10">
                        <MathRow label="SkillScrumpt.in Earnings" value="$10,000" highlight />
                     </div>
                  </div>
                </div>
                <div className="p-12 lg:p-20 flex flex-col justify-center bg-white/5">
                   <h3 className="text-4xl font-black tracking-tighter uppercase italic mb-10">WHY FLAT <br />FEE?</h3>
                   <p className="text-white/30 mb-16 leading-relaxed font-bold uppercase tracking-widest text-xs">
                     By charging a flat subscription, our interests are aligned with the success of the hire, not the size of the transaction. This encourages long-term partnerships and high-quality outcomes.
                   </p>
                   <div className="grid grid-cols-2 gap-4">
                      <FeatureBox icon={TrendingUp} label="High Yield" />
                      <FeatureBox icon={ShieldCheck} label="Escrow Lock" />
                      <FeatureBox icon={Users} label="Direct Access" />
                      <FeatureBox icon={PieChart} label="Full Audit" />
                   </div>
                </div>
              </div>
           </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-60 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <h2 className="text-6xl md:text-9xl font-black tracking-tighter mb-16 leading-[0.8]">ESTABLISH <br />EQUITY.</h2>
          <div className="flex flex-col sm:flex-row gap-8 justify-center">
            <Link to="/register" className="flex-1 max-w-xs mx-auto sm:mx-0">
              <button className="w-full py-6 bg-white text-black font-black uppercase tracking-[0.4em] text-xs hover:scale-105 transition-transform">
                Start as Talent
              </button>
            </Link>
            <Link to="/pricing" className="flex-1 max-w-xs mx-auto sm:mx-0">
              <button className="w-full py-6 border border-white text-white font-black uppercase tracking-[0.4em] text-xs hover:bg-white/10 transition-all">
                Hire Elite
              </button>
            </Link>
          </div>
        </div>
        <Star className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] text-white/5 pointer-events-none" />
      </section>
    </div>
  );
}

function ComparisonCard({ title, items, type }) {
  const isPositive = type === 'positive';
  return (
    <div className={`p-1 border border-white/10 ${isPositive ? 'bg-white/10' : 'bg-white/5'}`}>
      <div className="p-12 border border-white/10 h-full bg-black">
        <h3 className={`text-2xl font-black tracking-tight mb-12 uppercase italic ${isPositive ? 'text-white' : 'text-white/30'}`}>{title}</h3>
        <ul className="space-y-8">
          {items.map((item, i) => (
            <li key={i} className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-white/60">
               <div className={`w-8 h-8 flex items-center justify-center border transition-all ${isPositive ? 'border-white bg-white text-black' : 'border-white/10 text-white/20'}`}>
                  {isPositive ? <CheckCircle size={16} /> : <Zap size={16} />}
               </div>
               {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function MathRow({ label, value, negative = false, highlight = false }) {
  return (
    <div className="flex justify-between items-center">
       <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">{label}</span>
       <span className={`text-2xl font-black italic ${negative ? 'text-white/40 line-through' : highlight ? 'text-white' : 'text-white/60'}`}>{value}</span>
    </div>
  );
}

function FeatureBox({ icon: Icon, label }) {
  return (
    <div className="border border-white/10 p-8 flex flex-col items-center text-center bg-black hover:bg-white hover:text-black transition-all group">
       <Icon className="mb-4 group-hover:text-black transition-colors" size={24} />
       <span className="text-[9px] font-black uppercase tracking-[0.2em]">{label}</span>
    </div>
  );
}
