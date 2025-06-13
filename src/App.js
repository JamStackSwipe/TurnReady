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

function App() {
  return (
    <Router>
      <Navbar />
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/client-dashboard" element={<ClientDashboard />} />
        <Route path="/tech-dashboard" element={<TechDashboard />} />
        <Route path="/job-board" element={<JobBoard />} />
        <Route path="/submit-job" element={<SubmitJob />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/my-properties" element={<MyProperties />} />
        <Route path="/tech-setup" element={<TechProfileSetup />} />
      </Routes>
    </Router>
  );
}

export default App;
