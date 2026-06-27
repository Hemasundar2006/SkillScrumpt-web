const fs = require('fs');
const filePath = 'src/pages/AssessmentsPage.jsx';
let code = fs.readFileSync(filePath, 'utf8');

code = code.replace(
  /onClick={() => navigate\(\`\/assessments\/setup\/\$\{test\._id\}\`\)}/g,
  "onClick={() => navigate(`/assessments/setup/${test._id || test.id || test.testId}`)}"
);

code = code.replace(
  /key={test\._id}/g,
  "key={test._id || test.id || test.testId}"
);

fs.writeFileSync(filePath, code);
console.log('Fixed AssessmentsPage route!');
