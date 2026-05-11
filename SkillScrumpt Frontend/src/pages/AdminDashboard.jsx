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

  if (isLoading && !user) return <div className="flex justify-center py-40 bg-black min-h-screen"><Loader2 className="animate-spin text-white/20" size={64} /></div>;

  return (
    <DashboardLayout user={user}>
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.4em]">Sector: Global Oversight</span>
          </div>
          <h1 className="text-6xl font-black tracking-tighter uppercase italic">CONTROL CENTER.</h1>
          <p className="text-white/40 font-black text-[10px] uppercase tracking-[0.2em] mt-2">Monitoring platform-wide telemetry and economic throughput on SkillScrumpt.in.</p>
        </div>
        <div className="flex gap-4">
           <button className="px-8 py-4 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:border-white transition-all">
             Generate Dossier
           </button>
           <Link to="/dashboard/admin/create-test">
             <button className="px-8 py-4 bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-white/90 transition-all flex items-center gap-3">
               <Plus size={16} /> Deploy Test
             </button>
           </Link>
        </div>
      </header>

      <div className="flex border-b border-white/10 gap-12 mb-16">
        {['overview', 'users', 'audits', 'finances'].map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`pb-4 text-[10px] font-black uppercase tracking-[0.3em] transition-all relative ${
              activeTab === tab ? 'text-white' : 'text-white/20 hover:text-white'
            }`}
          >
            {tab}
            {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white" />}
          </button>
        ))}
      </div>

      <div className="space-y-16 relative z-10">
        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="TOTAL OPERATIVES" value={stats?.totalUsers || 0} icon={Users} />
              <StatCard label="ACTIVE DIRECTIVES" value={stats?.totalProjects || 0} icon={Briefcase} />
              <StatCard label="LIVE AUDITS" value={stats?.totalAssessments || 0} icon={Activity} />
              <StatCard label="ECONOMIC VOLUME" value={`₹${stats?.totalVolume?.toLocaleString() || 0}`} icon={Globe} />
            </div>

            <div className="grid lg:grid-cols-3 gap-16">
              <div className="lg:col-span-2 space-y-12">
                <section>
                  <div className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mb-10 flex items-center gap-4">
                    <Activity size={14} className="text-white" /> SYSTEM PULSE
                  </div>
                  <div className="border border-white/10 bg-white/5 overflow-hidden">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-white/10 bg-white/5">
                          <th className="p-6 text-[9px] font-black text-white/40 uppercase tracking-widest">Target</th>
                          <th className="p-4 text-[9px] font-black text-white/40 uppercase tracking-widest">Type</th>
                          <th className="p-4 text-[9px] font-black text-white/40 uppercase tracking-widest">Metric</th>
                          <th className="p-4 text-[9px] font-black text-white/40 uppercase tracking-widest">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {recentActivity.projects.map(proj => (
                          <tr key={proj._id} className="hover:bg-white/5 transition-colors group">
                            <td className="p-6">
                               <p className="font-black text-white uppercase text-xs tracking-tight group-hover:italic">{proj.title}</p>
                               <p className="text-[9px] text-white/20 font-black uppercase tracking-widest mt-1">{proj.client?.firstName}</p>
                            </td>
                            <td className="p-4"><div className="px-3 py-1 border border-white/10 text-[8px] font-black uppercase">Project</div></td>
                            <td className="p-4 font-black text-white text-xs italic tracking-tighter">₹{proj.budget}</td>
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className={`w-1.5 h-1.5 rounded-full ${proj.status === 'completed' ? 'bg-white' : 'bg-white/20'}`} />
                                <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">{proj.status}</span>
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
                  <div className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mb-10">System Infrastructure</div>
                  <div className="p-1 border border-white/10 bg-white/5">
                    <div className="p-8 border border-white/5 bg-black space-y-8">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-black text-white uppercase tracking-widest italic">MAINTENANCE_MODE</p>
                          <p className="text-[9px] text-white/20 font-black uppercase tracking-widest mt-2">SEAL PLATFORM ACCESS</p>
                        </div>
                        <button 
                          onClick={handleToggleMaintenance}
                          className={`w-12 h-6 border transition-all relative p-1 ${settings.maintenanceMode ? 'border-white bg-white' : 'border-white/20'}`}
                        >
                           <div className={`w-3 h-3 transition-all ${settings.maintenanceMode ? 'translate-x-6 bg-black' : 'translate-x-0 bg-white/20'}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                </section>
              </aside>
            </div>
          </>
        )}

        {activeTab === 'users' && (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-end mb-12 pb-6 border-b border-white/10">
              <h3 className="text-4xl font-black tracking-tighter uppercase italic">USER MANAGEMENT.</h3>
              <div className="relative">
                <Search size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" />
                <input className="pl-14 pr-8 py-4 bg-white/5 border border-white/10 w-96 outline-none focus:border-white transition-all font-black text-[10px] uppercase tracking-widest" placeholder="SEARCH IDENTITIES..." />
              </div>
            </div>
            <div className="border border-white/10 bg-white/5 overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10">
                    <th className="p-8 text-[9px] font-black text-white/40 uppercase tracking-widest">Operative Signature</th>
                    <th className="p-4 text-[9px] font-black text-white/40 uppercase tracking-widest">Function</th>
                    <th className="p-4 text-[9px] font-black text-white/40 uppercase tracking-widest">Integrity Pulse</th>
                    <th className="p-4 text-[9px] font-black text-white/40 uppercase tracking-widest">Clearance</th>
                    <th className="p-4 text-[9px] font-black text-white/40 uppercase tracking-widest">Directives</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {fullUsers.map(u => (
                    <tr key={u._id} className="hover:bg-white/5 transition-colors group">
                      <td className="p-8">
                        <div className="flex items-center gap-6">
                           <div className="w-12 h-12 border border-white/10 flex items-center justify-center font-black italic text-xl group-hover:bg-white group-hover:text-black transition-all">{u.firstName[0]}</div>
                           <div>
                             <p className="font-black text-white text-sm uppercase tracking-tight group-hover:italic">{u.firstName} {u.lastName}</p>
                             <p className="text-[9px] text-white/20 font-black tracking-widest mt-1 uppercase">{u.email}</p>
                           </div>
                        </div>
                      </td>
                      <td className="p-4"><div className="px-3 py-1 border border-white/10 text-[8px] font-black uppercase text-white/40">{u.role}</div></td>
                      <td className="p-4">
                         <div className="flex items-center gap-4">
                           <div className="w-24 bg-white/5 h-1 border border-white/5">
                             <div className="bg-white h-full" style={{ width: `${u.aiScore || 0}%` }} />
                           </div>
                           <span className="text-[10px] font-black italic text-white/80">{u.aiScore || 0}%</span>
                         </div>
                      </td>
                      <td className="p-4">
                         <div className={`px-4 py-1 border text-[8px] font-black uppercase tracking-widest ${u.isVerified ? 'border-white text-white' : 'border-white/10 text-white/20'}`}>
                           {u.isVerified ? 'VERIFIED_ELITE' : 'PENDING'}
                         </div>
                      </td>
                      <td className="p-4">
                         <div className="flex gap-4">
                           <button onClick={() => navigate(`/profile/${u._id || u.id}`)} className="text-[9px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-colors">Dossier</button>
                           <button className="text-[9px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-colors">Audit</button>
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
              <div className="flex justify-between items-end mb-12 pb-6 border-b border-white/10">
                <h3 className="text-4xl font-black tracking-tighter uppercase italic">AUDIT VAULT.</h3>
                <div className="text-[10px] font-black uppercase tracking-widest text-white/40">{fullAudits.length} SESSIONS_RECORDED</div>
              </div>
              <div className="border border-white/10 bg-white/5 overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/10">
                      <th className="p-8 text-[9px] font-black text-white/40 uppercase tracking-widest">Candidate Signature</th>
                      <th className="p-4 text-[9px] font-black text-white/40 uppercase tracking-widest">Target Module</th>
                      <th className="p-4 text-[9px] font-black text-white/40 uppercase tracking-widest">Integrity Metric</th>
                      <th className="p-4 text-[9px] font-black text-white/40 uppercase tracking-widest">Validation</th>
                      <th className="p-4 text-[9px] font-black text-white/40 uppercase tracking-widest">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {fullAudits.map(audit => (
                      <tr key={audit._id} className="hover:bg-white/5 transition-colors group">
                        <td className="p-8">
                          <p className="font-black text-white text-sm uppercase tracking-tight group-hover:italic">{audit.user?.firstName} {audit.user?.lastName}</p>
                          <p className="text-[9px] text-white/20 font-black uppercase tracking-widest mt-1">{audit.user?.email}</p>
                        </td>
                        <td className="p-4">
                           <p className="text-[10px] font-black text-white uppercase tracking-widest">{audit.assessment?.title || 'GENERAL_TEST'}</p>
                           <p className="text-[8px] font-black text-white/20 uppercase mt-1">{audit.assessment?.category}</p>
                        </td>
                        <td className="p-4">
                           <div className="flex items-center gap-3">
                             <div className={`w-1.5 h-1.5 rounded-full ${audit.score >= 80 ? 'bg-white shadow-[0_0_8px_white]' : 'bg-white/10'}`} />
                             <span className="font-black text-white text-xs italic italic">{audit.score}%</span>
                           </div>
                        </td>
                        <td className="p-4">
                           <div className={`px-4 py-1 border text-[8px] font-black uppercase tracking-widest ${audit.isPassed ? 'border-white text-white italic' : 'border-red-500/50 text-red-500'}`}>
                             {audit.isPassed ? 'CLEARED' : 'FLAGGED'}
                           </div>
                        </td>
                        <td className="p-4 text-[9px] font-black text-white/30 uppercase tracking-widest">
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
              <div className="flex justify-between items-end mb-12 pb-6 border-b border-white/10">
                <h3 className="text-4xl font-black tracking-tighter uppercase italic">LEDGER ANALYSIS.</h3>
                <div className="text-right">
                  <p className="text-[9px] text-white/30 font-black uppercase tracking-widest mb-1">AGGREGATE VOLUME</p>
                  <p className="text-3xl font-black text-white italic tracking-tighter">₹{fullTransactions.reduce((acc, curr) => acc + (curr.amount || 0), 0).toLocaleString()}</p>
                </div>
              </div>
              <div className="border border-white/10 bg-white/5 overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/10">
                      <th className="p-8 text-[9px] font-black text-white/40 uppercase tracking-widest">Relay Signature</th>
                      <th className="p-4 text-[9px] font-black text-white/40 uppercase tracking-widest">Throughput</th>
                      <th className="p-4 text-[9px] font-black text-white/40 uppercase tracking-widest">Source (Client)</th>
                      <th className="p-4 text-[9px] font-black text-white/40 uppercase tracking-widest">Sink (Expert)</th>
                      <th className="p-4 text-[9px] font-black text-white/40 uppercase tracking-widest">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {fullTransactions.map(txn => (
                      <tr key={txn._id} className="hover:bg-white/5 transition-colors group">
                        <td className="p-8">
                          <p className="font-mono text-[9px] font-black text-white bg-white/5 px-4 py-1 border border-white/10 w-fit uppercase tracking-widest group-hover:bg-white group-hover:text-black transition-all">
                            RELAY_{txn._id?.slice(-8).toUpperCase() || 'EXT'}
                          </p>
                          <p className="text-[8px] text-white/20 font-black mt-2 uppercase tracking-widest">{new Date(txn.date).toLocaleDateString()} / {new Date(txn.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </td>
                        <td className="p-4 font-black text-white text-lg italic tracking-tighter">₹{txn.amount?.toLocaleString()}</td>
                        <td className="p-4">
                           <p className="text-[10px] font-black text-white uppercase tracking-tight">{txn.client?.firstName} {txn.client?.lastName}</p>
                           <p className="text-[8px] text-white/20 font-black uppercase tracking-widest mt-1">{txn.client?.email}</p>
                        </td>
                        <td className="p-4">
                           <p className="text-[10px] font-black text-white uppercase tracking-tight">{txn.professional?.firstName || 'SYSTEM'} {txn.professional?.lastName || 'RELAY'}</p>
                           <p className="text-[8px] text-white/20 font-black uppercase tracking-widest mt-1">{txn.professional?.email || 'INTERNAL'}</p>
                        </td>
                        <td className="p-4">
                           <div className="px-4 py-1 border border-white text-[8px] font-black uppercase tracking-widest italic text-white">SUCCESSFUL</div>
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
      <header className="mb-16">
        <button onClick={() => navigate(-1)} className="flex items-center gap-3 text-white/30 hover:text-white mb-6 transition-all group">
          <ArrowRight className="rotate-180 group-hover:-translate-x-1 transition-transform" size={16} /> 
          <span className="text-[10px] font-black uppercase tracking-[0.4em]">Abort Sequence</span>
        </button>
        <h1 className="text-6xl font-black tracking-tighter uppercase italic">DEPLOY <br />TEST.</h1>
        <p className="text-white/40 font-black text-[10px] uppercase tracking-[0.2em] mt-4 italic">GENERATE NEW VERIFICATION DIRECTIVE FOR SkillScrumpt.in</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-12 pb-32">
        <div className="p-1 border border-white/10 bg-white/5">
          <div className="bg-black border border-white/10 p-12 md:p-16 space-y-12">
            <h3 className="text-xl font-black tracking-tight uppercase italic flex items-center gap-4">
              <Zap size={20} className="text-white" /> CORE_PARAMETERS
            </h3>
            
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-3">
                <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">DIRECTIVE_TITLE</label>
                <input 
                  required
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-6 py-4 bg-transparent border border-white/20 focus:border-white outline-none transition-all font-black uppercase tracking-widest"
                  placeholder="E.G. REACT_CORE_V14"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">SECTOR (CATEGORY)</label>
                <input 
                  required
                  type="text" 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-6 py-4 bg-transparent border border-white/20 focus:border-white outline-none transition-all font-black uppercase tracking-widest"
                  placeholder="TECHNICAL"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">TIME_LIMIT (MINUTES)</label>
                <input 
                  required
                  type="number" 
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  className="w-full px-6 py-4 bg-transparent border border-white/20 focus:border-white outline-none transition-all font-black"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">COMPLEXITY_INDEX</label>
                <select 
                  value={formData.difficulty}
                  onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                  className="w-full px-6 py-4 bg-transparent border border-white/20 focus:border-white outline-none transition-all font-black uppercase tracking-widest appearance-none cursor-pointer"
                >
                  <option className="bg-black">Beginner</option>
                  <option className="bg-black">Intermediate</option>
                  <option className="bg-black">Expert</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">MISSION_OBJECTIVE (DESCRIPTION)</label>
              <textarea 
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-6 py-4 bg-transparent border border-white/20 focus:border-white outline-none transition-all font-bold uppercase tracking-widest text-[11px] resize-none"
                placeholder="DESCRIBE THE GOALS OF THIS VERIFICATION CYCLE..."
              />
            </div>
          </div>
        </div>

        <div className="space-y-12">
          <div className="flex items-center gap-6">
            <h2 className="text-3xl font-black tracking-tighter uppercase italic">DIRECTIVE_MODULES.</h2>
            <div className="h-[1px] bg-white/10 flex-1" />
            <button 
              type="button"
              onClick={handleAddQuestion}
              className="px-6 py-2 border border-white text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center gap-2"
            >
              <Plus size={14} /> ADD_MODULE
            </button>
          </div>

          <div className="space-y-8">
            {formData.questions.map((q, qIdx) => (
              <div key={qIdx} className="p-1 border border-white/10 bg-white/5">
                <div className="bg-black border border-white/10 p-10 space-y-10">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">MODULE_0{qIdx + 1}</span>
                    <button 
                      type="button"
                      onClick={() => setFormData({...formData, questions: formData.questions.filter((_, i) => i !== qIdx)})}
                      className="text-white/20 hover:text-white transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">QUERY_STRING</label>
                    <textarea 
                      required
                      rows={2}
                      value={q.question}
                      onChange={(e) => handleQuestionChange(qIdx, 'question', e.target.value)}
                      className="w-full px-6 py-4 bg-transparent border border-white/20 focus:border-white outline-none transition-all font-bold uppercase tracking-widest text-[11px] resize-none"
                      placeholder="ENTER THE QUESTION TELEMETRY..."
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    {q.options.map((opt, oIdx) => (
                      <div key={oIdx} className="space-y-3">
                        <div className="flex justify-between items-center px-1">
                          <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">OPTION_{String.fromCharCode(65 + oIdx)}</label>
                          <input 
                            type="radio" 
                            name={`correct-${qIdx}`} 
                            checked={q.correctOption === oIdx}
                            onChange={() => handleQuestionChange(qIdx, 'correctOption', oIdx)}
                            className="accent-white"
                          />
                        </div>
                        <input 
                          required
                          type="text" 
                          value={opt}
                          onChange={(e) => handleOptionChange(qIdx, oIdx, e.target.value)}
                          className="w-full px-6 py-4 bg-transparent border border-white/20 focus:border-white outline-none transition-all font-black uppercase tracking-widest text-xs"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-12 border-t border-white/10 flex justify-end gap-8">
           <button 
             type="button"
             onClick={() => navigate('/dashboard/admin')}
             className="px-10 py-5 border border-white/10 text-white/40 font-black uppercase tracking-[0.3em] text-[10px] hover:text-white transition-all"
           >
             ABORT_DEPLOYMENT
           </button>
           <button 
             type="submit" 
             disabled={isLoading}
             className="px-20 py-5 bg-white text-black font-black uppercase tracking-[0.3em] text-[10px] hover:bg-white/90 transition-all flex items-center gap-4"
           >
             {isLoading ? <Loader2 className="animate-spin" size={16} /> : 'AUTHORIZE_BROADCAST'}
           </button>
        </div>
      </form>
    </DashboardLayout>
  );
}

function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="p-10 border border-white/10 bg-white/5 hover:border-white transition-all group">
      <div className="flex justify-between items-start mb-10">
        <div className="w-12 h-12 border border-white/10 flex items-center justify-center text-white/20 group-hover:bg-white group-hover:text-black transition-all">
          <Icon size={24} />
        </div>
      </div>
      <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] mb-3">{label}</p>
      <p className="text-4xl font-black italic tracking-tighter text-white">{value}</p>
    </div>
  );
}
