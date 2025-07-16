import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Installations from './pages/Installations';
import './App.css';

function App() {
  return (
    <div className="App">
      <Navbar />
      <main className="container-fluid mt-4">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/installations" element={<Installations />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>
      
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;
