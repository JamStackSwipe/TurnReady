// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'; // ✅ TailwindCSS styles
import App from './App';
import { AuthProvider } from './components/AuthProvider'; // ✅ Import the AuthProvider

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
