import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCircle, Clock, Info, ExternalLink, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

export function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get('/notifications');
      setNotifications(data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => 
        n._id === id ? { ...n, isRead: true } : n
      ));
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/mark-all-read');
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      markAsRead(notification._id);
    }
    if (notification.link) {
      navigate(notification.link);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'assessment_result': return <CheckCircle size={20} className="text-emerald-500" />;
      case 'job_alert': return <Bell size={20} className="text-orange-500" />;
      case 'system': return <Info size={20} className="text-sky-500" />;
      default: return <Clock size={20} className="text-slate-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-24 px-6 relative z-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase mb-2">Notifications.</h1>
            <p className="text-slate-500 font-medium">Your latest updates and alerts.</p>
          </div>
          {notifications.some(n => !n.isRead) && (
            <button 
              onClick={markAllAsRead}
              className="text-xs font-bold uppercase tracking-wider text-sky-600 hover:text-sky-700 transition-colors flex items-center gap-2"
            >
              <CheckCircle2 size={16} /> Mark all as read
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-[#F97316] rounded-full animate-spin"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-white rounded-[2rem] p-16 text-center border border-slate-100 shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-slate-400">
              <Bell size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">All Caught Up!</h3>
            <p className="text-slate-500">You have no new notifications right now.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {notifications.map((notification) => (
                <motion.div
                  key={notification._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onClick={() => handleNotificationClick(notification)}
                  className={`bg-white p-6 rounded-[1.5rem] border transition-all cursor-pointer group flex items-start gap-6 ${notification.isRead ? 'border-slate-100 opacity-70 hover:opacity-100' : 'border-sky-200 shadow-md hover:shadow-lg relative overflow-hidden'}`}
                >
                  {!notification.isRead && (
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-sky-500" />
                  )}
                  
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${notification.isRead ? 'bg-slate-50' : 'bg-sky-50'}`}>
                    {getIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className={`text-base font-bold ${notification.isRead ? 'text-slate-700' : 'text-slate-900'}`}>
                        {notification.title}
                      </h4>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-4 shrink-0">
                        {new Date(notification.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed mb-3">
                      {notification.message}
                    </p>
                    
                    {notification.link && (
                      <span className="inline-flex items-center gap-2 text-xs font-bold text-[#F97316] uppercase tracking-wider group-hover:text-orange-600 transition-colors">
                        View Details <ExternalLink size={12} />
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
