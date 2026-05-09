import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Award, BadgeCheck, Share2, Download, ArrowRight, Star, TrendingUp } from 'lucide-react';
import { Button, Card, Badge, GlassContainer } from '../components/UI';
import { Link } from 'react-router-dom';

export function AssessmentResult() {
  return (
    <div className="pt-20 bg-[#f8f9fb] pb-24 min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        {/* Success Header */}
        <motion.div 
          className="text-center py-12"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/20">
            <BadgeCheck size={48} className="fill-primary/10" />
          </div>
          <h1 className="text-4xl font-black text-secondary mb-4">Assessment Passed!</h1>
          <p className="text-xl text-gray-500 font-medium">You have successfully earned the <span className="text-primary font-bold">Expert React Architect</span> badge.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Badge Display */}
          <Card className="p-10 flex flex-col items-center text-center bg-secondary text-white border-none shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000" />
            
            <motion.div 
              className="relative z-10 mb-8"
              animate={{ rotateY: [0, 360] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
              <div className="w-48 h-48 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center shadow-2xl border-8 border-white/10">
                <Award size={80} className="text-white" />
              </div>
            </motion.div>

            <div className="relative z-10">
              <Badge variant="primary" className="mb-4 bg-primary/20 text-blue-300 border-none font-bold uppercase tracking-widest">Digital Credential</Badge>
              <h3 className="text-2xl font-bold mb-2">Expert React Architect</h3>
              <p className="text-gray-400 text-sm mb-8 leading-relaxed">Verified by AI Proctoring on May 09, 2026. This badge is permanent and verifiable on the platform.</p>
              
              <div className="flex gap-4">
                <Button className="flex-1 text-xs py-2 bg-white text-secondary hover:bg-white/90">Add to Profile</Button>
                <Button variant="outline" className="text-xs py-2 border-white/20 text-white hover:bg-white/10"><Download size={14} /></Button>
              </div>
            </div>
          </Card>

          {/* Performance Stats */}
          <Card className="p-8 border-none shadow-xl flex flex-col">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-8">Performance Analytics</h3>
            <div className="space-y-8 flex-grow">
              <StatRow label="Accuracy" value="94%" />
              <StatRow label="Time Efficiency" value="Top 5%" />
              <StatRow label="Code Quality" value="Expert" />
              <StatRow label="AI Trust Score" value="99.8/100" color="text-green-500" />
            </div>

            <div className="mt-12 pt-8 border-t border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold text-secondary">Skill Points Earned</span>
                <span className="text-xl font-black text-primary">+850 XP</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-primary h-full w-[85%]" />
              </div>
            </div>
          </Card>
        </div>

        {/* Next Steps */}
        <section className="bg-white rounded-custom p-8 shadow-xl border border-gray-100 mb-12">
          <h3 className="text-xl font-bold text-secondary mb-6">What's Next?</h3>
          <div className="grid sm:grid-cols-3 gap-6">
            <NextStepCard 
              icon={Briefcase} 
              title="Browse Projects" 
              desc="View high-ticket projects that require this badge."
              link="/marketplace"
            />
            <NextStepCard 
              icon={TrendingUp} 
              title="Boost Profile" 
              desc="Update your availability to attract top clients."
              link="/profile/edit"
            />
            <NextStepCard 
              icon={Share2} 
              title="Share Success" 
              desc="Post your new badge on LinkedIn or Twitter."
              link="#"
            />
          </div>
        </section>

        <div className="text-center">
          <Link to="/dashboard/student">
            <Button variant="outline" className="px-10">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatRow({ label, value, color = "text-secondary" }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">{label}</span>
      <span className={`text-lg font-black ${color}`}>{value}</span>
    </div>
  );
}

function NextStepCard({ icon: Icon, title, desc, link }) {
  return (
    <Link to={link} className="group p-6 bg-gray-50 rounded-custom hover:bg-primary transition-all">
      <div className="text-primary group-hover:text-white mb-4 transition-colors">
        <Icon size={24} />
      </div>
      <h4 className="font-bold text-secondary group-hover:text-white transition-colors mb-2">{title}</h4>
      <p className="text-xs text-gray-500 group-hover:text-white/70 transition-colors leading-relaxed">{desc}</p>
    </Link>
  );
}
