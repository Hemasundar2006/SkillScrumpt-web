import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Navbar, Footer } from './layout/LayoutItems';
import { LandingPage } from './pages/LandingPage';
import { Login, Register } from './pages/AuthPages';
import { StudentDashboard } from './pages/StudentDashboard';
import { StudentProfile } from './pages/StudentProfile';
import { ClientDashboard } from './pages/ClientDashboard';
import { ProjectWorkspace } from './pages/ProjectWorkspace';
import { AboutPage, PricingPage, ProctoringPage, MarketplacePage } from './pages/InfoPages';
import { AIProctoringInterface } from './pages/ProctoringInterface';
import { AssessmentResult } from './pages/AssessmentResult';
import { PostNewProject, HelpCenter } from './pages/UtilityPages';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import { StudentEarnings } from './pages/EarningsPage';
import { SharedSettingsPage } from './pages/SharedSettingsPage';
import { 
  StudentProjects, 
  StudentSkills 
} from './pages/StudentExperiencePages';
import { 
  ViewBids, 
  SubmitBid,
  ProjectDetails, 
  PaymentCheckout, 
  PeerToPeerCheckout, 
  ConfirmReceipt, 
  NotFoundPage 
} from './pages/ProjectAndPaymentPages';
import { ZeroBrokeragePage } from './pages/ZeroBrokerage';
import { AssessmentsPage } from './pages/AssessmentsPage';
import { AdminDashboard, CreateProctoringTest } from './pages/AdminDashboard';
import { MaintenancePage } from './pages/MaintenancePage';
import { ProctoringSetup } from './pages/ProctoringSetup';
import { MouseTrail } from './components/MouseTrail';

import { Navigate } from 'react-router-dom';

function AppLayout({ children }) {
  const location = useLocation();
  const isDashboardRoute = location.pathname.includes('/dashboard') || 
                           location.pathname.includes('/workspace') || 
                           location.pathname.includes('/assessments');
  // If user is logged in and visits profile, marketplace, or projects, treat it like dashboard
  const userStr = localStorage.getItem('user');
  const isLoggedIn = !!userStr;
  const isDashboard = isDashboardRoute || (isLoggedIn && (
    location.pathname.includes('/profile/') || 
    location.pathname.includes('/marketplace') || 
    location.pathname.includes('/projects') ||
    location.pathname === '/settings' ||
    location.pathname === '/post-project'
  ));
  const isAuth = location.pathname === '/login' || 
                 location.pathname === '/register' || 
                 location.pathname === '/forgot-password' || 
                 location.pathname.includes('/reset-password');
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col">
      {!isDashboard && !isHome && <Navbar />}
      <main className="flex-grow">
        {children}
      </main>
      {!isDashboard && !isAuth && !isHome && <Footer />}
    </div>
  );
}

// Redirects logged in users away from public pages like landing, login, register
function PublicRoute({ children }) {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  
  if (token && userStr) {
    const user = JSON.parse(userStr);
    if (user.role === 'admin') return <Navigate to="/dashboard/admin" replace />;
    if (user.role === 'professional') return <Navigate to="/dashboard/student" replace />;
    return <Navigate to="/dashboard/client" replace />;
  }
  
  return children;
}

// Blocks access to dashboard pages for unauthenticated users
function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  
  if (!token || !userStr) {
    return <Navigate to="/login" replace />;
  }
  
  const user = JSON.parse(userStr);
  if (role && user.role !== role) {
    // If user has wrong role, redirect to their correct dashboard
    if (user.role === 'admin') return <Navigate to="/dashboard/admin" replace />;
    if (user.role === 'professional') return <Navigate to="/dashboard/student" replace />;
    return <Navigate to="/dashboard/client" replace />;
  }
  
  return children;
}

// Redirects to specific role dashboard
function DashboardRedirect() {
  const userStr = localStorage.getItem('user');
  if (!userStr) return <Navigate to="/login" replace />;
  
  const user = JSON.parse(userStr);
  if (user.role === 'admin') return <Navigate to="/dashboard/admin" replace />;
  if (user.role === 'professional') return <Navigate to="/dashboard/student" replace />;
  return <Navigate to="/dashboard/client" replace />;
}

