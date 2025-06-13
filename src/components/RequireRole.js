// src/components/RequireRole.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from './AuthProvider';

const RequireRole = ({ allowedRoles = [], children }) => {
  const { user, profile } = useUser();

  if (!user || !profile) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(profile.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

export default RequireRole;
