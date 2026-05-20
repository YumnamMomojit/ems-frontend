import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for user in localStorage on initial load
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      // Ensure role is in uppercase for consistency with backend
      if (user.role) {
        user.role = user.role.toUpperCase();
      }
      setUser(user);
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    const userRole = userData.user.role?.toUpperCase();
    const userWithUpperRole = { ...userData.user, role: userRole };

    localStorage.setItem('user', JSON.stringify(userWithUpperRole));
    localStorage.setItem('mockToken', userData.token);
    setUser(userWithUpperRole);

    // Redirect based on role
    if (userRole === 'ADMIN' || userRole === 'SUPER_ADMIN' || userRole === 'ORG_ADMIN') {
      navigate('/admin/dashboard');
    } else if (userRole === 'HR') {
      navigate('/hr/dashboard');
    } else if (userRole === 'MANAGER') {
      navigate('/manager/dashboard');
    } else if (userRole === 'EMPLOYEE') {
      navigate('/employee/dashboard');
    } else {
      console.warn("Unhandled user role:", userRole);
      navigate('/employee/dashboard'); // Default fallback
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('mockToken');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
