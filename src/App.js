// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import ClientDashboard from './pages/ClientDashboard';
import TechDashboard from './pages/TechDashboard';
import JobBoard from './pages/JobBoard';
import SubmitJob from './pages/SubmitJob';
import Profile from './pages/Profile';
import Login from './pages/Login';
import TechProfileSetup from './pages/TechProfileSetup';
import MyProperties from './pages/MyProperties';
import Navbar from './components/Navbar';
import AdminDashboard from './pages/AdminDashboard';
import AdminJobs from './pages/AdminJobs';
import AdminReviews from './pages/AdminReviews';
import AdminUsers from './pages/AdminUsers';
import MyJobs from './pages/MyJobs';
import MyRequests from './pages/MyRequests';


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
  <Route path="/client-dashboard" element={<ClientDashboard />} />
  <Route path="/my-requests" element={<MyRequests />} />
  <Route path="/my-properties" element={<MyProperties />} />

  {/* Tech Views */}
  <Route path="/tech-dashboard" element={<TechDashboard />} />
  <Route path="/my-jobs" element={<MyJobs />} />
  <Route path="/tech-setup" element={<TechProfileSetup />} />

  {/* Admin Views */}
  <Route path="/admin" element={<AdminDashboard />} />
  <Route path="/admin/jobs" element={<AdminJobs />} />
  <Route path="/admin/reviews" element={<AdminReviews />} />
  <Route path="/admin/users" element={<AdminUsers />} />
</Routes>

    </Router>
  );
}

export default App;
