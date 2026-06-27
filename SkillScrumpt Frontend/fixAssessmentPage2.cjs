const fs = require('fs');
const filePath = 'src/pages/AssessmentsPage.jsx';
let code = fs.readFileSync(filePath, 'utf8');

code = code.split("navigate(`/assessments/setup/${test._id}`)").join("navigate(`/assessments/setup/${test._id || test.id || test.testId}`)");

fs.writeFileSync(filePath, code);
console.log('Fixed AssessmentsPage route correctly!');
