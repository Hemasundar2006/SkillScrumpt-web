const fs = require('fs');
const path = require('path');

const routePath = path.join(__dirname, 'routes', 'supportRoutes.js');
let code = fs.readFileSync(routePath, 'utf8');

const newRoute = `
router.post('/generate-proposal', async (req, res) => {
  try {
    const { projectDetails, userProfile } = req.body;
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    
    const prompt = \`
You are an expert AI proposal writer. 
Write a concise, highly professional, and compelling project proposal/cover letter (max 150 words).
Focus on highlighting why the freelancer is the perfect fit.

PROJECT DETAILS:
Title: \${projectDetails.title}
Description: \${projectDetails.description}
Required Skills: \${projectDetails.skills?.join(', ') || 'None specified'}

FREELANCER DETAILS:
Name: \${userProfile.firstName} \${userProfile.lastName}
Skills: \${userProfile.skills?.join(', ') || 'General Professional'}
Bio: \${userProfile.bio || ''}

Write ONLY the proposal text. No pleasantries or meta-comments.
\`;

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
`;

if (!code.includes('/generate-proposal')) {
  code = code.replace('module.exports = router;', newRoute + '\nmodule.exports = router;\n');
  fs.writeFileSync(routePath, code);
  console.log('Added /generate-proposal route');
} else {
  console.log('Route already exists');
}
