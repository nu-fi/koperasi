// pages/Profile.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SensitiveField from '../../context/SensitiveField';
import { useAuth } from '../../context/AuthContext';


const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { logoutAction } = useAuth(); // Handle 401 errors

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('access'); // Get the key to the vault
        
        const response = await axios.get('http://127.0.0.1:8000/user/profile/', {
          headers: {
            'Authorization': `Bearer ${token}` // <--- Unlock the door
          }
        });
        
        setProfileData(response.data.data);
      } catch (error) {
        console.error("Failed to fetch profile", error);
        // If token is expired, logout
        if (error.response && error.response.status === 401) {
            logoutAction(); 
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div className="p-10">Loading Secure Data...</div>;
  if (!profileData) return <div className="p-10 text-red-500">Error loading data.</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">My Member Profile</h2>

      {/* Public Data (Safe to show) */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-500">Full Name</label>
        <p className="text-lg font-semibold">{profileData.first_name} {profileData.last_name}</p>
      </div>

      {/* SENSITIVE DATA (Use the secure component) */}
      <SensitiveField label="KTP Number (NIK)" value={profileData.ktp_number} />
      <SensitiveField label="Phone Number" value={profileData.phone_number} />
      
    </div>
  );
};

export default Profile;