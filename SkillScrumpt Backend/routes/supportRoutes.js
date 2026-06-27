const express = require('express');
const router = express.Router();
const OpenAI = require('openai');

router.post('/chat', async (req, res) => {
  try {
    const { message, history } = req.body;
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    
    // Convert frontend history to OpenAI format
    const messages = history ? history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.text
    })) : [];

    messages.unshift({
      role: "system",
      content: \`You are the elite AI Support Assistant for SkillScrumpt (https://skillscrumpt.vercel.app/). Your mission is to provide fast, accurate, and high-energy technical and operational support to users on the platform.

CRITICAL OPERATIONAL RULES:
1. IDENTITY & TONE: You are an expert peer—knowledgeable, direct, and conversational. Keep answers crisp and actionable. Avoid robotic phrases like "As an AI..." or "How can I help you today?". Cut straight to the solution.
2. KNOWLEDGE BASE FIRST: Always check your uploaded vector store/documents first to answer specific questions about SkillScrumpt's features, pricing, or troubleshooting steps. 
3. ACCURACY: If a user asks about a feature or account issue that requires backend database access (like resetting a specific user's token or checking a live payment status), explicitly direct them to open a support ticket or contact the admin. Do not guess or fake data.
4. FORMATTING: Use markdown bolding and bullet points to break down multi-step fixes so they are easy to read on a mobile or web chat widget.

If any questions are irrelevant, don't answer them and say "Ask me about the app".\`
    });

    messages.push({ role: "user", content: message });

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
    });

    res.json({ reply: response.choices[0].message.content });
  } catch (error) {
    console.error("Support Chat Error:", error);
    res.status(500).json({ reply: "Support system is currently experiencing high load. Please try again or contact an admin." });
  }
});


router.post('/generate-proposal', async (req, res) => {
  try {
    const { projectDetails, userProfile } = req.body;
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    
    const prompt = `
You are an expert AI proposal writer. 
Write a concise, highly professional, and compelling project proposal/cover letter (max 150 words).
Focus on highlighting why the freelancer is the perfect fit.

PROJECT DETAILS:
Title: ${projectDetails.title}
Description: ${projectDetails.description}
Required Skills: ${projectDetails.skills?.join(', ') || 'None specified'}

FREELANCER DETAILS:
Name: ${userProfile.firstName} ${userProfile.lastName}
Skills: ${userProfile.skills?.join(', ') || 'General Professional'}
Bio: ${userProfile.bio || ''}

Write ONLY the proposal text. No pleasantries or meta-comments.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    res.json({ proposal: response.choices[0].message.content });
  } catch (error) {
    console.error("Proposal Gen Error:", error);
    res.status(500).json({ message: "Failed to generate proposal" });
  }
});

module.exports = router;

