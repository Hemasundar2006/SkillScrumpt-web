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
  Loader2
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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4 text-center">
        <h2 className="text-2xl font-bold text-secondary mb-4">Project Not Found</h2>
        <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white overflow-hidden pt-16">
      {/* Side Details Panel */}
      <aside className="w-80 border-r border-border bg-[#fbf9f8] hidden xl:flex flex-col">
        <div className="p-6 border-b border-border">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-gray-500 hover:text-primary mb-4 transition-colors">
            <ChevronLeft size={16} /> <span className="text-xs font-bold uppercase tracking-widest">Go Back</span>
          </button>
          <h2 className="text-xl font-bold text-secondary mb-2">{project.title}</h2>
          <Badge variant={project.status === 'Completed' ? 'success' : 'primary'} className="mb-4">{project.status}</Badge>
          <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full bg-primary border-2 border-white flex items-center justify-center text-[10px] font-bold text-white">
              {project.client?.firstName?.[0] || 'C'}
            </div>
            {project.assignedTo && (
              <div className="w-8 h-8 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center text-[10px] font-bold text-white">
                {project.assignedTo.firstName?.[0] || 'P'}
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <section>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Project Summary</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              {project.description || 'No description provided for this project.'}
            </p>
          </section>

          <section>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Budget & Deadline</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <DollarSign size={16} className="text-green-500" />
                <span className="text-sm font-bold text-secondary">${project.budget?.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={16} className="text-primary" />
                <span className="text-sm font-semibold text-gray-600">{new Date(project.deadline).toLocaleDateString()}</span>
              </div>
            </div>
          </section>

          <section>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Required Skills</h4>
            <div className="flex flex-wrap gap-2">
              {project.skills?.map((skill, i) => (
                <Badge key={i} variant="neutral" className="text-[10px]">{skill}</Badge>
              ))}
            </div>
          </section>
        </div>

        <div className="p-6 border-t border-border">
          <Button variant="outline" className="w-full text-xs py-2 flex items-center gap-2">
            <Settings size={14} /> Project Settings
          </Button>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <main className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center justify-between px-8 py-4 border-b border-border bg-white z-20">
          <div className="flex gap-8">
            <TabButton active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} label="Workspace Chat" />
            <TabButton active={activeTab === 'files'} onClick={() => setActiveTab('files')} label="Project Files" />
            <TabButton active={activeTab === 'contract'} onClick={() => setActiveTab('contract')} label="Contract & Payments" />
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="success" className="bg-green-50 text-green-600 border-green-100 flex items-center gap-1">
              <CheckCircle size={12} /> AI-Secured Transaction
            </Badge>
            <Button size="sm">Submit Milestone</Button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {activeTab === 'chat' ? (
            <div className="flex-1 flex flex-col bg-white">
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-8 space-y-6">
                <div className="flex justify-center my-8 text-center">
                  <div>
                    <div className="bg-gray-100 px-4 py-1 rounded-full text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                      Secure Workspace Initialized
                    </div>
                    <p className="text-xs text-gray-400">All messages are encrypted and monitored by SkillScrumpt AI.</p>
                  </div>
                </div>
                
                <ChatMessage 
                  user={`${project.client?.firstName || 'Client'} (Client)`} 
                  time="Recently" 
                  message={`Welcome to the workspace for "${project.title}". I'm looking forward to working with you!`}
                  isClient
                />
              </div>

              {/* Chat Input */}
              <div className="p-6 border-t border-border">
                <div className="max-w-4xl mx-auto relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <button className="text-gray-400 hover:text-primary transition-colors">
                      <Paperclip size={20} />
                    </button>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Type your message..." 
                    className="w-full pl-14 pr-16 py-4 bg-gray-50 border border-gray-200 rounded-custom outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-medium"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <button className="p-2 bg-primary text-white rounded-custom hover:opacity-90 active:scale-95 transition-all">
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 p-8 bg-[#f8f9fb] flex items-center justify-center text-gray-400 font-bold uppercase tracking-widest">
              Section under development
            </div>
          )}

          <aside className="w-72 border-l border-border bg-white hidden lg:flex flex-col">
            <div className="p-6">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 text-center">Project Activity</h4>
              <div className="space-y-6">
                <ActivityItem user="System" action="Project workspace created" time="Just now" icon={Shield} color="text-primary" />
                <ActivityItem user={project.client?.firstName || 'Client'} action="is online" time="Now" icon={Eye} />
              </div>
            </div>
          </aside>
        </div>
      </main>
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

function TabButton({ active, onClick, label }) {
  return (
    <button 
      onClick={onClick}
      className={`py-4 text-sm font-bold tracking-tight border-b-2 transition-all ${
        active ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-secondary'
      }`}
    >
      {label}
    </button>
  );
}

function ChatMessage({ user, time, message, isClient = false }) {
  return (
    <div className={`flex gap-4 ${isClient ? '' : 'flex-row-reverse text-right'}`}>
      <div className={`flex-shrink-0 w-10 h-10 rounded-custom flex items-center justify-center font-bold text-white ${
        isClient ? 'bg-blue-600' : 'bg-primary'
      }`}>
        {user[0]}
      </div>
      <div className="max-w-lg">
        <div className={`flex items-center gap-2 mb-1 ${isClient ? '' : 'justify-end'}`}>
          <span className="text-sm font-bold text-secondary">{user}</span>
          <span className="text-[10px] text-gray-400 font-bold">{time}</span>
        </div>
        <div className={`p-4 rounded-custom text-sm leading-relaxed ${
          isClient ? 'bg-gray-100 text-secondary rounded-tl-none' : 'bg-primary text-white rounded-tr-none'
        }`}>
          {message}
        </div>
      </div>
    </div>
  );
}

function ActivityItem({ user, action, time, icon: Icon, color = 'text-gray-400' }) {
  return (
    <div className="flex gap-3">
      <div className={`flex-shrink-0 mt-1 ${color}`}>
        <Icon size={14} />
      </div>
      <div>
        <p className="text-[11px] text-gray-600 font-medium">
          <span className="font-bold text-secondary">{user}</span> {action}
        </p>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{time}</p>
      </div>
    </div>
  );
}
