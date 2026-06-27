const fs = require('fs');
const path = require('path');

const appJsxPath = path.join(__dirname, 'src', 'App.jsx');
let code = fs.readFileSync(appJsxPath, 'utf8');

// Import NotificationsPage if not imported
if (!code.includes("import { NotificationsPage }")) {
  code = code.replace(
    "import { MaintenancePage } from './pages/MaintenancePage';",
    "import { MaintenancePage } from './pages/MaintenancePage';\nimport { NotificationsPage } from './pages/NotificationsPage';"
  );
}

// Add route if not added
if (!code.includes('<Route path="/notifications"')) {
  const target = '<Route path="/post-project"';
  const newRoute = `<Route path="/notifications" element={
            <ProtectedRoute>
              <PageWrapper>
                <NotificationsPage />
              </PageWrapper>
            </ProtectedRoute>
          } />
          <Route path="/post-project"`;
          
  code = code.replace(target, newRoute);
}

fs.writeFileSync(appJsxPath, code);
console.log('Added /notifications route to App.jsx');
