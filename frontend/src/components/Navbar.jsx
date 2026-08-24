import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, customer } = useAuth();

  return (
    <nav className="bg-[#17181c] border-b border-[#25262c] px-6 py-4 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <NavLink to="/" className="flex items-center gap-2">
          <span className="text-2xl font-extrabold tracking-tight text-orange-500 hover:text-orange-400 transition-colors">
            QuickBite
          </span>
        </NavLink>

        {/* Navigation Links */}
        <div className="flex items-center gap-2 bg-[#1f2026] p-1.5 rounded-lg border border-[#2d2e36]">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-[#282a32]'
              }`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/restaurants"
            className={({ isActive }) =>
              `px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-[#282a32]'
              }`
            }
          >
            Restaurants
          </NavLink>

          <NavLink
            to="/order"
            className={({ isActive }) =>
              `px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-[#282a32]'
              }`
            }
          >
            Order
          </NavLink>

          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-[#282a32]'
              }`
            }
          >
            Admin Panel
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
