import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ClientDashboard from './pages/ClientDashboard';
import TechDashboard from './pages/TechDashboard';
import JobBoard from './pages/JobBoard';
import SubmitJob from './pages/SubmitJob';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/client-dashboard" element={<ClientDashboard />} />
        <Route path="/tech-dashboard" element={<TechDashboard />} />
        <Route path="/job-board" element={<JobBoard />} />
        <Route path="/submit-job" element={<SubmitJob />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
