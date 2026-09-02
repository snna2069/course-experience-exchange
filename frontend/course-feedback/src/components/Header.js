import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

const Header = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  return (
    <header className="site-header">
      <Link to="/" className="brand"><span className="brand-mark">✳</span><span>course<br /><b>exchange</b></span></Link>
      <nav><Link className={location.pathname === '/' ? 'active' : ''} to="/">Discover</Link><a href="/#catalog">Catalog</a><Link className={location.pathname === '/profile' ? 'active' : ''} to="/profile">{user ? 'My profile' : 'Sign in'}</Link>{user && <button onClick={logout}>Log out</button>}</nav>
    </header>
  );
};
export default Header;
