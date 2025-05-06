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

function App() {
    const { isAuthenticated } = useAuth();
  
  const { error } = useContext(AuthContext);

useEffect(() => {
  if (error) {
    console.log(' new error:' , error)
    toast.error(error);
  }
}, [error]);
console.log(' isAuthenticated' , isAuthenticated)
  
  return (
    <div className='bg-surface'>
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/register' element={<RegisterPage/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path='/feed' element={<Feed/>}/>
        <Route path="/profile" element={<Profile />} />
        <Route path="/reddit-callback" element={<RedditCallback />} />
        {/* <Route path="/" element={<Navigate to="/dashboard" replace />} /> */}
      </Routes>
      <ToastContainer/>
    </BrowserRouter>

    </div>
  )
}

export default App
