import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('showcaseUser')) || null; } catch { return null; }
  });
  const login = (userData) => { localStorage.setItem('showcaseUser', JSON.stringify(userData)); setUser(userData); };
  const logout = () => { localStorage.removeItem('showcaseUser'); setUser(null); };
  return <AuthContext.Provider value={{ user, login, logout, loading: false }}>{children}</AuthContext.Provider>;
};
