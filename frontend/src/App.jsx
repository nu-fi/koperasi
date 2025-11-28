import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/navbar.jsx';
import Footer from './components/Footer.jsx';
import DashboardLayout from './components/DashboardLayout.jsx';

import LandingPage from './pages/LandingPage.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';

import { AuthProvider } from './context/AuthContext.jsx';
import PrivateRoute from './context/PriveteRoute.jsx';

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
          
          {/* GROUP 3: Dashboard Pages (Sidebar Layout) */}
          {/* Any route inside here will have the Sidebar */}
          <Route element={<PrivateRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              {/* Add more sidebar pages here later, e.g.: */}
              {/* <Route path="/users" element={<UsersPage />} /> */}
              {/* <Route path="/settings" element={<SettingsPage />} /> */}
            </Route>
          </Route>

        </Routes>
      </Router>
    </AuthProvider>
    
  );
}

export default App;