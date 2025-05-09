import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../../hooks/useAdminAuth';

const AdminSidebar: React.FC = () => {
  const { logout } = useAdminAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-primary text-white' : 'text-text-secondary hover:bg-gray-100';
  };

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard' },
    { path: '/admin/users-list', label: 'Manage Users' },
    // { path: '/admin/settings', label: 'System Settings' },
    { path: '/admin/reports', label: 'Reports' },
  ];

  return (
    <div className="w-64 bg-shell h-full">
      <div className="p-4">
        
        <nav className="mt-6">
          <ul>
            {menuItems.map((item) => (
              <li key={item.path} className="mb-2">
                <Link
                  to={item.path}
                  className={`${isActive(item.path)} flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="mt-10 pt-4 border-t border-gray-200">
          <button
            onClick={logout}
            className="w-full flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200"
          >
            Logout from Admin
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;