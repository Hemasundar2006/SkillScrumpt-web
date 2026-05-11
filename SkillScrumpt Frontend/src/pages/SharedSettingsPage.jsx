import React, { useState, useEffect } from 'react';
import { 
  User, 
  Lock, 
  Bell, 
  CreditCard, 
  Shield, 
  Loader2,
  ChevronRight,
  Settings
} from 'lucide-react';
import { Card, Button } from '../components/UI';
import { DashboardLayout } from '../layout/DashboardLayout';
import api from '../utils/api';

export function SharedSettingsPage() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    bio: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const savedUser = JSON.parse(localStorage.getItem('user'));
      const response = await api.get(`/users/profile/${savedUser._id || savedUser.id}`);
      setUser(response.data);
      setFormData({
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        email: response.data.email,
        bio: response.data.bio || '',
        password: '',
        confirmPassword: ''
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'PASSWORDS_DO_NOT_MATCH' });
      return;
    }

    setIsSaving(true);
    setMessage({ type: '', text: '' });
    
    try {
      const response = await api.put('/users/profile', formData);
      setUser(response.data);
      const savedUser = JSON.parse(localStorage.getItem('user'));
      localStorage.setItem('user', JSON.stringify({ ...savedUser, ...response.data }));
      
      setMessage({ type: 'success', text: 'PROFILE_SYNCHRONIZED_SUCCESSFULLY.' });
      setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'ERROR_UPDATING_PARAMETERS.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading && !user) return <div className="flex justify-center py-40 bg-slate-50 min-h-screen"><Loader2 className="animate-spin text-indigo-600" size={48} /></div>;

  return (
    <DashboardLayout user={user}>
        <header className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-2">Account Settings</h1>
          <p className="text-slate-500 text-sm font-medium">Manage your profile, security, and preferences.</p>
        </header>

      <div className="grid lg:grid-cols-4 gap-12">
        <div className="lg:col-span-1 space-y-2">
           <SettingsNavItem icon={User} label="Profile" active />
           <SettingsNavItem icon={Lock} label="Security" />
           <SettingsNavItem icon={Bell} label="Notifications" />
           <SettingsNavItem icon={CreditCard} label="Billing" />
           <SettingsNavItem icon={Shield} label="Privacy" />
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white border border-slate-200 rounded-2xl p-8 md:p-12 shadow-sm">
              {message.text && (
                <div className={`p-4 rounded-xl text-xs font-bold mb-8 flex items-center gap-3 ${
                    message.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${message.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                  {message.text}
                </div>
              )}

              <form onSubmit={handleUpdate} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">First Name</label>
                    <input 
                      type="text" required
                      value={formData.firstName} 
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none transition-all font-medium text-sm" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Last Name</label>
                    <input 
                      type="text" required
                      value={formData.lastName} 
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none transition-all font-medium text-sm" 
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
                    <input 
                      type="email" 
                      value={formData.email} 
                      disabled
                      className="w-full px-4 py-3 bg-slate-100 border border-slate-200 text-slate-400 rounded-xl outline-none font-medium text-sm cursor-not-allowed" 
                    />
                    <p className="text-[10px] text-slate-400 font-medium mt-2">Email address cannot be changed.</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Bio</label>
                  <textarea 
                    rows={6} 
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none transition-all font-medium text-sm resize-none"
                    placeholder="Tell us about yourself..."
                  ></textarea>
                </div>

                <div className="pt-8 border-t border-slate-100">
                  <h4 className="text-lg font-bold text-slate-900 mb-8">Security</h4>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">New Password</label>
                      <input 
                        type="password" 
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none transition-all font-medium text-sm" 
                        placeholder="Leave blank to keep current"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Confirm Password</label>
                      <input 
                        type="password" 
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none transition-all font-medium text-sm" 
                        placeholder="Repeat new password"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-100 flex justify-end gap-4">
                   <button type="button" className="px-8 py-3 text-slate-400 font-bold text-sm hover:text-slate-600 transition-all">Cancel</button>
                   <button type="submit" disabled={isSaving} className="px-12 py-3 bg-indigo-600 text-white font-bold rounded-xl text-sm hover:bg-indigo-700 transition-all flex items-center gap-3 shadow-md shadow-indigo-100">
                     {isSaving ? <Loader2 className="animate-spin" size={16} /> : 'Save Changes'}
                   </button>
                </div>
              </form>
            </div>
          </div>
        </div>
    </DashboardLayout>
  );
}

function SettingsNavItem({ icon: Icon, label, active = false }) {
  return (
    <button className={`flex items-center justify-between w-full p-4 rounded-xl transition-all font-bold text-xs ${
      active ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' : 'text-slate-500 hover:text-indigo-600 hover:bg-indigo-50'
    }`}>
      <div className="flex items-center gap-3">
        <Icon size={18} />
        <span>{label}</span>
      </div>
      <ChevronRight size={16} className={active ? 'text-white' : 'text-slate-300'} />
    </button>
  );
}