function App() {
  const location = useLocation();

  return (
    <AppLayout>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={
            <PublicRoute>
              <PageWrapper>
                <LandingPage />
              </PageWrapper>
            </PublicRoute>
          } />
          <Route path="/login" element={
            <PublicRoute>
              <PageWrapper>
                <Login />
              </PageWrapper>
            </PublicRoute>
          } />
          <Route path="/register" element={
            <PublicRoute>
              <PageWrapper>
                <Register />
              </PageWrapper>
            </PublicRoute>
          } />
          <Route path="/forgot-password" element={
            <PublicRoute>
              <PageWrapper>
                <ForgotPassword />
              </PageWrapper>
            </PublicRoute>
          } />
          <Route path="/reset-password/:token" element={
            <PublicRoute>
              <PageWrapper>
                <ResetPassword />
              </PageWrapper>
            </PublicRoute>
          } />
          <Route path="/dashboard/student" element={
            <ProtectedRoute role="professional">
              <PageWrapper>
                <StudentDashboard />
              </PageWrapper>
            </ProtectedRoute>
          } />
          <Route path="/profile/:id" element={
            <PageWrapper>
              <StudentProfile />
            </PageWrapper>
          } />
          <Route path="/dashboard/student/earnings" element={
            <ProtectedRoute role="professional">
              <PageWrapper>
                <StudentEarnings />
              </PageWrapper>
            </ProtectedRoute>
          } />
          <Route path="/dashboard/client" element={
            <ProtectedRoute role="client">
              <PageWrapper>
                <ClientDashboard />
              </PageWrapper>
            </ProtectedRoute>
          } />
          <Route path="/workspace/:id" element={
            <ProtectedRoute>
              <PageWrapper>
                <ProjectWorkspace />
              </PageWrapper>
            </ProtectedRoute>
          } />
          <Route path="/about" element={
            <PageWrapper>
              <AboutPage />
            </PageWrapper>
          } />
          <Route path="/pricing" element={
            <PageWrapper>
              <PricingPage />
            </PageWrapper>
          } />
          <Route path="/proctoring" element={
            <PageWrapper>
              <ProctoringPage />
            </PageWrapper>
          } />
          <Route path="/marketplace" element={
            <PageWrapper>
              <MarketplacePage />
            </PageWrapper>
          } />
          <Route path="/settings" element={
            <PageWrapper>
              <SharedSettingsPage />
            </PageWrapper>
          } />
          <Route path="/zero-brokerage" element={
            <PageWrapper>
              <ZeroBrokeragePage />
            </PageWrapper>
          } />
          <Route path="/assessments/live" element={
            <ProtectedRoute role="professional">
              <PageWrapper>
                <AIProctoringInterface />
              </PageWrapper>
            </ProtectedRoute>
          } />
          <Route path="/assessments/result" element={
            <PageWrapper>
              <AssessmentResult />
            </PageWrapper>
          } />
          <Route path="/post-project" element={
            <PageWrapper>
              <PostNewProject />
            </PageWrapper>
          } />
          <Route path="/help" element={
            <PageWrapper>
              <HelpCenter />
            </PageWrapper>
          } />
          
          {/* Student Experience Sub-routes */}
          <Route path="/dashboard/student/projects" element={
            <ProtectedRoute role="professional">
              <PageWrapper>
                <StudentProjects />
              </PageWrapper>
            </ProtectedRoute>
          } />
          <Route path="/dashboard/student/skills" element={
            <ProtectedRoute role="professional">
              <PageWrapper>
                <StudentSkills />
              </PageWrapper>
            </ProtectedRoute>
          } />
          <Route path="/dashboard/student/settings" element={
            <ProtectedRoute role="professional">
              <PageWrapper>
                <SharedSettingsPage />
              </PageWrapper>
            </ProtectedRoute>
          } />
          <Route path="/dashboard/student/assessments" element={
            <ProtectedRoute role="professional">
              <PageWrapper>
                <AssessmentsPage />
              </PageWrapper>
            </ProtectedRoute>
          } />
          <Route path="/assessments/setup/:id" element={
            <ProtectedRoute role="professional">
              <PageWrapper>
                <ProctoringSetup />
              </PageWrapper>
            </ProtectedRoute>
          } />

          {/* Client & Project Management */}
          <Route path="/dashboard/client/bids/:id" element={
            <PageWrapper>
              <ViewBids />
            </PageWrapper>
          } />
          <Route path="/projects/:id" element={
            <PageWrapper>
              <ProjectDetails />
            </PageWrapper>
          } />
          <Route path="/projects/:id/apply" element={
            <PageWrapper>
              <SubmitBid />
            </PageWrapper>
          } />

          {/* Payment Flows */}
          <Route path="/checkout" element={
            <PageWrapper>
              <PaymentCheckout />
            </PageWrapper>
          } />
          <Route path="/checkout/p2p" element={
            <PageWrapper>
              <PeerToPeerCheckout />
            </PageWrapper>
          } />
          <Route path="/checkout/confirm" element={
            <PageWrapper>
              <ConfirmReceipt />
            </PageWrapper>
          } />

          {/* Admin Management */}
          <Route path="/dashboard/admin/*" element={
            <ProtectedRoute role="admin">
              <PageWrapper>
                <AdminDashboard />
              </PageWrapper>
            </ProtectedRoute>
          } />
          <Route path="/dashboard/admin/create-test" element={
            <ProtectedRoute role="admin">
              <PageWrapper>
                <CreateProctoringTest />
              </PageWrapper>
            </ProtectedRoute>
          } />

          <Route path="/maintenance" element={<MaintenancePage />} />

          {/* Fallback to 404 */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardRedirect /></ProtectedRoute>} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AnimatePresence>
    </AppLayout>
  );
}

// Animation wrapper for page transitions
function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

export default App;
