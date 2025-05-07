import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import { AuthContext } from './context/AuthContext'
import { useContext, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useAuth } from './hooks/useAuth';
import Dashboard from './pages/Dashboard';
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import RedditCallback from './SocialCallbacks/RedditCallback';
import { UserRole } from './types/userRoles';
import ReportedPostsPage from './components/Admin/PostReports';
import AdminLoginPage from './pages/Admin/AdminLoginPage';
import { AdminAuthProvider } from './hooks/useAdminAuth';
import AdminRoute from './components/Admin/auth/AdminRoute';
import AdminLayout from './components/Admin/layout/adminLayout';
import AdminDashboard from './pages/Admin/AdminDashboard';

function App() {

  const { error } = useContext(AuthContext);

  useEffect(() => {
    if (error) {
      console.log(' new error:', error)
      toast.error(error);
    }
  }, [error]);

  return (
    <div className='bg-surface'>
    <BrowserRouter>
  <AdminAuthProvider>
    <Routes>
      {/* All your existing routes */}
      <Route path='/login' element={<LoginPage role={UserRole.User} />} />
      <Route path='/register' element={<RegisterPage />} />
      <Route path='/dashboard' element={<Dashboard />} />
      <Route path='/feed' element={<Feed />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/reddit-callback" element={<RedditCallback />} />
      
      {/* Admin routes */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin/dashboard" element={
        <AdminRoute>
          <AdminLayout>
            <AdminDashboard />
          </AdminLayout>
        </AdminRoute>
      } />
      
      {/* Redirect admin root */}
      <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
    </Routes>
  </AdminAuthProvider>
  <ToastContainer />
</BrowserRouter>
    </div>
  )
}

export default App