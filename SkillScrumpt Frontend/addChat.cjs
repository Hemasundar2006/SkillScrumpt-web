const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, 'src', 'App.jsx');
let code = fs.readFileSync(appPath, 'utf8');

if (!code.includes("<SupportChat />")) {
  code = code.replace(
    /\{!isDashboard && !isAuth && !isHome && <Footer \/>\}\s*<\/div>/,
    "{!isDashboard && !isAuth && !isHome && <Footer />}\n      <SupportChat />\n    </div>"
  );
  fs.writeFileSync(appPath, code);
  console.log('Added SupportChat to App.jsx');
} else {
  console.log('SupportChat is already in App.jsx');
}
