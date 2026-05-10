import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Loader2, 
  Star,
  BadgeCheck,
  MoreVertical
} from 'lucide-react';
import { Card, Badge, Button } from '../components/UI';
import { Link, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../layout/DashboardLayout';
import api from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, CheckCircle } from 'lucide-react';
import RazorpayPayment from '../components/RazorpayPayment';

const UpgradeModal = ({ onClose }) => (
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
        <h3 className="text-2xl font-black text-secondary mb-2">Upgrade to Client Pro</h3>
        <p className="text-gray-500 font-medium text-sm">
          Hire the top 1% of AI-verified talent faster. Upgrade your employer account to unlock premium features and priority support.
        </p>
      </div>
      
      <div className="space-y-3 mb-8">
        {[
          'Access to Top 1% Verified Talent',
          'Priority Project Promotion',
          'Unlimited Direct Messaging',
          'Dedicated Account Manager'
        ].map((feature, i) => (
          <div key={i} className="flex items-center gap-3 text-sm font-bold text-gray-700">
            <CheckCircle size={16} className="text-green-500" />
            {feature}
          </div>
        ))}
      </div>
      
      <div className="flex flex-col gap-3">
        <RazorpayPayment 
          amount={49} 
          buttonText="Upgrade to Pro (₹49)"
          className="w-full h-14 shadow-xl shadow-primary/20 flex items-center justify-center"
          onSuccess={(data) => {
            alert('Payment Successful! Your client account has been upgraded to Pro.');
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

export function ClientDashboard() {
  const navigate = useNavigate();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [talent, setTalent] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const savedUser = JSON.parse(localStorage.getItem('user'));
      
      const [profileRes, projectsRes, talentRes] = await Promise.all([
        api.get(`/users/profile/${savedUser._id || savedUser.id}`),
        api.get('/projects'), 
        api.get('/users/professionals') 
      ]);

      setUser(profileRes.data);
      setProjects(projectsRes.data.slice(0, 3)); 
      setTalent(talentRes.data.slice(0, 3));
    } catch (err) {
      console.error('Error fetching client data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fb]">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <DashboardLayout user={user}>
      <AnimatePresence>
        {showUpgradeModal && <UpgradeModal onClose={() => setShowUpgradeModal(false)} />}
      </AnimatePresence>

      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-secondary">Employer Dashboard</h1>
          <p className="text-gray-500 font-medium text-sm">Welcome back, {user?.firstName}. Ready to hire verified talent?</p>
        </div>
        
        <Link to="/post-project">
          <Button className="flex items-center gap-2 shadow-primary/20">
            <Plus size={18} /> Post New Project
          </Button>
        </Link>
      </header>

      {/* Top Section: Active Bids & Top Talent */}
      <div className="grid lg:grid-cols-3 gap-8 mb-10">
        <div className="lg:col-span-2 space-y-6">
          <section>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-secondary">Your Projects</h3>
              <Link to="/my-projects" className="text-sm font-bold text-primary hover:underline">View All</Link>
            </div>
            <div className="space-y-4">
              {projects.length > 0 ? projects.map(proj => (
                <ActiveProjectCard 
                  key={proj._id}
                  id={proj._id}
                  title={proj.title} 
                  bids={proj.bidsCount || 0} 
                  status={proj.status} 
                  budget={`$${proj.budget?.toLocaleString()}`}
                />
              )) : (
                <p className="text-gray-400 font-medium italic py-10 text-center bg-white rounded-custom border border-dashed">You haven't posted any projects yet.</p>
              )}
            </div>
          </section>
        </div>

        <div>
          <h3 className="text-xl font-bold text-secondary mb-6">Project Stats</h3>
          <Card className="p-6 space-y-6 border-none shadow-sm bg-white">
            <StatItem label="Total Spent" value={`$${user?.totalSpent?.toLocaleString() || 0}`} color="text-green-600" />
            <StatItem label="Active Contracts" value={user?.activeContractsCount || 0} color="text-primary" />
            <StatItem label="Open Projects" value={projects.length} color="text-blue-600" />
          </Card>

          <Card className="mt-8 bg-primary text-white p-6 border-none relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-1000" />
            <div className="relative z-10">
              <h4 className="text-xl font-bold mb-2">Get Client Pro</h4>
              <p className="text-white/70 text-xs mb-4 leading-relaxed">
                Unlock elite verified talent and get 24/7 support for only ₹49.
              </p>
              <Button onClick={() => setShowUpgradeModal(true)} className="w-full bg-white text-primary hover:bg-white/90 text-sm py-2">Upgrade Now</Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Talent Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-secondary">AI-Verified Top Talent</h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Filter</Button>
            <Button variant="outline" size="sm">Search Talent</Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {talent.length > 0 ? talent.map(pro => (
            <TalentCard 
              key={pro._id}
              id={pro._id}
              name={`${pro.firstName} ${pro.lastName}`} 
              role={pro.skills?.[0] || 'Software Engineer'} 
              rating={pro.rating || '0.0'} 
              skills={pro.skills || []}
              score={pro.aiScore || 0}
              avatar={`${pro.firstName?.[0]}${pro.lastName?.[0]}`}
            />
          )) : (
            <p className="text-gray-400 font-medium italic col-span-3 py-10 text-center bg-white rounded-custom border border-dashed">Loading top talent...</p>
          )}
        </div>
      </section>
    </DashboardLayout>
  );
}

function ActiveProjectCard({ id, title, bids, status, budget }) {
  const navigate = useNavigate();
  return (
    <Card onClick={() => navigate(`/projects/${id}`)} className="p-6 hover:border-primary transition-all group flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer bg-white shadow-sm">
      <div>
        <h4 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{title}</h4>
        <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-gray-400">
          <span>{bids} Applications</span>
          <span className="text-secondary font-black">{budget}</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Badge variant={status === 'Reviewing' ? 'warning' : 'primary'}>{status}</Badge>
        <button className="p-2 text-gray-300 hover:text-secondary"><MoreVertical size={20} /></button>
      </div>
    </Card>
  );
}

function StatItem({ label, value, color }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">{label}</span>
      <span className={`text-lg font-bold ${color}`}>{value}</span>
    </div>
  );
}

function TalentCard({ id, name, role, rating, skills, score, avatar }) {
  const navigate = useNavigate();
  return (
    <Card className="p-6 group hover:shadow-xl hover:-translate-y-1 transition-all border-none shadow-sm relative overflow-hidden bg-white">
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700" />
      
      <div className="flex items-center gap-4 mb-6 relative z-10">
        <div className="w-12 h-12 bg-gray-100 rounded-custom flex items-center justify-center font-bold text-primary border border-primary/20">
          {avatar}
        </div>
        <div>
          <h4 className="font-bold text-secondary flex items-center gap-2">
            {name} <BadgeCheck size={18} className="text-primary fill-primary/10" />
          </h4>
          <p className="text-xs text-gray-500 font-medium">{role}</p>
        </div>
      </div>

      <div className="space-y-4 relative z-10">
        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-custom">
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">AI Score</p>
            <p className="text-lg font-bold text-primary">{score}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Rating</p>
            <p className="text-sm font-bold text-secondary flex items-center justify-end gap-1">
              <Star size={14} className="text-yellow-400 fill-yellow-400" /> {rating}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {skills.slice(0, 3).map((skill, i) => (
            <Badge key={i} variant="neutral" className="bg-white border-gray-200 text-gray-600">{skill}</Badge>
          ))}
          {skills.length > 3 && <Badge variant="neutral">+{skills.length - 3}</Badge>}
        </div>

        <Button onClick={() => navigate(`/profile/${id}`)} variant="outline" className="w-full text-xs py-2 mt-2">View Profile</Button>
      </div>
    </Card>
  );
}
