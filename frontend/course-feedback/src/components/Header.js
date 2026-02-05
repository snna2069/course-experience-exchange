import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext'; 
import './Header.css';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">
          <img src="/assets/profile-icon.png" alt="Logo" className="logo-icon" />
        </Link>
        <span className="website-name">Course Experience Exchange</span>
      </div>
      <nav className="nav">
        <div>
          <Link to="/profile" className="nav-link">
            <FontAwesomeIcon icon={faUserCircle} /> {user ? 'Profile' : 'Login'}
          </Link>
        </div>
        {user && (
          <button onClick={logout} className="logout-btn">
            Logout
          </button>
        )}
      </nav>
    </header>
  );
};

export default Header;
