import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/User/LoginPage'
import { AuthContext } from './context/AuthContext'
import { useContext, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import Dashboard from './pages/User/Dashboard';
import Feed from './pages/User/Feed';
import Profile from './pages/User/Profile';
import RedditCallback from './SocialCallbacks/RedditCallback';
import AdminLoginPage from './components/Admin/auth/AdminLoginForm';
import { AdminAuthProvider } from './hooks/useAdminAuth';
import AdminRoute from './components/Admin/auth/AdminRoute';
import AdminLayout from './components/Admin/layout/adminLayout';
import AdminDashboard from './pages/Admin/AdminDashboard';
import RegisterPage from './pages/User/RegisterPage';
import { Reports } from './components/Admin/dashboard/Reports';
import UsersList from './components/Admin/dashboard/UserList';
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
            <Route path='/login' element={<LoginPage/>} />
            <Route path='/register' element={<RegisterPage />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/feed' element={<Feed />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/reddit-callback" element={<RedditCallback />} />

            {/* Admin routes */}
            <Route path="/admin/login" element={
                          <AdminLayout>
                            <AdminLoginPage />
                          </AdminLayout>
            } />
            
            <Route path="/admin/dashboard" element={
              <AdminRoute>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </AdminRoute>
            } />
            <Route path="/admin/users-list" element={
              <AdminRoute>
                <AdminLayout>
                  <UsersList/>
                </AdminLayout>
              </AdminRoute>
            } />

            <Route path="/admin/reports" element={
              <AdminRoute>
                <AdminLayout>
                  <Reports />
                </AdminLayout>
              </AdminRoute>
            } />

            <Route path="/admin/users" element={
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