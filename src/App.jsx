import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import CreateListing from './pages/CreateListing';
import EditListing from './pages/EditListing';
import Listings from './pages/Listings';
import ListingDetails from './pages/ListingDetails';
import RatingsPage from './pages/RatingsPage';
import Profile from './pages/Profile';
import MyRequests from './pages/MyRequests';
import useAuthStore from './context/authStore';
import './styles/globals.css';

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/listings/:id" element={<ListingDetails />} />
        <Route 
          path="/dashboard" 
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/create-listing" 
          element={isAuthenticated ? <CreateListing /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/edit-listing/:id" 
          element={isAuthenticated ? <EditListing /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/ratings" 
          element={isAuthenticated ? <RatingsPage /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/profile" 
          element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/my-requests" 
          element={isAuthenticated ? <MyRequests /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/my-listings" 
          element={isAuthenticated ? <Dashboard activeTab="listings" /> : <Navigate to="/login" />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
