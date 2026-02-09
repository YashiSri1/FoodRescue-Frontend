import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { foodListingService } from '../services/api';
import useAuthStore from '../context/authStore';
import './CreateListing.css';

const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands',
  'Chandigarh', 'Dadra and Nagar Haveli', 'Daman and Diu', 'Delhi', 'Lakshadweep',
  'Puducherry'
];

const CITIES_BY_STATE = {
  'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Tirupati', 'Nellore'],
  'Arunachal Pradesh': ['Itanagar', 'Dibruggarh', 'Naharlagun'],
  'Assam': ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Barpeta'],
  'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Darbhanga'],
  'Chhattisgarh': ['Raipur', 'Bilaspur', 'Durg', 'Rajnandgaon', 'Raigarh'],
  'Goa': ['Panaji', 'Margao', 'Vasco da Gama', 'Mapusa', 'Ponda'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Jamnagar', 'Gandhinagar'],
  'Haryana': ['Faridabad', 'Gurgaon', 'Hisar', 'Panipat', 'Rohtak', 'Chandigarh'],
  'Himachal Pradesh': ['Shimla', 'Solan', 'Mandi', 'Kangra', 'Kullu'],
  'Jharkhand': ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Giridih', 'Bokaro'],
  'Karnataka': ['Bangalore', 'Mysore', 'Mangalore', 'Belgaum', 'Davangere', 'Udupi'],
  'Kerala': ['Kochi', 'Thiruvananthapuram', 'Kannur', 'Alappuzha', 'Kozhikode'],
  'Madhya Pradesh': ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain'],
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Aurangabad', 'Nashik', 'Solapur'],
  'Manipur': ['Imphal', 'Bishnupur', 'Thoubal', 'Ukhrul'],
  'Meghalaya': ['Shillong', 'Tura', 'Jowai', 'Nongstoin'],
  'Mizoram': ['Aizawl', 'Lunglei', 'Saiha', 'Champhai'],
  'Nagaland': ['Kohima', 'Dimapur', 'Mokokchung', 'Zunheboto'],
  'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur', 'Sambalpur'],
  'Punjab': ['Chandigarh', 'Ludhiana', 'Amritsar', 'Patiala', 'Jalandhar'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Ajmer', 'Bikaner'],
  'Sikkim': ['Gangtok', 'Pelling', 'Yuksom', 'Namchi'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Tiruchirappalli'],
  'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar'],
  'Tripura': ['Agartala', 'Udaipur', 'Ambassa', 'Kailashahar'],
  'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Ghaziabad', 'Agra', 'Varanasi', 'Meerut'],
  'Uttarakhand': ['Dehradun', 'Haridwar', 'Rishikesh', 'Almora', 'Nainital'],
  'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Siliguri', 'Asansol'],
  'Andaman and Nicobar Islands': ['Port Blair', 'Car Nicobar'],
  'Chandigarh': ['Chandigarh'],
  'Dadra and Nagar Haveli': ['Silvassa', 'Dadra'],
  'Daman and Diu': ['Daman', 'Diu'],
  'Delhi': ['New Delhi', 'Delhi'],
  'Lakshadweep': ['Kavaratti', 'Agatti'],
  'Puducherry': ['Puducherry', 'Yanam', 'Mahe', 'Karaikal']
};

