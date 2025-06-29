// src/components/RequireRole.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from './AuthProvider';

const RequireRole = ({ allowedRoles = [], children }) => {
  const { user, profile, loading } = useUser();

  if (loading) {
    return <div className="p-4 text-center">Checking access...</div>;
  }

  if (!user || !profile || !profile.role) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(profile.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RequireRole;
