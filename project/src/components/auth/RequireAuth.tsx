import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface RequireAuthProps {
  children: React.ReactNode;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      // Save the attempted URL for redirecting after login
      navigate('/auth', { 
        state: { from: location.pathname },
        replace: true 
      });
    }
  }, [isAuthenticated, loading, navigate, location]);

  // Show nothing while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#16213e] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If authenticated, render children
  return isAuthenticated ? <>{children}</> : null;
};

export default RequireAuth;
