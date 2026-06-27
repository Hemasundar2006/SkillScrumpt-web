import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';

export function SupportChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState([
    { role: 'assistant', text: 'Hey there! I am the Elite AI Support Assistant for SkillScrumpt. How can I help you dominate your freelancing journey today?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history, isOpen]);

  const handleSend = async () => {
    if (!message.trim()) return;
    const userMsg = { role: 'user', text: message };
    setHistory(prev => [...prev, userMsg]);
    setMessage('');
    setIsLoading(true);

    try {
      const apiKey = import.meta.env.OPENAI_API_KEY || import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.VITE_API_KEY;
      if (!apiKey) throw new Error("Missing OpenAI API Key");

      const msgs = history ? history.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.text
      })) : [];

      msgs.unshift({
        role: "system",
        content: `You are the elite AI Support Assistant for SkillScrumpt (https://skillscrumpt.vercel.app/). Your mission is to provide fast, accurate, and high-energy technical and operational support to users on the platform.

CRITICAL OPERATIONAL RULES:
1. IDENTITY & TONE: You are an expert peer—knowledgeable, direct, and conversational. Keep answers crisp and actionable. Avoid robotic phrases like "As an AI..." or "How can I help you today?". Cut straight to the solution.
2. KNOWLEDGE BASE FIRST: Always check your uploaded vector store/documents first to answer specific questions about SkillScrumpt's features, pricing, or troubleshooting steps. 
3. ACCURACY: If a user asks about a feature or account issue that requires backend database access (like resetting a specific user's token or checking a live payment status), explicitly direct them to open a support ticket or contact the admin. Do not guess or fake data.
4. FORMATTING: Use markdown bolding and bullet points to break down multi-step fixes so they are easy to read on a mobile or web chat widget.

If any questions are irrelevant, don't answer them and say "Ask me about the app".`
      });
      msgs.push({ role: "user", content: userMsg.text });

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: msgs
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "Failed to fetch response");

      setHistory(prev => [...prev, { role: 'assistant', text: data.choices[0].message.content }]);
    } catch (err) {
      console.error(err);
      setHistory(prev => [...prev, { role: 'assistant', text: 'Error connecting to support network. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-orange-500 hover:bg-orange-600 text-white rounded-full flex items-center justify-center shadow-[0_8px_30px_rgba(249,115,22,0.4)] hover:scale-105 transition-transform z-50"
      >
        <MessageSquare size={24} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-[380px] h-[550px] bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 flex flex-col overflow-hidden font-sans"
          >
            {/* Header */}
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center shadow-inner">
                  <Bot size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Elite AI Support</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-[10px] text-slate-300 font-medium uppercase tracking-wider">Online</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4">
              {history.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-orange-500 text-white rounded-tr-sm shadow-sm' 
                      : 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm shadow-sm'
                  }`}>
                    {/* Basic Markdown rendering for bold and bullets */}
                    <div dangerouslySetInnerHTML={{ 
                      __html: msg.text
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\n- (.*?)/g, '<br/>• $1')
                        .replace(/\n/g, '<br/>')
                    }} />
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-sm shadow-sm text-slate-400">
                    <Loader2 size={16} className="animate-spin" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-100 shrink-0">
              <div className="flex items-center gap-2 relative">
                <input 
                  type="text" 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask me anything..." 
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-slate-900"
                />
                <button 
                  onClick={handleSend}
                  disabled={!message.trim() || isLoading}
                  className="absolute right-2 p-1.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
