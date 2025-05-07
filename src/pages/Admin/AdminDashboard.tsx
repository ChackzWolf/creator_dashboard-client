import React, { useEffect } from 'react';
import { useAdminAuth } from '../../hooks/useAdminAuth';

const AdminDashboard: React.FC = () => {
  const { admin } = useAdminAuth();
  
  useEffect(()=> {
    
  })

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Welcome, {admin?.name || 'Admin'}</h2>
        <p className="text-gray-600">This is your administrative control panel where you can manage users, content, and system settings.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Quick stats cards */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Total Users</h3>
          <p className="text-3xl font-bold">157</p>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">New Registrations</h3>
          <p className="text-3xl font-bold">24</p>
          <p className="text-sm text-green-600">+12% from last week</p>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Active Sessions</h3>
          <p className="text-3xl font-bold">42</p>
        </div>
      </div>
      
      <div className="mt-8 bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">john.doe@example.com</td>
                <td className="px-6 py-4 whitespace-nowrap">Login</td>
                <td className="px-6 py-4 whitespace-nowrap">2 hours ago</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">alice.smith@example.com</td>
                <td className="px-6 py-4 whitespace-nowrap">Updated profile</td>
                <td className="px-6 py-4 whitespace-nowrap">4 hours ago</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">bob.johnson@example.com</td>
                <td className="px-6 py-4 whitespace-nowrap">Changed password</td>
                <td className="px-6 py-4 whitespace-nowrap">Yesterday</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;