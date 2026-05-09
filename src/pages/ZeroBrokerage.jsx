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
  HelpCircle
} from 'lucide-react';
import { Card, Badge, Button, GlassContainer } from '../components/UI';
import { Link } from 'react-router-dom';

export function ZeroBrokeragePage() {
  return (
    <div className="pt-20 bg-white">
      {/* Hero Section */}
      <section className="relative py-24 lg:py-32 overflow-hidden bg-secondary text-white">
        <div className="absolute top-0 right-0 w-full h-full">
           <div className="absolute top-1/4 right-10 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
           <div className="absolute bottom-1/4 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Badge variant="primary" className="mb-6 bg-primary/20 text-blue-300 border-none uppercase tracking-widest font-bold">The Revolution</Badge>
            <h1 className="text-5xl lg:text-7xl font-black mb-8 leading-tight">
              Zero Brokerage. <br />
              <span className="text-primary">100% Talent Earnings.</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              We've dismantled the traditional commission-based model. On SkillScrumpt, 100% of the project budget goes exactly where it belongs: to the professional who did the work.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Comparison Grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-secondary mb-4">How we differ from traditional platforms</h2>
            <p className="text-gray-500 font-medium">No hidden fees. No middleman cuts. Pure value.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <ComparisonCard 
              title="Traditional Platforms" 
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
              title="SkillScrumpt Model" 
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
      <section className="py-24 bg-[#f8f9fb]">
        <div className="max-w-7xl mx-auto px-4">
           <div className="bg-white rounded-custom border border-border overflow-hidden shadow-2xl grid lg:grid-cols-2">
              <div className="p-12 lg:p-20 border-b lg:border-b-0 lg:border-r border-border">
                <h3 className="text-3xl font-bold mb-8">The Real Impact of 20%</h3>
                <p className="text-gray-500 mb-10 leading-relaxed font-medium">
                  On a $10,000 project, a traditional platform takes <strong>$2,000</strong>. Over a year of freelancing, that could be <strong>$20,000+</strong> lost to fees. 
                  SkillScrumpt keeps that money in the pockets of the talent, driving a more sustainable and equitable global economy.
                </p>
                <div className="space-y-6">
                   <MathRow label="Project Budget" value="$10,000" />
                   <MathRow label="Traditional Platform Fee" value="-$2,000" negative />
                   <div className="pt-6 border-t border-border">
                      <MathRow label="SkillScrumpt Earnings" value="$10,000" highlight />
                   </div>
                </div>
              </div>
              <div className="p-12 lg:p-20 flex flex-col justify-center bg-primary/5">
                 <h3 className="text-3xl font-bold mb-8 text-primary">Why Subscription?</h3>
                 <p className="text-gray-600 mb-8 leading-relaxed font-medium">
                   By charging employers a flat subscription, our interests are aligned with the success of the hire, not the size of the transaction. This encourages long-term partnerships and high-quality outcomes.
                 </p>
                 <div className="grid grid-cols-2 gap-4">
                    <FeatureBox icon={TrendingUp} label="Higher Earnings" />
                    <FeatureBox icon={ShieldCheck} label="Secured Escrow" />
                    <FeatureBox icon={Users} label="Better Partnerships" />
                    <FeatureBox icon={PieChart} label="Full Transparency" />
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-8">Ready to experience the future?</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register"><Button className="h-14 px-10">Start as Talent</Button></Link>
            <Link to="/pricing"><Button variant="outline" className="h-14 px-10">Hire on Subscription</Button></Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function ComparisonCard({ title, items, type }) {
  const isPositive = type === 'positive';
  return (
    <Card className={`p-10 border-2 ${isPositive ? 'border-primary bg-primary/5' : 'border-gray-100 bg-white'}`}>
      <h3 className={`text-2xl font-bold mb-8 ${isPositive ? 'text-primary' : 'text-secondary'}`}>{title}</h3>
      <ul className="space-y-6">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-4 text-sm font-bold text-gray-700">
             <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${isPositive ? 'bg-primary/20 text-primary' : 'bg-red-100 text-red-500'}`}>
                {isPositive ? <CheckCircle size={14} /> : <Zap size={14} />}
             </div>
             {item}
          </li>
        ))}
      </ul>
    </Card>
  );
}

function MathRow({ label, value, negative = false, highlight = false }) {
  return (
    <div className="flex justify-between items-center">
       <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">{label}</span>
       <span className={`text-xl font-black ${negative ? 'text-red-500' : highlight ? 'text-primary' : 'text-secondary'}`}>{value}</span>
    </div>
  );
}

function FeatureBox({ icon: Icon, label }) {
  return (
    <div className="bg-white p-4 rounded-custom border border-primary/10 flex flex-col items-center text-center shadow-sm">
       <Icon className="text-primary mb-2" size={20} />
       <span className="text-[10px] font-black uppercase tracking-widest text-secondary leading-tight">{label}</span>
    </div>
  );
}
