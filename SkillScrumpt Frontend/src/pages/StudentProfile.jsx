import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  MapPin, 
  Globe, 
  Mail, 
  CheckCircle, 
  Star, 
  Zap, 
  Briefcase, 
  BadgeCheck,
  Award,
  Link as LinkIcon,
  Twitter,
  Code,
  Linkedin
} from 'lucide-react';
import { Card, Badge, Button, GlassContainer } from '../components/UI';

import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { DashboardLayout } from '../layout/DashboardLayout';

export function StudentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const currentUserStr = localStorage.getItem('user');
  const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(`/users/profile/${id}`);
        setProfile(res.data);
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (isLoading) {
    return (
      <DashboardLayout user={currentUser}>
        <div className="pt-32 pb-24 text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-bold text-slate-500 uppercase tracking-widest text-xs">Synchronizing Profile Data...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!profile) {
    return (
      <DashboardLayout user={currentUser}>
        <div className="pt-32 pb-24 text-center">
          <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Shield size={32} />
          </div>
          <p className="font-bold text-slate-900 text-lg">Identity Not Found</p>
          <p className="text-slate-500 text-sm mt-2">The requested profile signature could not be verified in the vault.</p>
          <Button onClick={() => navigate(-1)} variant="outline" className="mt-8 border-slate-200 text-slate-600">Return to Previous Node</Button>
        </div>
      </DashboardLayout>
    );
  }

  const isOwnProfile = currentUser && (currentUser._id === id || currentUser.id === id);

  const content = (
    <div className="pt-20 bg-[#f8f9fb] pb-24">
      {/* Profile Header */}
      <div className="bg-secondary text-white py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -mr-48 -mt-48" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row gap-10 items-center md:items-start">
            <div className="relative">
              <div className="w-40 h-40 bg-gray-200 rounded-custom border-4 border-white/10 overflow-hidden shadow-2xl flex items-center justify-center text-4xl font-bold text-gray-400 bg-white">
                {profile.avatar ? <img src={profile.avatar} alt="avatar" className="w-full h-full object-cover" /> : profile.firstName?.[0]}
              </div>
              {profile.isVerified && (
                <div className="absolute -bottom-4 -right-4 bg-primary text-white p-2 rounded-custom shadow-lg border-4 border-secondary">
                  <Shield size={24} />
                </div>
              )}
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                <h1 className="text-4xl lg:text-5xl font-bold tracking-tight flex items-center justify-center md:justify-start gap-2">
                  {profile.firstName} {profile.lastName} {profile.isVerified && <BadgeCheck size={32} className="text-primary fill-primary/10" />}
                  {profile.isPro && (
                    <span className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-amber-400 to-amber-600 text-white text-[12px] font-black rounded-full shadow-md ml-4">
                      <Zap size={14} fill="currentColor" /> PRO
                    </span>
                  )}
                </h1>
                {profile.role === 'professional' && <Badge variant="primary" className="bg-primary/20 text-blue-300 border-none px-4 py-1.5 uppercase tracking-widest font-bold">Professional</Badge>}
                {profile.role === 'client' && <Badge variant="primary" className="bg-primary/20 text-emerald-300 border-none px-4 py-1.5 uppercase tracking-widest font-bold">Client</Badge>}
              </div>
              <p className="text-xl text-gray-400 mb-6 font-medium">{profile.role === 'professional' ? (profile.skills?.[0] || 'Professional Talent') : 'Client Account'}</p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm font-bold text-gray-400 uppercase tracking-widest">
                {profile.location && <span className="flex items-center gap-2"><MapPin size={16} /> {profile.location}</span>}
                {profile.timezone && <span className="flex items-center gap-2"><Globe size={16} /> {profile.timezone}</span>}
                {profile.rating && <span className="flex items-center gap-2 text-primary"><Star size={16} className="fill-primary" /> {profile.rating}</span>}
              </div>
            </div>

            <div className="flex flex-col gap-3 w-full md:w-auto mt-6 md:mt-0">
              {isOwnProfile ? (
                <Button onClick={() => navigate(currentUser.role === 'professional' ? '/dashboard/student/settings' : '/settings')} className="h-12 px-8 shadow-primary/20">Edit Profile</Button>
              ) : (
                <>
                  <Button className="h-12 px-8 shadow-primary/20">Hire for Project</Button>
                  <Button variant="outline" className="h-12 px-8 border-white/10 text-white hover:bg-white/5">Send Message</Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 -mt-12 relative z-20">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Stats & Skills */}
          <div className="space-y-8">
            <Card className="p-8 border-none shadow-xl">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">AI Skill Score</h3>
              <div className="text-center py-6 bg-gray-50 rounded-custom mb-6">
                <div className="text-5xl font-black text-primary mb-2">982</div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Top 1% of Platform</p>
              </div>
              <div className="space-y-4">
                <SkillProgress label="Frontend Architecture" value={98} />
                <SkillProgress label="Distributed Systems" value={95} />
                <SkillProgress label="Security & Cryptography" value={92} />
              </div>
            </Card>

            <Card className="p-8 border-none shadow-xl">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Verified Badges</h3>
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="aspect-square bg-primary/5 rounded-custom flex items-center justify-center text-primary group cursor-pointer hover:bg-primary hover:text-white transition-all">
                    <Award size={24} className="group-hover:scale-110 transition-transform" />
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-8 border-none shadow-xl">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Connect</h3>
              <div className="space-y-4">
                {profile.website && <SocialLink icon={Code} label="Portfolio / Website" handle={new URL(profile.website).hostname.replace('www.', '')} href={profile.website} />}
                {profile.socialLinks?.linkedin && <SocialLink icon={Linkedin} label="LinkedIn" handle="View Profile" href={profile.socialLinks.linkedin} />}
                {profile.socialLinks?.github && <SocialLink icon={Code} label="GitHub" handle="View Profile" href={profile.socialLinks.github} />}
                {profile.socialLinks?.twitter && <SocialLink icon={Twitter} label="Twitter" handle="View Profile" href={profile.socialLinks.twitter} />}
                {(!profile.website && !profile.socialLinks?.linkedin && !profile.socialLinks?.github && !profile.socialLinks?.twitter) && (
                  <p className="text-sm font-bold text-gray-400">No external links provided.</p>
                )}
              </div>
            </Card>
          </div>

          {/* Right Column: Bio & Portfolio */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="p-8 border-none shadow-xl">
              <h3 className="text-xl font-bold text-secondary mb-6">Professional Bio</h3>
              <p className="text-gray-600 leading-relaxed mb-6 whitespace-pre-wrap">
                {profile.bio || "No professional bio provided yet."}
              </p>
            </Card>

            <section>
              <h3 className="text-xl font-bold text-secondary mb-6 px-2">Featured Work</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <PortfolioCard 
                  title="Web3 Analytics Engine" 
                  desc="A decentralized data processing engine for real-time blockchain analytics."
                  tech={['Rust', 'React', 'GraphQL']}
                />
                <PortfolioCard 
                  title="Global Payment Gateway" 
                  desc="Optimized checkout experience for cross-border transactions in 50+ currencies."
                  tech={['Node.js', 'Next.js', 'Redis']}
                />
              </div>
            </section>

            <section>
              <h3 className="text-xl font-bold text-secondary mb-6 px-2">Client Testimonials</h3>
              <div className="space-y-4">
                <TestimonialCard 
                  client="Sarah Connor" 
                  company="Stripe" 
                  text="Alex is a rare talent who combines deep technical expertise with a strong product sense. Delivered the rebrand ahead of schedule with flawless execution."
                />
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );

  if (currentUser) {
    return <DashboardLayout user={currentUser}>{content}</DashboardLayout>;
  }
  
  return content;
}

function SkillProgress({ label, value }) {
  return (
    <div>
      <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest mb-1.5 text-gray-500">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
        <div className="bg-primary h-full transition-all duration-1000" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function SocialLink({ icon: Icon, label, handle, href }) {
  return (
    <a href={href || "#"} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 border border-border rounded-custom hover:border-primary group transition-all">
      <div className="flex items-center gap-3">
        <div className="text-gray-400 group-hover:text-primary transition-colors">
          <Icon size={18} />
        </div>
        <span className="text-sm font-bold text-secondary">{label}</span>
      </div>
      <span className="text-xs font-bold text-gray-400 group-hover:text-primary">{handle}</span>
    </a>
  );
}

function PortfolioCard({ title, desc, tech }) {
  return (
    <Card className="p-6 border-none shadow-md hover:shadow-xl transition-all group">
      <div className="aspect-video bg-gray-100 rounded-custom mb-6 overflow-hidden relative">
        <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button variant="outline" size="sm" className="bg-white border-none shadow-lg">View Case Study</Button>
        </div>
      </div>
      <h4 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">{title}</h4>
      <p className="text-xs text-gray-500 leading-relaxed mb-4">{desc}</p>
      <div className="flex gap-2">
        {tech.map((t, i) => (
          <Badge key={i} variant="neutral" className="text-[9px] px-2">{t}</Badge>
        ))}
      </div>
    </Card>
  );
}

function TestimonialCard({ client, company, text }) {
  return (
    <Card className="p-8 border-none shadow-md">
      <div className="flex gap-1 mb-4 text-yellow-400">
        {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} className="fill-yellow-400" />)}
      </div>
      <p className="text-gray-600 italic mb-6 leading-relaxed">"{text}"</p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold">
          {client[0]}
        </div>
        <div>
          <p className="text-sm font-bold text-secondary">{client}</p>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{company}</p>
        </div>
      </div>
    </Card>
  );
}
