import React from 'react';
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
  Eye
} from 'lucide-react';
import { Card, Badge, Button, GlassContainer } from '../components/UI';
import { Link } from 'react-router-dom';

export function ProjectWorkspace() {
  const [activeTab, setActiveTab] = React.useState('chat');

  return (
    <div className="flex h-screen bg-white overflow-hidden pt-16">
      {/* Side Details Panel */}
      <aside className="w-80 border-r border-border bg-[#fbf9f8] hidden xl:flex flex-col">
        <div className="p-6 border-b border-border">
          <Link to="/dashboard" className="flex items-center gap-1 text-gray-500 hover:text-primary mb-4 transition-colors">
            <ChevronLeft size={16} /> <span className="text-xs font-bold uppercase tracking-widest">Back to Projects</span>
          </Link>
          <h2 className="text-xl font-bold text-secondary mb-2">E-commerce Rebrand</h2>
          <Badge variant="primary" className="mb-4">In Progress</Badge>
          <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full bg-primary border-2 border-white flex items-center justify-center text-[10px] font-bold text-white">AR</div>
            <div className="w-8 h-8 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center text-[10px] font-bold text-white">SC</div>
            <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-gray-500">+2</div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <section>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Project Summary</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              Complete overhaul of the existing Stripe checkout experience with a focus on mobile conversion and local payment methods.
            </p>
          </section>

          <section>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Milestones</h4>
            <div className="space-y-4">
              <MilestoneItem title="Initial Research" completed />
              <MilestoneItem title="UX Wireframes" completed />
              <MilestoneItem title="Visual Design" active />
              <MilestoneItem title="Prototyping" />
            </div>
          </section>

          <section>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Shared Assets</h4>
            <div className="space-y-2">
              <AssetItem name="Brand_Guidelines.pdf" size="2.4 MB" />
              <AssetItem name="Wireframes_v2.fig" size="18.5 MB" />
              <AssetItem name="Assets_Export.zip" size="45.0 MB" />
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
        {/* Workspace Header/Tabs */}
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
                <ChatMessage 
                  user="Sarah Connor (Client)" 
                  time="10:24 AM" 
                  message="Hey Alex, the latest wireframes look great. I particularly liked how you handled the multi-currency selection."
                  isClient
                />
                <ChatMessage 
                  user="Alex Rivera (You)" 
                  time="10:45 AM" 
                  message="Thanks Sarah! I've started on the high-fidelity mockups today. I'll have the first batch ready for review by end of day."
                />
                <div className="flex justify-center my-8">
                  <div className="bg-gray-100 px-4 py-1 rounded-full text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Today
                  </div>
                </div>
                <ChatMessage 
                  user="Sarah Connor (Client)" 
                  time="11:02 AM" 
                  message="Perfect. Could you also ensure the contrast ratio on the buttons meets WCAG standards? We want this to be fully accessible."
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
                    placeholder="Type your message or use / to run commands..." 
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

          {/* Activity/Notification Panel (Hidden on smaller screens) */}
          <aside className="w-72 border-l border-border bg-white hidden lg:flex flex-col">
            <div className="p-6">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 text-center">Live Activity Feed</h4>
              <div className="space-y-6">
                <ActivityItem user="Sarah Connor" action="viewed the project" time="2 mins ago" icon={Eye} />
                <ActivityItem user="Alex Rivera" action="uploaded Design_v2.fig" time="45 mins ago" icon={Paperclip} />
                <ActivityItem user="System" action="Milestone 2 payment secured" time="2 hours ago" icon={Shield} color="text-primary" />
                <ActivityItem user="Alex Rivera" action="marked 'UX Wireframes' as complete" time="3 hours ago" icon={CheckCircle} color="text-green-500" />
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
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

function MilestoneItem({ title, completed = false, active = false }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
        completed ? 'bg-primary border-primary text-white' : active ? 'border-primary text-primary' : 'border-gray-300'
      }`}>
        {completed && <CheckCircle size={12} />}
        {active && <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />}
      </div>
      <span className={`text-sm font-semibold ${completed ? 'text-gray-400 line-through' : active ? 'text-secondary' : 'text-gray-500'}`}>
        {title}
      </span>
    </div>
  );
}

function AssetItem({ name, size }) {
  return (
    <div className="flex items-center justify-between p-3 bg-white border border-border rounded-custom hover:border-primary transition-colors cursor-pointer group">
      <div className="flex items-center gap-3">
        <FileText size={16} className="text-gray-400 group-hover:text-primary" />
        <div>
          <p className="text-xs font-bold text-secondary truncate w-32">{name}</p>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest">{size}</p>
        </div>
      </div>
      <Download size={14} className="text-gray-300 group-hover:text-primary" />
    </div>
  );
}

function ChatMessage({ user, time, message, isClient = false }) {
  return (
    <div className={`flex gap-4 ${isClient ? '' : 'flex-row-reverse text-right'}`}>
      <div className={`flex-shrink-0 w-10 h-10 rounded-custom flex items-center justify-center font-bold text-white ${
        isClient ? 'bg-blue-600' : 'bg-primary'
      }`}>
        {user.split(' ')[0][0]}
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
