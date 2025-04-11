import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for an existing user in localStorage when the app loads
    const storedUser = localStorage.getItem('macroUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log('Found stored user:', parsedUser);
        setCurrentUser(parsedUser);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('macroUser');
      }
    }
    setLoading(false);
  }, []);

  // Register a new user
  const register = (email, password, name) => {
    try {
      // In a real app, you would make an API call to register the user
      // For this demo, we'll just store the user in localStorage
      const newUser = {
        id: Date.now().toString(),
        email,
        password, // In a real app, this would be hashed
        name,
        joinDate: new Date().toISOString().split('T')[0],
        orders: []
      };
      
      // Store user in localStorage
      localStorage.setItem('macroUser', JSON.stringify(newUser));
      console.log('User registered:', newUser);
      setCurrentUser(newUser);
      return newUser;
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error('Failed to register user');
    }
  };

  // Login a user
  const login = (email, password) => {
    try {
      // In a real app, you would validate credentials against an API
      // For this demo, we'll check if the email exists in localStorage
      const storedUser = localStorage.getItem('macroUser');
      console.log('Attempting login with email:', email);
      console.log('Stored user data:', storedUser);
      
      if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user.email === email && user.password === password) {
          // In a real app, you would compare password hashes
          console.log('Login successful');
          setCurrentUser(user);
          return user;
        }
      }
      
      throw new Error('Invalid email or password');
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Invalid email or password');
    }
  };

  // Logout the user
  const logout = () => {
    try {
      // In a real app, you would also invalidate tokens on the server
      // localStorage.removeItem('macroUser'); // Uncomment this for actual logout
      // For demo purposes, we'll keep the user in localStorage but clear the current state
      setCurrentUser(null);
      console.log('User logged out');
    } catch (error) {
      console.error('Logout error:', error);
    }
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
