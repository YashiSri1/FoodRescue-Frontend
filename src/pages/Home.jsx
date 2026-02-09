import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLeaf, FaMap, FaUsers, FaTrophy, FaHandsHelping, FaBox, FaStar, FaCheckCircle, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import { foodListingService } from '../services/api';
import FoodCard from '../components/FoodCard';
import './Home.css';

export default function Home() {
  const navigate = useNavigate();
  const [recentListings, setRecentListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await foodListingService.getAll({
          status: 'available'
        });
        setRecentListings(response.data.slice(0, 6));
      } catch (error) {
        console.error('Error fetching listings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background">
          <div className="hero-shape-1"></div>
          <div className="hero-shape-2"></div>
          <div className="hero-shape-3"></div>
        </div>
        <div className="hero-content">
          <div className="hero-title-section">
            <h1 className="hero-title">🌱 Rescue Food, Save Lives</h1>
            <p className="hero-subtitle">Connect surplus edible food with people and organizations in need</p>
          </div>
          <div className="hero-illustration">
            <div className="hero-icon-large">
              <FaLeaf />
            </div>
          </div>
          <div className="hero-buttons">
            <button className="btn-primary btn-lg" onClick={() => navigate('/register')}>
              Get Started Free
            </button>
            <button className="btn-secondary btn-lg" onClick={() => navigate('/listings')}>
              Browse Food →
            </button>
          </div>
        </div>
      </section>

      {/* Impact Numbers Section */}
      <section className="impact-numbers">
        <div className="container">
          <div className="impact-stat">
            <div className="impact-stat-icon">📦</div>
            <h3>500+</h3>
            <p>Food Items Listed</p>
          </div>
          <div className="impact-stat">
            <div className="impact-stat-icon">👥</div>
            <h3>1000+</h3>
            <p>Active Users</p>
          </div>
          <div className="impact-stat">
            <div className="impact-stat-icon">🌍</div>
            <h3>50+</h3>
            <p>Cities Reached</p>
          </div>
          <div className="impact-stat">
            <div className="impact-stat-icon">✨</div>
            <h3>10K+</h3>
            <p>Lives Impacted</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="container">
          <div className="stat-card stat-card-1">
            <div className="stat-card-icon">
              <FaBox />
            </div>
            <h3>Post Food</h3>
            <p>List surplus food items with details, location & pickup times</p>
          </div>
          <div className="stat-card stat-card-2">
            <div className="stat-card-icon">
              <FaMap />
            </div>
            <h3>Find Nearby</h3>
            <p>Discover available food in your area with real-time updates</p>
          </div>
          <div className="stat-card stat-card-3">
            <div className="stat-card-icon">
              <FaHandsHelping />
            </div>
            <h3>Make Request</h3>
            <p>Request food and arrange convenient pickup schedules</p>
          </div>
          <div className="stat-card stat-card-4">
            <div className="stat-card-icon">
              <FaStar />
            </div>
            <h3>Build Trust</h3>
            <p>Rate users and build a reliable community ecosystem</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">4 Simple Steps to Save Food & Help Others</p>
          <div className="steps">
            <div
              className="step step-1"
              role="button"
              tabIndex={0}
              aria-label="Sign Up - Register"
              onClick={() => navigate('/register')}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate('/register'); }}
            >
              <div className="step-icon">
                <div className="step-number">1</div>
              </div>
              <h3>Sign Up</h3>
              <p>Create account as a donor, volunteer, or organization</p>
              <div className="step-visual">👤</div>
            </div>
            <div className="step-connector"></div>
            <div
              className="step step-2"
              role="button"
              tabIndex={0}
              aria-label="List or Find Food - Listings"
              onClick={() => navigate('/listings')}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate('/listings'); }}
            >
              <div className="step-icon">
                <div className="step-number">2</div>
              </div>
              <h3>List or Find Food</h3>
              <p>Post surplus food or browse available items nearby</p>
              <div className="step-visual">🍎</div>
            </div>
            <div className="step-connector"></div>
            <div
              className="step step-3"
              role="button"
              tabIndex={0}
              aria-label="Connect and Arrange - Listings"
              onClick={() => navigate('/listings')}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate('/listings'); }}
            >
              <div className="step-icon">
                <div className="step-number">3</div>
              </div>
              <h3>Connect & Arrange</h3>
              <p>Request food and arrange pickup with donors</p>
              <div className="step-visual">📍</div>
            </div>
            <div className="step-connector"></div>
            <div
              className="step step-4"
              role="button"
              tabIndex={0}
              aria-label="Impact and Rate - Ratings"
              onClick={() => navigate('/ratings')}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate('/ratings'); }}
            >
              <div className="step-icon">
                <div className="step-number">4</div>
              </div>
              <h3>Impact & Rate</h3>
              <p>Complete transaction and help reduce food waste</p>
              <div className="step-visual">⭐</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Why Choose FoodRescue?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Verified Users</h3>
              <p>All users are verified for safety and trust</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Easy to Use</h3>
              <p>Simple interface designed for everyone</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🚀</div>
              <h3>Fast Matching</h3>
              <p>Get matches within minutes of posting</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌍</div>
              <h3>Reduce Waste</h3>
              <p>Every share helps reduce food waste globally</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💬</div>
              <h3>Community Chat</h3>
              <p>Direct communication with donors and recipients</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🏆</div>
              <h3>Rating System</h3>
              <p>Build reputation through positive interactions</p>
            </div>
          </div>
        </div>
      </section>

    

      {/* Impact Section */}
      <section className="impact">
        <div className="container">
          <div className="impact-wrapper">
            <div className="impact-image">
              <div className="impact-illustration">
                <div className="impact-shapes">
                  <div className="impact-circle-1"></div>
                  <div className="impact-circle-2"></div>
                  <div className="impact-circle-3"></div>
                </div>
                <div className="impact-icon-large">🌱</div>
              </div>
            </div>
            <div className="impact-text">
              <h2>Making Real Impact</h2>
              <h3>Every Meal Counts</h3>
              <p>Food waste is a global problem. While millions go hungry, billions of dollars worth of food is thrown away. FoodRescue connects surplus food with those who need it most.</p>
              <ul className="impact-list">
                <li><FaCheckCircle className="check-icon" /> 1/3 of food produced globally is wasted</li>
                <li><FaCheckCircle className="check-icon" /> 800M+ people face hunger worldwide</li>
                <li><FaCheckCircle className="check-icon" /> Your actions can change communities</li>
                <li><FaCheckCircle className="check-icon" /> Sustainable solution for all</li>
              </ul>
              <button className="btn-primary" onClick={() => navigate('/register')}>
                Join the Movement
              </button>
            </div>
          </div>
          <div className="impact-footer">
            <p className="impact-contact">
              <a href="https://www.linkedin.com/in/yashi-srivastava-016938307/" target="_blank" rel="noreferrer" className="impact-contact-link">
                <FaLinkedin /> LinkedIn
              </a>
              <a href="mailto:yashisrivastava4004@gmail.com" className="impact-contact-link">
                <FaEnvelope /> yashisrivastava4004@gmail.com
              </a>
            </p>
          </div>
        </div>
      </section>

      
    </div>
  );
}
