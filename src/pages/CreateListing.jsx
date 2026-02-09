import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaMapMarkerAlt } from 'react-icons/fa';
import { foodListingService } from '../services/api';
import useAuthStore from '../context/authStore';
import './CreateListing.css';

// Indian States
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

// Major Indian Cities by State
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

// State to Zip Code Mapping (Representative zip codes for each state)
const STATE_ZIP_CODES = {
  'Andhra Pradesh': '530001',
  'Arunachal Pradesh': '790001',
  'Assam': '781001',
  'Bihar': '800001',
  'Chhattisgarh': '492001',
  'Goa': '403001',
  'Gujarat': '380001',
  'Haryana': '121001',
  'Himachal Pradesh': '171001',
  'Jharkhand': '814101',
  'Karnataka': '560001',
  'Kerala': '682001',
  'Madhya Pradesh': '452001',
  'Maharashtra': '400001',
  'Manipur': '795001',
  'Meghalaya': '793001',
  'Mizoram': '796001',
  'Nagaland': '797001',
  'Odisha': '753001',
  'Punjab': '160001',
  'Rajasthan': '302001',
  'Sikkim': '737001',
  'Tamil Nadu': '600001',
  'Telangana': '500001',
  'Tripura': '799001',
  'Uttar Pradesh': '210001',
  'Uttarakhand': '248001',
  'West Bengal': '700001',
  'Andaman and Nicobar Islands': '744101',
  'Chandigarh': '160001',
  'Dadra and Nagar Haveli': '396521',
  'Daman and Diu': '362210',
  'Delhi': '110001',
  'Lakshadweep': '682551',
  'Puducherry': '605001'
};

