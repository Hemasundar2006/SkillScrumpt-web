const fs = require('fs');
const path = require('path');
const chatPath = path.join(__dirname, 'src', 'components', 'SupportChat.jsx');
let chatCode = fs.readFileSync(chatPath, 'utf8');

const targetStr = `      const contents = history.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));`;

const replaceStr = `      // Filter out the initial greeting so Gemini doesn't reject a conversation starting with 'model'
      const contents = history.slice(1).map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));`;

chatCode = chatCode.replace(targetStr, replaceStr);
fs.writeFileSync(chatPath, chatCode);
console.log('Fixed SupportChat.jsx Gemini history mapping');
