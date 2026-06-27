const fs = require('fs');
const filePath = 'src/App.jsx';
let code = fs.readFileSync(filePath, 'utf8');

if (!code.includes('import NotificationsPage from "./pages/NotificationsPage";')) {
  // Add import
  code = code.replace(
    'import SettingsPage from "./pages/SharedSettingsPage";',
    'import SettingsPage from "./pages/SharedSettingsPage";\nimport NotificationsPage from "./pages/NotificationsPage";'
  );

  // Add route under dashboard (or authenticated routes)
  const routeTarget = '<Route path="/dashboard" element={';
  code = code.replace(
    routeTarget,
    `<Route path="/notifications" element={
            <ProtectedRoute>
              <LayoutWrapper><NotificationsPage /></LayoutWrapper>
            </ProtectedRoute>
          } />\n          <Route path="/dashboard" element={`
  );

  fs.writeFileSync(filePath, code);
  console.log('Added NotificationsPage route to App.jsx.');
} else {
  console.log('Route already exists.');
}
