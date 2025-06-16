import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Shared Components
import Navbar from './components/Navbar';
import RequireRole from './components/RequireRole';
import Footer from './components/Footer';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Profile from './pages/Profile';
import TechSignup from './pages/TechSignup';
import ClientSignup from './pages/ClientSignup';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Settings from './pages/Settings';
import PageNotFound from './pages/PageNotFound';

// Job Pages
import SubmitJob from './pages/SubmitJob';
import JobBoard from './pages/JobBoard';
import JobDetails from './pages/JobDetails';
import JobUpdate from './pages/JobUpdate';
import PartsRequest from './pages/PartsRequest';

// Client Pages
import ClientDashboard from './pages/ClientDashboard';
import MyProperties from './pages/MyProperties';
import MyRequests from './pages/MyRequests';

// Tech Pages
import TechDashboard from './pages/TechDashboard';
import MyJobs from './pages/MyJobs';
import TechProfileSetup from './pages/TechProfileSetup';
import CompleteJob from './pages/CompleteJob';
import TechNotes from './pages/TechNotes';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminJobs from './pages/AdminJobs';
import AdminReviews from './pages/AdminReviews';
import AdminUsers from './pages/AdminUsers';
import AdminPartsRequests from './pages/AdminPartsRequests';
import AdminPartsApproval from './pages/AdminPartsApproval';
import AdminPartInventory from './pages/AdminPartInventory';
import AdminPartsOrders from './pages/AdminPartsOrders';

// System Pages
import PaymentHistory from './pages/PaymentHistory';
import DisputeCenter from './pages/DisputeCenter';
import MaintenanceTips from './pages/MaintenanceTips';
import SystemLogViewer from './pages/SystemLogViewer';
import NotificationsInbox from './pages/NotificationsInbox';
import ReferralSystem from './pages/ReferralSystem';

function App() {
  return (
    <Router>
      <Navbar />
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>

        {/* Public + Core */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/signup/tech" element={<TechSignup />} />
        <Route path="/signup/client" element={<ClientSignup />} />
        <Route path="/submit-job" element={<SubmitJob />} />
        <Route path="/job-board" element={<JobBoard />} />
        <Route path="/job/:id" element={<JobDetails />} />
        <Route path="/job-update/:jobId" element={<JobUpdate />} />
        <Route path="/parts-request/:jobId" element={<PartsRequest />} />
        <Route path="/parts-request" element={<PartsRequest />} />
        <Route path="/notifications" element={<NotificationsInbox />} />
        <Route path="/payment-history" element={<PaymentHistory />} />
        <Route path="/disputes" element={<DisputeCenter />} />
        <Route path="/maintenance-tips" element={<MaintenanceTips />} />
        <Route path="/system-logs" element={<SystemLogViewer />} />
        <Route path="/referrals" element={<ReferralSystem />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/settings" element={<Settings />} />

        {/* Client Views */}
        <Route path="/client-dashboard" element={
          <RequireRole allowedRoles={['client', 'admin']}>
            <ClientDashboard />
          </RequireRole>
        } />
        <Route path="/my-requests" element={
          <RequireRole allowedRoles={['client', 'admin']}>
            <MyRequests />
          </RequireRole>
        } />
        <Route path="/my-properties" element={
          <RequireRole allowedRoles={['client', 'admin']}>
            <MyProperties />
          </RequireRole>
        } />

        {/* Tech Views */}
        <Route path="/tech-dashboard" element={
          <RequireRole allowedRoles={['tech', 'admin']}>
            <TechDashboard />
          </RequireRole>
        } />
        <Route path="/my-jobs" element={
          <RequireRole allowedRoles={['tech', 'admin']}>
            <MyJobs />
          </RequireRole>
        } />
        <Route path="/tech-setup" element={
          <RequireRole allowedRoles={['tech', 'admin']}>
            <TechProfileSetup />
          </RequireRole>
        } />
        <Route path="/complete-job/:jobId" element={
          <RequireRole allowedRoles={['tech', 'admin']}>
            <CompleteJob />
          </RequireRole>
        } />
        <Route path="/tech-notes/:jobId" element={
          <RequireRole allowedRoles={['tech', 'admin']}>
            <TechNotes />
          </RequireRole>
        } />

        {/* Admin Views */}
        <Route path="/admin" element={
          <RequireRole allowedRoles={['admin']}>
            <AdminDashboard />
          </RequireRole>
        } />
        <Route path="/admin/jobs" element={
          <RequireRole allowedRoles={['admin']}>
            <AdminJobs />
          </RequireRole>
        } />
        <Route path="/admin/reviews" element={
          <RequireRole allowedRoles={['admin']}>
            <AdminReviews />
          </RequireRole>
        } />
        <Route path="/admin/users" element={
          <RequireRole allowedRoles={['admin']}>
            <AdminUsers />
          </RequireRole>
        } />
        <Route path="/admin/parts" element={
          <RequireRole allowedRoles={['admin']}>
            <AdminPartsRequests />
          </RequireRole>
        } />
        <Route path="/admin/parts-approval" element={
          <RequireRole allowedRoles={['admin']}>
            <AdminPartsApproval />
          </RequireRole>
        } />
        <Route path="/admin/inventory" element={
          <RequireRole allowedRoles={['admin']}>
            <AdminPartInventory />
          </RequireRole>
        } />
        <Route path="/admin/part-orders" element={
          <RequireRole allowedRoles={['admin']}>
            <AdminPartsOrders />
          </RequireRole>
        } />

        {/* Catch All */}
        <Route path="*" element={<PageNotFound />} />

      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
