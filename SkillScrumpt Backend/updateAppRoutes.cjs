const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, 'app.js');
let code = fs.readFileSync(appPath, 'utf8');

if (!code.includes("require('./routes/supportRoutes')")) {
  code = code.replace(
    "const notificationRoutes = require('./routes/notificationRoutes');",
    "const notificationRoutes = require('./routes/notificationRoutes');\nconst supportRoutes = require('./routes/supportRoutes');"
  );
  
  code = code.replace(
    "app.use('/api/v1/notifications', notificationRoutes);",
    "app.use('/api/v1/notifications', notificationRoutes);\napp.use('/api/v1/support', supportRoutes);"
  );
  
  fs.writeFileSync(appPath, code);
  console.log('Added support routes to app.js');
}
