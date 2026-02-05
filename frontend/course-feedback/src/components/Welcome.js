import React from 'react';
import { useLocation } from 'react-router-dom'; // To get the passed state

const Welcome = () => {
  const location = useLocation(); // Get the location object
  const { email } = location.state || {}; // Access the email passed during navigation

  return (
    <div className="welcome-container">
      <h1>Welcome {email}</h1>
      <p>Thank you for signing up!</p>
    </div>
  );
};

export default Welcome;
