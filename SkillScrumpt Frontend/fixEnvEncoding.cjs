const fs = require('fs');
const path = require('path');
const envPath = path.join(__dirname, '.env');
fs.writeFileSync(envPath, 'VITE_API_URL=http://localhost:5000/api/v1\nVITE_GEMINI_API_KEY="AQ.Ab8RN6IbHbduQooCoqsCGNf2hheTyQ-UIrQuEaSN7e7w_EjL-Q"\n', 'utf8');
console.log('Rewrote .env as UTF-8');
