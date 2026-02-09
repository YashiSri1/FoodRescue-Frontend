import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaBoxOpen, FaCalendarAlt, FaMapMarkerAlt, FaStickyNote, FaTimesCircle } from 'react-icons/fa';
import useAuthStore from '../context/authStore';
import { requestService } from '../services/api';
import ModalPrompt from '../components/ModalPrompt';
import './MyRequests.css';

export default function MyRequests() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelReason, setCancelReason] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchRequests();
  }, [isAuthenticated]);

  const fetchRequests = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await requestService.getMyRequests();
      setRequests(response.data || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to load requests');
    } finally {
      setLoading(false);
    }
  };

  const statusLabel = useMemo(() => ({
    pending: 'Pending',
    accepted: 'Accepted',
    rejected: 'Rejected',
    completed: 'Completed',
    cancelled: 'Cancelled'
  }), []);

  const canCancel = (status) => ['pending', 'accepted'].includes(status);

  const openCancelModal = (requestId) => {
    setCancelTarget(requestId);
    setCancelReason('');
  };

  const closeCancelModal = () => {
    setCancelTarget(null);
    setCancelReason('');
  };

  const confirmCancel = async () => {
    if (!cancelTarget) {
      return;
    }

    try {
      await requestService.cancel(cancelTarget, {
        cancelReason: cancelReason.trim() || 'Cancelled by user'
      });
      closeCancelModal();
      fetchRequests();
    } catch (err) {
      alert(err.response?.data?.error || 'Unable to cancel request');
    }
  };

  return (
    <div className="my-requests-page">
      <div className="container">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          <FaArrowLeft /> Back to Dashboard
        </button>

        <div className="requests-header">
          <div>
            <h1>My Requests</h1>
            <p>Track the food requests you have placed</p>
          </div>
          <button className="btn-secondary" onClick={fetchRequests}>
            Refresh
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="requests-content">
          {loading ? (
            <div className="loading-spinner"></div>
          ) : requests.length === 0 ? (
            <div className="empty-state">
              <p>No requests yet. Start by browsing available food.</p>
              <button className="btn-primary" onClick={() => navigate('/listings')}>
                Browse Food
              </button>
            </div>
          ) : (
            <div className="requests-grid">
              {requests.map((request) => {
                const listing = request.foodListing;
                return (
                  <div key={request._id} className="request-card">
                    <div className="request-card-header">
                      <div>
                        <h3>{listing?.foodName || 'Listing Unavailable'}</h3>
                        <span className={`status-badge status-${request.status}`}>
                          {statusLabel[request.status] || request.status}
                        </span>
                      </div>
                      {listing?._id && (
                        <button className="btn-primary" onClick={() => navigate(`/listings/${listing._id}`)}>
                          View Listing
                        </button>
                      )}
                    </div>

                    <div className="request-details">
                      <div className="detail-item">
                        <FaBoxOpen />
                        <span>
                          Requested: {request.quantityRequested} {listing?.unit || 'items'}
                        </span>
                      </div>
                      <div className="detail-item">
                        <FaCalendarAlt />
                        <span>
                          Pickup: {new Date(request.pickupDate).toLocaleDateString()} {request.pickupTime || ''}
                        </span>
                      </div>
                      <div className="detail-item">
                        <FaMapMarkerAlt />
                        <span>
                          {listing?.pickupLocation?.city || 'Location unavailable'}
                        </span>
                      </div>
                    </div>

                    {request.notes && (
                      <div className="request-notes">
                        <FaStickyNote />
                        <p>{request.notes}</p>
                      </div>
                    )}

                    {request.responseMessage && (
                      <div className="response-message">
                        <strong>Response:</strong> {request.responseMessage}
                      </div>
                    )}

                    {canCancel(request.status) && (
                      <button className="btn-secondary cancel-btn" onClick={() => openCancelModal(request._id)}>
                        <FaTimesCircle /> Cancel Request
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <ModalPrompt
        isOpen={Boolean(cancelTarget)}
        title="Cancel request"
        message="Reason for canceling? (optional)"
        placeholder="Add a short reason"
        value={cancelReason}
        onChange={(event) => setCancelReason(event.target.value)}
        onConfirm={confirmCancel}
        onCancel={closeCancelModal}
        confirmLabel="Cancel Request"
      />
    </div>
  );
}