export default function CreateListing() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [formData, setFormData] = useState({
    foodName: '',
    description: '',
    quantity: '',
    unit: 'pieces',
    category: 'fruits',
    expiryDate: '',
    pickupTime: { startTime: '09:00', endTime: '17:00' },
    pickupLocation: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    },
    location: { latitude: 28.6139, longitude: 77.2090 },
    allergens: [],
    dietary: [],
    pickupInstructions: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [stateDropdown, setStateDropdown] = useState(false);
  const [cityDropdown, setCityDropdown] = useState(false);
  const [filteredStates, setFilteredStates] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated]);

  const handleStateChange = (value) => {
    setFormData(prev => ({
      ...prev,
      pickupLocation: {
        ...prev.pickupLocation,
        state: value,
        city: '' // Reset city when state changes
      }
    }));
    
    if (value.length > 0) {
      const filtered = STATES.filter(s => 
        s.toLowerCase().startsWith(value.toLowerCase())
      );
      setFilteredStates(filtered);
      setStateDropdown(true);
    } else {
      setFilteredStates([]);
      setStateDropdown(false);
    }
    setCityDropdown(false);
  };

  const handleCityChange = (value) => {
    setFormData(prev => ({
      ...prev,
      pickupLocation: {
        ...prev.pickupLocation,
        city: value
      }
    }));
    
    if (value.length > 0 && formData.pickupLocation.state) {
      const availableCities = CITIES_BY_STATE[formData.pickupLocation.state] || [];
      const filtered = availableCities.filter(c => 
        c.toLowerCase().startsWith(value.toLowerCase())
      );
      setFilteredCities(filtered);
      setCityDropdown(true);
    } else {
      setFilteredCities([]);
      setCityDropdown(false);
    }
  };

  const selectState = (state) => {
    setFormData(prev => ({
      ...prev,
      pickupLocation: {
        ...prev.pickupLocation,
        state,
        city: '',
        zipCode: STATE_ZIP_CODES[state] || ''
      }
    }));
    setStateDropdown(false);
    setFilteredStates([]);
    setCityDropdown(false);
  };

  const selectCity = (city) => {
    setFormData(prev => ({
      ...prev,
      pickupLocation: {
        ...prev.pickupLocation,
        city
      }
    }));
    setCityDropdown(false);
    setFilteredCities([]);
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await foodListingService.create(formData);
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.error || 'Error creating listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-listing-page">
      <div className="container">
        <div className="form-header">
          <h1>Create Food Listing</h1>
          <p>Share your surplus food with the community</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="listing-form">
          <fieldset>
            <legend>Food Details</legend>
            
            <div className="form-group">
              <label>Food Name</label>
              <input
                type="text"
                name="foodName"
                value={formData.foodName}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g., Fresh Tomatoes"
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="input-field"
                rows="4"
                placeholder="Describe the food, its condition, preparation..."
                required
              ></textarea>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>

              <div className="form-group">
                <label>Unit</label>
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="kg">Kg</option>
                  <option value="lbs">Lbs</option>
                  <option value="pieces">Pieces</option>
                  <option value="liters">Liters</option>
                  <option value="portions">Portions</option>
                </select>
              </div>

              <div className="form-group">
                <label>Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="fruits">Fruits</option>
                  <option value="vegetables">Vegetables</option>
                  <option value="grains">Grains</option>
                  <option value="dairy">Dairy</option>
                  <option value="meat">Meat</option>
                  <option value="cooked">Cooked Food</option>
                  <option value="packaged">Packaged</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Expiry Date</label>
              <input
                type="datetime-local"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
          </fieldset>

          <fieldset>
            <legend>Pickup Details</legend>

            <div className="form-row">
              <div className="form-group">
                <label>Pickup Start Time</label>
                <input
                  type="time"
                  name="pickupTime.startTime"
                  value={formData.pickupTime.startTime}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>

              <div className="form-group">
                <label>Pickup End Time</label>
                <input
                  type="time"
                  name="pickupTime.endTime"
                  value={formData.pickupTime.endTime}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Pickup Location - Street</label>
              <input
                type="text"
                name="pickupLocation.street"
                value={formData.pickupLocation.street}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <div className="autocomplete-wrapper">
                  <input
                    type="text"
                    name="pickupLocation.city"
                    value={formData.pickupLocation.city}
                    onChange={(e) => handleCityChange(e.target.value)}
                    onFocus={() => {
                      if (formData.pickupLocation.state) {
                        const available = CITIES_BY_STATE[formData.pickupLocation.state] || [];
                        setFilteredCities(available);
                        setCityDropdown(true);
                      }
                    }}
                    onBlur={() => setTimeout(() => setCityDropdown(false), 200)}
                    className="input-field"
                    placeholder={formData.pickupLocation.state ? "Start typing city..." : "Select state first"}
                    disabled={!formData.pickupLocation.state}
                    required
                  />
                  {cityDropdown && filteredCities.length > 0 && (
                    <div className="autocomplete-dropdown">
                      {filteredCities.map((city, idx) => (
                        <div
                          key={idx}
                          className="dropdown-item"
                          onMouseDown={() => selectCity(city)}
                        >
                          {city}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>State</label>
                <div className="autocomplete-wrapper">
                  <input
                    type="text"
                    name="pickupLocation.state"
                    value={formData.pickupLocation.state}
                    onChange={(e) => handleStateChange(e.target.value)}
                    onFocus={() => {
                      setFilteredStates(STATES);
                      setStateDropdown(true);
                    }}
                    onBlur={() => setTimeout(() => setStateDropdown(false), 200)}
                    className="input-field"
                    placeholder="Start typing state..."
                    required
                  />
                  {stateDropdown && filteredStates.length > 0 && (
                    <div className="autocomplete-dropdown">
                      {filteredStates.map((state, idx) => (
                        <div
                          key={idx}
                          className="dropdown-item"
                          onMouseDown={() => selectState(state)}
                        >
                          {state}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>Zip Code {formData.pickupLocation.zipCode && '(Auto-populated)'}</label>
                <div className="zip-code-container">
                  <input
                    type="text"
                    name="pickupLocation.zipCode"
                    value={formData.pickupLocation.zipCode}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Auto-generated from state"
                  />
                  {formData.pickupLocation.zipCode && (
                    <span className="auto-filled-badge">✓ Auto-filled</span>
                  )}
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Pickup Instructions</label>
              <textarea
                name="pickupInstructions"
                value={formData.pickupInstructions}
                onChange={handleChange}
                className="input-field"
                rows="3"
                placeholder="Provide any special instructions for pickup..."
              ></textarea>
            </div>
          </fieldset>

          <fieldset>
            <legend>Additional Information</legend>

            <div className="form-group">
              <label>Allergens (comma separated)</label>
              <input
                type="text"
                name="allergens"
                value={formData.allergens.join(', ')}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  allergens: e.target.value.split(',').map(a => a.trim())
                }))}
                className="input-field"
                placeholder="e.g., peanuts, dairy, gluten"
              />
            </div>
          </fieldset>

          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Creating Listing...' : 'Create Listing'}
            </button>
            <button type="button" className="btn-secondary" onClick={() => navigate('/dashboard')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
