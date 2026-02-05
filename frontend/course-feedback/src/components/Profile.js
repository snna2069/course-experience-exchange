import React, { useState } from 'react';
import Login from './Login'; // Your Login form
import './Profile.css'; // Custom styles

const Profile = () => {
  const [activeTab, setActiveTab] = useState('login'); // State for active tab

  return (
    <div className="profile-container">

      {/* Sliding Content */}
      <div className="tab-content">
        <div
          className={`content-panel ${activeTab === 'login' ? 'active' : ''}`}
        >
          <Login />
        </div>
      </div>
    </div>
  );
};

export default Profile;
