import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // 1. Add a loading state (Default to TRUE)
  const [loading, setLoading] = useState(true);
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const loginAction = (userData) => {
    setIsLoggedIn(true);

    // 1. FIX: Combine first and last name
    // The backend sends 'first_name', NOT 'name'
    const firstName = userData.first_name || "";
    const lastName = userData.last_name || "";
    
    // Combine them. If both are empty, use the username.
    let fullName = `${firstName} ${lastName}`.trim();
    
    if (!fullName) {
        fullName = userData.username || "User";
    }

    // 2. Update State
    setName(fullName);
    setEmail(userData.email);

    // 3. Update Local Storage
    // NOTE: Check if your API actually returns 'access' tokens. 
    // If not, remove the lines for 'access' and 'refresh' below.
    if (userData.access) localStorage.setItem('access', userData.access);
    if (userData.refresh) localStorage.setItem('refresh', userData.refresh);
    
    localStorage.setItem('userName', fullName); // Save the REAL name
    localStorage.setItem('userEmail', userData.email);
  };

  // Helper function to handle Logout
  const logoutAction = () => {
    setIsLoggedIn(false);
    setName("");
    setEmail("");
    localStorage.clear(); // Clears tokens and user data
  };

  // Check login status when page loads (The Rehydration Logic)
  useEffect(() => {
     const token = localStorage.getItem('access');
     const storedName = localStorage.getItem('userName');
     const storedEmail = localStorage.getItem('userEmail');

     if (token && storedName) {
        // If we found data in storage, restore it to React State
        setIsLoggedIn(true);
        setName(storedName);
        setEmail(storedEmail);
     }
     
     // CRITICAL: Tell the app we are done checking
     setLoading(false); 
  }, []);

  return (
    // Pass 'loading' to the context value
    <AuthContext.Provider value={{ isLoggedIn, name, email, loginAction, logoutAction, loading }}>
      {/* Do not render children until we have checked localStorage */}
      {!loading && children} 
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);