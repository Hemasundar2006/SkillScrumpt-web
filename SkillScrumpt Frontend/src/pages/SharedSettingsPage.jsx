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

  if (isLoading && !user) return <div className="flex justify-center py-40 bg-black min-h-screen"><Loader2 className="animate-spin text-white" size={48} /></div>;

  return (
    <DashboardLayout user={user}>
       <header className="mb-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.4em]">Sector: Identity Management</span>
          </div>
          <h1 className="text-6xl font-black tracking-tighter uppercase italic">ACCOUNT <br />PARAMETERS.</h1>
      </header>

      <div className="grid lg:grid-cols-4 gap-12">
        <div className="lg:col-span-1 space-y-1">
           <SettingsNavItem icon={User} label="CORE_IDENTITY" active />
           <SettingsNavItem icon={Lock} label="SECURITY_PASS" />
           <SettingsNavItem icon={Bell} label="RELAY_NOTICES" />
           <SettingsNavItem icon={CreditCard} label="FINANCIAL_RECORDS" />
           <SettingsNavItem icon={Shield} label="AI_PRIVACY" />
        </div>

        <div className="lg:col-span-3">
          <div className="p-1 border border-white/10 bg-white/5">
            <div className="bg-black border border-white/10 p-12 md:p-20 space-y-12">
              {message.text && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-6 border text-[10px] font-black uppercase tracking-widest flex items-center gap-4 ${
                    message.type === 'success' ? 'bg-white/10 border-white/20 text-white' : 'bg-red-500/10 border-red-500/20 text-red-500'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full animate-pulse ${message.type === 'success' ? 'bg-white' : 'bg-red-500'}`} />
                  {message.text}
                </motion.div>
              )}

              <form onSubmit={handleUpdate} className="space-y-12">
                <div className="grid md:grid-cols-2 gap-12">
                  <div className="space-y-3">
                    <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] ml-1">GIVEN_NAME</label>
                    <input 
                      type="text" required
                      value={formData.firstName} 
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      className="w-full px-6 py-4 bg-transparent border border-white/20 focus:border-white outline-none transition-all font-black uppercase tracking-widest placeholder:text-white/10" 
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] ml-1">SURNAME</label>
                    <input 
                      type="text" required
                      value={formData.lastName} 
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      className="w-full px-6 py-4 bg-transparent border border-white/20 focus:border-white outline-none transition-all font-black uppercase tracking-widest placeholder:text-white/10" 
                    />
                  </div>
                  <div className="space-y-3 md:col-span-2">
                    <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] ml-1">IDENTITY_EMAIL</label>
                    <input 
                      type="email" 
                      value={formData.email} 
                      disabled
                      className="w-full px-6 py-4 bg-white/[0.02] border border-white/5 text-white/20 outline-none font-black uppercase tracking-widest cursor-not-allowed" 
                    />
                    <p className="text-[8px] text-white/10 font-black uppercase tracking-widest mt-2">EMAIL_CANNOT_BE_ALTERED_VIA_CORE_PROTOCOL.</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] ml-1">OPERATIVE_BIO</label>
                  <textarea 
                    rows={6} 
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    className="w-full px-6 py-4 bg-transparent border border-white/20 focus:border-white outline-none transition-all font-bold placeholder:text-white/10 resize-none uppercase tracking-widest text-[11px]"
                    placeholder="ESTABLISH YOUR PROFESSIONAL DIRECTIVE..."
                  ></textarea>
                </div>

                <div className="pt-12 border-t border-white/10">
                  <h4 className="text-xl font-black text-white uppercase italic mb-10">SECURITY_OVERRIDE</h4>
                  <div className="grid md:grid-cols-2 gap-12">
                    <div className="space-y-3">
                      <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] ml-1">NEW_ACCESS_KEY</label>
                      <input 
                        type="password" 
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="w-full px-6 py-4 bg-transparent border border-white/20 focus:border-white outline-none transition-all font-black uppercase tracking-widest placeholder:text-white/10" 
                        placeholder="LEAVE_BLANK_TO_PERSIST"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] ml-1">CONFIRM_KEY</label>
                      <input 
                        type="password" 
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                        className="w-full px-6 py-4 bg-transparent border border-white/20 focus:border-white outline-none transition-all font-black uppercase tracking-widest placeholder:text-white/10" 
                        placeholder="REPEAT_NEW_KEY"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-12 border-t border-white/10 flex justify-end gap-8">
                   <button type="button" className="px-10 py-5 border border-white/10 text-white/40 font-black uppercase tracking-[0.3em] text-[10px] hover:text-white transition-all">ABORT_CHANGES</button>
                   <button type="submit" disabled={isSaving} className="px-16 py-5 bg-white text-black font-black uppercase tracking-[0.3em] text-[10px] hover:bg-white/90 transition-all flex items-center gap-3">
                     {isSaving ? <Loader2 className="animate-spin" size={16} /> : 'SAVE_PARAMETERS'}
                   </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function SettingsNavItem({ icon: Icon, label, active = false }) {
  return (
    <button className={`flex items-center justify-between w-full p-6 transition-all font-black text-[10px] uppercase tracking-[0.3em] ${
      active ? 'bg-white text-black' : 'text-white/30 hover:text-white hover:bg-white/5 border border-transparent'
    }`}>
      <div className="flex items-center gap-4">
        <Icon size={16} />
        <span>{label}</span>
      </div>
      <ChevronRight size={14} className={active ? 'text-black' : 'text-white/10'} />
    </button>
  );
}
