// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import RequireRole from './components/RequireRole';
import { useUser } from './components/AuthProvider';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import TechSignup from './pages/TechSignup';
import ClientSignup from './pages/ClientSignup';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Settings from './pages/Settings';
import PageNotFound from './pages/PageNotFound';
import RequestRegion from './pages/RequestRegion';
import ResetPassword from './pages/ResetPassword';
import AuthRedirectHandler from './pages/AuthRedirectHandler';

import SubmitJob from './pages/SubmitJob';
import JobBoard from './pages/JobBoard';
import JobDetails from './pages/JobDetails';
import JobUpdate from './pages/JobUpdate';
import PartsRequest from './pages/PartsRequest';

import ClientDashboard from './pages/ClientDashboard';
import MyProperties from './pages/MyProperties';
import MyRequests from './pages/MyRequests';

import TechDashboard from './pages/TechDashboard';
import MyJobs from './pages/MyJobs';
import TechProfileSetup from './pages/TechProfileSetup';
import CompleteJob from './pages/CompleteJob';
import TechNotes from './pages/TechNotes';

import AdminDashboard from './pages/AdminDashboard';
import AdminJobs from './pages/AdminJobs';
import AdminReviews from './pages/AdminReviews';
import AdminUsers from './pages/AdminUsers';
import AdminPartsRequests from './pages/AdminPartsRequests';
import AdminPartsApproval from './pages/AdminPartsApproval';
import AdminPartInventory from './pages/AdminPartInventory';
import AdminPartsOrders from './pages/AdminPartsOrders';
import AdminRegionRequests from './pages/AdminRegionRequests';

import PaymentHistory from './pages/PaymentHistory';
import DisputeCenter from './pages/DisputeCenter';
import MaintenanceTips from './pages/MaintenanceTips';
import SystemLogViewer from './pages/SystemLogViewer';
import NotificationsInbox from './pages/NotificationsInbox';
import ReferralSystem from './pages/ReferralSystem';

function AppWrapper() {
  const { user, profile, loading } = useUser();
  const location = useLocation();

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <>
      <Navbar />
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/tech-signup" element={<TechSignup />} />
        <Route path="/client-signup" element={<ClientSignup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/request-region" element={<RequestRegion />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/confirm" element={<AuthRedirectHandler />} />

        {/* Job Pages */}
        <Route path="/submit-job" element={
          <RequireRole allowedRoles={['client', 'admin']}>
            <SubmitJob />
          </RequireRole>
        } />
        <Route path="/job-board" element={
          <RequireRole allowedRoles={['tech', 'admin']}>
            <JobBoard />
          </RequireRole>
        } />
        <Route path="/job/:id" element={
          <RequireRole allowedRoles={['tech', 'client', 'admin']}>
            <JobDetails />
          </RequireRole>
        } />
        <Route path="/job-update/:jobId" element={
          <RequireRole allowedRoles={['client', 'admin']}>
            <JobUpdate />
          </RequireRole>
        } />
        <Route path="/parts-request/:jobId" element={
          <RequireRole allowedRoles={['tech', 'admin']}>
            <PartsRequest />
          </RequireRole>
        } />
        <Route path="/parts-request" element={
          <RequireRole allowedRoles={['tech', 'admin']}>
            <PartsRequest />
          </RequireRole>
        } />

        {/* Utilities */}
        <Route path="/notifications" element={<NotificationsInbox />} />
        <Route path="/payment-history" element={<PaymentHistory />} />
        <Route path="/disputes" element={<DisputeCenter />} />
        <Route path="/maintenance-tips" element={<MaintenanceTips />} />
        <Route path="/system-logs" element={<SystemLogViewer />} />
        <Route path="/referrals" element={<ReferralSystem />} />

        {/* Client */}
        <Route path="/client-dashboard" element={
          <RequireRole allowedRoles={['client', 'admin']}>
            <ClientDashboard />
          </RequireRole>
        } />
        <Route path="/my-properties" element={
          <RequireRole allowedRoles={['client', 'admin']}>
            <MyProperties />
          </RequireRole>
        } />
        <Route path="/my-requests" element={
          <RequireRole allowedRoles={['client', 'admin']}>
            <MyRequests />
          </RequireRole>
        } />

        {/* Tech */}
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

        {/* Admin */}
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
        <Route path="/admin/region-requests" element={
          <RequireRole allowedRoles={['admin']}>
            <AdminRegionRequests />
          </RequireRole>
        } />

        {/* Catch all */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
