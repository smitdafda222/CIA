import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import RestaurantsPage from './pages/RestaurantsPage';
import OrderPage from './pages/OrderPage';

// Lazy-loaded route for Admin Panel (Task 1 & Task 2 requirement)
const AdminPanel = lazy(() => import('./pages/AdminPanel'));

const App = () => {
  return (
    <div className="min-h-screen bg-[#121316] text-gray-200 flex flex-col justify-between">
      <div>
        <Navbar />
        <main>
          <Suspense fallback={
            <div className="flex items-center justify-center py-24 text-gray-400 text-xs font-semibold">
              Loading lazy module...
            </div>
          }>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/restaurants" element={<RestaurantsPage />} />
              <Route
                path="/order"
                element={
                  <ProtectedRoute>
                    <OrderPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/admin" element={<AdminPanel />} />
            </Routes>
          </Suspense>
        </main>
      </div>

      <footer className="border-t border-[#23242c] py-4 text-center text-[11px] text-gray-500 bg-[#16171c]">
        © 2026 QuickBite Food Ordering System. All rights reserved.
      </footer>
    </div>
  );
};

export default App;
