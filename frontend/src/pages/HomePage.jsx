import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { customer, isAuthenticated, logout } = useAuth();

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 flex flex-col items-center justify-center text-center min-h-[80vh]">
      {/* Brand Header */}
      <h1 className="text-5xl font-black text-white tracking-tight mb-4">
        QuickBite
      </h1>
      
      <p className="text-sm text-gray-400 max-w-xl mb-10 leading-relaxed">
        QuickBite is your go-to food ordering platform where you can explore top-rated restaurants, 
        view their current status, and place your favorite orders online with ease.
      </p>

      {/* Main Welcome Card */}
      <div className="w-full bg-[#1b1c22] border border-[#2d2e38] rounded-2xl p-8 shadow-xl max-w-2xl text-center mb-8">
        <h2 className="text-xl font-bold text-white mb-3">
          Welcome to QuickBite!
        </h2>
        <p className="text-xs text-gray-400 mb-8 leading-relaxed">
          Whether you are craving spicy curries, hot pizzas, fresh sushi, or gourmet burgers, we have got you covered. 
          Navigate to the Restaurants page to browse our list of open places.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/restaurants"
            className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold px-6 py-3 rounded-lg shadow-md transition-all text-center"
          >
            Browse Restaurants
          </Link>

          <Link
            to="/order"
            className="w-full sm:w-auto bg-[#2b2c36] hover:bg-[#343542] text-gray-200 text-xs font-bold px-6 py-3 rounded-lg border border-[#3b3c48] transition-all text-center"
          >
            Go to Order Panel
          </Link>
        </div>
      </div>

      {/* Auth / Customer Session Info Card */}
      {isAuthenticated && customer && (
        <div className="w-full max-w-2xl bg-[#18191e] border border-[#282932] rounded-xl p-5 flex items-center justify-between shadow-md">
          <div className="text-left">
            <p className="text-xs font-semibold text-gray-400">Logged in as:</p>
            <p className="text-sm font-bold text-white">{customer.name}</p>
            <p className="text-xs text-gray-400">{customer.email}</p>
          </div>
          <button
            onClick={logout}
            className="bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-300 text-xs font-semibold px-4 py-1.5 rounded-md transition-all"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default HomePage;