export default function EditListing() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    foodName: '',
    description: '',
    quantity: '',
    unit: 'kg',
    category: 'Vegetables',
    expiryDate: '',
    pickupTime: { startTime: '09:00', endTime: '18:00' },
    pickupLocation: { street: '', city: '', state: '', zipCode: '' },
    pickupInstructions: '',
    allergens: [],
    image: null
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchListing();
  }, [isAuthenticated, id]);

  const fetchListing = async () => {
    try {
      const response = await foodListingService.getById(id);
      setFormData({
        foodName: response.data.foodName,
        description: response.data.description,
        quantity: response.data.quantity,
        unit: response.data.unit,
        category: response.data.category,
        expiryDate: response.data.expiryDate?.split('T')[0],
        pickupTime: response.data.pickupTime || { startTime: '09:00', endTime: '18:00' },
        pickupLocation: response.data.pickupLocation || { street: '', city: '', state: '', zipCode: '' },
        pickupInstructions: response.data.pickupInstructions || '',
        allergens: response.data.allergens || [],
        image: null
      });
    } catch (error) {
      alert('Error loading listing: ' + error.response?.data?.error);
      navigate('/my-listings');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.foodName || !formData.quantity || !formData.expiryDate) {
      alert('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const updateData = { ...formData };
      // Remove image if not changed
      if (!formData.image) {
        delete updateData.image;
      }

      await foodListingService.update(id, updateData);
      alert('Listing updated successfully!');
      navigate('/my-listings');
    } catch (error) {
      alert('Error updating listing: ' + error.response?.data?.error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="container"><div className="loading-spinner"></div></div>;
  }

  return (
    <div className="create-listing-page">
      <div className="container">
        <button className="back-btn" onClick={() => navigate('/my-listings')}>
          <FaArrowLeft /> Back to My Listings
        </button>

        <div className="form-container">
          <h1>Edit Food Listing</h1>

          <form onSubmit={handleSubmit} className="listing-form">
            {/* Food Details Section */}
            <fieldset>
              <legend>Food Details</legend>

              <div className="form-group">
                <label>Food Name *</label>
                <input
                  type="text"
                  value={formData.foodName}
                  onChange={(e) => setFormData({ ...formData, foodName: e.target.value })}
                  placeholder="e.g., Fresh Vegetables"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Quantity *</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    placeholder="10"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Unit</label>
                  <select value={formData.unit} onChange={(e) => setFormData({ ...formData, unit: e.target.value })}>
                    <option>kg</option>
                    <option>liter</option>
                    <option>pieces</option>
                    <option>boxes</option>
                    <option>dozen</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Category</label>
                <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                  <option>Vegetables</option>
                  <option>Fruits</option>
                  <option>Dairy</option>
                  <option>Bakery</option>
                  <option>Cooked Food</option>
                  <option>Others</option>
                </select>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the food, condition, and any special details"
                  rows="4"
                ></textarea>
              </div>
            </fieldset>

            {/* Expiry & Pickup Section */}
            <fieldset>
              <legend>Expiry & Pickup Details</legend>

              <div className="form-group">
                <label>Expiry Date *</label>
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Pickup Start Time</label>
                  <input
                    type="time"
                    value={formData.pickupTime.startTime}
                    onChange={(e) => setFormData({
                      ...formData,
                      pickupTime: { ...formData.pickupTime, startTime: e.target.value }
                    })}
                  />
                </div>
                <div className="form-group">
                  <label>Pickup End Time</label>
                  <input
                    type="time"
                    value={formData.pickupTime.endTime}
                    onChange={(e) => setFormData({
                      ...formData,
                      pickupTime: { ...formData.pickupTime, endTime: e.target.value }
                    })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Pickup Instructions</label>
                <textarea
                  value={formData.pickupInstructions}
                  onChange={(e) => setFormData({ ...formData, pickupInstructions: e.target.value })}
                  placeholder="E.g., Ring the bell, knock on gate, etc."
                  rows="3"
                ></textarea>
              </div>
            </fieldset>

            {/* Location Section */}
            <fieldset>
              <legend>Pickup Location</legend>

              <div className="form-group">
                <label>Street Address</label>
                <input
                  type="text"
                  value={formData.pickupLocation.street}
                  onChange={(e) => setFormData({
                    ...formData,
                    pickupLocation: { ...formData.pickupLocation, street: e.target.value }
                  })}
                  placeholder="Street address"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>State</label>
                  <select
                    value={formData.pickupLocation.state}
                    onChange={(e) => setFormData({
                      ...formData,
                      pickupLocation: { ...formData.pickupLocation, state: e.target.value }
                    })}
                  >
                    <option value="">Select State</option>
                    {STATES.map(state => <option key={state} value={state}>{state}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label>City</label>
                  <select
                    value={formData.pickupLocation.city}
                    onChange={(e) => setFormData({
                      ...formData,
                      pickupLocation: { ...formData.pickupLocation, city: e.target.value }
                    })}
                  >
                    <option value="">Select City</option>
                    {formData.pickupLocation.state && CITIES_BY_STATE[formData.pickupLocation.state]?.map(city =>
                      <option key={city} value={city}>{city}</option>
                    )}
                  </select>
                </div>

                <div className="form-group">
                  <label>Zip Code</label>
                  <input
                    type="text"
                    value={formData.pickupLocation.zipCode}
                    onChange={(e) => setFormData({
                      ...formData,
                      pickupLocation: { ...formData.pickupLocation, zipCode: e.target.value }
                    })}
                    placeholder="000000"
                  />
                </div>
              </div>
            </fieldset>

            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting ? 'Updating...' : 'Update Listing'}
              </button>
              <button type="button" className="btn-secondary" onClick={() => navigate('/my-listings')}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
