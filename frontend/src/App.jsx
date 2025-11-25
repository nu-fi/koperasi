import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar.jsx';
import Footer from './components/Footer.jsx';

import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Services from './pages/Services.jsx';
import Contact from './pages/Contact.jsx';

function App() {
  return (
    <Router>
      {/* Navbar sits here, so it appears on every page */}
      <Navbar />
      
      {/* Your page content goes here */}
      <main className="bg-gray-50 min-h-screen">
        <Home />
        <Services />
        <About />
        <Contact />
      </main>
      
      {/* Footer sits here, so it appears on every page */}
      <Footer />
    </Router>
  );
}

export default App;