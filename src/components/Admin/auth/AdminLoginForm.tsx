import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { toast } from 'react-toastify';
import { useAdminAuth } from '../../../hooks/useAdminAuth';

const AdminLoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAdminAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const result = await login({ email, password });
      if (result.success) {
        navigate('/admin/dashboard');
      } else {
        setError(result.error || 'Failed to login');
        toast.error(result.error || 'Failed to login');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to login';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-shell md:h-130 md:w-1/2 rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-8">
        <h2 className="text-center text-3xl font-bold text-text-primary mb-6">Admin Login</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-text-secondary text-sm font-bold mb-2" htmlFor="email">
              Admin Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow bg-input-bg appearance-none border rounded w-full py-2 px-3 text-text-secondary leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-text-secondary text-sm font-bold mb-2" htmlFor="password">
              Admin Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none bg-input-bg border rounded w-full py-2 px-3 text-text-secondary leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          
          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={isLoading}
              className={`bg-primary hover:bg-primary-hover text-text-primary font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Logging in...' : 'Admin Login'}
            </button>
          </div>
        </form>
        
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Need a user account?{' '}
            <Link to="/login" className="text-indigo-600 hover:text-indigo-800">
              User Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginForm;