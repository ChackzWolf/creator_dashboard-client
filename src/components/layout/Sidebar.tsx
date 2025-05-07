import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCredits } from '../../hooks/useCredits';

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const { creditStats } = useCredits();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/feed', label: 'Feed', icon: '📰' },
    { path: '/profile', label: 'Profile', icon: '👤' },
  ];

  if (user?.role === 'admin') {
    navItems.push({ path: '/admin', label: 'Admin Panel', icon: '🔧' });
  }

  return (
    <div className="bg-shell text-white w-52 flex-shrink-0 min-h-screen">
      <div className="p-4">
        <div className="text-center py-4">
          <div className="w-20 h-20 rounded-full bg-gray-500 mx-auto mb-2 flex items-center justify-center text-xl">
            {user?.profilePicture ? (
              <img src={user.profilePicture} alt="Profile" className="w-full h-full rounded-full object-cover" />
            ) : (
              user?.username?.charAt(0).toUpperCase() || '?'
            )}
          </div>
          <h2 className="text-lg font-semibold">{user?.username}</h2>
          <p className="text-xs text-gray-400">{user?.email}</p>
        </div>

        <div className="bg-gray-700 rounded-lg p-4 mb-6">
          <h3 className="text-gray-400 text-xs uppercase font-semibold mb-2">Credit Balance</h3>
          <div className="flex items-center">
            <span className="text-2xl font-bold text-gray-300">
              {creditStats?.total || 0}
            </span>
            <span className="ml-2 text-xs text-gray-400">credits</span>
          </div>
          <div className="mt-2 text-xs text-gray-400">
            <span>This month: +{creditStats?.thisMonth || 0}</span>
          </div>
        </div>

        <nav>
          <h3 className="text-gray-400 text-xs uppercase font-semibold mb-2">Main Menu</h3>
          <ul>
            {navItems.map((item) => (
              <li key={item.path} className="mb-1">
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-2 rounded-md ${
                    isActive(item.path)
                      ? 'bg-gray-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;