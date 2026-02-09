import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaEdit, FaSave, FaTimes, FaStar } from 'react-icons/fa';
import useAuthStore from '../context/authStore';
import { userService } from '../services/api';
import './Profile.css';

const emptyProfile = {
  name: '',
  phone: '',
  bio: '',
  address: {
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  }
};

export default function Profile() {
  const navigate = useNavigate();
  const { user, isAuthenticated, setUser } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const derivedRole = useMemo(() => profile?.role || user?.role || 'donor', [profile, user]);
  const profileImage = profile?.profileImage || '';
  const displayImage = imagePreview || profileImage;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchProfile();
  }, [isAuthenticated]);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const hydrateForm = (data) => {
    setFormData({
      name: data?.name || '',
      phone: data?.phone || '',
      bio: data?.bio || '',
      address: {
        street: data?.address?.street || '',
        city: data?.address?.city || '',
        state: data?.address?.state || '',
        zipCode: data?.address?.zipCode || '',
        country: data?.address?.country || ''
      }
    });
  };

  const fetchProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await userService.getProfile();
      setProfile(response.data);
      hydrateForm(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value
      }
    }));
  };

  const handleCancel = () => {
    hydrateForm(profile);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview('');
    }
    setImageFile(null);
    setEditing(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setError('');
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleUploadImage = async () => {
    if (!imageFile) {
      return;
    }

    setUploading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      const response = await userService.uploadProfileImage(formData);
      const updatedUser = response.data.user;
      setProfile(updatedUser);
      hydrateForm(updatedUser);
      if (user) {
        setUser({
          ...user,
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role
        });
      }
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      setImagePreview('');
      setImageFile(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const response = await userService.updateProfile({
        name: formData.name,
        phone: formData.phone,
        bio: formData.bio,
        address: formData.address
      });
      const updatedUser = response.data.user;
      setProfile(updatedUser);
      hydrateForm(updatedUser);
      setEditing(false);
      if (user) {
        setUser({
          ...user,
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role
        });
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="container">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <div className="profile-identity">
            <div className="profile-avatar">
              {displayImage ? (
                <img src={displayImage} alt="profile" />
              ) : (
                <FaUserCircle />
              )}
            </div>
            {editing && (
              <div className="avatar-actions">
                <label className="avatar-upload">
                  <input type="file" accept="image/*" onChange={handleImageChange} />
                  Change Photo
                </label>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleUploadImage}
                  disabled={!imageFile || uploading}
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            )}
            <div className="profile-summary">
              <h1>{profile?.name || user?.name || 'Your Profile'}</h1>
              <p className="profile-role">{derivedRole.toUpperCase()}</p>
              <div className="profile-meta">
                <span><FaEnvelope /> {profile?.email || user?.email}</span>
                <span><FaPhoneAlt /> {profile?.phone || 'Add your phone number'}</span>
                <span><FaMapMarkerAlt /> {profile?.address?.city || 'Add your city'}</span>
              </div>
            </div>
          </div>
          <div className="profile-actions">
            {!editing ? (
              <button className="btn-primary" onClick={() => setEditing(true)}>
                <FaEdit /> Edit Profile
              </button>
            ) : (
              <div className="profile-action-group">
                <button className="btn-primary" onClick={handleSave} disabled={saving}>
                  <FaSave /> {saving ? 'Saving...' : 'Save'}
                </button>
                <button className="btn-secondary" onClick={handleCancel} disabled={saving}>
                  <FaTimes /> Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="profile-grid">
          <div className="profile-card">
            <h2>About You</h2>
            <form onSubmit={handleSave}>
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input-field"
                    disabled={!editing}
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input-field"
                    disabled={!editing}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Bio</label>
                <textarea
                  name="bio"
                  rows="4"
                  value={formData.bio}
                  onChange={handleChange}
                  className="input-field"
                  disabled={!editing}
                ></textarea>
              </div>

              <div className="form-group">
                <label>Street Address</label>
                <input
                  type="text"
                  name="street"
                  value={formData.address.street}
                  onChange={handleAddressChange}
                  className="input-field"
                  disabled={!editing}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.address.city}
                    onChange={handleAddressChange}
                    className="input-field"
                    disabled={!editing}
                  />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.address.state}
                    onChange={handleAddressChange}
                    className="input-field"
                    disabled={!editing}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>ZIP Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.address.zipCode}
                    onChange={handleAddressChange}
                    className="input-field"
                    disabled={!editing}
                  />
                </div>
                <div className="form-group">
                  <label>Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.address.country}
                    onChange={handleAddressChange}
                    className="input-field"
                    disabled={!editing}
                  />
                </div>
              </div>

              {editing && (
                <button type="submit" className="btn-primary mobile-save" disabled={saving}>
                  <FaSave /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
              )}
            </form>
          </div>

          <div className="profile-card profile-side">
            <h2>Account Highlights</h2>
            <div className="highlight-item">
              <span>Role</span>
              <strong>{derivedRole.toUpperCase()}</strong>
            </div>
            <div className="highlight-item">
              <span>Email</span>
              <strong>{profile?.email || user?.email}</strong>
            </div>
            <div className="highlight-item">
              <span>Rating</span>
              <strong>
                <FaStar className="rating-icon" /> {profile?.averageRating?.toFixed(1) || '0.0'}
              </strong>
            </div>
            <div className="highlight-item">
              <span>Total Reviews</span>
              <strong>{profile?.totalRatings || 0}</strong>
            </div>
            <div className="highlight-item">
              <span>User ID</span>
              <strong>{profile?._id || user?.id}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
