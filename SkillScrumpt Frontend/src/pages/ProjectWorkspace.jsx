import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  MessageSquare, 
  Paperclip, 
  Send, 
  FileText, 
  CheckCircle, 
  Clock, 
  MoreHorizontal,
  ChevronLeft,
  Settings,
  Download,
  Eye,
  Loader2,
  Cpu,
  Zap,
  Lock,
  User
} from 'lucide-react';
import { Card, Badge, Button } from '../components/UI';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';

export function ProjectWorkspace() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('chat');
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/projects/${id}`);
      setProject(response.data);
    } catch (err) {
      console.error('Error fetching project:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 className="animate-spin text-white" size={48} />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black p-4 text-center">
        <h2 className="text-2xl font-black text-white uppercase italic mb-8">DIRECTIVE_NOT_FOUND.</h2>
        <button onClick={() => navigate('/dashboard')} className="px-10 py-4 border border-white text-white font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">RETURN_TO_COMMAND</button>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-black text-white selection:bg-white selection:text-black overflow-hidden pt-16">
      {/* Side Details Panel */}
      <aside className="w-80 border-r border-white/10 bg-black hidden xl:flex flex-col">
        <div className="p-8 border-b border-white/10">
          <button onClick={() => navigate(-1)} className="flex items-center gap-3 text-white/30 hover:text-white mb-8 transition-all group">
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Bypass</span>
          </button>
          <h2 className="text-2xl font-black tracking-tight uppercase italic mb-6 leading-tight">{project.title}</h2>
          <div className="flex items-center gap-4 mb-8">
             <div className="px-4 py-1 border border-white/10 text-[9px] font-black uppercase tracking-widest">{project.status.toUpperCase()}</div>
             <div className="flex -space-x-3">
                <div className="w-8 h-8 border border-white bg-white text-black flex items-center justify-center text-[10px] font-black italic">
                  {project.client?.firstName?.[0] || 'C'}
                </div>
                {project.assignedTo && (
                  <div className="w-8 h-8 border border-white bg-black text-white flex items-center justify-center text-[10px] font-black italic">
                    {project.assignedTo.firstName?.[0] || 'P'}
                  </div>
                )}
             </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-12">
          <section>
            <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-6">DIRECTIVE_SCOPE</h4>
            <p className="text-[11px] font-bold text-white/40 leading-relaxed uppercase tracking-widest italic">
              {project.description || 'NO_DESCRIPTION_SIGNAL_DETECTED.'}
            </p>
          </section>

          <section>
            <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-6">VALUATION_&_TIME</h4>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <DollarSign size={16} className="text-white/40" />
                <span className="text-sm font-black italic tracking-tighter">${project.budget?.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-4">
                <Clock size={16} className="text-white/40" />
                <span className="text-[10px] font-black uppercase tracking-widest">{new Date(project.deadline).toLocaleDateString().toUpperCase()}</span>
              </div>
            </div>
          </section>

          <section>
            <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-6">PROTOCOL_BADGES</h4>
            <div className="flex flex-wrap gap-2">
              {project.skills?.map((skill, i) => (
                <div key={i} className="px-3 py-1 border border-white/10 text-[8px] font-black uppercase tracking-widest">{skill}</div>
              ))}
            </div>
          </section>
        </div>

        <div className="p-8 border-t border-white/10">
          <button className="w-full py-4 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:border-white transition-all flex items-center justify-center gap-3">
            <Settings size={14} /> SYSTEM_CONFIG
          </button>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-black">
        <div className="flex flex-col md:flex-row items-center justify-between px-10 py-6 border-b border-white/10 bg-black z-20 gap-8">
          <div className="flex gap-12">
            <TabItem active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} label="ENCRYPTED_RELAY" />
            <TabItem active={activeTab === 'files'} onClick={() => setActiveTab('files')} label="DATA_VAULT" />
            <TabItem active={activeTab === 'contract'} onClick={() => setActiveTab('contract')} label="ESCROW_LEDGER" />
          </div>
          <div className="flex items-center gap-6">
            <div className="px-4 py-1 border border-white text-black bg-white text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
              <Shield size={12} /> AI_SECURED
            </div>
            <button className="px-8 py-3 bg-white text-black font-black uppercase tracking-widest text-[10px] hover:bg-white/90 transition-all">SUBMIT_MILESTONE</button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {activeTab === 'chat' ? (
            <div className="flex-1 flex flex-col">
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-12 space-y-10">
                <div className="flex justify-center my-12 text-center">
                  <div>
                    <div className="px-6 py-2 border border-white/10 text-[9px] font-black text-white/30 uppercase tracking-[0.5em] mb-4 italic">
                      SECURE_WORKSPACE_INITIALIZED
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">ALL_MESSAGES_ENCRYPTED_VIA_SKILLSCRUMPT.IN_AI_CORE</p>
                  </div>
                </div>
                
                <RelayMessage 
                  user={`${project.client?.firstName || 'CLIENT'} (COMMAND)`} 
                  time="0X_NOMINAL" 
                  message={`Welcome to the workspace for "${project.title}". Directives are locked and secure. I'm looking forward to the execution phase.`}
                  isClient
                />
              </div>

              {/* Chat Input */}
              <div className="p-10 border-t border-white/10">
                <div className="max-w-5xl mx-auto relative group">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <button className="text-white/20 hover:text-white transition-colors">
                      <Paperclip size={20} />
                    </button>
                  </div>
                  <input 
                    type="text" 
                    placeholder="ENTER_DATA_RELAY..." 
                    className="w-full pl-16 pr-20 py-6 bg-white/[0.02] border border-white/10 focus:border-white outline-none transition-all font-black uppercase tracking-widest text-xs"
                  />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2">
                    <button className="p-3 bg-white text-black hover:bg-white/90 transition-all">
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 p-12 flex items-center justify-center text-white/20 font-black uppercase tracking-[0.5em] text-xs italic">
              SECTION_UNDER_DEVELOPMENT // ACCESS_RESTRICTED
            </div>
          )}

          <aside className="w-80 border-l border-white/10 bg-black hidden lg:flex flex-col">
            <div className="p-10">
              <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-10 text-center">ACTIVITY_LOG</h4>
              <div className="space-y-10">
                <ActivityRow user="SYSTEM" action="WORKSPACE_ENCRYPTED" time="NOW" icon={Shield} color="text-white" />
                <ActivityRow user={project.client?.firstName || 'CLIENT'} action="RELAY_ACTIVE" time="ACTIVE" icon={Eye} color="text-white/40" />
              </div>
            </div>
          </aside>
        </div>
      </main>
      
      <div className="fixed bottom-8 right-8 z-[100] pointer-events-none opacity-20">
         <Cpu className="w-32 h-32 animate-spin-slow" />
      </div>
    </div>
  );
}

