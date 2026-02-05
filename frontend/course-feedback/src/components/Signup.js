import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Make sure to import the authentication context

const Signup = () => {
  const { login } = useAuth(); // Get login function from AuthContext
  const [email, setEmail] = useState(''); // State to store the email
  const [password, setPassword] = useState(''); // State to store the password
  const [confirmPassword, setConfirmPassword] = useState(''); // State for confirming password
  const [error, setError] = useState(''); // State for handling errors

  // Handle sign-up form submission
  const handleSignUp = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords don't match!");
      return;
    }

    try {
      // Make a POST request to the backend API for user registration
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }), // Pass email and password to the backend
      });

      const data = await response.json();

      if (response.ok) {
        // On successful sign-up, log the user in immediately
        login({ email }); // You might want to store other data like a token
        alert("Sign Up successful! Welcome aboard!");
      } else {
        alert(data.message || "Error signing up!");
      }
    } catch (error) {
      console.error('Error signing up:', error);
      alert("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignUp}>
        <div className="input-container">
          <label htmlFor="email">Email:</label>
          <input 
            type="email" 
            id="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div className="input-container">
          <label htmlFor="password">Password:</label>
          <input 
            type="password" 
            id="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <div className="input-container">
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input 
            type="password" 
            id="confirmPassword" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            required 
          />
        </div>

        {/* Display error message if passwords don't match */}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
