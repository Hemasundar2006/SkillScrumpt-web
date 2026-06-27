const fs = require('fs');
const path = require('path');

// Update SupportChat.jsx
const chatPath = path.join(__dirname, 'src', 'components', 'SupportChat.jsx');
let chatCode = fs.readFileSync(chatPath, 'utf8');

chatCode = chatCode.replace(
  "const apiKey = import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.VITE_API_KEY;",
  "const apiKey = import.meta.env.OPENAI_API_KEY || import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.VITE_API_KEY;"
);
fs.writeFileSync(chatPath, chatCode);

// Update ProjectAndPaymentPages.jsx
const projPath = path.join(__dirname, 'src', 'pages', 'ProjectAndPaymentPages.jsx');
let projCode = fs.readFileSync(projPath, 'utf8');

projCode = projCode.replace(
  "const apiKey = import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.VITE_API_KEY;",
  "const apiKey = import.meta.env.OPENAI_API_KEY || import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.VITE_API_KEY;"
);
fs.writeFileSync(projPath, projCode);

console.log("Updated both files to check for OPENAI_API_KEY");
