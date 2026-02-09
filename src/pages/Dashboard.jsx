import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { foodListingService, requestService } from '../services/api';
import useAuthStore from '../context/authStore';
import FoodCard from '../components/FoodCard';
import './Dashboard.css';

export default function Dashboard({ activeTab: initialTab = 'listings' }) {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [myListings, setMyListings] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [requestsForMyListings, setRequestsForMyListings] = useState([]);
  const [activeTab, setActiveTab] = useState(initialTab);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [isAuthenticated]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [listings, requests, listingRequests] = await Promise.all([
        foodListingService.getMyListings(),
        requestService.getMyRequests(),
        requestService.getRequestsForMyListings()
      ]);
      setMyListings(listings.data);
      setMyRequests(requests.data);
      setRequestsForMyListings(listingRequests.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteListing = async (id) => {
    if (confirm('Are you sure you want to delete this listing?')) {
      try {
        await foodListingService.delete(id);
        setMyListings(myListings.filter(l => l._id !== id));
      } catch (error) {
        alert('Error deleting listing');
      }
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      await requestService.accept(requestId);
      alert('Request accepted!');
      fetchData();
    } catch (error) {
      alert('Error accepting request: ' + error.response?.data?.error);
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      await requestService.reject(requestId, { reason: 'Rejected by donor' });
      alert('Request rejected!');
      fetchData();
    } catch (error) {
      alert('Error rejecting request: ' + error.response?.data?.error);
    }
  };

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="dashboard-header">
          <h1>Welcome, {user?.name}!</h1>
          <button className="btn-primary" onClick={() => navigate('/create-listing')}>
            <FaPlus /> Create New Listing
          </button>
        </div>

        <div className="dashboard-tabs">
          <button
            className={`tab-btn ${activeTab === 'listings' ? 'active' : ''}`}
            onClick={() => setActiveTab('listings')}
          >
            My Listings ({myListings.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'requests' ? 'active' : ''}`}
            onClick={() => setActiveTab('requests')}
          >
            My Requests ({myRequests.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'received' ? 'active' : ''}`}
            onClick={() => setActiveTab('received')}
          >
            Requests for My Food ({requestsForMyListings.length})
          </button>
        </div>

        <div className="dashboard-content">
          {loading ? (
            <div className="loading-spinner"></div>
          ) : (
            <>
              {activeTab === 'listings' && (
                <div className="tab-content">
                  <h2>My Food Listings</h2>
                  {myListings.length === 0 ? (
                    <p className="empty-state">
                      No listings yet. <a href="/create-listing">Create your first listing</a>
                    </p>
                  ) : (
                    <div className="listings-table">
                      <table>
                        <thead>
                          <tr>
                            <th>Food Item</th>
                            <th>Quantity</th>
                            <th>Status</th>
                            <th>Expires</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {myListings.map(listing => (
                            <tr key={listing._id}>
                              <td>{listing.foodName}</td>
                              <td>{listing.quantity} {listing.unit}</td>
                              <td><span className={`status-badge status-${listing.status}`}>{listing.status}</span></td>
                              <td>{new Date(listing.expiryDate).toLocaleDateString()}</td>
                              <td>
                                <button className="action-btn edit" onClick={() => navigate(`/edit-listing/${listing._id}`)}>
                                  <FaEdit />
                                </button>
                                <button className="action-btn delete" onClick={() => handleDeleteListing(listing._id)}>
                                  <FaTrash />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'requests' && (
                <div className="tab-content">
                  <h2>Requests I've Made</h2>
                  {myRequests.length === 0 ? (
                    <p className="empty-state">No requests yet</p>
                  ) : (
                    <div className="requests-list">
                      {myRequests.map(request => (
                        <div key={request._id} className="request-card">
                          <h3>{request.foodListing?.foodName}</h3>
                          <p>Status: <span className={`status-badge status-${request.status}`}>{request.status}</span></p>
                          <p>Quantity: {request.quantityRequested} {request.foodListing?.unit}</p>
                          <p>Pickup Date: {new Date(request.pickupDate).toLocaleDateString()}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'received' && (
                <div className="tab-content">
                  <h2>Requests for My Listings</h2>
                  {requestsForMyListings.length === 0 ? (
                    <p className="empty-state">No requests yet</p>
                  ) : (
                    <div className="requests-list">
                      {requestsForMyListings.map(request => (
                        <div key={request._id} className="request-card">
                          <h3>{request.foodListing?.foodName}</h3>
                          <p>From: {request.requestedBy?.name}</p>
                          <p>Status: <span className={`status-badge status-${request.status}`}>{request.status}</span></p>
                          <p>Quantity: {request.quantityRequested} {request.foodListing?.unit}</p>
                          <p>Pickup Date: {new Date(request.pickupDate).toLocaleDateString()}</p>
                          {request.status === 'pending' && (
                            <div className="request-actions">
                              <button className="btn-primary" onClick={() => handleAcceptRequest(request._id)}>Accept</button>
                              <button className="btn-secondary" onClick={() => handleRejectRequest(request._id)}>Reject</button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
