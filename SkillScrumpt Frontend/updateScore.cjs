const fs = require('fs');
const filePath = 'src/pages/ProctoringInterface.jsx';
let code = fs.readFileSync(filePath, 'utf8');

const targetStr = `const technicalScore = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;`;

const replacementStr = `let technicalScore = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;

  // Apply internal deductions based on proctoring logs/violations (- points)
  if (report && report.violations && report.violations.length > 0) {
    const penalty = report.violations.length * 5; // e.g. -5 marks per violation
    technicalScore = Math.max(0, technicalScore - penalty);
  } else if (report && report.proctoring_score !== undefined && report.proctoring_score < 100) {
    const penalty = 100 - report.proctoring_score;
    technicalScore = Math.max(0, technicalScore - Math.floor(penalty / 2));
  }`;

if (code.includes(targetStr)) {
  code = code.replace(targetStr, replacementStr);
  fs.writeFileSync(filePath, code);
  console.log('Fixed ProctoringInterface.jsx scoring logic!');
} else {
  console.log('Target string not found!');
}
