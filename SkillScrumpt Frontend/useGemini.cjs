const fs = require('fs');
const path = require('path');

// Update SupportChat.jsx
const chatPath = path.join(__dirname, 'src', 'components', 'SupportChat.jsx');
let chatCode = fs.readFileSync(chatPath, 'utf8');

const newChatHandleSend = `  const handleSend = async () => {
    if (!message.trim()) return;
    const userMsg = { role: 'user', text: message };
    setHistory(prev => [...prev, userMsg]);
    setMessage('');
    setIsLoading(true);

    try {
      const apiKey = "AQ.Ab8RN6IbHbduQooCoqsCGNf2hheTyQ-UIrQuEaSN7e7w_EjL-Q" || import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.OPENAI_API_KEY;
      
      const systemInstruction = \`You are the elite AI Support Assistant for SkillScrumpt (https://skillscrumpt.vercel.app/). Your mission is to provide fast, accurate, and high-energy technical and operational support to users on the platform.

CRITICAL OPERATIONAL RULES:
1. IDENTITY & TONE: You are an expert peer—knowledgeable, direct, and conversational. Keep answers crisp and actionable. Avoid robotic phrases like "As an AI..." or "How can I help you today?". Cut straight to the solution.
2. KNOWLEDGE BASE FIRST: Always check your uploaded vector store/documents first to answer specific questions about SkillScrumpt's features, pricing, or troubleshooting steps. 
3. ACCURACY: If a user asks about a feature or account issue that requires backend database access (like resetting a specific user's token or checking a live payment status), explicitly direct them to open a support ticket or contact the admin. Do not guess or fake data.
4. FORMATTING: Use markdown bolding and bullet points to break down multi-step fixes so they are easy to read on a mobile or web chat widget.

If any questions are irrelevant, don't answer them and say "Ask me about the app".\`;

      const contents = history.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));
      
      contents.push({ role: 'user', parts: [{ text: userMsg.text }] });

      const response = await fetch(\`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=\${apiKey}\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemInstruction }] },
          contents: contents
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "Failed to fetch Gemini response");

      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm having trouble thinking right now.";
      
      setHistory(prev => [...prev, { role: 'assistant', text: reply }]);
    } catch (err) {
      console.error(err);
      setHistory(prev => [...prev, { role: 'assistant', text: 'Error connecting to support network. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };`;

chatCode = chatCode.replace(/const handleSend = async \(\) => \{[\s\S]*?finally \{\s*setIsLoading\(false\);\s*\}\s*\};\s*(?=\r?\n\s*return \()/m, newChatHandleSend + '\n');
fs.writeFileSync(chatPath, chatCode);
console.log('Updated SupportChat.jsx');


// Update ProjectAndPaymentPages.jsx
const projPath = path.join(__dirname, 'src', 'pages', 'ProjectAndPaymentPages.jsx');
let projCode = fs.readFileSync(projPath, 'utf8');

const newProjHandleGenerate = `  const handleAIGenerate = async () => {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    if (!user) return;
    
    setIsGenerating(true);
    try {
      const apiKey = "AQ.Ab8RN6IbHbduQooCoqsCGNf2hheTyQ-UIrQuEaSN7e7w_EjL-Q" || import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.OPENAI_API_KEY;

      const prompt = \`You are an expert AI proposal writer. 
Write a concise, highly professional, and compelling project proposal/cover letter (max 150 words).
Focus on highlighting why the freelancer is the perfect fit.

PROJECT DETAILS:
Title: \${project.title}
Description: \${project.description}
Required Skills: \${project.skills?.join(', ') || 'None specified'}

FREELANCER DETAILS:
Name: \${user.firstName} \${user.lastName}
Skills: \${user.skills?.join(', ') || 'General Professional'}
Bio: \${user.bio || ''}

Write ONLY the proposal text. No pleasantries or meta-comments.\`;

      const response = await fetch(\`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=\${apiKey}\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }]
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "Failed to generate proposal via Gemini");

      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      setCoverLetter(reply);
    } catch (error) {
      console.error('AI Generation failed', error);
      alert('Failed to generate AI proposal. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };`;

projCode = projCode.replace(/const handleAIGenerate = async \(\) => \{[\s\S]*?finally \{\s*setIsGenerating\(false\);\s*\}\s*\};/m, newProjHandleGenerate);
fs.writeFileSync(projPath, projCode);
console.log('Updated ProjectAndPaymentPages.jsx');
