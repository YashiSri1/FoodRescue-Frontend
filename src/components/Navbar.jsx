import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaLeaf, FaUser, FaSignOutAlt, FaHome, FaMapMarkerAlt } from 'react-icons/fa';
import useAuthStore from '../context/authStore';
import './Navbar.css';

export default function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <Link to="/" className="navbar-brand">
          <FaLeaf className="brand-icon" />
          <span>FoodRescue</span>
        </Link>

        <div className="nav-links">
          <Link to="/" className="nav-link">
            <FaHome /> Home
          </Link>
          <Link to="/listings" className="nav-link">
            <FaMapMarkerAlt /> Available Food
          </Link>

          {isAuthenticated ? (
            <>
              <Link to="/my-listings" className="nav-link">My Listings</Link>
              <div className="user-menu">
                <button className="user-btn" onClick={toggleDropdown}>
                  <FaUser /> {user?.name?.split(' ')[0]}
                </button>
                <div className={`dropdown-menu ${dropdownOpen ? 'show' : ''}`}>
                  <Link to="/profile" onClick={closeDropdown}>Profile</Link>
                  <Link to="/my-requests" onClick={closeDropdown}>My Requests</Link>
                  <Link to="/ratings" onClick={closeDropdown}>Ratings</Link>
                  <button onClick={handleLogout}>
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="btn-primary">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
