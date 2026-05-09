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
import { AboutPage, PricingPage } from './pages/InfoPages';
import { AIProctoringInterface } from './pages/ProctoringInterface';
import { AssessmentResult } from './pages/AssessmentResult';
import { PostNewProject, HelpCenter } from './pages/UtilityPages';
import { StudentEarnings } from './pages/EarningsPage';
import { 
  StudentProjects, 
  StudentSkills, 
  StudentSettings, 
  AddAssessment 
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
import { MouseTrail } from './components/MouseTrail';

// Layout wrapper to handle Navbar/Footer visibility
function AppLayout({ children }) {
  const location = useLocation();
  const isDashboard = location.pathname.includes('/dashboard') || location.pathname.includes('/workspace');
  const isAuth = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="min-h-screen flex flex-col">
      {!isDashboard && <Navbar />}
      <main className="flex-grow">
        {children}
      </main>
      {!isDashboard && !isAuth && <Footer />}
    </div>
  );
}

function App() {
  const location = useLocation();

  return (
    <AppLayout>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={
            <PageWrapper>
              <LandingPage />
            </PageWrapper>
          } />
          <Route path="/login" element={
            <PageWrapper>
              <Login />
            </PageWrapper>
          } />
          <Route path="/register" element={
            <PageWrapper>
              <Register />
            </PageWrapper>
          } />
          <Route path="/dashboard/student" element={
            <PageWrapper>
              <StudentDashboard />
            </PageWrapper>
          } />
          <Route path="/profile/:id" element={
            <PageWrapper>
              <StudentProfile />
            </PageWrapper>
          } />
          <Route path="/dashboard/student/earnings" element={
            <PageWrapper>
              <StudentEarnings />
            </PageWrapper>
          } />
          <Route path="/dashboard/client" element={
            <PageWrapper>
              <ClientDashboard />
            </PageWrapper>
          } />
          <Route path="/workspace/:id" element={
            <PageWrapper>
              <ProjectWorkspace />
            </PageWrapper>
          } />
          <Route path="/about" element={
            <PageWrapper>
              <AboutPage />
            </PageWrapper>
          } />
          <Route path="/assessments" element={<PageWrapper><AssessmentsPage /></PageWrapper>} />
          <Route path="/pricing" element={
            <PageWrapper>
              <PricingPage />
            </PageWrapper>
          } />
          <Route path="/zero-brokerage" element={
            <PageWrapper>
              <ZeroBrokeragePage />
            </PageWrapper>
          } />
          <Route path="/assessments/live" element={
            <AIProctoringInterface />
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
            <PageWrapper>
              <StudentProjects />
            </PageWrapper>
          } />
          <Route path="/dashboard/student/skills" element={
            <PageWrapper>
              <StudentSkills />
            </PageWrapper>
          } />
          <Route path="/dashboard/student/settings" element={
            <PageWrapper>
              <StudentSettings />
            </PageWrapper>
          } />
          <Route path="/assessments/add" element={
            <PageWrapper>
              <AddAssessment />
            </PageWrapper>
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

          {/* Fallback to 404 */}
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
