import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {

  return (
    <nav className="bg-shell text-shell shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center space-x-4">
            <Link to="/" className="font-bold text-xl text-text-primary">Admin Dashboard</Link>
          </div>
          <div className="flex items-center space-x-4">
            
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;