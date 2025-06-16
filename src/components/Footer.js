// src/components/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-gray-100 text-center text-sm text-gray-600 py-4 mt-10 border-t">
    <p>&copy; {new Date().getFullYear()} TurnReady. All rights reserved.</p>
    <p>
      <Link to="/terms" className="hover:underline text-blue-500">Terms of Service</Link> &nbsp;|&nbsp;
      <Link to="/privacy" className="hover:underline text-blue-500">Privacy Policy</Link>
      <a href="/request-region" className="text-blue-500 hover:underline">
  🌍 Request a Region
</a>
    </p>
  </footer>
);

export default Footer;
