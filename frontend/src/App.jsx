import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/navbar.jsx';
import Footer from './components/Footer.jsx';

import LandingPage from './pages/LandingPage.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';

import { AuthProvider } from './context/AuthContext.jsx';

// 1. Create a Layout component that includes Nav and Footer
const MainLayout = () => {
  return (
    <>
      <Navbar />
      <main className="bg-gray-50 min-h-screen">
        {/* <Outlet /> is a placeholder where the child routes will render */}
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  return (
    <AuthProvider>
        <Router>
        <ToastContainer />
        <Routes>
          {/* GROUP 1: Pages WITH Navbar and Footer */}
          {/* We wrap these routes inside the MainLayout */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<LandingPage />} />
          </Route>

          {/* GROUP 2: Pages WITHOUT Navbar and Footer */}
          {/* This sits outside the MainLayout */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
        </Routes>
      </Router>
    </AuthProvider>
    
  );
}

export default App;