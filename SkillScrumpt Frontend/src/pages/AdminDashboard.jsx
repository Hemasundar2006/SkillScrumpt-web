import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Briefcase, 
  Award, 
  Search, 
  Plus, 
  DollarSign,
  PieChart,
  Activity,
  Loader2,
  Shield
} from 'lucide-react';
import { Card, Badge, Button } from '../components/UI';
import api from '../utils/api';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { DashboardLayout } from '../layout/DashboardLayout';

export function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState({ users: [], projects: [] });
  const [fullUsers, setFullUsers] = useState([]);
  const [fullAudits, setFullAudits] = useState([]);
  const [fullTransactions, setFullTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [settings, setSettings] = useState({ maintenanceMode: false, maintenanceMessage: '' });
  const [isUpdatingSettings, setIsUpdatingSettings] = useState(false);

  useEffect(() => {
    fetchAdminData();
    fetchSettings();
  }, []);

  useEffect(() => {
    // Extract tab from URL: /dashboard/admin/users -> users
    const pathParts = location.pathname.split('/');
    const tabFromUrl = pathParts[pathParts.length - 1];
    
    if (['users', 'audits', 'finances'].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    } else {
      setActiveTab('overview');
    }
  }, [location.pathname]);

  useEffect(() => {
    if (activeTab === 'users' && fullUsers.length === 0) fetchAllUsers();
    if (activeTab === 'audits' && fullAudits.length === 0) fetchAllAudits();
    if (activeTab === 'finances' && fullTransactions.length === 0) fetchAllTransactions();
  }, [activeTab]);

  const handleTabChange = (tab) => {
    if (tab === 'overview') {
      navigate('/dashboard/admin');
    } else {
      navigate(`/dashboard/admin/${tab}`);
    }
  };

  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      const savedUser = JSON.parse(localStorage.getItem('user'));
      const [profileRes, statsRes] = await Promise.all([
        api.get(`/users/profile/${savedUser._id || savedUser.id}`),
        api.get('/admin/stats')
      ]);
      
      setUser(profileRes.data);
      setStats(statsRes.data.stats);
      setRecentActivity(statsRes.data.recentActivity);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const { data } = await api.get('/admin/users');
      // Enforce data originality: standardizing state update to prevent duplicates
      setFullUsers([...data.data]);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const fetchAllAudits = async () => {
    try {
      const { data } = await api.get('/admin/audits');
      setFullAudits(data.data);
    } catch (err) {
      console.error('Error fetching audits:', err);
    }
  };

  const fetchAllTransactions = async () => {
    try {
      const { data } = await api.get('/admin/transactions');
      setFullTransactions(data.data);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await api.get('/admin/settings');
      setSettings(response.data.data);
    } catch (err) {
      console.error('Error fetching settings:', err);
    }
  };

  const handleToggleMaintenance = async () => {
    setIsUpdatingSettings(true);
    try {
      const response = await api.put('/admin/settings', { 
        maintenanceMode: !settings.maintenanceMode 
      });
      setSettings(response.data.data);
      alert(`Maintenance mode ${response.data.data.maintenanceMode ? 'ENABLED' : 'DISABLED'}`);
    } catch (err) {
      alert('Error updating settings');
    } finally {
      setIsUpdatingSettings(false);
    }
  };

  if (isLoading && !user) return <div className="flex justify-center py-40"><Loader2 className="animate-spin text-primary" size={48} /></div>;

  return (
    <DashboardLayout user={user}>
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-secondary">Admin Dashboard</h1>
          <p className="text-gray-500 font-medium text-sm">Monitoring SkillScrumpt Ecosystem Activity</p>
        </div>
        <div className="flex gap-4">
           <Button variant="outline" className="flex items-center gap-2">
             <PieChart size={18} /> Generate Report
           </Button>
           <Link to="/dashboard/admin/create-test">
             <Button className="flex items-center gap-2">
               <Plus size={18} /> Create Proctoring Test
             </Button>
           </Link>
        </div>
      </header>

      <div className="flex bg-white/50 backdrop-blur-md p-1.5 rounded-2xl border border-gray-100 mb-10 w-fit">
        {['overview', 'users', 'audits', 'finances'].map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === tab ? 'bg-secondary text-white shadow-xl shadow-secondary/20' : 'text-gray-400 hover:text-secondary'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="space-y-8 relative z-10">
        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard label="Total Users" value={stats?.totalUsers || 0} icon={Users} color="text-blue-500" />
              <StatCard label="Active Projects" value={stats?.totalProjects || 0} icon={Briefcase} color="text-primary" />
              <StatCard label="Live Audits" value={stats?.totalAssessments || 0} icon={Activity} color="text-purple-500" />
              <StatCard label="Platform Volume" value={`₹${stats?.totalVolume?.toLocaleString() || 0}`} icon={DollarSign} color="text-green-500" />
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <section>
                  <h3 className="text-xl font-black mb-6 flex items-center gap-2 text-secondary tracking-tighter">
                    <Activity size={24} className="text-primary" /> Recent Platform Pulse
                  </h3>
                  <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-xl shadow-blue-900/5">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                          <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Entity</th>
                          <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Type</th>
                          <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Metric</th>
                          <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {recentActivity.projects.map(proj => (
                          <tr key={proj._id} className="hover:bg-gray-50/80 transition-colors">
                            <td className="p-6">
                               <p className="font-black text-secondary text-sm">{proj.title}</p>
                               <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{proj.client?.firstName}</p>
                            </td>
                            <td className="p-4"><Badge variant="neutral" className="bg-gray-100 border-none font-black text-[9px]">Project</Badge></td>
                            <td className="p-4 font-black text-secondary text-sm">₹{proj.budget}</td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${proj.status === 'completed' ? 'bg-green-500' : 'bg-primary'}`} />
                                <span className="text-[10px] font-black text-secondary uppercase tracking-widest">{proj.status}</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>

              <aside className="space-y-8">
                <section>
                  <h3 className="text-xl font-black mb-6 text-secondary tracking-tighter">Ecosystem Vitals</h3>
                  <Card className="p-8 border-none shadow-xl bg-white space-y-6 rounded-[2rem]">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-black text-secondary">Maintenance Mode</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Seal ecosystem access</p>
                      </div>
                      <button 
                        onClick={handleToggleMaintenance}
                        className={`w-14 h-7 rounded-full transition-all relative p-1 ${settings.maintenanceMode ? 'bg-red-500 shadow-lg shadow-red-500/30' : 'bg-gray-200'}`}
                      >
                         <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-all ${settings.maintenanceMode ? 'translate-x-7' : 'translate-x-0'}`} />
                      </button>
                    </div>
                  </Card>
                </section>
              </aside>
            </div>
          </>
        )}

        {activeTab === 'users' && (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-secondary tracking-tighter">User Management Hub</h3>
              <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input className="pl-12 pr-6 py-3 bg-white border border-gray-100 rounded-2xl w-80 shadow-sm outline-none focus:border-primary transition-all font-bold text-sm" placeholder="Search by name or email..." />
              </div>
            </div>
            <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-2xl shadow-blue-900/5">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="p-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Candidate / Client</th>
                    <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Role</th>
                    <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">AI Integrity</th>
                    <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {fullUsers.map(u => (
                    <tr key={u._id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="p-8">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-white font-black">{u.firstName[0]}</div>
                           <div>
                             <p className="font-black text-secondary text-sm">{u.firstName} {u.lastName}</p>
                             <p className="text-[10px] text-gray-400 font-bold tracking-tight">{u.email}</p>
                           </div>
                        </div>
                      </td>
                      <td className="p-4"><Badge variant="neutral" className="bg-gray-100 text-gray-500 border-none font-black text-[9px] uppercase">{u.role}</Badge></td>
                      <td className="p-4">
                         <div className="flex items-center gap-3">
                           <div className="w-24 bg-gray-100 h-1.5 rounded-full overflow-hidden">
                             <div className="bg-primary h-full" style={{ width: `${u.aiScore || 0}%` }} />
                           </div>
                           <span className="text-xs font-black text-secondary">{u.aiScore || 0}%</span>
                         </div>
                      </td>
                      <td className="p-4">
                         {u.isVerified ? 
                           <Badge className="bg-green-100 text-green-700 border-none font-black text-[9px] uppercase">Verified Elite</Badge> : 
                           <Badge className="bg-amber-100 text-amber-700 border-none font-black text-[9px] uppercase">Pending</Badge>
                         }
                      </td>
                      <td className="p-4">
                         <div className="flex gap-2">
                           <Button onClick={() => navigate(`/profile/${u._id || u.id}`)} size="sm" variant="outline" className="text-[9px] font-black uppercase tracking-widest px-4 h-9">View Profile</Button>
                           <Button size="sm" className="text-[9px] font-black uppercase tracking-widest px-4 h-9">Verify</Button>
                         </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === 'audits' && (
           <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black text-secondary tracking-tighter">Proctoring Audit Vault</h3>
                <Badge variant="primary">{fullAudits.length} Sessions Recorded</Badge>
              </div>
              <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-2xl shadow-blue-900/5">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100">
                      <th className="p-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Candidate</th>
                      <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Assessment</th>
                      <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Integrity Score</th>
                      <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                      <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {fullAudits.map(audit => (
                      <tr key={audit._id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="p-8">
                          <p className="font-black text-secondary text-sm">{audit.user?.firstName} {audit.user?.lastName}</p>
                          <p className="text-[10px] text-gray-400 font-bold tracking-tight">{audit.user?.email}</p>
                        </td>
                        <td className="p-4">
                           <p className="text-xs font-black text-secondary">{audit.assessment?.title || 'General Test'}</p>
                           <Badge variant="neutral" className="bg-gray-100 border-none font-bold text-[8px] uppercase">{audit.assessment?.category}</Badge>
                        </td>
                        <td className="p-4">
                           <div className="flex items-center gap-2">
                             <div className={`w-3 h-3 rounded-full ${audit.score >= 80 ? 'bg-green-500' : 'bg-red-500'}`} />
                             <span className="font-black text-secondary text-sm">{audit.score}%</span>
                           </div>
                        </td>
                        <td className="p-4">
                           <Badge className={audit.isPassed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                             {audit.isPassed ? 'CLEARED' : 'FLAGGED'}
                           </Badge>
                        </td>
                        <td className="p-4 text-xs font-bold text-gray-400">
                          {new Date(audit.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
           </section>
        )}

        {activeTab === 'finances' && (
           <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black text-secondary tracking-tighter">Financial Tracking Ledger</h3>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Total Platform Volume</p>
                    <p className="text-xl font-black text-emerald-500 tracking-tight">₹{fullTransactions.reduce((acc, curr) => acc + (curr.amount || 0), 0).toLocaleString()}</p>
                  </div>
                  <Badge variant="primary">{fullTransactions.length} TXNS</Badge>
                </div>
              </div>
              <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-2xl shadow-blue-900/5">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100">
                      <th className="p-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">Transaction ID</th>
                      <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                      <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Client (Payer)</th>
                      <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Expert (Payee)</th>
                      <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {fullTransactions.map(txn => (
                      <tr key={txn._id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="p-8">
                          <p className="font-mono text-[10px] font-black text-primary bg-primary/5 px-3 py-1 rounded-full w-fit uppercase tracking-widest">
                            TXN-{txn._id?.slice(-10).toUpperCase() || 'EXTERNAL'}
                          </p>
                          <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-tight">{new Date(txn.date).toLocaleDateString()} {new Date(txn.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </td>
                        <td className="p-4 font-black text-secondary text-lg">₹{txn.amount?.toLocaleString()}</td>
                        <td className="p-4">
                           <p className="text-sm font-black text-secondary">{txn.client?.firstName} {txn.client?.lastName}</p>
                           <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{txn.client?.email}</p>
                        </td>
                        <td className="p-4">
                           <p className="text-sm font-black text-secondary">{txn.professional?.firstName} {txn.professional?.lastName || 'N/A'}</p>
                           <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{txn.professional?.email || 'N/A'}</p>
                        </td>
                        <td className="p-4">
                           <Badge className="bg-emerald-100 text-emerald-700 border-none font-black text-[9px] uppercase tracking-widest">SUCCESSFUL</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
           </section>
        )}
      </div>
    </DashboardLayout>
  );
}

export function CreateProctoringTest() {
  const [isSaving, setIsSaving] = useState(false);
  const [activeQuestionTab, setActiveQuestionTab] = useState('mcq');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    reward: '',
    category: 'Technical',
    difficulty: 'Intermediate',
    duration: 60,
    cutoffScore: 70,
    isProctored: true,
    questions: []
  });

  const [currentMCQ, setCurrentMCQ] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    type: 'mcq'
  });

  const [currentCoding, setCurrentCoding] = useState({
    question: '',
    type: 'coding',
    initialCode: '// Write your code here',
    testCases: [{ input: '', output: '', isPublic: true }]
  });

  const addMCQ = () => {
    if (!currentMCQ.question) return alert('Please enter a question');
    setFormData({
      ...formData,
      questions: [...formData.questions, { ...currentMCQ }]
    });
    setCurrentMCQ({
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      type: 'mcq'
    });
  };

  const addCoding = () => {
    if (!currentCoding.question) return alert('Please enter a coding problem statement');
    setFormData({
      ...formData,
      questions: [...formData.questions, { ...currentCoding }]
    });
    setCurrentCoding({
      question: '',
      type: 'coding',
      initialCode: '// Write your code here',
      testCases: [{ input: '', output: '', isPublic: true }]
    });
  };

  const removeQuestion = (index) => {
    const newQuestions = [...formData.questions];
    newQuestions.splice(index, 1);
    setFormData({ ...formData, questions: newQuestions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.questions.length === 0) return alert('Please add at least one question');
    
    setIsSaving(true);
    try {
      await api.post('/admin/assessments', formData);
      alert('Assessment created successfully with ' + formData.questions.length + ' questions!');
      setFormData({
        title: '',
        description: '',
        category: 'Technical',
        difficulty: 'Intermediate',
        duration: 60,
        cutoffScore: 70,
        isProctored: true,
        questions: []
      });
    } catch (err) {
      alert('Error creating assessment');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardLayout user={{ role: 'admin', firstName: 'Admin' }}>
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-secondary mb-2">Create Proctoring Test</h1>
        <p className="text-gray-500 font-medium text-sm">Design a comprehensive assessment with 20 MCQs and 1 Coding Challenge.</p>
      </header>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Left: Configuration & Question Entry */}
        <div className="space-y-8">
          <Card className="p-8 bg-white border-none shadow-xl">
            <h3 className="text-lg font-bold mb-6 text-secondary border-b pb-4">1. Test Configuration</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2 col-span-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Test Title</label>
                <input 
                  type="text" required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-custom outline-none focus:bg-white focus:border-primary transition-all font-medium" 
                  placeholder="e.g. Fullstack Developer Assessment"
                />
              </div>
              <div className="space-y-2 col-span-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Description</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-custom outline-none focus:bg-white focus:border-primary transition-all font-medium h-20 resize-none" 
                  placeholder="Describe the skills this test validates..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Difficulty</label>
                <select 
                  value={formData.difficulty}
                  onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-custom outline-none focus:bg-white focus:border-primary transition-all font-medium"
                >
                  <option value="Entry">Entry</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Senior">Senior</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Reward Badge Name</label>
                <input 
                  type="text" required
                  value={formData.reward}
                  onChange={(e) => setFormData({...formData, reward: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-custom outline-none focus:bg-white focus:border-primary transition-all font-medium" 
                  placeholder="e.g. React Master Badge"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Duration (Min)</label>
                <input 
                  type="number" required
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-custom outline-none focus:bg-white focus:border-primary transition-all font-medium" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Cutoff (%)</label>
                <input 
                  type="number" required
                  value={formData.cutoffScore}
                  onChange={(e) => setFormData({...formData, cutoffScore: parseInt(e.target.value)})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-custom outline-none focus:bg-white focus:border-primary transition-all font-medium" 
                />
              </div>
            </div>
          </Card>

          <Card className="p-8 bg-white border-none shadow-xl">
             <div className="flex justify-between items-center mb-6">
               <h3 className="text-lg font-bold text-secondary">2. Add Questions</h3>
               <div className="flex bg-gray-100 p-1 rounded-lg">
                 <button 
                  onClick={() => setActiveQuestionTab('mcq')}
                  className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${activeQuestionTab === 'mcq' ? 'bg-white shadow-sm text-primary' : 'text-gray-500'}`}
                 >MCQ</button>
                 <button 
                  onClick={() => setActiveQuestionTab('coding')}
                  className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${activeQuestionTab === 'coding' ? 'bg-white shadow-sm text-primary' : 'text-gray-500'}`}
                 >Coding</button>
               </div>
             </div>

             {activeQuestionTab === 'mcq' ? (
               <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Question Text</label>
                    <textarea 
                      value={currentMCQ.question}
                      onChange={(e) => setCurrentMCQ({...currentMCQ, question: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-custom outline-none focus:bg-white focus:border-primary transition-all font-medium resize-none"
                      placeholder="Enter MCQ question..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {currentMCQ.options.map((opt, i) => (
                      <div key={i} className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-400">Option {i + 1} {currentMCQ.correctAnswer === i && <span className="text-green-500 ml-2">(Correct)</span>}</label>
                        <div className="relative">
                          <input 
                            value={opt}
                            onChange={(e) => {
                              const newOpts = [...currentMCQ.options];
                              newOpts[i] = e.target.value;
                              setCurrentMCQ({...currentMCQ, options: newOpts});
                            }}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-custom outline-none focus:bg-white focus:border-primary transition-all font-medium"
                          />
                          <button 
                            onClick={() => setCurrentMCQ({...currentMCQ, correctAnswer: i})}
                            className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 transition-all ${currentMCQ.correctAnswer === i ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button onClick={addMCQ} variant="outline" className="w-full flex items-center justify-center gap-2">
                    <Plus size={16} /> Add MCQ to List
                  </Button>
               </div>
             ) : (
               <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Coding Problem Statement</label>
                    <textarea 
                      value={currentCoding.question}
                      onChange={(e) => setCurrentCoding({...currentCoding, question: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-custom outline-none focus:bg-white focus:border-primary transition-all font-medium resize-none h-32"
                      placeholder="Explain the problem, constraints, and examples..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Initial Boilerplate Code</label>
                    <textarea 
                      value={currentCoding.initialCode}
                      onChange={(e) => setCurrentCoding({...currentCoding, initialCode: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-900 text-green-400 border border-gray-800 rounded-custom outline-none font-mono text-sm resize-none h-32"
                    />
                  </div>
                  <Button onClick={addCoding} variant="outline" className="w-full flex items-center justify-center gap-2">
                    <Code size={16} /> Add Coding Problem to List
                  </Button>
               </div>
             )}
          </Card>
        </div>

        {/* Right: Question List Preview */}
        <div className="space-y-8">
           <Card className="p-8 bg-white border-none shadow-xl h-full flex flex-col">
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h3 className="text-lg font-bold text-secondary">3. Question Queue</h3>
                <Badge variant="primary" className="px-4">{formData.questions.length} / 21 Items</Badge>
              </div>

              <div className="flex-grow space-y-4 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
                {formData.questions.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                      <Plus size={32} />
                    </div>
                    <p className="text-gray-400 font-medium italic">Your question queue is empty.</p>
                  </div>
                ) : (
                  formData.questions.map((q, idx) => (
                    <div key={idx} className="bg-gray-50 p-4 rounded-custom border border-gray-200 group relative">
                       <button 
                        onClick={() => removeQuestion(idx)}
                        className="absolute top-4 right-4 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                       >
                         <Plus size={16} className="rotate-45" />
                       </button>
                       <div className="flex gap-3 mb-2">
                          <Badge variant={q.type === 'mcq' ? 'neutral' : 'warning'} className="text-[9px] uppercase tracking-tighter">
                            {q.type}
                          </Badge>
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Question {idx + 1}</span>
                       </div>
                       <p className="text-sm font-bold text-secondary line-clamp-2">{q.question}</p>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-8 mt-auto">
                <Button 
                  onClick={handleSubmit} 
                  disabled={isSaving || formData.questions.length === 0}
                  className="w-full h-16 text-lg shadow-2xl shadow-primary/30 group"
                >
                  {isSaving ? <Loader2 className="animate-spin" /> : (
                    <span className="flex items-center justify-center gap-3">
                      Finalize & Publish Assessment <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                    </span>
                  )}
                </Button>
              </div>
           </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

function StatCard({ label, value, icon: Icon, color }) {
  return (
    <Card className="p-6 border-none shadow-sm flex items-center justify-between bg-white">
      <div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-2xl font-bold text-secondary">{value}</p>
      </div>
      <div className={`w-12 h-12 bg-gray-50 ${color} rounded-custom flex items-center justify-center`}>
        <Icon size={24} />
      </div>
    </Card>
  );
}
