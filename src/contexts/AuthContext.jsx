import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for an existing user in localStorage when the app loads
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Register a new user
  const register = (email, password, name) => {
    // In a real app, you would make an API call to register the user
    // For this demo, we'll just store the user in localStorage
    const newUser = {
      id: Date.now().toString(),
      email,
      name,
      joinDate: new Date().toISOString().split('T')[0],
      orders: []
    };
    
    localStorage.setItem('user', JSON.stringify(newUser));
    setCurrentUser(newUser);
    return newUser;
  };

  // Login a user
  const login = (email, password) => {
    // In a real app, you would validate credentials against an API
    // For this demo, we'll check if the email exists in our mock data
    const storedUser = localStorage.getItem('user');
    
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.email === email) {
        // In a real app, you would also verify the password hash
        setCurrentUser(user);
        return user;
      }
    }
    
    throw new Error('Invalid email or password');
  };

  // Logout the user
  const logout = () => {
    // In a real app, you would also invalidate tokens on the server
    localStorage.removeItem('user');
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
