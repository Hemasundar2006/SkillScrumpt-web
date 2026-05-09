import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  ChevronRight, 
  Briefcase, 
  Shield, 
  DollarSign, 
  Clock, 
  FileText, 
  CheckCircle,
  Zap
} from 'lucide-react';
import { Card, Badge, Button } from '../components/UI';
import { Link } from 'react-router-dom';

export function PostNewProject() {
  const [step, setStep] = React.useState(1);

  return (
    <div className="pt-24 pb-20 bg-[#f8f9fb] min-h-screen">
      <div className="max-w-3xl mx-auto px-4">
        {/* Progress Header */}
        <div className="flex justify-between items-center mb-12">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-secondary mb-2">Post a New Project</h1>
            <p className="text-gray-500 font-medium">Step {step} of 3: {step === 1 ? 'Project Details' : step === 2 ? 'Skills & Verification' : 'Budget & Timeline'}</p>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3].map(i => (
              <div key={i} className={`w-8 h-1.5 rounded-full ${i <= step ? 'bg-primary' : 'bg-gray-200'}`} />
            ))}
          </div>
        </div>

        <Card className="p-8 border-none shadow-2xl">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Project Title</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-custom outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-medium"
                    placeholder="e.g. Next.js Frontend Developer for E-commerce Rebrand"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Project Description</label>
                  <textarea 
                    rows={6}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-custom outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-medium resize-none"
                    placeholder="Describe the project goals, requirements, and deliverables..."
                  />
                </div>

                <div className="pt-6">
                  <Button className="w-full h-12" onClick={() => setStep(2)}>Continue to Skills</Button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <h3 className="font-bold text-lg">Required Skill Badges</h3>
                  <p className="text-xs text-gray-500 font-medium leading-relaxed">Select the AI-verified badges that talent must possess to bid on this project.</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <SkillToggle label="React Expert" />
                    <SkillToggle label="Next.js Core" />
                    <SkillToggle label="TypeScript Pro" />
                    <SkillToggle label="System Design" />
                    <SkillToggle label="Node.js Backend" />
                    <SkillToggle label="UI/UX Verified" />
                  </div>
                </div>

                <div className="bg-primary/5 border border-primary/20 rounded-custom p-6">
                  <div className="flex gap-4">
                    <Shield className="text-primary flex-shrink-0" size={24} />
                    <div>
                      <h4 className="font-bold text-primary mb-1">AI-Enforced Quality</h4>
                      <p className="text-xs text-gray-600 leading-relaxed">By requiring verified badges, only the top 5% of talent will be able to apply. This ensures you only receive high-quality proposals.</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>Back</Button>
                  <Button className="flex-[2] h-12" onClick={() => setStep(3)}>Continue to Budget</Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Budget Type</label>
                    <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-custom outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-bold text-secondary">
                      <option>Fixed Price</option>
                      <option>Hourly Rate</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Budget Range (USD)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        type="text" 
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-custom outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-bold"
                        placeholder="5,000"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Estimated Deadline</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="date" 
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-custom outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-bold"
                    />
                  </div>
                </div>

                <div className="bg-secondary text-white p-6 rounded-custom relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-2xl -mr-16 -mt-16" />
                   <div className="relative z-10">
                      <h4 className="font-bold mb-2 flex items-center gap-2">
                        <CheckCircle size={18} className="text-primary" /> Ready to Launch?
                      </h4>
                      <p className="text-xs text-gray-400 leading-relaxed mb-4">Your project will be broadcasted to verified professionals matching your criteria immediately after posting.</p>
                      <div className="flex items-center justify-between py-3 border-t border-white/10">
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Service Fee</span>
                        <span className="text-lg font-bold text-primary">$0.00</span>
                      </div>
                      <p className="text-[10px] text-gray-500 italic mt-2">SkillScrumpt's Zero Brokerage model means 100% of your budget goes to the talent.</p>
                   </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button variant="outline" className="flex-1" onClick={() => setStep(2)}>Back</Button>
                  <Button className="flex-[2] h-12 shadow-primary/30">Post Project Now</Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </div>
    </div>
  );
}

function SkillToggle({ label }) {
  const [selected, setSelected] = React.useState(false);
  return (
    <button 
      onClick={() => setSelected(!selected)}
      className={`flex items-center justify-between p-4 border rounded-custom transition-all group ${
        selected ? 'bg-primary/10 border-primary' : 'bg-white border-gray-100 hover:border-gray-200'
      }`}
    >
      <span className={`text-sm font-bold ${selected ? 'text-primary' : 'text-gray-500'}`}>{label}</span>
      <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
        selected ? 'bg-primary border-primary text-white' : 'border-gray-300'
      }`}>
        {selected && <CheckCircle size={12} />}
      </div>
    </button>
  );
}

// AnimatePresence is now imported from framer-motion

export function HelpCenter() {
  return (
    <div className="pt-20 bg-[#f8f9fb] pb-24">
      <section className="bg-primary py-24 text-white text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-48 -mt-48" />
        <div className="max-w-3xl mx-auto px-4 relative z-10">
          <h1 className="text-5xl font-black mb-6">How can we help?</h1>
          <div className="relative max-w-xl mx-auto">
            <input 
              type="text" 
              placeholder="Search help articles..." 
              className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-custom outline-none focus:bg-white focus:text-secondary transition-all text-lg font-medium placeholder:text-white/50"
            />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 -mt-12 relative z-20">
        <div className="grid md:grid-cols-3 gap-8">
          <CategoryCard 
            icon={Shield} 
            title="Verification & Safety" 
            desc="Learn about our AI proctoring and verified badge system."
          />
          <CategoryCard 
            icon={Briefcase} 
            title="Hiring & Projects" 
            desc="How to find talent, manage milestones and workspace collaboration."
          />
          <CategoryCard 
            icon={DollarSign} 
            title="Payments & Fees" 
            desc="Everything about our zero brokerage model and secure transactions."
          />
        </div>

        <div className="mt-20">
          <h2 className="text-3xl font-bold mb-10 text-secondary">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <FaqItem question="How does the AI Proctoring work?" />
            <FaqItem question="What is the Zero Brokerage Model?" />
            <FaqItem question="How do I earn my first skill badge?" />
            <FaqItem question="Is my data secure on SkillScrumpt?" />
            <FaqItem question="Can I hire talent for full-time roles?" />
            <FaqItem question="How are disputes handled?" />
          </div>
        </div>
      </div>
    </div>
  );
}

function CategoryCard({ icon: Icon, title, desc }) {
  return (
    <Card className="p-8 border-none shadow-xl hover:-translate-y-1 transition-all group">
      <div className="w-14 h-14 bg-primary/5 text-primary rounded-custom flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all">
        <Icon size={28} />
      </div>
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed mb-6">{desc}</p>
      <Link to="#" className="text-primary text-sm font-black uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">
        Explore Category <ChevronRight size={16} />
      </Link>
    </Card>
  );
}

function FaqItem({ question }) {
  return (
    <button className="flex items-center justify-between w-full p-6 bg-white border border-border rounded-custom hover:border-primary transition-all text-left group">
      <span className="text-sm font-bold text-secondary">{question}</span>
      <ChevronRight size={18} className="text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
    </button>
  );
}
