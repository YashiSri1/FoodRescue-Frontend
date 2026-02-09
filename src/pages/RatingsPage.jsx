import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaArrowLeft, FaPaperPlane } from 'react-icons/fa';
import useAuthStore from '../context/authStore';
import { ratingService, userService } from '../services/api';
import './RatingsPage.css';

export default function RatingsPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [userProfile, setUserProfile] = useState(null);
  const [receivedRatings, setReceivedRatings] = useState([]);
  const [activeTab, setActiveTab] = useState('received');
  const [loading, setLoading] = useState(true);
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [ratingForm, setRatingForm] = useState({
    ratedUserId: '',
    rating: 5,
    review: ''
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchRatings();
    fetchUserProfile();
  }, [isAuthenticated]);

  const fetchRatings = async () => {
    setLoading(true);
    try {
      const received = await ratingService.getUserRatings(user._id);
      setReceivedRatings(received.data);
    } catch (error) {
      console.error('Error fetching ratings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const profile = await userService.getProfile();
      setUserProfile(profile.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    const userId = ratingForm.ratedUserId.trim();
    
    if (!userId) {
      alert('Please enter a user ID');
      return;
    }

    // Simple validation - check if it looks like a MongoDB ID (24 hex characters)
    if (userId.length !== 24 || !/^[a-f0-9]{24}$/.test(userId)) {
      alert('Please enter a valid User ID (24 character MongoDB ID)');
      return;
    }

    try {
      await ratingService.createRating({
        ratedUserId: userId,
        rating: parseInt(ratingForm.rating),
        review: ratingForm.review
      });

      alert('Rating submitted successfully!');
      setRatingForm({ ratedUserId: '', rating: 5, review: '' });
      setShowRatingForm(false);
      fetchRatings();
    } catch (error) {
      alert(error.response?.data?.error || 'Error submitting rating. Please check the user ID.');
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="stars-display">
        {[...Array(5)].map((_, i) => (
          <FaStar
            key={i}
            className={i < rating ? 'star-filled' : 'star-empty'}
          />
        ))}
        <span className="rating-value">({rating.toFixed(1)})</span>
      </div>
    );
  };

  const renderRatingInput = (rating) => {
    return (
      <div className="stars-input">
        {[...Array(5)].map((_, i) => (
          <FaStar
            key={i}
            className={i < rating ? 'star-filled' : 'star-empty'}
            onClick={() => setRatingForm({ ...ratingForm, rating: i + 1 })}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="ratings-page">
      <div className="container">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          <FaArrowLeft /> Back to Dashboard
        </button>

        <div className="ratings-header">
          <h1>Ratings & Reviews</h1>
          {userProfile && (
            <div className="user-rating-summary">
              <div className="summary-item">
                <h3>Your Rating</h3>
                {renderStars(userProfile.averageRating || 0)}
              </div>
              <div className="summary-item">
                <h3>Total Reviews</h3>
                <p className="review-count">{userProfile.totalRatings || 0}</p>
              </div>
              <div className="summary-item">
                <h3>Your User ID</h3>
                <p className="user-id-display">{userProfile._id}</p>
              </div>
            </div>
          )}
        </div>

        <div className="ratings-actions">
          <button
            className="btn-primary"
            onClick={() => setShowRatingForm(!showRatingForm)}
          >
            <FaPaperPlane /> Rate a User
          </button>
        </div>

        {showRatingForm && (
          <div className="rating-form-container">
            <form onSubmit={handleRatingSubmit} className="rating-form">
              <h3>Rate a User</h3>

              <div className="form-group">
                <label>User ID to Rate</label>
                <input
                  type="text"
                  placeholder="Paste the 24-character User ID here"
                  value={ratingForm.ratedUserId}
                  onChange={(e) => setRatingForm({ ...ratingForm, ratedUserId: e.target.value })}
                  required
                />
                <small>You can get the User ID from their profile or registration confirmation</small>
              </div>

              <div className="form-group">
                <label>Rating</label>
                {renderRatingInput(ratingForm.rating)}
              </div>

              <div className="form-group">
                <label>Review (optional)</label>
                <textarea
                  placeholder="Share your experience..."
                  value={ratingForm.review}
                  onChange={(e) => setRatingForm({ ...ratingForm, review: e.target.value })}
                  rows="4"
                ></textarea>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  Submit Rating
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowRatingForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="ratings-tabs">
          <button
            className={`tab-btn ${activeTab === 'received' ? 'active' : ''}`}
            onClick={() => setActiveTab('received')}
          >
            Ratings Received ({receivedRatings.length})
          </button>
        </div>

        <div className="ratings-content">
          {loading ? (
            <div className="loading-spinner"></div>
          ) : (
            <div className="ratings-list">
              {receivedRatings.length === 0 ? (
                <p className="empty-state">No ratings yet. Great interactions start here!</p>
              ) : (
                receivedRatings.map((rating) => (
                  <div key={rating._id} className="rating-card">
                    <div className="rating-header">
                      <div className="rater-info">
                        <h4>{rating.ratedBy?.name || 'Anonymous'}</h4>
                        {renderStars(rating.rating)}
                      </div>
                      <span className="rating-date">
                        {new Date(rating.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {rating.review && (
                      <p className="rating-review">{rating.review}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
