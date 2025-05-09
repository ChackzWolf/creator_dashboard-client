import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useAuth } from '../../../hooks/useAuth';

interface LayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  requireAuth = false,
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Check authentication
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // For login and register pages, only show the navbar
  if (location.pathname === '/login' || location.pathname === '/register') {
    if(isAuthenticated) return <Navigate to="/dashboard" replace />;
    console.log(location.pathname, 'location path name')
    return (
      <div className="min-h-screen bg-surface">
        <Navbar />
        <main className="container mx-auto px-4">
          {children}
        </main>
      </div>
    );
  }

  // For authenticated pages, show sidebar and navbar
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        {isAuthenticated && <Sidebar />}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-surface p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;