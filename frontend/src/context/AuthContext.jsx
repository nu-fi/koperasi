import React, { createContext, useState, useContext, useEffect } from 'react';

// 1. Create the Context
const AuthContext = createContext(null);

// 2. Create the Provider Component
export const AuthProvider = ({ children }) => {
  // --- THIS IS THE CODE YOU REQUESTED ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  // --------------------------------------

  // Helper function to handle Login
  const loginAction = (userData) => {
    setIsLoggedIn(true);
    setName(userData.username); // Assuming backend sends 'username'
    setEmail(userData.email);   // Assuming backend sends 'email'
    
    // Store token in local storage (standard practice)
    localStorage.setItem('access', userData.access);
    localStorage.setItem('refresh', userData.refresh);
  };

  // Helper function to handle Logout
  const logoutAction = () => {
    setIsLoggedIn(false);
    setName("");
    setEmail("");
    localStorage.clear();
  };

  // Optional: Check if user is already logged in when page loads
  useEffect(() => {
     const token = localStorage.getItem('access');
     if (token) {
        setIsLoggedIn(true);
        // In a real app, you would fetch the user profile here to get the name
     }
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, name, email, loginAction, logoutAction }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Custom Hook to use it easily
export const useAuth = () => useContext(AuthContext);