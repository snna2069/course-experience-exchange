import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const LoginPage = () => {
  const { login, logout, currentUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    const userData = { email };
    login(userData);
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    const newUser = { email, password };
    login(newUser);
    alert('Sign Up successful! You are now logged in.');
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="login-page-wrapper">
      {currentUser ? (
        <div className="welcome-message-container">
          <h2>Welcome, {currentUser.email}!</h2>
          <p>Have a great time exploring courses and sharing your reviews.</p>
          <p>Happy Learning!</p>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      ) : (
        <div className="login-page-container">
          <div className="login-form-container">
            <h2>Course Experience Exchange</h2>
            <p>{isSignUp ? 'Sign up to start exploring!' : 'Log in to continue'}</p>

            <form onSubmit={isSignUp ? handleSignUp : handleLogin}>
              <div className="input-container">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="input-container">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {isSignUp && (
                <div className="input-container">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              )}
              <button type="submit" className="login-btn">
                {isSignUp ? 'Sign Up' : 'Login'}
              </button>
            </form>

            <div className="toggle-form">
              <p>{isSignUp ? 'Already have an account?' : "Don't have an account?"}</p>
              <button
                className="toggle-btn"
                onClick={() => setIsSignUp(!isSignUp)}
              >
                {isSignUp ? 'Login here' : 'Sign Up'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
