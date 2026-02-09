import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaClock, FaLeaf, FaUser, FaStar } from 'react-icons/fa';
import placeholder40 from '../assets/placeholder-40.svg';
import './FoodCard.css';

export default function FoodCard({ listing, onViewDetails }) {
  const [distance, setDistance] = useState(null);

  const handleViewDetails = () => {
    onViewDetails(listing._id);
  };

  return (
    <div className="food-card">
      <div className="food-card-header">
        <span className={`status-badge status-${listing.status}`}>
          {listing.status.toUpperCase()}
        </span>
        <div className="food-category">
          <FaLeaf /> {listing.category}
        </div>
      </div>

      <h3 className="food-name">{listing.foodName}</h3>
      <p className="food-description">{listing.description.substring(0, 100)}...</p>

      <div className="food-details">
        <div className="detail-item">
          <span className="label">Quantity:</span>
          <span className="value">{listing.quantity} {listing.unit}</span>
        </div>
        <div className="detail-item">
          <span className="label">Expires:</span>
          <span className="value">{new Date(listing.expiryDate).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="donor-info">
        <img src={listing.donor.profileImage || placeholder40} alt="donor" className="donor-avatar" />
        <div className="donor-details">
          <p className="donor-name">{listing.donor.name}</p>
          <div className="donor-rating">
            <FaStar className="star-icon" />
            <span>{listing.donor.averageRating?.toFixed(1) || 'N/A'}</span>
          </div>
        </div>
      </div>

      <div className="location-info">
        <FaMapMarkerAlt className="location-icon" />
        <span>{listing.pickupLocation?.city}, {listing.pickupLocation?.state}</span>
      </div>

      <div className="pickup-time">
        <FaClock className="time-icon" />
        <span>{listing.pickupTime?.startTime} - {listing.pickupTime?.endTime}</span>
      </div>

      <button className="btn-primary view-details-btn" onClick={handleViewDetails}>
        View Details & Request
      </button>
    </div>
  );
}
