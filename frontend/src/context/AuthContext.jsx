import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('qb_token') || 'demo_token_24ce021');
  const [customer, setCustomer] = useState(() => {
    const saved = localStorage.getItem('qb_customer');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      _id: '66d010000000000000000001',
      name: 'Jay Chheta',
      email: 'jaychheta06@gmail.com',
      phone: '09574361060',
      address: 'A-802 sarjan heights dabholi gam,katargam'
    };
  });

  const login = (userData, authToken) => {
    setCustomer(userData);
    setToken(authToken);
    localStorage.setItem('qb_customer', JSON.stringify(userData));
    localStorage.setItem('qb_token', authToken);
  };

  const logout = () => {
    setCustomer(null);
    setToken(null);
    localStorage.removeItem('qb_customer');
    localStorage.removeItem('qb_token');
  };

  return (
    <AuthContext.Provider value={{ customer, token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
