import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar.jsx';

// Create a placeholder Home component for testing
const Home = () => (
  <div className="p-10 text-center">
    <h1 className="text-3xl font-bold">Welcome to BestTech</h1>
    <p className="mt-4 text-gray-600">The navbar is now fixed at the top!</p>
  </div>
);

function App() {
  return (
    <Router>
      {/* Navbar sits here, so it appears on every page */}
      <Navbar />
      
      {/* Your page content goes here */}
      <main className="bg-gray-50 min-h-screen">
        <Routes>
           <Route path="/" element={<Home />} />
           {/* Add more routes here later, e.g., <Route path="/about" element={<About />} /> */}
        </Routes>
      </main>
    </Router>
  );
}

export default App;