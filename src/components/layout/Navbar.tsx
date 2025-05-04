import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-shell text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center space-x-4">
            <Link to="/" className="font-bold text-xl">Creator Dashboard</Link>
            {isAuthenticated && (
              <div className="hidden md:flex space-x-4">
                <Link to="/dashboard" className="hover:text-text-primary text-text-secondary">Dashboard</Link>
                <Link to="/feed" className="hover:text-text-primary text-text-secondary">Feed</Link>
                <Link to="/profile" className="hover:text-text-primary text-text-secondary">Profile</Link>
                {user?.role === 'admin' && (
                  <Link to="/admin" className="hover:text-text-primary text-text-secondary">Admin</Link>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="hidden md:inline">Welcome, {user?.username}</span>
                <button 
                  onClick={handleLogout}
                  className="bg-primary hover:bg-indigo-400 text-white px-4 py-2 rounded"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-secondary hover:bg-secondary-hover text-text-secondary px-4 py-2 rounded"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;