import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, 
  Award, 
  TrendingUp, 
  ChevronRight,
  Shield,
  Zap,
  Clock,
  DollarSign,
  Users,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { Card, Badge, Button } from '../components/UI';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../layout/DashboardLayout';
import api from '../utils/api';
import RazorpayPayment from '../components/RazorpayPayment';

const UpgradeModal = ({ onClose }) => {
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
  }, []);

  return (
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
        <h3 className="text-2xl font-black text-secondary mb-2">Upgrade Your Plan</h3>
        {pricing.isPromoActive ? (
          <div className="inline-block px-4 py-1 bg-green-100 text-green-700 text-[10px] font-black uppercase tracking-widest rounded-full mb-4 animate-pulse">
            Early Bird Offer: ₹1 for first 200 users! ({pricing.remainingPromoSpots} spots left)
          </div>
        ) : null}
        <p className="text-gray-500 font-medium text-sm">
          Welcome to the professional ecosystem! To access premium assessments and higher-paying projects, consider upgrading your student account.
        </p>
      </div>
      
      <div className="space-y-3 mb-8">
        {[
          'Access to Elite AI Assessments',
          'Priority Placement for Big Tech Roles',
          'Unlimited Verified Badges',
          '24/7 Career Support'
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
          buttonText={`Upgrade to Pro (₹${pricing.currentPrice})`}
          className="w-full h-14 shadow-xl shadow-primary/20 flex items-center justify-center font-bold"
          onSuccess={(data) => {
            alert('Payment Successful! Your account has been upgraded.');
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
};

export function StudentDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (location.state?.showUpgrade) {
      setShowUpgradeModal(true);
    }
    
    fetchData();
  }, [location.state]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const savedUser = JSON.parse(localStorage.getItem('user'));
      
      const [profileRes, projectsRes, assessmentsRes] = await Promise.all([
        api.get(`/users/profile/${savedUser._id || savedUser.id}`),
        api.get('/projects'),
        api.get('/assessments')
      ]);

      setUser(profileRes.data);
      setProjects(projectsRes.data.slice(0, 3)); 
      setAssessments(assessmentsRes.data.slice(0, 2));
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
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

      <header className="mb-10">
        <h1 className="text-3xl font-bold text-secondary">Dashboard Overview</h1>
        <p className="text-gray-500 font-medium text-sm">Welcome back, {user?.firstName}. Here's what's happening today.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard icon={Briefcase} label="Active Projects" value={user?.activeContractsCount || 0} color="text-primary" bg="bg-primary/10" />
        <StatCard icon={Award} label="Skill Badges" value={user?.badges?.length || 0} color="text-blue-500" bg="bg-blue-500/10" />
        <StatCard icon={TrendingUp} label="Rating" value={user?.rating || '0.0'} color="text-purple-500" bg="bg-purple-500/10" />
        <StatCard icon={DollarSign} label="Available Balance" value={`$${user?.earnings?.toLocaleString() || 0}`} color="text-green-500" bg="bg-green-500/10" />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-secondary">Available Projects</h3>
              <Link to="/assessments" className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
                View all <ChevronRight size={16} />
              </Link>
            </div>
            <div className="space-y-4">
              {projects.length > 0 ? projects.map(proj => (
                <ProjectRow 
                  key={proj._id}
                  id={proj._id}
                  title={proj.title} 
                  client={proj.client?.firstName || 'Elite Client'} 
                  status={proj.status} 
                  deadline={new Date(proj.deadline).toLocaleDateString()} 
                  amount={`$${proj.budget?.toLocaleString()}`}
                />
              )) : (
                <p className="text-gray-400 font-medium italic py-10 text-center bg-white rounded-custom border border-dashed">No projects available right now.</p>
              )}
            </div>
          </section>

          <section>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-secondary">Recommended Assessments</h3>
              <Link to="/assessments">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {assessments.length > 0 ? assessments.map(assessment => (
                <AssessmentCard 
                  key={assessment._id}
                  title={assessment.title} 
                  duration={`${assessment.duration} mins`} 
                  difficulty={assessment.difficulty} 
                  reward={assessment.reward}
                />
              )) : (
                <p className="text-gray-400 font-medium italic col-span-2 py-10 text-center bg-white rounded-custom border border-dashed">No recommendations yet.</p>
              )}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <section>
            <h3 className="text-xl font-bold text-secondary mb-6">Verification Status</h3>
            <Card className={`${user?.isVerified ? 'bg-green-600' : 'bg-primary'} text-white p-6 border-none relative overflow-hidden group`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-1000" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-widest">{user?.isVerified ? 'Profile Verified' : 'Action Required'}</span>
                </div>
                <h4 className="text-2xl font-bold mb-4">{user?.isVerified ? 'Elite Talent Profile' : 'Get Verified Today'}</h4>
                <p className="text-white/70 text-sm mb-6 leading-relaxed">
                  {user?.isVerified 
                    ? 'Your profile is live and visible to premium clients. Keep your AI score high to stay in the top 1%.' 
                    : 'Unlock high-paying projects and get noticed by top companies by completing your first AI assessment.'}
                </p>
                {!user?.isVerified ? (
                  <Button onClick={() => navigate('/assessments')} className="w-full bg-white text-primary hover:bg-white/90">Start Verification</Button>
                ) : (
                  <Button onClick={() => setShowUpgradeModal(true)} className="w-full bg-white/20 text-white border border-white/30 hover:bg-white/30 backdrop-blur-sm">Upgrade to Pro</Button>
                )}
              </div>
            </Card>
          </section>

          <section>
            <h3 className="text-xl font-bold text-secondary mb-6">Quick Actions</h3>
            <div className="space-y-3">
              <QuickActionButton onClick={() => setShowUpgradeModal(true)} icon={Zap} label="Upgrade Account" />
              <QuickActionButton onClick={() => navigate('/assessments')} icon={Zap} label="Take Assessment" />
              <QuickActionButton onClick={() => navigate('/dashboard/student/projects')} icon={Briefcase} label="Find Work" />
              <QuickActionButton icon={Users} label="Refer a Friend" />
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}

function StatCard({ icon: Icon, label, value, color, bg }) {
  return (
    <Card className="p-6 border-none shadow-sm hover:shadow-md transition-shadow bg-white">
      <div className={`w-12 h-12 ${bg} ${color} rounded-custom flex items-center justify-center mb-4`}>
        <Icon size={24} />
      </div>
      <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">{label}</p>
      <p className="text-2xl font-bold text-secondary">{value}</p>
    </Card>
  );
}

function ProjectRow({ id, title, client, status, deadline, amount, isCompleted = false }) {
  const navigate = useNavigate();
  return (
    <div onClick={() => navigate(`/projects/${id}`)} className="bg-white border border-border rounded-custom p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-primary transition-colors group cursor-pointer shadow-sm">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-custom flex items-center justify-center font-bold text-lg ${
          isCompleted ? 'bg-green-100 text-green-600' : 'bg-primary/10 text-primary'
        }`}>
          {title[0]}
        </div>
        <div>
          <h4 className="font-bold text-secondary group-hover:text-primary transition-colors">{title}</h4>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{client}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-8 text-right">
        <div className="hidden sm:block">
          <p className="text-sm font-bold text-secondary">{amount}</p>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{deadline}</p>
        </div>
        <Badge variant={status === 'Completed' ? 'success' : 'primary'}>{status}</Badge>
        <button className="p-2 text-gray-300 hover:text-primary">
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}

function AssessmentCard({ title, duration, difficulty, reward }) {
  const navigate = useNavigate();
  return (
    <Card className="p-6 hover:border-primary transition-all group bg-white">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-gray-50 rounded-custom text-primary group-hover:bg-primary group-hover:text-white transition-colors">
          <Zap size={20} />
        </div>
        <Badge variant="neutral">{difficulty}</Badge>
      </div>
      <h4 className="font-bold text-lg mb-2">{title}</h4>
      <div className="flex items-center gap-4 text-xs text-gray-400 font-bold uppercase tracking-widest mb-4">
        <span className="flex items-center gap-1"><Clock size={14} /> {duration}</span>
        <span className="flex items-center gap-1 text-primary"><Award size={14} /> {reward}</span>
      </div>
      <Button onClick={() => navigate('/assessments')} variant="outline" className="w-full text-xs py-2">Start Challenge</Button>
    </Card>
  );
}

function QuickActionButton({ icon: Icon, label, onClick }) {
  return (
    <button onClick={onClick} className="flex items-center justify-between w-full p-4 bg-white border border-border rounded-custom hover:border-primary hover:shadow-md transition-all group text-left shadow-sm">
      <div className="flex items-center gap-3">
        <div className="text-gray-400 group-hover:text-primary transition-colors">
          <Icon size={20} />
        </div>
        <span className="text-sm font-bold text-secondary">{label}</span>
      </div>
      <ChevronRight size={18} className="text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
    </button>
  );
}
