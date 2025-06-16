// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import RequireRole from './components/RequireRole';

import Home from './pages/Home';
import Login from './pages/Login';
import Profile from './pages/Profile';

import ClientDashboard from './pages/ClientDashboard';
import MyProperties from './pages/MyProperties';
import MyRequests from './pages/MyRequests';

import TechDashboard from './pages/TechDashboard';
import MyJobs from './pages/MyJobs';
import TechProfileSetup from './pages/TechProfileSetup';

import SubmitJob from './pages/SubmitJob';
import JobBoard from './pages/JobBoard';
import JobDetails from './pages/JobDetails';
import JobUpdate from './pages/JobUpdate';
import PartsRequest from './pages/PartsRequest';

import AdminDashboard from './pages/AdminDashboard';
import AdminJobs from './pages/AdminJobs';
import AdminReviews from './pages/AdminReviews';
import AdminUsers from './pages/AdminUsers';
import AdminPartsRequests from './pages/AdminPartsRequests'; // ✅ New

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
        <Route path="/submit-job" element={<SubmitJob />} />
        <Route path="/job-board" element={<JobBoard />} />

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
        <Route path="/job/:id" element={<JobDetails />} />
        <Route path="/job-update/:jobId" element={<JobUpdate />} />
        <Route path="/parts-request/:jobId" element={<PartsRequest />} />
        <Route path="/parts-request" element={<PartsRequest />} />

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

      </Routes>
    </Router>
  );
}

export default App;
