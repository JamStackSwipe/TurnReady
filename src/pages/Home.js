// src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';


const Home = () => (
  <div style={{ padding: '2rem' }}>
    <h1>Welcome to TurnReady 🏠</h1>
    <p>This is the home screen.</p>
    <ul>
      <li><Link to="/client-dashboard">Client Dashboard</Link></li>
      <li><Link to="/tech-dashboard">Tech Dashboard</Link></li>
      <li><Link to="/job-board">Job Board</Link></li>
      <li><Link to="/submit-job">Submit Job</Link></li>
      <li><Link to="/profile">Profile</Link></li>
    </ul>
  </div>
);

export default Home;
