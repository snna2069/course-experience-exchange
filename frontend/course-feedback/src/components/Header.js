import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

const Header = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  // "Catalog" is an in-page anchor on the home route. When the user is already
  // on "/" we scroll instead of navigating so the link doesn't appear inert.
  const goToCatalog = (event) => {
    if (location.pathname !== '/') return;
    event.preventDefault();
    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="site-header">
      <Link to="/" className="brand"><span className="brand-mark">✳</span><span>course<br /><b>exchange</b></span></Link>
      <nav><Link className={location.pathname === '/' && location.hash !== '#catalog' ? 'active' : ''} to="/">Discover</Link><Link to="/#catalog" onClick={goToCatalog}>Catalog</Link><Link className={location.pathname === '/profile' ? 'active' : ''} to="/profile">{user ? 'My profile' : 'Sign in'}</Link>{user && <button onClick={logout}>Log out</button>}</nav>
    </header>
  );
};
export default Header;
