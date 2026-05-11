const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // Use SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 10000, // 10 seconds
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

const sendEmail = async (to, subject, html) => {
  try {
    console.log(`ATTEMPTING_EMAIL_DISPATCH to: ${to} | Subject: ${subject}`);
    const info = await transporter.sendMail({
      from: `"SkillScrumpt" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log('EMAIL_SENT_SUCCESS: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('CRITICAL_MAIL_ERROR:', error);
    if (error.code === 'EAUTH') {
      console.error('AUTH_FAILURE: Check EMAIL_USER and EMAIL_PASS (App Password).');
    }
    throw error;
  }
};

const templates = {
  welcomeStudent: (name) => ({
    subject: 'Welcome to SkillScrumpt - Ready to Validate Your Skills?',
    html: `
      <div style="font-family: sans-serif; padding: 20px; color: #333;">
        <h1 style="color: #4f46e5;">Welcome, ${name}!</h1>
        <p>We're thrilled to have you join SkillScrumpt. Our AI-powered platform is designed to help you prove your expertise to top-tier clients.</p>
        <p>Start by taking an assessment to earn your first <b>Verified Badge</b>.</p>
        <a href="https://skillscrumpt.vercel.app/dashboard/student" style="display: inline-block; padding: 12px 24px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 8px; margin-top: 20px;">Go to Dashboard</a>
      </div>
    `
  }),
  welcomeClient: (name) => ({
    subject: 'Welcome to SkillScrumpt - Find Elite Verified Talent',
    html: `
      <div style="font-family: sans-serif; padding: 20px; color: #333;">
        <h1 style="color: #4f46e5;">Hello, ${name}!</h1>
        <p>Welcome to SkillScrumpt for Business. You now have access to a pool of talent whose skills are verified through rigorous AI proctoring.</p>
        <p>Post your first project and find the perfect match today.</p>
        <a href="https://skillscrumpt.vercel.app/dashboard/client" style="display: inline-block; padding: 12px 24px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 8px; margin-top: 20px;">Post a Project</a>
      </div>
    `
  }),
  assessmentResult: (name, assessmentTitle, score, status, badge) => ({
    subject: `Assessment Result: ${assessmentTitle}`,
    html: `
      <div style="font-family: sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #4f46e5;">Assessment Report</h2>
        <p>Hello ${name}, your results for <b>${assessmentTitle}</b> are ready.</p>
        <div style="padding: 15px; background: #f9fafb; border-radius: 8px; margin: 20px 0;">
          <p><b>Status:</b> <span style="color: ${status === 'passed' ? '#059669' : '#dc2626'}">${status.toUpperCase()}</span></p>
          <p><b>Verified Score:</b> ${score}%</p>
          ${badge ? `<p><b>Earned Badge:</b> ${badge}</p>` : ''}
        </div>
        ${status === 'failed' ? `<p style="color: #dc2626;"><i>Security Note: A 48-hour cooling period is active.</i></p>` : ''}
        <p>View the full audit trail and details on your dashboard.</p>
      </div>
    `
  }),
  forgotPassword: (name, resetLink) => ({
    subject: 'SkillScrumpt Password Reset Request',
    html: `
      <div style="font-family: sans-serif; padding: 20px; color: #333;">
        <h2>Password Reset</h2>
        <p>Hello ${name}, we received a request to reset your password. Click the button below to proceed:</p>
        <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 8px; margin: 20px 0;">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    `
  }),
  desktopHandoff: (testLink) => ({
    subject: 'Complete Your Assessment on Desktop',
    html: `
      <div style="font-family: sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #4f46e5;">Desktop Handoff</h2>
        <p>AI Proctoring requires a desktop environment for full biometric synchronization.</p>
        <p>Click the link below on your computer to start the assessment:</p>
        <a href="${testLink}" style="display: inline-block; padding: 12px 24px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 8px; margin: 20px 0;">Start on Desktop</a>
      </div>
    `
  }),
  proUpgrade: (name) => ({
    subject: 'Welcome to SkillScrumpt Pro - Identity Verified',
    html: `
      <div style="font-family: sans-serif; padding: 20px; color: #333;">
        <h1 style="color: #4f46e5;">Welcome to Elite Status, ${name}!</h1>
        <p>Your account has been upgraded to <b>SkillScrumpt Pro</b>.</p>
        <div style="padding: 15px; background: #eff6ff; border-radius: 8px; margin: 20px 0; border: 1px solid #dbeafe;">
          <ul style="margin: 0; padding-left: 20px; color: #1e40af;">
            <li>Unlimited Verified Badges</li>
            <li>Priority Placement in Client Search</li>
            <li>Zero Brokerage on High-Value Projects</li>
            <li>Exclusive Expert-Only Assessments</li>
          </ul>
        </div>
        <p>Your professional identity is now backed by our AI-Verification protocol.</p>
        <a href="https://skillscrumpt.vercel.app/dashboard/student" style="display: inline-block; padding: 12px 24px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 8px; margin-top: 20px;">Explore Pro Features</a>
      </div>
    `
  })
};

module.exports = { sendEmail, templates };
