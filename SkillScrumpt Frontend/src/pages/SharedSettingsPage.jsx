import React, { useState, useEffect } from 'react';
import { 
  User, 
  Lock, 
  Bell, 
  CreditCard, 
  Shield, 
  Loader2,
  ChevronRight,
  Settings,
  BadgeCheck,
  Zap,
  Briefcase,
  Layers,
  Trash2,
  Plus,
  ExternalLink,
  Code
} from 'lucide-react';
import { Card, Button } from '../components/UI';
import { DashboardLayout } from '../layout/DashboardLayout';
import api from '../utils/api';

export function SharedSettingsPage() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Gigs State
  const [myGigs, setMyGigs] = useState([]);
  const [gigFormData, setGigFormData] = useState({
    title: '',
    description: '',
    price: '',
    deliveryTime: '',
    category: 'Development',
    features: '',
    skills: ''
  });

  // Portfolio State
  const [portfolioFormData, setPortfolioFormData] = useState({
    title: '',
    description: '',
    techStack: '',
    codeLink: '',
    liveLink: ''
  });

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    bio: '',
    phone: '',
    location: '',
    website: '',
    timezone: '',
    socialLinks: { github: '', linkedin: '', twitter: '' },
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (activeTab === 'gigs' && user) {
      fetchMyGigs();
    }
  }, [activeTab, user]);

  const fetchProfile = async () => {
    try {
      const savedUser = JSON.parse(localStorage.getItem('user'));
      const response = await api.get(`/users/profile/${savedUser._id || savedUser.id}`);
      setUser(response.data);
      setFormData({
        firstName: response.data.firstName || '',
        lastName: response.data.lastName || '',
        email: response.data.email || '',
        bio: response.data.bio || '',
        phone: response.data.phone || '',
        location: response.data.location || '',
        website: response.data.website || '',
        timezone: response.data.timezone || '',
        socialLinks: response.data.socialLinks || { github: '', linkedin: '', twitter: '' },
        password: '',
        confirmPassword: ''
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMyGigs = async () => {
    try {
      const savedUser = JSON.parse(localStorage.getItem('user'));
      const res = await api.get(`/gigs?professional=${savedUser._id || savedUser.id}`);
      setMyGigs(res.data);
    } catch (err) {
      console.error(err);
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

  const handleAddPortfolio = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    const newProject = {
      ...portfolioFormData,
      techStack: portfolioFormData.techStack.split(',').map(s => s.trim()).filter(Boolean)
    };

    const updatedPortfolio = [...(user.portfolio || []), newProject];

    try {
      const response = await api.put('/users/profile', { portfolio: updatedPortfolio });
      setUser(response.data);
      const savedUser = JSON.parse(localStorage.getItem('user'));
      localStorage.setItem('user', JSON.stringify({ ...savedUser, ...response.data }));
      
      setMessage({ type: 'success', text: 'PORTFOLIO_PROJECT_PUBLISHED.' });
      setPortfolioFormData({ title: '', description: '', techStack: '', codeLink: '', liveLink: '' });
    } catch (err) {
      setMessage({ type: 'error', text: 'ERROR_UPDATING_PORTFOLIO.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePortfolio = async (indexToDelete) => {
    setIsSaving(true);
    const updatedPortfolio = user.portfolio.filter((_, idx) => idx !== indexToDelete);
    try {
      const response = await api.put('/users/profile', { portfolio: updatedPortfolio });
      setUser(response.data);
      const savedUser = JSON.parse(localStorage.getItem('user'));
      localStorage.setItem('user', JSON.stringify({ ...savedUser, ...response.data }));
      setMessage({ type: 'success', text: 'PORTFOLIO_ITEM_DELETED.' });
    } catch (err) {
      setMessage({ type: 'error', text: 'ERROR_DELETING_PORTFOLIO_ITEM.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateGig = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    const gigPayload = {
      ...gigFormData,
      price: Number(gigFormData.price),
      deliveryTime: Number(gigFormData.deliveryTime),
      features: gigFormData.features.split(',').map(s => s.trim()).filter(Boolean),
      skills: gigFormData.skills.split(',').map(s => s.trim()).filter(Boolean)
    };

    try {
      await api.post('/gigs', gigPayload);
      setMessage({ type: 'success', text: 'SERVICE_PACKAGE_NODE_CREATED_SUCCESSFULLY.' });
      setGigFormData({ title: '', description: '', price: '', deliveryTime: '', category: 'Development', features: '', skills: '' });
      fetchMyGigs();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'ERROR_CREATING_GIG.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading && !user) {
    const cachedUserStr = localStorage.getItem('user');
    const cachedUser = cachedUserStr ? JSON.parse(cachedUserStr) : null;
    return (
      <DashboardLayout user={cachedUser}>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="animate-spin text-indigo-600" size={48} />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout user={user}>
      <header className="mb-12">
        <div className="flex items-center gap-4 mb-2">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            {user?.firstName} {user?.lastName}
          </h1>
          {user?.isVerified && <BadgeCheck size={32} className="text-indigo-500" />}
          {user?.isPro && (
            <span className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-amber-400 to-amber-600 text-white text-xs font-black rounded-full shadow-md">
              <Zap size={14} fill="currentColor" /> PRO
            </span>
          )}
        </div>
        <p className="text-slate-500 text-sm font-medium">Manage your identity profiles, technical portfolio and active service packages.</p>
      </header>

      <div className="grid lg:grid-cols-4 gap-12">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-2">
           <SettingsNavItem icon={User} label="Profile" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
           
           {user?.role === 'professional' && (
             <>
               <SettingsNavItem icon={Briefcase} label="Portfolio Showcase" active={activeTab === 'portfolio'} onClick={() => setActiveTab('portfolio')} />
               <SettingsNavItem icon={Layers} label="Gig Packages" active={activeTab === 'gigs'} onClick={() => setActiveTab('gigs')} />
             </>
           )}
           
           <SettingsNavItem icon={Lock} label="Security Settings" active={activeTab === 'security'} onClick={() => setActiveTab('security')} />
        </div>

        {/* Form Container */}
        <div className="lg:col-span-3">
          <div className="bg-white border border-slate-200 rounded-2xl p-8 md:p-12 shadow-sm">
            {message.text && (
              <div className={`p-4 rounded-xl text-xs font-bold mb-8 flex items-center gap-3 ${
                  message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${message.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                {message.text}
              </div>
            )}

            {/* TAB: Standard Profile */}
            {activeTab === 'profile' && (
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
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Bio</label>
                  <textarea 
                    rows={4} 
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none transition-all font-medium text-sm resize-none"
                    placeholder="Tell us about your professional expertise..."
                  ></textarea>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Phone Number</label>
                    <input 
                      type="tel"
                      value={formData.phone} 
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none transition-all font-medium text-sm" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Location</label>
                    <input 
                      type="text"
                      value={formData.location} 
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none transition-all font-medium text-sm" 
                      placeholder="City, Country"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Website / Portfolio</label>
                    <input 
                      type="url"
                      value={formData.website} 
                      onChange={(e) => setFormData({...formData, website: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none transition-all font-medium text-sm" 
                      placeholder="https://"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Timezone</label>
                    <input 
                      type="text"
                      value={formData.timezone} 
                      onChange={(e) => setFormData({...formData, timezone: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none transition-all font-medium text-sm" 
                      placeholder="e.g., UTC-5"
                    />
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-100">
                  <h4 className="text-lg font-bold text-slate-900 mb-8">Social Profiles</h4>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">LinkedIn URL</label>
                      <input 
                        type="url"
                        value={formData.socialLinks.linkedin} 
                        onChange={(e) => setFormData({...formData, socialLinks: {...formData.socialLinks, linkedin: e.target.value}})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none transition-all font-medium text-sm" 
                        placeholder="https://linkedin.com/in/..."
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">GitHub URL</label>
                      <input 
                        type="url"
                        value={formData.socialLinks.github} 
                        onChange={(e) => setFormData({...formData, socialLinks: {...formData.socialLinks, github: e.target.value}})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none transition-all font-medium text-sm" 
                        placeholder="https://github.com/..."
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-100 flex justify-end gap-4">
                   <button type="submit" disabled={isSaving} className="px-12 py-3 bg-indigo-600 text-white font-bold rounded-xl text-sm hover:bg-indigo-700 transition-all flex items-center gap-3 shadow-md">
                     {isSaving ? <Loader2 className="animate-spin" size={16} /> : 'Save Profile Changes'}
                   </button>
                </div>
              </form>
            )}

            {/* TAB: Portfolio Showcase */}
            {activeTab === 'portfolio' && (
              <div className="space-y-12">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">My Portfolio Showcases</h3>
                  <p className="text-slate-500 text-sm">Add real or concept projects to impress prospective clients browsing your profile signature.</p>
                </div>

                {/* List Portfolio Items */}
                <div className="grid md:grid-cols-2 gap-6">
                  {user.portfolio && user.portfolio.length > 0 ? user.portfolio.map((project, idx) => (
                    <Card key={idx} className="p-6 border border-slate-200 hover:shadow-md transition-all relative flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="font-bold text-base text-slate-900">{project.title}</h4>
                          <button 
                            onClick={() => handleDeletePortfolio(idx)}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed mb-4">{project.description}</p>
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {project.techStack.map((tech, i) => (
                            <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[9px] font-bold uppercase">{tech}</span>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-4 mt-4 pt-4 border-t border-slate-100 text-xs font-bold text-indigo-600">
                        {project.codeLink && <a href={project.codeLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:underline"><Code size={12} /> Source Code</a>}
                        {project.liveLink && <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:underline"><ExternalLink size={12} /> Live Link</a>}
                      </div>
                    </Card>
                  )) : (
                    <div className="col-span-2 py-12 text-center bg-slate-50 border border-slate-100 rounded-xl">
                      <p className="text-slate-500 text-xs font-medium">No showcased work found. Add your first project below.</p>
                    </div>
                  )}
                </div>

                {/* Add Portfolio Item Form */}
                <form onSubmit={handleAddPortfolio} className="space-y-6 pt-8 border-t border-slate-100">
                  <h4 className="text-base font-bold text-slate-900">Publish New Showcase Project</h4>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Project Title</label>
                      <input 
                        type="text" required
                        value={portfolioFormData.title}
                        onChange={(e) => setPortfolioFormData({...portfolioFormData, title: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none transition-all font-medium text-sm" 
                        placeholder="Web3 Ledger Client"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tech Stack (Comma Separated)</label>
                      <input 
                        type="text" required
                        value={portfolioFormData.techStack}
                        onChange={(e) => setPortfolioFormData({...portfolioFormData, techStack: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none transition-all font-medium text-sm" 
                        placeholder="React, Next.js, Rust, Solidity"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Project Description</label>
                    <textarea 
                      rows={3} required
                      value={portfolioFormData.description}
                      onChange={(e) => setPortfolioFormData({...portfolioFormData, description: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none transition-all font-medium text-sm resize-none"
                      placeholder="Brief overview detailing the architecture and deliverables..."
                    ></textarea>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Repository Link (GitHub)</label>
                      <input 
                        type="url"
                        value={portfolioFormData.codeLink}
                        onChange={(e) => setPortfolioFormData({...portfolioFormData, codeLink: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none transition-all font-medium text-sm" 
                        placeholder="https://github.com/..."
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Deployment Live Link</label>
                      <input 
                        type="url"
                        value={portfolioFormData.liveLink}
                        onChange={(e) => setPortfolioFormData({...portfolioFormData, liveLink: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none transition-all font-medium text-sm" 
                        placeholder="https://..."
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button type="submit" disabled={isSaving} className="px-10 py-3 bg-slate-900 text-white font-bold rounded-xl text-xs uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2">
                      {isSaving ? <Loader2 className="animate-spin" size={14} /> : <Plus size={14} />} Add Showcase Item
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB: Gig Packages */}
            {activeTab === 'gigs' && (
              <div className="space-y-12">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">My Service Packages (Gigs)</h3>
                  <p className="text-slate-500 text-sm">Package your routine professional expertise into high-demand products that clients can purchase in one click.</p>
                </div>

                {/* List Active Gigs */}
                <div className="space-y-4">
                  {myGigs.length > 0 ? myGigs.map((gig) => (
                    <div key={gig._id} className="p-6 border border-slate-200 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-sm transition-all bg-slate-50">
                      <div>
                        <div className="flex gap-2 mb-2">
                          <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[8px] font-black uppercase rounded">{gig.category}</span>
                          <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">{gig.salesCount} purchases</span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-base">{gig.title}</h4>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">{gig.description}</p>
                      </div>

                      <div className="flex items-center gap-8 text-right min-w-[200px] justify-between md:justify-end">
                        <div>
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Contract Price</p>
                          <p className="text-xl font-black text-slate-900">${gig.price}</p>
                        </div>
                        <div>
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Duration</p>
                          <p className="text-sm font-bold text-slate-700">{gig.deliveryTime} Days</p>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="py-12 text-center bg-slate-50 border border-slate-100 rounded-xl">
                      <p className="text-slate-500 text-xs font-medium">You haven't listed any service packages yet.</p>
                    </div>
                  )}
                </div>

                {/* Create Gig Form */}
                <form onSubmit={handleCreateGig} className="space-y-6 pt-8 border-t border-slate-100">
                  <h4 className="text-base font-bold text-slate-900">Publish New Service Package Node</h4>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gig Title</label>
                      <input 
                        type="text" required
                        value={gigFormData.title}
                        onChange={(e) => setGigFormData({...gigFormData, title: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none transition-all font-medium text-sm" 
                        placeholder="I will develop a professional fullstack landing page"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category</label>
                      <select 
                        value={gigFormData.category}
                        onChange={(e) => setGigFormData({...gigFormData, category: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none transition-all font-medium text-sm"
                      >
                        <option>Development</option>
                        <option>Design</option>
                        <option>AI & Data</option>
                        <option>Marketing</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Description</label>
                    <textarea 
                      rows={4} required
                      value={gigFormData.description}
                      onChange={(e) => setGigFormData({...gigFormData, description: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none transition-all font-medium text-sm resize-none"
                      placeholder="Detail precisely what scope this package provides, your engineering stack, and how you deliver value..."
                    ></textarea>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Contract Price ($)</label>
                      <input 
                        type="number" required min={5}
                        value={gigFormData.price}
                        onChange={(e) => setGigFormData({...gigFormData, price: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none transition-all font-medium text-sm" 
                        placeholder="250"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Delivery Time (Days)</label>
                      <input 
                        type="number" required min={1}
                        value={gigFormData.deliveryTime}
                        onChange={(e) => setGigFormData({...gigFormData, deliveryTime: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none transition-all font-medium text-sm" 
                        placeholder="5"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Skills Tags (Comma Separated)</label>
                      <input 
                        type="text" required
                        value={gigFormData.skills}
                        onChange={(e) => setGigFormData({...gigFormData, skills: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none transition-all font-medium text-sm" 
                        placeholder="React, Tailwind, Node.js"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Deliverables (Comma Separated list)</label>
                      <input 
                        type="text" required
                        value={gigFormData.features}
                        onChange={(e) => setGigFormData({...gigFormData, features: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none transition-all font-medium text-sm" 
                        placeholder="Source Code Access, 1 Mockup UI, Free Domain Config"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button type="submit" disabled={isSaving} className="px-10 py-3 bg-indigo-600 text-white font-bold rounded-xl text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center gap-2">
                      {isSaving ? <Loader2 className="animate-spin" size={14} /> : <Plus size={14} />} List Service Package
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB: Security */}
            {activeTab === 'security' && (
              <form onSubmit={handleUpdate} className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Security Settings</h3>
                  <p className="text-slate-500 text-sm">Update your secure access credentials to prevent unauthorized sessions.</p>
                </div>

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

                <div className="pt-8 border-t border-slate-100 flex justify-end">
                   <button type="submit" disabled={isSaving} className="px-12 py-3 bg-indigo-600 text-white font-bold rounded-xl text-sm hover:bg-indigo-700 transition-all flex items-center gap-3 shadow-md">
                     {isSaving ? <Loader2 className="animate-spin" size={16} /> : 'Save Secure Password'}
                   </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function SettingsNavItem({ icon: Icon, label, active = false, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center justify-between w-full p-4 rounded-xl transition-all font-bold text-xs ${
        active ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' : 'text-slate-500 hover:text-indigo-600 hover:bg-indigo-50'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon size={18} />
        <span>{label}</span>
      </div>
      <ChevronRight size={16} className={active ? 'text-white' : 'text-slate-300'} />
    </button>
  );
}
