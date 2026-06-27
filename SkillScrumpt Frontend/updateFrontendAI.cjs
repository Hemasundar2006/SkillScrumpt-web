const fs = require('fs');
const path = require('path');

// Update SupportChat.jsx
const chatPath = path.join(__dirname, 'src', 'components', 'SupportChat.jsx');
let chatCode = fs.readFileSync(chatPath, 'utf8');

const chatOldApiCall = `
    try {
      const res = await api.post('/support/chat', { message: userMsg.text, history });
      setHistory(prev => [...prev, { role: 'assistant', text: res.data.reply }]);
    } catch (err) {
      console.error(err);
      setHistory(prev => [...prev, { role: 'assistant', text: 'Error connecting to support network. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
`;

const chatNewApiCall = `
    try {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.VITE_API_KEY;
      if (!apiKey) throw new Error("Missing OpenAI API Key");

      const msgs = history ? history.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.text
      })) : [];

      msgs.unshift({
        role: "system",
        content: \`You are the elite AI Support Assistant for SkillScrumpt (https://skillscrumpt.vercel.app/). Your mission is to provide fast, accurate, and high-energy technical and operational support to users on the platform.

CRITICAL OPERATIONAL RULES:
1. IDENTITY & TONE: You are an expert peer—knowledgeable, direct, and conversational. Keep answers crisp and actionable. Avoid robotic phrases like "As an AI..." or "How can I help you today?". Cut straight to the solution.
2. KNOWLEDGE BASE FIRST: Always check your uploaded vector store/documents first to answer specific questions about SkillScrumpt's features, pricing, or troubleshooting steps. 
3. ACCURACY: If a user asks about a feature or account issue that requires backend database access (like resetting a specific user's token or checking a live payment status), explicitly direct them to open a support ticket or contact the admin. Do not guess or fake data.
4. FORMATTING: Use markdown bolding and bullet points to break down multi-step fixes so they are easy to read on a mobile or web chat widget.

If any questions are irrelevant, don't answer them and say "Ask me about the app".\`
      });
      msgs.push({ role: "user", content: userMsg.text });

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': \`Bearer \${apiKey}\`
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
`;

chatCode = chatCode.replace(chatOldApiCall.trim(), chatNewApiCall.trim());
fs.writeFileSync(chatPath, chatCode);
console.log('Updated SupportChat.jsx');


// Update ProjectAndPaymentPages.jsx
const projPath = path.join(__dirname, 'src', 'pages', 'ProjectAndPaymentPages.jsx');
let projCode = fs.readFileSync(projPath, 'utf8');

const projOldApiCall = `
   try {
     const response = await api.post('/support/generate-proposal', {
       projectDetails: project,
       userProfile: user
     });
     setCoverLetter(response.data.proposal);
   } catch (error) {
`;

const projNewApiCall = `
   try {
     const apiKey = import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.VITE_API_KEY;
     if (!apiKey) throw new Error("Missing OpenAI API Key");

     const prompt = \`
You are an expert AI proposal writer. 
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

Write ONLY the proposal text. No pleasantries or meta-comments.
\`;

     const response = await fetch('https://api.openai.com/v1/chat/completions', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
         'Authorization': \`Bearer \${apiKey}\`
       },
       body: JSON.stringify({
         model: "gpt-4o-mini",
         messages: [{ role: "user", content: prompt }]
       })
     });

     const data = await response.json();
     if (!response.ok) throw new Error(data.error?.message || "Failed to fetch response");

     setCoverLetter(data.choices[0].message.content);
   } catch (error) {
`;

projCode = projCode.replace(projOldApiCall.trim(), projNewApiCall.trim());
fs.writeFileSync(projPath, projCode);
console.log('Updated ProjectAndPaymentPages.jsx');
