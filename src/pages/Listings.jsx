import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt, FaFilter } from 'react-icons/fa';
import { foodListingService } from '../services/api';
import FoodCard from '../components/FoodCard';
import './Listings.css';

export default function Listings() {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'available',
    category: '',
    city: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchListings();
  }, [filters, searchTerm]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = {
        status: filters.status
      };

      const response = await foodListingService.getAll(params);
      let data = response.data;

      // Client-side filtering
      if (filters.category) {
        data = data.filter(l => l.category === filters.category);
      }
      if (filters.city) {
        data = data.filter(l => l.pickupLocation?.city.toLowerCase().includes(filters.city.toLowerCase()));
      }
      if (searchTerm.trim()) {
        const terms = searchTerm
          .toLowerCase()
          .split(/\s+/)
          .filter(Boolean);

        data = data.filter(l => {
          const haystack = [
            l.foodName,
            l.category,
            l.description,
            l.pickupLocation?.city,
            l.pickupLocation?.state
          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();

          return terms.every(term => haystack.includes(term));
        });
      }

      setListings(data);
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['fruits', 'vegetables', 'grains', 'dairy', 'meat', 'cooked', 'packaged', 'other'];

  return (
    <div className="listings-page">
      <div className="container">
        <div className="listings-header">
          <h1>Available Food Nearby</h1>
          <p>Find food items being shared in your community</p>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="filter-group">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search for food..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-group">
            <label>Category</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="input-field"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>City</label>
            <input
              type="text"
              placeholder="Filter by city..."
              value={filters.city}
              onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
              className="input-field"
            />
          </div>

          <div className="filter-group">
            <label>Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="input-field"
            >
              <option value="available">Available</option>
              <option value="claimed">Claimed</option>
              <option value="">All</option>
            </select>
          </div>

          <button
            className="btn-secondary reset-btn"
            onClick={() => {
              setFilters({ status: 'available', category: '', city: '' });
              setSearchTerm('');
            }}
          >
            Reset Filters
          </button>
        </div>

        {/* Results */}
        <div className="listings-results">
          {loading ? (
            <div className="loading-spinner"></div>
          ) : listings.length === 0 ? (
            <div className="no-results">
              <p>No listings found matching your criteria</p>
              <button className="btn-primary" onClick={() => navigate('/')}>
                Back to Home
              </button>
            </div>
          ) : (
            <>
              <div className="results-info">
                <p>{listings.length} listing{listings.length !== 1 ? 's' : ''} found</p>
              </div>
              <div className="listings-grid">
                {listings.map(listing => (
                  <FoodCard
                    key={listing._id}
                    listing={listing}
                    onViewDetails={(id) => navigate(`/listings/${id}`)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
