import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaClock, FaUser, FaStar, FaPhone, FaThumbsUp } from 'react-icons/fa';
import { foodListingService, requestService } from '../services/api';
import useAuthStore from '../context/authStore';
import './ListingDetails.css';
import placeholder100 from '../assets/placeholder-100.svg';

export default function ListingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingData, setRatingData] = useState({
    rating: 5,
    review: ''
  });
  const [submittingRating, setSubmittingRating] = useState(false);
  const [requestData, setRequestData] = useState({
    quantityRequested: '',
    pickupDate: '',
    pickupTime: '',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchListing();
  }, [id]);

  const fetchListing = async () => {
    try {
      const response = await foodListingService.getById(id);
      setListing(response.data);
    } catch (error) {
      console.error('Error fetching listing:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setSubmitting(true);
    try {
      await requestService.create({
        foodListingId: id,
        requestType: user?.role === 'ngo' ? 'organization' : 'personal',
        ...requestData
      });
      alert('Request submitted successfully!');
      setShowRequestForm(false);
      setRequestData({ quantityRequested: '', pickupDate: '', pickupTime: '', notes: '' });
    } catch (error) {
      alert('Error submitting request: ' + error.response?.data?.error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRateUser = async (e) => {
    e.preventDefault();

    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }

    if (user._id === listing.donor._id) {
      alert('You cannot rate yourself!');
      return;
    }

    setSubmittingRating(true);
    try {
      const { ratingService } = await import('../services/api');
      await ratingService.createRating({
        ratedUserId: listing.donor._id,
        rating: parseInt(ratingData.rating),
        review: ratingData.review,
        foodListingId: id
      });
      alert('Rating submitted successfully!');
      setShowRatingModal(false);
      setRatingData({ rating: 5, review: '' });
    } catch (error) {
      alert(error.response?.data?.error || 'Error submitting rating');
    } finally {
      setSubmittingRating(false);
    }
  };

  if (loading) {
    return <div className="container"><div className="loading-spinner"></div></div>;
  }

  if (!listing) {
    return <div className="container"><p className="not-found">Listing not found</p></div>;
  }

  if (!listing.donor) {
    return <div className="container"><p className="not-found">Donor information not available</p></div>;
  }

  return (
    <div className="listing-details-page">
      <div className="container">
        <button className="back-btn" onClick={() => navigate('/listings')}>← Back to Listings</button>

        <div className="details-layout">
          {/* Left Column - Listing Details */}
          <div className="details-column">
            <div className="listing-header">
              <h1>{listing.foodName}</h1>
              <span className={`status-badge status-${listing.status}`}>{listing.status.toUpperCase()}</span>
            </div>

            <div className="listing-info-grid">
              <div className="info-item">
                <span className="label">Quantity</span>
                <span className="value">{listing.quantity} {listing.unit}</span>
              </div>
              <div className="info-item">
                <span className="label">Category</span>
                <span className="value">{listing.category}</span>
              </div>
              <div className="info-item">
                <span className="label">Expires</span>
                <span className="value">{new Date(listing.expiryDate).toLocaleString()}</span>
              </div>
              <div className="info-item">
                <span className="label">Posted</span>
                <span className="value">{new Date(listing.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="description-section">
              <h3>Description</h3>
              <p>{listing.description}</p>
            </div>

            {listing.allergens && listing.allergens.length > 0 && (
              <div className="allergens-section">
                <h3>Allergens</h3>
                <div className="allergen-list">
                  {listing.allergens.map((allergen, idx) => (
                    <span key={idx} className="allergen-tag">{allergen}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="pickup-section">
              <h3>Pickup Details</h3>
              <div className="pickup-info">
                <div className="info-row">
                  <FaClock />
                  <div>
                    <strong>Time Window</strong>
                    <p>{listing.pickupTime?.startTime} - {listing.pickupTime?.endTime}</p>
                  </div>
                </div>
                <div className="info-row">
                  <FaMapMarkerAlt />
                  <div>
                    <strong>Location</strong>
                    <p>
                      {listing.pickupLocation?.street}
                      <br />
                      {listing.pickupLocation?.city}, {listing.pickupLocation?.state} {listing.pickupLocation?.zipCode}
                    </p>
                  </div>
                </div>
              </div>

              {listing.pickupInstructions && (
                <div className="instructions">
                  <strong>Special Instructions:</strong>
                  <p>{listing.pickupInstructions}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Donor Info & Request Form */}
          <div className="sidebar-column">
            <div className="donor-card">
              <img
                src={listing.donor.profileImage || placeholder100}
                alt="donor"
                className="donor-image"
              />
              <h2>{listing.donor.name}</h2>

              <div className="rating-section">
                <div className="stars">
                  <FaStar className="star-icon" />
                  <span className="rating-value">{listing.donor.averageRating?.toFixed(1) || 'N/A'}</span>
                </div>
                <p className="rating-count">({listing.donor.totalRatings} ratings)</p>
              </div>

              {listing.donor.bio && (
                <p className="donor-bio">{listing.donor.bio}</p>
              )}

              <div className="donor-contact">
                <div className="contact-item">
                  <FaPhone />
                  <span>{listing.donor.phone}</span>
                </div>
              </div>

              <div className="donor-stats">
                <div className="stat">
                  <div className="stat-value">-</div>
                  <div className="stat-label">Food Shared</div>
                </div>
                <div className="stat">
                  <div className="stat-value">-</div>
                  <div className="stat-label">Volunteers</div>
                </div>
              </div>

              {isAuthenticated && user && user._id !== listing.donor._id && (
                <button
                  className="btn-rate-user"
                  onClick={() => setShowRatingModal(true)}
                >
                  <FaThumbsUp /> Rate This User
                </button>
              )}
            </div>

            {listing.status === 'available' && (
              <div className="request-section">
                {!showRequestForm ? (
                  <button
                    className="btn-primary request-btn"
                    onClick={() => setShowRequestForm(true)}
                  >
                    Request This Food
                  </button>
                ) : (
                  <form onSubmit={handleSubmitRequest} className="request-form">
                    <h3>Request Food</h3>

                    <div className="form-group">
                      <label>Quantity Needed</label>
                      <input
                        type="number"
                        value={requestData.quantityRequested}
                        onChange={(e) => setRequestData(prev => ({
                          ...prev,
                          quantityRequested: e.target.value
                        }))}
                        className="input-field"
                        max={listing.quantity}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Pickup Date</label>
                      <input
                        type="date"
                        value={requestData.pickupDate}
                        onChange={(e) => setRequestData(prev => ({
                          ...prev,
                          pickupDate: e.target.value
                        }))}
                        className="input-field"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Pickup Time</label>
                      <input
                        type="time"
                        value={requestData.pickupTime}
                        onChange={(e) => setRequestData(prev => ({
                          ...prev,
                          pickupTime: e.target.value
                        }))}
                        className="input-field"
                      />
                    </div>

                    <div className="form-group">
                      <label>Notes</label>
                      <textarea
                        value={requestData.notes}
                        onChange={(e) => setRequestData(prev => ({
                          ...prev,
                          notes: e.target.value
                        }))}
                        className="input-field"
                        rows="3"
                        placeholder="Any special requirements or questions..."
                      ></textarea>
                    </div>

                    <button type="submit" className="btn-primary" disabled={submitting}>
                      {submitting ? 'Submitting...' : 'Submit Request'}
                    </button>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => setShowRequestForm(false)}
                    >
                      Cancel
                    </button>
                  </form>
                )}
              </div>
            )}

            {listing.status !== 'available' && (
              <div className="unavailable-notice">
                <p>This food is no longer available</p>
              </div>
            )}
          </div>
        </div>

        {showRatingModal && listing && listing.donor && (
          <div className="modal-overlay" onClick={() => setShowRatingModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Rate {listing.donor.name}</h3>
                <button className="close-btn" onClick={() => setShowRatingModal(false)}>×</button>
              </div>

              <form onSubmit={handleRateUser} className="rating-form">
                <div className="form-group">
                  <label>How would you rate this user?</label>
                  <div className="stars-input">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={i < ratingData.rating ? 'star-filled' : 'star-empty'}
                        onClick={() => setRatingData({ ...ratingData, rating: i + 1 })}
                      />
                    ))}
                  </div>
                  <p className="rating-label">{ratingData.rating} out of 5 stars</p>
                </div>

                <div className="form-group">
                  <label>Review (optional)</label>
                  <textarea
                    placeholder="Share your experience with this user..."
                    value={ratingData.review}
                    onChange={(e) => setRatingData({ ...ratingData, review: e.target.value })}
                    rows="4"
                    className="input-field"
                  ></textarea>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-primary" disabled={submittingRating}>
                    {submittingRating ? 'Submitting...' : 'Submit Rating'}
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setShowRatingModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
