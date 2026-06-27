import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  MapPin, 
  Globe, 
  CheckCircle, 
  Star, 
  Zap, 
  BadgeCheck,
  Award,
  Twitter,
  Code,
  Linkedin,
  MessageSquare
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { DashboardLayout } from '../layout/DashboardLayout';

export function StudentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const currentUserStr = localStorage.getItem('user');
  const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const [profileRes, reviewsRes] = await Promise.all([
          api.get(`/users/profile/${id}`),
          api.get(`/reviews/user/${id}`)
        ]);
        setProfile(profileRes.data);
        setReviews(reviewsRes.data);
      } catch (err) {
        console.error('Error fetching profile and reviews:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (isLoading) {
    return (
      <DashboardLayout user={currentUser}>
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-[#38BDF8] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-bold text-[#1E293B]/40 uppercase tracking-wider text-[10px]">Synchronizing Profile Data...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!profile) {
    return (
      <DashboardLayout user={currentUser}>
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
          <div className="w-16 h-16 bg-[#F97316]/10 text-[#F97316] rounded-[16px] flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Shield size={32} />
          </div>
          <p className="font-bold text-[#1E293B] text-2xl tracking-tight mb-2">Identity Not Found</p>
          <p className="text-[#1E293B]/60 text-sm font-medium mb-8">The requested profile signature could not be verified in the vault.</p>
          <button onClick={() => navigate(-1)} className="px-6 py-2.5 bg-white border border-[#38BDF8]/20 rounded-[12px] text-[#1E293B] text-sm font-bold shadow-sm hover:bg-[#E0F2FE]/50 transition-all">Return to Previous Node</button>
        </div>
      </DashboardLayout>
    );
  }

  const isOwnProfile = currentUser && (currentUser._id === id || currentUser.id === id);

  const content = (
    <div className="flex-1 overflow-y-auto custom-scrollbar font-sans w-full h-full relative">
      {/* Profile Header */}
      <div className="bg-[#1E293B] text-white pt-16 pb-28 relative shrink-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#38BDF8] opacity-10 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none" />
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row gap-10 items-center md:items-start">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative shrink-0">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-[24px] border-4 border-white/10 overflow-hidden shadow-2xl flex items-center justify-center text-4xl font-bold text-[#1E293B]/40 bg-white relative z-10">
                {profile.avatar ? <img src={profile.avatar} alt="avatar" className="w-full h-full object-cover" /> : profile.firstName?.[0]}
              </div>
              {profile.isVerified && (
                <div className="absolute -bottom-4 -right-4 bg-[#F97316] text-white p-2.5 rounded-[12px] shadow-lg border-4 border-[#1E293B] z-20">
                  <Shield size={20} />
                </div>
              )}
            </motion.div>
            
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                <h1 className="text-4xl lg:text-5xl font-bold tracking-tight flex items-center justify-center md:justify-start gap-3">
                  {profile.firstName} {profile.lastName} {profile.isVerified && <BadgeCheck size={32} className="text-[#38BDF8] drop-shadow-sm" />}
                  {profile.isPro && (
                    <span className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-amber-400 to-amber-600 text-white text-[10px] font-bold rounded-[8px] shadow-md ml-2 uppercase tracking-wider">
                      <Zap size={14} fill="currentColor" /> PRO
                    </span>
                  )}
                </h1>
                {profile.role === 'professional' && <span className="bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/30 px-3 py-1.5 rounded-[8px] text-[10px] uppercase tracking-wider font-bold">Professional</span>}
                {profile.role === 'client' && <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-[8px] text-[10px] uppercase tracking-wider font-bold">Client</span>}
              </div>
              <p className="text-xl text-white/60 mb-6 font-medium">
                {profile.role === 'professional' ? (profile.skills?.[0] || 'Technical Expert') : 'Client'}
              </p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-6 text-[11px] font-bold text-white/50 uppercase tracking-wider">
                {profile.location && <span className="flex items-center gap-2"><MapPin size={16} className="text-[#38BDF8]" /> {profile.location}</span>}
                {profile.timezone && <span className="flex items-center gap-2"><Globe size={16} className="text-[#38BDF8]" /> {profile.timezone}</span>}
                <span className="flex items-center gap-1.5 text-[#F97316]">
                  <Star size={16} className="fill-[#F97316]" /> {profile.rating ? profile.rating.toFixed(1) : '5.0'} ({reviews.length} reviews)
                </span>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-3 w-full md:w-auto mt-6 md:mt-0 shrink-0">
              {isOwnProfile ? (
                <button onClick={() => navigate(currentUser.role === 'professional' ? '/dashboard/student/settings' : '/settings')} className="h-12 px-8 bg-[#F97316] hover:bg-[#EA580C] text-white rounded-[12px] font-bold text-sm shadow-[0_8px_20px_rgba(249,115,22,0.3)] transition-all hover:-translate-y-0.5">Edit Profile</button>
              ) : (
                <>
                  <button onClick={() => navigate('/marketplace')} className="h-12 px-8 bg-[#F97316] hover:bg-[#EA580C] text-white rounded-[12px] font-bold text-sm shadow-[0_8px_20px_rgba(249,115,22,0.3)] transition-all hover:-translate-y-0.5">Hire for Project</button>
                  <button onClick={() => navigate('/marketplace/gigs')} className="h-12 px-8 border border-white/20 text-white rounded-[12px] font-bold text-sm hover:bg-white/10 transition-all">Browse Services</button>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8 -mt-12 relative z-20 pb-20">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Stats & Skills */}
          <div className="space-y-8 shrink-0">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-[24px] p-8 border border-[#38BDF8]/10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(56,189,248,0.06)] transition-all">
              <h3 className="text-[10px] font-bold text-[#1E293B]/40 uppercase tracking-wider mb-6">AI Skill Score</h3>
              <div className="text-center py-6 bg-[#E0F2FE]/30 rounded-[16px] mb-8 border border-[#38BDF8]/10">
                <div className="text-5xl font-bold text-[#38BDF8] tracking-tight mb-2">{profile.aiScore || 0}</div>
                <p className="text-[10px] font-bold text-[#1E293B]/50 uppercase tracking-wider">
                  {profile.aiScore > 500 ? 'Top 1% of Platform' : profile.aiScore > 200 ? 'Expert Tier' : 'Growing Talent'}
                </p>
              </div>
              <div className="space-y-5">
                {profile.skills && profile.skills.length > 0 ? profile.skills.map((skill, idx) => (
                  <SkillProgress key={idx} label={skill} value={profile.aiScore > 0 ? Math.min(100, Math.floor(profile.aiScore / 10)) : 75} />
                )) : (
                  <>
                    <SkillProgress label="Core Competency" value={75} />
                    <SkillProgress label="Session Integrity" value={98} />
                  </>
                )}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-[24px] p-8 border border-[#38BDF8]/10 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
              <h3 className="text-[10px] font-bold text-[#1E293B]/40 uppercase tracking-wider mb-6">Verified Badges</h3>
              <div className="grid grid-cols-3 gap-4">
                {profile.badges && profile.badges.length > 0 ? profile.badges.map((badge, idx) => (
                  <div key={idx} title={badge.name} className="aspect-square bg-[#E0F2FE] rounded-[16px] flex flex-col items-center justify-center text-[#38BDF8] group cursor-pointer hover:bg-[#38BDF8] hover:text-white hover:shadow-[0_8px_20px_rgba(56,189,248,0.2)] transition-all p-2 text-center">
                    <Award size={24} className="group-hover:scale-110 transition-transform mb-2" />
                    <span className="text-[10px] font-bold uppercase tracking-widest truncate w-full">{badge.name}</span>
                  </div>
                )) : (
                  <div className="col-span-3 py-8 text-center text-[#1E293B]/40 text-[11px] font-bold uppercase tracking-wider bg-[#FFF0E5]/50 rounded-[16px] border border-[#F97316]/10">No verified badges yet.</div>
                )}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-[24px] p-8 border border-[#38BDF8]/10 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
              <h3 className="text-[10px] font-bold text-[#1E293B]/40 uppercase tracking-wider mb-6">Connect</h3>
              <div className="space-y-3">
                {profile.website && <SocialLink icon={Code} label="Portfolio" handle={new URL(profile.website).hostname.replace('www.', '')} href={profile.website} />}
                {profile.socialLinks?.linkedin && <SocialLink icon={Linkedin} label="LinkedIn" handle="View Profile" href={profile.socialLinks.linkedin} />}
                {profile.socialLinks?.github && <SocialLink icon={Code} label="GitHub" handle="View Profile" href={profile.socialLinks.github} />}
                {profile.socialLinks?.twitter && <SocialLink icon={Twitter} label="Twitter" handle="View Profile" href={profile.socialLinks.twitter} />}
                {(!profile.website && !profile.socialLinks?.linkedin && !profile.socialLinks?.github && !profile.socialLinks?.twitter) && (
                  <p className="text-[11px] font-bold text-[#1E293B]/40 uppercase tracking-wider text-center py-4 bg-slate-50 rounded-[12px]">No external links provided.</p>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Column: Bio & Portfolio */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-[24px] p-8 md:p-10 border border-[#38BDF8]/10 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
              <h3 className="text-2xl font-bold tracking-tight text-[#1E293B] mb-6">Professional Bio</h3>
              <p className="text-[#1E293B]/70 leading-relaxed font-medium whitespace-pre-wrap text-[15px]">
                {profile.bio || "No professional bio provided yet."}
              </p>
            </motion.div>

            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <h3 className="text-2xl font-bold tracking-tight text-[#1E293B] mb-6 px-2">Featured Work</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {profile.portfolio && profile.portfolio.length > 0 ? profile.portfolio.map((project, idx) => (
                  <PortfolioCard 
                    key={idx}
                    title={project.title} 
                    desc={project.description}
                    tech={project.techStack || []}
                    codeLink={project.codeLink}
                    liveLink={project.liveLink}
                  />
                )) : (
                  <div className="col-span-2 py-16 text-center bg-white border border-[#38BDF8]/10 rounded-[24px] shadow-sm">
                    <div className="w-16 h-16 bg-[#E0F2FE] text-[#38BDF8] rounded-full flex items-center justify-center mx-auto mb-4">
                      <Code size={24} />
                    </div>
                    <p className="text-[#1E293B]/40 font-bold text-[10px] uppercase tracking-wider">No portfolio items published yet.</p>
                  </div>
                )}
              </div>
            </motion.section>

            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <h3 className="text-2xl font-bold tracking-tight text-[#1E293B] mb-6 px-2">Client Testimonials</h3>
              <div className="space-y-4">
                {reviews.length > 0 ? reviews.map((review, idx) => (
                  <TestimonialCard 
                    key={idx}
                    client={`${review.from?.firstName || 'Client'} ${review.from?.lastName || ''}`}
                    company={review.reviewType === 'client_to_professional' ? 'Client Partner' : 'Contract Operative'} 
                    text={review.comment}
                    rating={review.rating}
                  />
                )) : (
                  <div className="py-16 text-center bg-white border border-[#38BDF8]/10 rounded-[24px] shadow-sm">
                    <div className="w-16 h-16 bg-[#FFF0E5] text-[#F97316] rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageSquare size={24} />
                    </div>
                    <p className="text-[#1E293B]/40 font-bold text-[10px] uppercase tracking-wider">No reviews received yet.</p>
                  </div>
                )}
              </div>
            </motion.section>
          </div>
        </div>
      </div>
    </div>
  );

  if (currentUser) {
    return <DashboardLayout user={currentUser}>{content}</DashboardLayout>;
  }
  
  return (
    <div className="h-screen w-full bg-[#FFF0E5] overflow-hidden flex flex-col">
      {content}
    </div>
  );
}

function SkillProgress({ label, value }) {
  return (
    <div>
      <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider mb-2 text-[#1E293B]/50">
        <span>{label}</span>
        <span className="text-[#38BDF8]">{value}%</span>
      </div>
      <div className="w-full bg-[#1E293B]/5 h-2 rounded-full overflow-hidden">
        <div className="bg-[#38BDF8] h-full transition-all duration-1000 shadow-[0_0_8px_rgba(56,189,248,0.5)]" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function SocialLink({ icon: Icon, label, handle, href }) {
  return (
    <a href={href || "#"} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-white border border-[#38BDF8]/10 rounded-[12px] hover:border-[#38BDF8]/30 hover:bg-[#E0F2FE]/30 group transition-all">
      <div className="flex items-center gap-3">
        <div className="text-[#1E293B]/40 group-hover:text-[#38BDF8] transition-colors bg-[#1E293B]/5 p-2 rounded-[8px] group-hover:bg-white group-hover:shadow-sm">
          <Icon size={16} />
        </div>
        <span className="text-sm font-bold text-[#1E293B] group-hover:text-[#38BDF8] transition-colors">{label}</span>
      </div>
      <span className="text-[10px] font-bold text-[#1E293B]/30 uppercase tracking-wider group-hover:text-[#38BDF8]/60 transition-colors">{handle}</span>
    </a>
  );
}

function PortfolioCard({ title, desc, tech = [], codeLink, liveLink }) {
  return (
    <div className="p-6 bg-white border border-[#38BDF8]/10 rounded-[24px] shadow-sm hover:shadow-[0_12px_30px_rgba(56,189,248,0.08)] hover:-translate-y-1 hover:border-[#38BDF8]/30 transition-all group flex flex-col justify-between h-[340px]">
      <div>
        <div className="h-32 bg-[#1E293B] rounded-[16px] mb-6 overflow-hidden relative flex items-center justify-center text-white/20 font-bold tracking-widest text-[10px] uppercase bg-gradient-to-br from-[#1E293B] to-[#0F172A]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#38BDF8] opacity-10 rounded-full blur-[30px] translate-x-1/2 -translate-y-1/2" />
          PRO_PROJECT
        </div>
        <h4 className="font-bold text-lg mb-2 text-[#1E293B] group-hover:text-[#38BDF8] transition-colors tracking-tight line-clamp-1">{title}</h4>
        <p className="text-[13px] text-[#1E293B]/60 font-medium leading-relaxed mb-4 line-clamp-2">{desc}</p>
      </div>
      <div className="mt-auto">
        <div className="flex flex-wrap gap-2 mb-5">
          {tech.map((t, i) => (
            <span key={i} className="text-[10px] px-2.5 py-1 uppercase tracking-wider font-bold bg-[#1E293B]/5 text-[#1E293B]/60 rounded-[6px] border border-[#1E293B]/10">{t}</span>
          ))}
        </div>
        <div className="flex gap-4 text-[10px] font-bold text-[#F97316] uppercase tracking-wider pt-4 border-t border-[#38BDF8]/10">
          {codeLink && <a href={codeLink} target="_blank" rel="noopener noreferrer" className="hover:text-[#EA580C] transition-colors flex items-center gap-1.5"><Code size={12} /> Source</a>}
          {liveLink && <a href={liveLink} target="_blank" rel="noopener noreferrer" className="hover:text-[#EA580C] transition-colors flex items-center gap-1.5"><Zap size={12} fill="currentColor" /> Demo</a>}
        </div>
      </div>
    </div>
  );
}

function TestimonialCard({ client, company, text, rating = 5 }) {
  return (
    <div className="p-8 bg-white border border-[#38BDF8]/10 rounded-[24px] shadow-sm hover:shadow-[0_8px_24px_rgba(0,0,0,0.04)] transition-all">
      <div className="flex gap-1 mb-5 text-[#F97316]">
        {Array.from({ length: rating }).map((_, i) => <Star key={i} size={14} className="fill-[#F97316] text-[#F97316]" />)}
      </div>
      <p className="text-[#1E293B]/70 font-medium text-[15px] mb-6 leading-relaxed italic">"{text}"</p>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-[#E0F2FE] text-[#38BDF8] rounded-[12px] flex items-center justify-center font-bold text-lg shadow-inner">
          {client[0]}
        </div>
        <div>
          <p className="text-sm font-bold text-[#1E293B]">{client}</p>
          <p className="text-[10px] text-[#1E293B]/40 font-bold uppercase tracking-wider mt-0.5">{company}</p>
        </div>
      </div>
    </div>
  );
}
