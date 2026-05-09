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
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Technical',
    difficulty: 'Intermediate',
    duration: 60,
    cutoffScore: 70,
    isProctored: true
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.post('/admin/assessments', formData);
      alert('Assessment created successfully!');
      setFormData({
        title: '',
        description: '',
        category: 'Technical',
        difficulty: 'Intermediate',
        duration: 60,
        cutoffScore: 70,
        isProctored: true
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
        <p className="text-gray-500 font-medium text-sm">Configure a new skill-based assessment for students.</p>
      </header>

      <Card className="max-w-3xl p-10 bg-white border-none shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Test Title</label>
              <input 
                type="text" required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-custom outline-none focus:bg-white focus:border-primary transition-all font-medium" 
                placeholder="e.g. Advanced React & Architecture"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Category</label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-custom outline-none focus:bg-white focus:border-primary transition-all font-medium"
              >
                <option>Technical</option>
                <option>Design</option>
                <option>Management</option>
                <option>Marketing</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Cutoff Score (%)</label>
              <input 
                type="number" required
                value={formData.cutoffScore}
                onChange={(e) => setFormData({...formData, cutoffScore: parseInt(e.target.value)})}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-custom outline-none focus:bg-white focus:border-primary transition-all font-medium" 
                min="0" max="100"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Duration (Minutes)</label>
              <input 
                type="number" required
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-custom outline-none focus:bg-white focus:border-primary transition-all font-medium" 
              />
            </div>

            <div className="flex items-center gap-3 pt-8">
              <input 
                type="checkbox" 
                checked={formData.isProctored}
                onChange={(e) => setFormData({...formData, isProctored: e.target.checked})}
                className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label className="text-sm font-bold text-secondary">Enable AI Proctoring</label>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Test Description</label>
            <textarea 
              rows={4} required
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-custom outline-none focus:bg-white focus:border-primary transition-all font-medium resize-none"
              placeholder="Provide clear instructions for the students..."
            ></textarea>
          </div>

          <div className="pt-6 flex justify-end">
             <Button type="submit" disabled={isSaving} className="px-12 h-14 shadow-xl shadow-primary/20">
               {isSaving ? <Loader2 className="animate-spin" /> : 'Create Assessment'}
             </Button>
          </div>
        </form>
      </Card>
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
