import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// --- IMPORTS ---
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import DashboardLayout from './components/DashboardLayout.jsx';

import LandingPage from './pages/LandingPage.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Profile from './pages/user/Profile.jsx';
import ApplyLoan from './pages/user/ApplyLoan.jsx';
import LoanProgress from './pages/user/LoanProgress.jsx';
import Repayment from './pages/user/Repayment.jsx';
import LoanHistory from './pages/user/LoanHistory.jsx';

import { AuthProvider } from './context/AuthContext.jsx';
import PrivateRoute from './context/PriveteRoute.jsx';

// --- LAYOUTS ---
const MainLayout = () => {
  return (
    <>
      <Navbar />
      <main className="bg-gray-50 min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

// --- MAIN APP COMPONENT ---
function App() {
  // 1. Connection Test State
  const [status, setStatus] = useState("Testing connection...");

  // 2. Connection Test Logic
  useEffect(() => {
    fetch('http://localhost:8000/admin/')
      .then(response => {
        if (response.ok) {
          setStatus("✅ Connected to Django Backend Successfully!");
        } else {
          setStatus("❌ Connected, but got an error (Check Django logs)");
        }
      })
      .catch(error => {
        setStatus("🚨 Connection Failed: CORS error or Backend is down.");
        console.error("Fetch error:", error);
      });
  }, []);

  return (
    <AuthProvider>
      <Router>
        <ToastContainer />
        
        {/* 3. Temporary Status Banner (Remove this once testing is done!) */}
        <div style={{ backgroundColor: '#333', color: 'white', textAlign: 'center', padding: '10px', fontWeight: 'bold' }}>
          Backend Status: {status}
        </div>

        <Routes>
          {/* GROUP 1: Pages WITH Navbar and Footer */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<LandingPage />} />
          </Route>

          {/* GROUP 2: Pages WITHOUT Navbar and Footer */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* GROUP 3: Dashboard Pages (Sidebar Layout) */}
          <Route element={<PrivateRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/apply-loan" element={<ApplyLoan />} />
              <Route path="/loan-progress" element={<LoanProgress />} />
              <Route path="/repayment" element={<Repayment />} />
              <Route path="/history" element={<LoanHistory />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;