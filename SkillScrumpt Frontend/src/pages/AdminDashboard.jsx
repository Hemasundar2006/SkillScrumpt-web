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
  Loader2
} from 'lucide-react';
import { Card, Badge, Button } from '../components/UI';
import api from '../utils/api';
import { Link, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../layout/DashboardLayout';

export function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState({ users: [], projects: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [settings, setSettings] = useState({ maintenanceMode: false, maintenanceMessage: '' });
  const [isUpdatingSettings, setIsUpdatingSettings] = useState(false);

  useEffect(() => {
    fetchAdminData();
    fetchSettings();
  }, []);

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
           <Link to="/admin/create-test">
             <Button className="flex items-center gap-2">
               <Plus size={18} /> Create Proctoring Test
             </Button>
           </Link>
        </div>
      </header>

      <div className="space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard label="Total Users" value={stats?.totalUsers} icon={Users} color="text-blue-500" />
          <StatCard label="Total Projects" value={stats?.totalProjects} icon={Briefcase} color="text-primary" />
          <StatCard label="Total Tests" value={stats?.totalAssessments} icon={Award} color="text-purple-500" />
          <StatCard label="Total Volume" value={`$${stats?.totalVolume?.toLocaleString()}`} icon={DollarSign} color="text-green-500" />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 space-y-8">
              <section>
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-secondary">
                  <Activity size={20} className="text-primary" /> Recent Projects
                </h3>
                <div className="bg-white rounded-custom border border-border overflow-hidden shadow-sm">
                   <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50 border-b border-border">
                           <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Project</th>
                           <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Client</th>
                           <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Budget</th>
                           <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentActivity.projects.map(proj => (
                          <tr key={proj._id} className="border-b border-border hover:bg-gray-50 transition-colors">
                            <td className="p-4 font-bold text-secondary text-sm">{proj.title}</td>
                            <td className="p-4 text-sm font-medium text-gray-500">{proj.client?.firstName} {proj.client?.lastName}</td>
                            <td className="p-4 font-black text-secondary">${proj.budget}</td>
                            <td className="p-4">
                              <Badge variant={proj.status === 'completed' ? 'success' : 'primary'}>{proj.status}</Badge>
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
                <h3 className="text-xl font-bold mb-6 text-secondary">System Settings</h3>
                <Card className="p-6 border-none shadow-sm bg-white space-y-4 mb-8">
                   <div className="flex items-center justify-between">
                      <div>
                         <p className="text-sm font-bold text-secondary">Maintenance Mode</p>
                         <p className="text-[10px] text-gray-400 font-medium">Block non-admin access</p>
                      </div>
                      <button 
                        type="button"
                        onClick={handleToggleMaintenance}
                        disabled={isUpdatingSettings}
                        className={`w-12 h-6 rounded-full transition-all relative ${settings.maintenanceMode ? 'bg-red-500' : 'bg-gray-200'}`}
                      >
                         <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.maintenanceMode ? 'right-1' : 'left-1'}`} />
                      </button>
                   </div>
                   {settings.maintenanceMode && (
                     <Badge variant="warning" className="w-full justify-center py-2">MAINTENANCE ACTIVE</Badge>
                   )}
                </Card>
              </section>

              <section>
                <h3 className="text-xl font-bold mb-6 text-secondary">User Activity</h3>
                <div className="space-y-4">
                   {recentActivity.users.map(user => (
                     <div key={user._id} className="flex items-center gap-4 bg-white p-4 rounded-custom border border-border shadow-sm">
                        <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold">
                          {user.firstName[0]}
                        </div>
                        <div>
                           <p className="text-sm font-bold text-secondary">{user.firstName} {user.lastName}</p>
                           <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{user.role}</p>
                        </div>
                     </div>
                   ))}
                </div>
              </section>
           </aside>
        </div>
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
