import React from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Briefcase, 
  Award, 
  TrendingUp, 
  Settings, 
  LogOut, 
  Bell, 
  Search, 
  ChevronRight,
  Shield,
  Zap,
  Clock,
  DollarSign,
  Users,
  BadgeCheck
} from 'lucide-react';
import { Card, Badge, Button, GlassContainer } from '../components/UI';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

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
        <h3 className="text-2xl font-black text-secondary mb-2">Upgrade Your Plan</h3>
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
        <Button className="w-full h-14 shadow-xl shadow-primary/20">View Pro Plans</Button>
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

export function StudentDashboard() {
  const location = useLocation();
  const [showUpgradeModal, setShowUpgradeModal] = React.useState(false);

  React.useEffect(() => {
    if (location.state?.showUpgrade) {
      setShowUpgradeModal(true);
    }
  }, [location.state]);

  return (
    <div className="flex min-h-screen bg-[#f8f9fb]">
      <AnimatePresence>
        {showUpgradeModal && <UpgradeModal onClose={() => setShowUpgradeModal(false)} />}
      </AnimatePresence>
      {/* Sidebar */}
      <aside className="w-64 bg-secondary text-white hidden lg:flex flex-col fixed h-full z-30">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="p-2 bg-primary rounded-custom text-white">
              <Shield size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight">SkillScrumpt</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <SidebarItem icon={LayoutDashboard} label="Overview" active />
          <SidebarItem icon={Briefcase} label="My Projects" />
          <SidebarItem icon={Award} label="Skill Badges" />
          <SidebarItem icon={TrendingUp} label="Earnings" />
          <SidebarItem icon={Settings} label="Settings" />
        </nav>

        <div className="p-4 mt-auto">
          <div className="bg-white/5 rounded-custom p-4 mb-4 border border-white/10">
            <p className="text-xs text-gray-400 font-bold mb-2 uppercase tracking-widest">Your AI Score</p>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold text-primary">852</div>
              <Badge variant="primary" className="bg-primary/20 text-blue-300 border-none text-[10px]">TOP 5%</Badge>
            </div>
            <div className="w-full bg-white/10 h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-primary h-full w-[85%]" />
            </div>
          </div>
          <button className="flex items-center gap-3 w-full px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-custom transition-all">
            <LogOut size={18} />
            <span className="text-sm font-semibold">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-secondary">Dashboard Overview</h1>
            <p className="text-gray-500 font-medium text-sm">Welcome back, Alex. Here's what's happening today.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 bg-white border border-border rounded-custom text-gray-500 hover:text-primary hover:border-primary transition-all relative">
              <Bell size={20} />
              <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-border">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-secondary flex items-center gap-1 justify-end">
                  Alex Rivera <BadgeCheck size={14} className="text-primary fill-primary/10" />
                </p>
                <p className="text-xs font-bold text-primary">Verified Expert</p>
              </div>
              <div className="w-10 h-10 bg-primary rounded-custom flex items-center justify-center text-white font-bold">
                AR
              </div>
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard icon={Briefcase} label="Active Projects" value="4" color="text-primary" bg="bg-primary/10" />
          <StatCard icon={Award} label="Skill Badges" value="12" color="text-blue-500" bg="bg-blue-500/10" />
          <StatCard icon={TrendingUp} label="Profile Views" value="2.4k" color="text-purple-500" bg="bg-purple-500/10" />
          <StatCard icon={DollarSign} label="Total Earnings" value="$14,250" color="text-green-500" bg="bg-green-500/10" />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main List */}
          <div className="lg:col-span-2 space-y-8">
            <section>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-secondary">Recent Projects</h3>
                <Link to="/projects" className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
                  View all <ChevronRight size={16} />
                </Link>
              </div>
              <div className="space-y-4">
                <ProjectRow 
                  title="E-commerce Rebrand" 
                  client="Stripe" 
                  status="In Progress" 
                  deadline="2 days left" 
                  amount="$4,500"
                />
                <ProjectRow 
                  title="Web3 Analytics Dashboard" 
                  client="Uniswap" 
                  status="Completed" 
                  deadline="Aug 12, 2026" 
                  amount="$3,200"
                  isCompleted
                />
                <ProjectRow 
                  title="Mobile App Design" 
                  client="Airbnb" 
                  status="In Progress" 
                  deadline="5 days left" 
                  amount="$6,800"
                />
              </div>
            </section>

            <section>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-secondary">Upcoming Assessments</h3>
                <Button variant="outline" size="sm">Schedule New</Button>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <AssessmentCard 
                  title="Advanced React" 
                  duration="90 mins" 
                  difficulty="Expert" 
                  reward="Expert Badge"
                />
                <AssessmentCard 
                  title="System Architecture" 
                  duration="120 mins" 
                  difficulty="Senior" 
                  reward="Verified Senior Badge"
                />
              </div>
            </section>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-8">
            <section>
              <h3 className="text-xl font-bold text-secondary mb-6">Active Proctoring</h3>
              <Card className="bg-primary text-white p-6 border-none relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-1000" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-widest">Secure Session Active</span>
                  </div>
                  <h4 className="text-2xl font-bold mb-4">Alex Rivera's Identity Verified</h4>
                  <p className="text-white/70 text-sm mb-6 leading-relaxed">Your live proctoring session is currently active. All assessment data is being encrypted and secured.</p>
                  <Button className="w-full bg-white text-primary hover:bg-white/90">View Live Feed</Button>
                </div>
              </Card>
            </section>

            <section>
              <h3 className="text-xl font-bold text-secondary mb-6">Quick Actions</h3>
              <div className="space-y-3">
                <QuickActionButton icon={Zap} label="Take Assessment" />
                <QuickActionButton icon={Briefcase} label="Post a Project" />
                <QuickActionButton icon={Users} label="Refer a Friend" />
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ icon: Icon, label, active = false }) {
  return (
    <button className={`flex items-center gap-3 w-full px-4 py-3 rounded-custom transition-all font-semibold text-sm ${
      active ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-400 hover:text-white hover:bg-white/5'
    }`}>
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );
}

function StatCard({ icon: Icon, label, value, color, bg }) {
  return (
    <Card className="p-6 border-none shadow-sm hover:shadow-md transition-shadow">
      <div className={`w-12 h-12 ${bg} ${color} rounded-custom flex items-center justify-center mb-4`}>
        <Icon size={24} />
      </div>
      <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">{label}</p>
      <p className="text-2xl font-bold text-secondary">{value}</p>
    </Card>
  );
}

function ProjectRow({ title, client, status, deadline, amount, isCompleted = false }) {
  return (
    <div className="bg-white border border-border rounded-custom p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-primary transition-colors group">
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
        <Badge variant={isCompleted ? 'success' : 'primary'}>{status}</Badge>
        <button className="p-2 text-gray-300 hover:text-primary">
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}

function AssessmentCard({ title, duration, difficulty, reward }) {
  return (
    <Card className="p-6 hover:border-primary transition-all group">
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
      <Button variant="outline" className="w-full text-xs py-2">Start Challenge</Button>
    </Card>
  );
}

function QuickActionButton({ icon: Icon, label }) {
  return (
    <button className="flex items-center justify-between w-full p-4 bg-white border border-border rounded-custom hover:border-primary hover:shadow-md transition-all group text-left">
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
