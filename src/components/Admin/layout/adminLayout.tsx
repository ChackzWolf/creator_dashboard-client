import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import AdminSidebar from './AdminSidebar';
import { useAdminAuth } from '../../../hooks/useAdminAuth';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (location.pathname === '/admin/login') {
    console.log('before', isAuthenticated)
    if (isAuthenticated) return(
      <Navigate to="/admin/dashboard" replace />
    )
    console.log('after' , isAuthenticated)
    return (
      <div className="min-h-screen bg-surface">
        <Navbar />
        <main className="container mx-auto px-4">
          {children}
        </main>
      </div>
    );
  }

  // Redirect to admin login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // For authenticated admin pages, show admin sidebar and navbar
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-surface p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;