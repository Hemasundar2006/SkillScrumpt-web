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
 <div className="pt-20 bg-[#FFF0E5] text-slate-900 selection:bg-[#F97316] selection:text-white">
 {/* Hero Section */}
 <section className="relative py-24 lg:py-32 overflow-hidden border-b border-slate-200">
 <div className="max-w-7xl mx-auto px-6 relative z-10">
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.8 }}
 >
 <div className="flex items-center gap-3 mb-6">
 <div className="w-8 h-[2px] bg-[#F97316] rounded-full" />
 <span className="text-sm font-semibold tracking-wide text-slate-500 uppercase">The Economic Protocol</span>
 </div>
 <h1 className="text-4xl lg:text-6xl font-bold mb-8 leading-tight tracking-tight text-slate-900">
 Zero <br />
 <span className="text-[#F97316]">Brokerage.</span>
 </h1>
 <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
 We've dismantled the traditional commission-based model. On SkillScrumpt.in, 100% of the project budget goes exactly where it belongs: to the professional who did the work.
 </p>
 </motion.div>
 </div>
 
 {/* Abstract Background */}
 <div className="absolute top-1/2 right-0 -translate-y-1/2 opacity-10 pointer-events-none text-[#F97316]">
 <Star className="w-[400px] h-[400px] animate-spin-slow" />
 </div>
 </section>

 {/* Comparison Grid */}
 <section className="py-24">
 <div className="max-w-7xl mx-auto px-6">
 <div className="grid lg:grid-cols-2 gap-12 items-end mb-20">
 <div>
 <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-slate-900">Protocol <br />Differentiation.</h2>
 <p className="text-slate-500 text-sm font-medium">No middleman cuts. No hidden fees. Pure value exchange.</p>
 </div>
 <div className="h-[1px] bg-slate-200 w-full" />
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
 <section className="py-24 border-y border-slate-200">
 <div className="max-w-7xl mx-auto px-6">
 <div className="border-transparent bg-transparent p-0">
 <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden grid lg:grid-cols-2 shadow-xl">
 <div className="p-10 lg:p-16 border-b lg:border-b-0 lg:border-r border-slate-200">
 <h3 className="text-3xl font-bold tracking-tight mb-8 text-slate-900">The Impact <br />of 20%.</h3>
 <p className="text-slate-600 mb-12 leading-relaxed text-sm">
 On a $10,000 project, a traditional platform takes <span className="text-[#F97316] font-semibold">$2,000</span>. Over a year of freelancing, that could be <span className="text-[#F97316] font-semibold">$20,000+</span> lost to fees. 
 SkillScrumpt.in keeps that money in the pockets of the talent.
 </p>
 <div className="space-y-6">
 <MathRow label="Project Budget" value="$10,000" />
 <MathRow label="Platform Fee" value="-$2,000" negative />
 <div className="pt-6 border-t border-slate-200">
 <MathRow label="SkillScrumpt.in Earnings" value="$10,000" highlight />
 </div>
 </div>
 </div>
 <div className="p-10 lg:p-16 flex flex-col justify-center bg-slate-50">
 <h3 className="text-3xl font-bold tracking-tight mb-8 text-slate-900">Why a Flat <br />Fee?</h3>
 <p className="text-slate-600 mb-12 leading-relaxed text-sm">
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
 <section className="py-32 text-center relative overflow-hidden">
 <div className="max-w-4xl mx-auto px-6 relative z-10">
 <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-12 text-slate-900">Establish <br />Equity.</h2>
 <div className="flex flex-col sm:flex-row gap-6 justify-center">
 <Link to="/register" className="flex-1 max-w-xs mx-auto sm:mx-0">
 <button className="w-full py-4 bg-[#F97316] text-white font-semibold text-sm hover:scale-105 transition-transform shadow-md rounded-xl">
 Start as Talent
 </button>
 </Link>
 <Link to="/pricing" className="flex-1 max-w-xs mx-auto sm:mx-0">
 <button className="w-full py-4 border border-slate-200 bg-white text-slate-900 font-semibold text-sm hover:bg-slate-50 transition-all shadow-sm rounded-xl">
 Hire Elite
 </button>
 </Link>
 </div>
 </div>
 <Star className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] text-[#F97316]/5 pointer-events-none" />
 </section>
 </div>
 );
}

function ComparisonCard({ title, items, type }) {
 const isPositive = type === 'positive';
 return (
 <div className="border-transparent bg-transparent group">
 <div className="p-8 md:p-10 border border-slate-200 bg-white h-full rounded-3xl shadow-sm hover:shadow-md transition-all">
 <h3 className={`text-xl font-bold tracking-tight mb-8 ${isPositive ? 'text-[#F97316]' : 'text-slate-500'}`}>{title}</h3>
 <ul className="space-y-6">
 {items.map((item, i) => (
 <li key={i} className="flex items-center gap-4 text-sm font-medium text-slate-600">
 <div className={`w-6 h-6 flex items-center justify-center border transition-all rounded-full shrink-0 ${isPositive ? 'border-[#F97316] bg-[#F97316] text-white' : 'border-slate-200 bg-slate-50 text-slate-400'}`}>
 {isPositive ? <CheckCircle size={14} /> : <Zap size={14} />}
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
 <span className="text-sm font-medium text-slate-500">{label}</span>
 <span className={`text-lg font-bold ${negative ? 'text-slate-400 line-through' : highlight ? 'text-[#F97316]' : 'text-slate-900'}`}>{value}</span>
 </div>
 );
}

function FeatureBox({ icon: Icon, label }) {
 return (
 <div className="border border-slate-200 bg-white hover:border-orange-300 rounded-2xl shadow-sm hover:shadow-md p-6 flex flex-col items-center text-center text-slate-500 hover:text-[#F97316] transition-all group cursor-default">
 <Icon className="mb-3 group-hover:text-[#F97316] transition-colors" size={20} />
 <span className="text-xs font-semibold text-slate-700">{label}</span>
 </div>
 );
}
