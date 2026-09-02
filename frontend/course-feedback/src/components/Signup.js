import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api'; // Shared axios instance (see src/api/api.js)

const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState(''); // State to store the full name
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
      // POST /api/auth/register expects { name, email, password } and
      // responds with { message } on success (see backend/routes/auth.js).
      const response = await api.post('/auth/register', { name, email, password });
      alert(response.data.message || 'Sign up successful! Please log in.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Error signing up!');
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignUp}>
        <div className="input-container">
          <label htmlFor="name">Full Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
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
