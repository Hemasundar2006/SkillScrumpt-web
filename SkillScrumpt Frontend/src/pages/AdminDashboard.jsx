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
  Shield,
  ArrowRight,
  Settings,
  Zap,
  Globe,
  X
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
      localStorage.setItem('user', JSON.stringify(profileRes.data));
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
      alert(`SYSTEM STATUS: ${response.data.data.maintenanceMode ? 'MAINTENANCE_LOCKED' : 'ONLINE'}`);
    } catch (err) {
      alert('PROTOCOL_ERROR: SETTINGS_UPDATE_FAILED');
    } finally {
      setIsUpdatingSettings(false);
    }
  };

  const handleToggleCooling = async () => {
    setIsUpdatingSettings(true);
    try {
      const response = await api.put('/admin/settings', { 
        coolingPeriodActive: !settings.coolingPeriodActive 
      });
      setSettings(response.data.data);
      alert(`COOLING PERIOD: ${response.data.data.coolingPeriodActive ? 'ENFORCED (48h)' : 'DISABLED (Testing Mode)'}`);
    } catch (err) {
      alert('PROTOCOL_ERROR: SETTINGS_UPDATE_FAILED');
    } finally {
      setIsUpdatingSettings(false);
    }
  };

  if (isLoading && !user) {
    const cachedUserStr = localStorage.getItem('user');
    const cachedUser = cachedUserStr ? JSON.parse(cachedUserStr) : null;
    return (
      <DashboardLayout user={cachedUser}>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="animate-spin text-indigo-600" size={64} />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout user={user}>
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-12">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-2">Admin Dashboard</h1>
          <p className="text-slate-500 text-sm font-medium">Monitoring platform-wide activities and financial throughput.</p>
        </div>
        <div className="flex gap-4">
           <button className="px-6 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">
             Export Data
           </button>
           <Link to="/dashboard/admin/create-test">
             <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-md shadow-indigo-100">
               <Plus size={16} /> Create New Test
             </button>
           </Link>
        </div>
      </header>

      <div className="flex border-b border-slate-200 gap-8 mb-12">
        {['overview', 'users', 'audits', 'finances'].map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`pb-4 text-xs font-bold uppercase tracking-wider transition-all relative ${
              activeTab === tab ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {tab}
            {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600" />}
          </button>
        ))}
      </div>

      <div className="space-y-16 relative z-10">
        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <StatCard label="Total Users" value={stats?.totalUsers || 0} icon={Users} color="indigo" />
              <StatCard label="Active Projects" value={stats?.totalProjects || 0} icon={Briefcase} color="emerald" />
              <StatCard label="Total Assessments" value={stats?.totalAssessments || 0} icon={Activity} color="amber" />
              <StatCard label="Total Volume" value={`₹${stats?.totalVolume?.toLocaleString() || 0}`} icon={Globe} color="blue" />
            </div>

            <div className="grid lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-12">
                <section>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                    <Activity size={14} className="text-indigo-500" /> RECENT ACTIVITY
                  </div>
                  <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-slate-100 bg-slate-50">
                          <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Project</th>
                          <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Type</th>
                          <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Budget</th>
                          <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {recentActivity.projects.map(proj => (
                          <tr key={proj._id} className="hover:bg-slate-50 transition-colors group">
                            <td className="p-4">
                               <p className="font-semibold text-slate-900 text-sm">{proj.title}</p>
                               <p className="text-[10px] text-slate-400 font-medium mt-0.5">{proj.client?.firstName}</p>
                            </td>
                            <td className="p-4 text-[10px] font-bold text-slate-500 uppercase">Project</td>
                            <td className="p-4 font-bold text-slate-900 text-sm">₹{proj.budget}</td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <div className={`w-1.5 h-1.5 rounded-full ${proj.status === 'completed' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                <span className="text-[10px] font-bold text-slate-500 uppercase">{proj.status}</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>

              <aside className="space-y-12">
                <section>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">System Controls</div>
                  <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-slate-900">Maintenance Mode</p>
                        <p className="text-xs text-slate-500 font-medium mt-1">Restrict platform access</p>
                      </div>
                      <button 
                        onClick={handleToggleMaintenance}
                        disabled={isUpdatingSettings}
                        className={`w-12 h-6 rounded-full transition-all relative p-1 ${settings.maintenanceMode ? 'bg-indigo-600' : 'bg-slate-200'}`}
                      >
                         <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-all ${settings.maintenanceMode ? 'translate-x-6' : 'translate-x-0'}`} />
                      </button>
                    </div>

                    <div className="h-px bg-slate-100 w-full" />

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-slate-900">Enforce 48h Cooling</p>
                        <p className="text-xs text-slate-500 font-medium mt-1">Lockout after assessment attempt</p>
                      </div>
                      <button 
                        onClick={handleToggleCooling}
                        disabled={isUpdatingSettings}
                        className={`w-12 h-6 rounded-full transition-all relative p-1 ${settings.coolingPeriodActive !== false ? 'bg-indigo-600' : 'bg-slate-200'}`}
                      >
                         <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-all ${settings.coolingPeriodActive !== false ? 'translate-x-6' : 'translate-x-0'}`} />
                      </button>
                    </div>
                  </div>
                </section>
              </aside>
            </div>
          </>
        )}

        {activeTab === 'users' && (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-8 pb-4">
              <h3 className="text-2xl font-bold text-slate-900">User Management</h3>
              <div className="relative">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-xl w-80 outline-none focus:border-indigo-500 transition-all text-sm font-medium" placeholder="Search users..." />
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">User</th>
                    <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Role</th>
                    <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">AI Score</th>
                    <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {fullUsers.map(u => (
                    <tr key={u._id} className="hover:bg-slate-50 transition-colors group">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center font-bold text-slate-400 text-sm">{u.firstName?.[0] || 'U'}</div>
                           <div>
                             <div className="flex items-center gap-2">
                               <p className="font-semibold text-slate-900 text-sm">{u.firstName || 'Unknown'} {u.lastName || 'User'}</p>
                               {u.isPro && (
                                 <span className="flex items-center gap-1 px-1.5 py-0.5 bg-gradient-to-r from-amber-400 to-amber-600 text-white text-[8px] font-black rounded-full shadow-sm">
                                   <Zap size={8} fill="currentColor" /> PRO
                                 </span>
                               )}
                             </div>
                             <p className="text-[10px] text-slate-400 font-medium">{u.email}</p>
                           </div>
                        </div>
                      </td>
                      <td className="p-4"><div className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-bold text-slate-500 uppercase">{u.role}</div></td>
                      <td className="p-4">
                         <div className="flex items-center gap-3">
                           <div className="w-20 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                             <div className="bg-indigo-600 h-full" style={{ width: `${u.aiScore || 0}%` }} />
                           </div>
                           <span className="text-xs font-bold text-slate-600">{u.aiScore || 0}%</span>
                         </div>
                      </td>
                      <td className="p-4">
                         <div className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${u.isVerified ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                           {u.isVerified ? 'Verified' : 'Pending'}
                         </div>
                      </td>
                      <td className="p-4">
                         <div className="flex gap-4">
                           <button onClick={() => navigate(`/profile/${u._id || u.id}`)} className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors">Profile</button>
                           <button className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors">Audit</button>
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
              <div className="flex justify-between items-center mb-8 pb-4">
                <h3 className="text-2xl font-bold text-slate-900">Audit Vault</h3>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{fullAudits.length} Sessions Recorded</div>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Candidate</th>
                      <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Module</th>
                      <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Score</th>
                      <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Result</th>
                      <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {fullAudits.map(audit => (
                      <tr key={audit._id} className="hover:bg-slate-50 transition-colors group">
                        <td className="p-4">
                          <p className="font-semibold text-slate-900 text-sm">{audit.user?.firstName} {audit.user?.lastName}</p>
                          <p className="text-[10px] text-slate-400 font-medium">{audit.user?.email}</p>
                        </td>
                        <td className="p-4">
                           <p className="text-xs font-bold text-slate-900">{audit.assessment?.title || 'General Test'}</p>
                           <p className="text-[10px] text-slate-400 font-medium mt-0.5">{audit.assessment?.category}</p>
                        </td>
                        <td className="p-4">
                           <div className="flex items-center gap-2">
                             <div className={`w-1.5 h-1.5 rounded-full ${audit.score >= 80 ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                             <span className="font-bold text-slate-900 text-sm">{audit.score}%</span>
                           </div>
                        </td>
                        <td className="p-4">
                           <div className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${audit.status === 'passed' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                             {audit.status === 'passed' ? 'Cleared' : 'Flagged'}
                           </div>
                        </td>
                        <td className="p-4 text-xs font-medium text-slate-400">
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
              <div className="flex justify-between items-center mb-8 pb-4">
                <h3 className="text-2xl font-bold text-slate-900">Ledger Analysis</h3>
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Total Volume</p>
                  <p className="text-3xl font-bold text-indigo-600">₹{fullTransactions.reduce((acc, curr) => acc + (curr.amount || 0), 0).toLocaleString()}</p>
                </div>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Transaction ID</th>
                      <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Amount</th>
                      <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Client</th>
                      <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Recipient</th>
                      <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {fullTransactions.map(txn => (
                      <tr key={txn._id} className="hover:bg-slate-50 transition-colors group">
                        <td className="p-4">
                          <p className="font-mono text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg w-fit uppercase tracking-widest">
                            TX_{txn._id?.slice(-8).toUpperCase() || 'EXT'}
                          </p>
                          <p className="text-[10px] text-slate-400 font-medium mt-1.5">{new Date(txn.date).toLocaleDateString()} at {new Date(txn.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </td>
                        <td className="p-4 font-bold text-slate-900 text-lg">₹{txn.amount?.toLocaleString()}</td>
                        <td className="p-4">
                           <p className="text-sm font-semibold text-slate-900">{txn.client?.firstName} {txn.client?.lastName}</p>
                           <p className="text-[10px] text-slate-400 font-medium mt-0.5">{txn.client?.email}</p>
                        </td>
                        <td className="p-4">
                           <p className="text-sm font-semibold text-slate-900">{txn.professional?.firstName || 'System'} {txn.professional?.lastName || 'Payment'}</p>
                           <p className="text-[10px] text-slate-400 font-medium mt-0.5">{txn.professional?.email || 'internal'}</p>
                        </td>
                        <td className="p-4">
                           <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-bold uppercase tracking-wider">Successful</div>
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
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '60',
    difficulty: 'Intermediate',
    category: 'Technical',
    questions: [
      { question: '', options: ['', '', '', ''], correctOption: 0, type: 'mcq' }
    ]
  });

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    setUser(savedUser);
  }, []);

  const handleAddQuestion = () => {
    setFormData({
      ...formData,
      questions: [...formData.questions, { question: '', options: ['', '', '', ''], correctOption: 0, type: 'mcq' }]
    });
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...formData.questions];
    newQuestions[index][field] = value;
    setFormData({ ...formData, questions: newQuestions });
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...formData.questions];
    newQuestions[qIndex].options[oIndex] = value;
    setFormData({ ...formData, questions: newQuestions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post('/admin/assessments', formData);
      alert('TEST_DEPLOYED: Assessment has been broadcasted to the verification engine.');
      navigate('/dashboard/admin');
    } catch (err) {
      alert('PROTOCOL_ERROR: FAILED_TO_DEPLOY_TEST');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout user={user}>
      <header className="mb-12">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 mb-6 transition-all group font-bold text-xs">
          <ArrowRight className="rotate-180 group-hover:-translate-x-1 transition-transform" size={14} /> 
          Cancel
        </button>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-2">Create New Test</h1>
        <p className="text-slate-500 text-sm font-medium">Generate a new verification assessment for the platform.</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8 pb-32">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 md:p-12 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-8 flex items-center gap-3">
              <Zap size={20} className="text-indigo-600" /> Test Configuration
            </h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Test Title</label>
                <input 
                  required
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none transition-all font-medium text-sm"
                  placeholder="e.g. React Core Assessment"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category</label>
                <input 
                  required
                  type="text" 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none transition-all font-medium text-sm"
                  placeholder="Technical"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Time Limit (Minutes)</label>
                <input 
                  required
                  type="number" 
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none transition-all font-medium text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Difficulty Level</label>
                <select 
                  value={formData.difficulty}
                  onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none transition-all font-bold text-sm appearance-none cursor-pointer"
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Expert</option>
                </select>
              </div>
            </div>

            <div className="space-y-2 mt-8">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Description</label>
              <textarea 
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none transition-all font-medium text-sm resize-none"
                placeholder="Describe the goals and topics of this test..."
              />
            </div>
        </div>

        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-slate-900">Questions</h2>
            <div className="h-px bg-slate-100 flex-1" />
            <button 
              type="button"
              onClick={handleAddQuestion}
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all flex items-center gap-2"
            >
              <Plus size={14} /> Add Question
            </button>
          </div>

          <div className="space-y-8">
            {formData.questions.map((q, qIdx) => (
              <div key={qIdx} className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
                  <div className="flex justify-between items-center mb-8">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Question {qIdx + 1}</span>
                    <button 
                      type="button"
                      onClick={() => setFormData({...formData, questions: formData.questions.filter((_, i) => i !== qIdx)})}
                      className="text-slate-300 hover:text-red-500 transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <div className="space-y-2 mb-8">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Question Text</label>
                    <textarea 
                      required
                      rows={2}
                      value={q.question}
                      onChange={(e) => handleQuestionChange(qIdx, 'question', e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none transition-all font-medium text-sm resize-none"
                      placeholder="Enter the question here..."
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {q.options.map((opt, oIdx) => (
                      <div key={oIdx} className="space-y-2">
                        <div className="flex justify-between items-center px-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Option {String.fromCharCode(65 + oIdx)}</label>
                          <input 
                            type="radio" 
                            name={`correct-${qIdx}`} 
                            checked={q.correctOption === oIdx}
                            onChange={() => handleQuestionChange(qIdx, 'correctOption', oIdx)}
                            className="accent-indigo-600"
                          />
                        </div>
                        <input 
                          required
                          type="text" 
                          value={opt}
                          onChange={(e) => handleOptionChange(qIdx, oIdx, e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none transition-all font-medium text-sm"
                        />
                      </div>
                    ))}
                  </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 flex justify-end gap-4">
           <button 
             type="button"
             onClick={() => navigate('/dashboard/admin')}
             className="px-8 py-3 text-slate-400 font-bold text-sm hover:text-slate-600 transition-all"
           >
             Discard Changes
           </button>
           <button 
             type="submit" 
             disabled={isLoading}
             className="px-12 py-3 bg-indigo-600 text-white font-bold rounded-xl text-sm hover:bg-indigo-700 transition-all flex items-center gap-3 shadow-md shadow-indigo-100"
           >
             {isLoading ? <Loader2 className="animate-spin" size={16} /> : 'Create Assessment'}
           </button>
        </div>
      </form>
    </DashboardLayout>
  );
}

function StatCard({ label, value, icon: Icon, color }) {
  const colorMap = {
    indigo: 'bg-indigo-50 text-indigo-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    blue: 'bg-blue-50 text-blue-600'
  };

  return (
    <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-indigo-300 transition-all group">
      <div className={`w-12 h-12 ${colorMap[color] || colorMap.indigo} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
        <Icon size={24} />
      </div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}
