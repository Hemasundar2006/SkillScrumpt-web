const fs = require('fs');
const filePath = 'src/pages/ProctoringInterface.jsx';
// Skip that, let's update assessmentController.js
const backendPath = '../SkillScrumpt Backend/controllers/assessmentController.js';
let code = fs.readFileSync(backendPath, 'utf8');

if (!code.includes('createNotification')) {
  // Add import
  code = code.replace(
    "const { sendEmail, templates } = require('../utils/mailService');",
    "const { sendEmail, templates } = require('../utils/mailService');\nconst { createNotification } = require('./notificationController');"
  );

  // Insert notification creation before res.status(201).json(result);
  const targetCode = '    res.status(201).json(result);\n  } catch (error) {';
  const newCode = `    // Create In-App Notification
    try {
      const notifTitle = status === 'passed' ? 'Assessment Passed' : 'Assessment Failed';
      const notifMsg = status === 'passed' 
        ? \`Congratulations! You passed the assessment with a score of \${finalScore}%\` 
        : \`You failed the assessment with \${finalScore}%. \${proctoringSummary.slice(0, 50)}...\`;
        
      await createNotification(
        req.user._id,
        notifTitle,
        notifMsg,
        'assessment_result',
        '/assessments/result'
      );
    } catch (notifErr) {
      console.error('Error creating notification:', notifErr.message);
    }

    res.status(201).json(result);
  } catch (error) {`;

  code = code.replace(targetCode, newCode);
  fs.writeFileSync(backendPath, code);
  console.log('Added in-app notification creation to assessmentController.');
} else {
  console.log('Already added notification logic.');
}
