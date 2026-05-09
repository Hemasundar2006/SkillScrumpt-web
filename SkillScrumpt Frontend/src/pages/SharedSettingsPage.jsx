import React, { useState, useEffect } from 'react';
import { 
  User, 
  Lock, 
  Bell, 
  CreditCard, 
  Shield, 
  Loader2 
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
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    setIsSaving(true);
    setMessage({ type: '', text: '' });
    
    try {
      const response = await api.put('/users/profile', formData);
      setUser(response.data);
      // Update local storage if needed
      const savedUser = JSON.parse(localStorage.getItem('user'));
      localStorage.setItem('user', JSON.stringify({ ...savedUser, ...response.data }));
      
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Error updating profile' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading && !user) return <div className="flex justify-center py-40"><Loader2 className="animate-spin text-primary" size={48} /></div>;

  return (
    <DashboardLayout user={user}>
       <header className="mb-10">
        <h1 className="text-3xl font-bold text-secondary mb-2">Account Settings</h1>
        <p className="text-gray-500 font-medium text-sm">Update your profile, security, and preferences.</p>
      </header>

      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-2">
           <SettingsNavItem icon={User} label="General Info" active />
           <SettingsNavItem icon={Lock} label="Security & Password" />
           <SettingsNavItem icon={Bell} label="Notifications" />
           <SettingsNavItem icon={CreditCard} label="Billing & Payouts" />
           <SettingsNavItem icon={Shield} label="AI Privacy" />
        </div>

        <div className="lg:col-span-3">
          <Card className="p-10 border-none shadow-xl space-y-8 bg-white">
            {message.text && (
              <div className={`p-4 rounded-custom text-xs font-bold border ${
                message.type === 'success' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'
              }`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleUpdate} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">First Name</label>
                  <input 
                    type="text" required
                    value={formData.firstName} 
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-custom outline-none focus:bg-white focus:border-primary transition-all font-medium" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Last Name</label>
                  <input 
                    type="text" required
                    value={formData.lastName} 
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-custom outline-none focus:bg-white focus:border-primary transition-all font-medium" 
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
                  <input 
                    type="email" 
                    value={formData.email} 
                    disabled
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-custom outline-none opacity-60 font-medium cursor-not-allowed" 
                  />
                  <p className="text-[10px] text-gray-400 font-bold ml-1">Email cannot be changed for security reasons.</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Professional Bio</label>
                <textarea 
                  rows={5} 
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-custom outline-none focus:bg-white focus:border-primary transition-all font-medium resize-none"
                  placeholder="Tell us about your experience..."
                ></textarea>
              </div>

              <div className="pt-8 border-t border-border">
                <h4 className="text-lg font-bold text-secondary mb-6">Change Password</h4>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">New Password</label>
                    <input 
                      type="password" 
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-custom outline-none focus:bg-white focus:border-primary transition-all font-medium" 
                      placeholder="Leave blank to keep current"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Confirm New Password</label>
                    <input 
                      type="password" 
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-custom outline-none focus:bg-white focus:border-primary transition-all font-medium" 
                      placeholder="Repeat new password"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-border flex justify-end gap-4">
                 <Button variant="outline" type="button">Cancel</Button>
                 <Button type="submit" disabled={isSaving} className="px-12 shadow-primary/20">
                   {isSaving ? <Loader2 className="animate-spin" size={18} /> : 'Save Changes'}
                 </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

function SettingsNavItem({ icon: Icon, label, active = false }) {
  return (
    <button className={`flex items-center gap-3 w-full px-4 py-4 rounded-custom transition-all font-bold text-sm ${
      active ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-500 hover:text-secondary hover:bg-white border border-transparent hover:border-border'
    }`}>
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );
}
