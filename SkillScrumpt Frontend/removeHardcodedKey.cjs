const fs = require('fs');
const path = require('path');

// Remove hardcoded keys from components
const chatPath = path.join(__dirname, 'src', 'components', 'SupportChat.jsx');
let chatCode = fs.readFileSync(chatPath, 'utf8');
chatCode = chatCode.replace(
  /const apiKey = "AQ.Ab8RN6IbHbduQooCoqsCGNf2hheTyQ-UIrQuEaSN7e7w_EjL-Q" \|\| /g,
  'const apiKey = '
);
fs.writeFileSync(chatPath, chatCode);

const projPath = path.join(__dirname, 'src', 'pages', 'ProjectAndPaymentPages.jsx');
let projCode = fs.readFileSync(projPath, 'utf8');
projCode = projCode.replace(
  /const apiKey = "AQ.Ab8RN6IbHbduQooCoqsCGNf2hheTyQ-UIrQuEaSN7e7w_EjL-Q" \|\| /g,
  'const apiKey = '
);
fs.writeFileSync(projPath, projCode);

console.log("Removed hardcoded keys");