function DollarSign({ size, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="12" y1="1" x2="12" y2="23"></line>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
    </svg>
  );
}

function TabItem({ active, onClick, label }) {
  return (
    <button 
      onClick={onClick}
      className={`py-4 text-[10px] font-black uppercase tracking-[0.3em] border-b-2 transition-all ${
        active ? 'border-white text-white' : 'border-transparent text-white/20 hover:text-white'
      }`}
    >
      {label}
    </button>
  );
}

function RelayMessage({ user, time, message, isClient = false }) {
  return (
    <div className={`flex gap-6 ${isClient ? '' : 'flex-row-reverse text-right'}`}>
      <div className={`flex-shrink-0 w-12 h-12 border flex items-center justify-center font-black text-xl italic ${
        isClient ? 'border-white bg-white text-black' : 'border-white/10 text-white'
      }`}>
        {user[0]}
      </div>
      <div className="max-w-xl">
        <div className={`flex items-center gap-4 mb-3 ${isClient ? '' : 'justify-end'}`}>
          <span className="text-[11px] font-black uppercase tracking-widest">{user}</span>
          <span className="text-[9px] text-white/20 font-black uppercase tracking-widest">{time}</span>
        </div>
        <div className={`p-6 border text-[11px] font-bold leading-relaxed uppercase tracking-widest italic ${
          isClient ? 'border-white/10 bg-white/5 text-white/80' : 'border-white bg-black text-white'
        }`}>
          {message}
        </div>
      </div>
    </div>
  );
}

function ActivityRow({ user, action, time, icon: Icon, color = 'text-white/20' }) {
  return (
    <div className="flex gap-4">
      <div className={`flex-shrink-0 mt-1 ${color}`}>
        <Icon size={16} />
      </div>
      <div>
        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-relaxed">
          <span className="font-black text-white">{user}</span> {action}
        </p>
        <p className="text-[8px] text-white/20 font-black uppercase tracking-[0.3em] mt-1">{time}</p>
      </div>
    </div>
  );
}
