import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import { AuthContext } from './context/AuthContext'
import { useContext, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useAuth } from './hooks/useAuth';

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
        <Route path='/dashboard' element={<div></div>}/>
      </Routes>
      <ToastContainer/>
    </BrowserRouter>

    </div>
  )
}

export default App
