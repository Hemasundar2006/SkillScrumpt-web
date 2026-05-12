const { Resend } = require('resend');

// Initialize Resend with the API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

// Reusable function to send emails using Resend
const sendEmail = async (to, subject, html) => {
  try {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('MISSING_MAIL_CREDENTIALS: RESEND_API_KEY not defined in environment.');
    }
    
    console.log(`ATTEMPTING_EMAIL_DISPATCH to: ${to} | Subject: ${subject}`);
    
    // IMPORTANT: If you have a custom domain on Resend (e.g., hello@skillscrumpt.com),
    // set RESEND_FROM_EMAIL in your .env.
    // If not, Resend requires you to use 'onboarding@resend.dev' and you can ONLY 
    // send emails to the email address you used to sign up for Resend.
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

    const { data, error } = await resend.emails.send({
      from: `SkillScrumpt <${fromEmail}>`,
      to: [to], // Resend expects an array
      subject: subject,
      html: html,
    });

    if (error) {
      console.error('RESEND_API_ERROR:', error);
      throw new Error(error.message);
    }

    console.log('EMAIL_SENT_SUCCESS: ID %s', data.id);
    return data;
  } catch (error) {
    console.error('CRITICAL_MAIL_ERROR:', {
      message: error.message
    });
    throw error;
  }
};

const baseLayout = (content) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1f2937; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; }
    .header { text-align: center; padding-bottom: 20px; border-bottom: 1px solid #f3f4f6; }
    .logo { font-size: 24px; font-weight: bold; color: #4f46e5; text-decoration: none; }
    .content { padding: 30px 0; }
    .footer { text-align: center; font-size: 12px; color: #6b7280; padding-top: 20px; border-top: 1px solid #f3f4f6; }
    .button { display: inline-block; padding: 12px 24px; background-color: #4f46e5; color: #ffffff !important; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 20px; }
    .badge { display: inline-block; padding: 4px 12px; background-color: #eff6ff; color: #1e40af; border-radius: 9999px; font-size: 14px; font-weight: 500; }
    .highlight { color: #4f46e5; font-weight: 600; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <a href="https://skillscrumpt.vercel.app" class="logo">SkillScrumpt</a>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} SkillScrumpt. All rights reserved.</p>
      <p>Secure AI-Powered Talent Verification Platform</p>
      <p><a href="https://skillscrumpt.vercel.app/support" style="color: #6b7280;">Support</a> | <a href="https://skillscrumpt.vercel.app/privacy" style="color: #6b7280;">Privacy Policy</a></p>
    </div>
  </div>
</body>
</html>
`;

const templates = {
  welcomeStudent: (name) => ({
    subject: 'Welcome to SkillScrumpt - Your Path to Verification',
    html: baseLayout(`
      <h1>Welcome aboard, ${name}! 🚀</h1>
      <p>We're thrilled to have you join the world's most rigorous AI-verified talent marketplace.</p>
      <p>SkillScrumpt isn't just another freelance platform. Here, your skills are <strong>AI-Proctored</strong> and <strong>Verified</strong>, giving you an elite edge with top-tier clients.</p>
      <p><strong>Next Step:</strong> Take your first assessment to earn your <span class="badge">Verified Badge</span>.</p>
      <center>
        <a href="https://skillscrumpt.vercel.app/dashboard/student" class="button">Go to Student Dashboard</a>
      </center>
    `)
  }),

  welcomeClient: (name) => ({
    subject: 'Welcome to SkillScrumpt - Access Elite Verified Talent',
    html: baseLayout(`
      <h1>Hello, ${name}! 👋</h1>
      <p>Welcome to SkillScrumpt for Business. You now have direct access to a pool of talent whose skills are verified through our rigorous AI proctoring protocol.</p>
      <p>Stop guessing and start hiring with confidence. Every professional on our platform has passed a monitored assessment to prove their expertise.</p>
      <center>
        <a href="https://skillscrumpt.vercel.app/dashboard/client" class="button">Post Your First Project</a>
      </center>
    `)
  }),

  assessmentResult: (name, assessmentTitle, score, status, badge) => ({
    subject: `Assessment Report: ${assessmentTitle}`,
    html: baseLayout(`
      <h2>Assessment Report: ${assessmentTitle}</h2>
      <p>Hello ${name}, your AI-proctored assessment results are in.</p>
      <div style="background-color: #f9fafb; padding: 20px; border-radius: 12px; margin: 20px 0;">
        <p><strong>Technical Score:</strong> <span class="highlight">${score}%</span></p>
        <p><strong>Integrity Status:</strong> <span style="color: ${status === 'passed' ? '#059669' : '#dc2626'}; font-weight: bold;">${status.toUpperCase()}</span></p>
        ${badge ? `<p><strong>Earned Badge:</strong> <span class="badge">${badge}</span></p>` : ''}
      </div>
      ${status === 'passed' 
        ? `<p>Congratulations! Your profile has been updated with your new credentials.</p>` 
        : `<p style="color: #dc2626;"><em>Security Note: Due to integrity anomalies or score threshold, a 48-hour cooling period is now active for this assessment.</em></p>`
      }
      <center>
        <a href="https://skillscrumpt.vercel.app/dashboard" class="button">View Full Audit Trail</a>
      </center>
    `)
  }),

  forgotPassword: (name, resetLink) => ({
    subject: 'SkillScrumpt: Password Reset Request',
    html: baseLayout(`
      <h2>Secure Password Reset</h2>
      <p>Hello ${name}, we received a request to reset your password for your SkillScrumpt account.</p>
      <p>Click the secure button below to choose a new password. This link is valid for <strong>1 hour</strong>.</p>
      <center>
        <a href="${resetLink}" class="button">Reset My Password</a>
      </center>
      <p style="font-size: 12px; color: #6b7280; margin-top: 20px;">If you didn't request this, you can safely ignore this email. Your password will remain unchanged.</p>
    `)
  }),

  desktopHandoff: (testLink) => ({
    subject: 'Action Required: Complete Your Assessment on Desktop',
    html: baseLayout(`
      <h2>Desktop Handoff Required 💻</h2>
      <p>Our AI Proctoring protocol requires a desktop environment to synchronize biometric and screen telemetry.</p>
      <p>Please open the link below on your computer to begin the assessment. <strong>Do not share this link.</strong></p>
      <center>
        <a href="${testLink}" class="button">Start Proctored Session</a>
      </center>
    `)
  }),

  proUpgrade: (name) => ({
    subject: 'Welcome to SkillScrumpt Pro - Identity Verified',
    html: baseLayout(`
      <h1 style="color: #4f46e5;">Welcome to the Elite, ${name}! 💎</h1>
      <p>Your account has been successfully upgraded to <strong>SkillScrumpt Pro</strong>. Your professional identity is now backed by our highest level of AI-Verification.</p>
      <div style="background-color: #eff6ff; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #dbeafe;">
        <h3 style="margin-top: 0; color: #1e40af;">Your Pro Benefits:</h3>
        <ul style="color: #1e40af;">
          <li>Unlimited Verified Badges & Assessments</li>
          <li>Priority Placement in Client Talent Search</li>
          <li>Verified Identity Badge on Public Profile</li>
          <li>Exclusive Access to High-Value Expert Projects</li>
        </ul>
      </div>
      <center>
        <a href="https://skillscrumpt.vercel.app/dashboard/student" class="button">Explore Pro Features</a>
      </center>
    `)
  })
};

module.exports = { sendEmail, templates };
