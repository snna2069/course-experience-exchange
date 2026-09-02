import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { faGithub, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import './Footer.css';

const Footer = () => (
  <footer className="site-footer">
    <div className="footer-brand">
      <span className="footer-mark">✳</span>
      <div>
        <strong>Built by Sneha Nagaraju</strong>
        <span>Course experiences, shared.</span>
      </div>
    </div>
    <nav className="footer-links" aria-label="Personal links">
      <a href="https://www.linkedin.com/in/snehan-raju/" target="_blank" rel="noreferrer" aria-label="Sneha Nagaraju on LinkedIn">
        <FontAwesomeIcon icon={faLinkedinIn} /> LinkedIn
      </a>
      <a href="https://github.com/snna2069" target="_blank" rel="noreferrer" aria-label="Sneha Nagaraju on GitHub">
        <FontAwesomeIcon icon={faGithub} /> GitHub
      </a>
      <a href="https://snehaa.me/" target="_blank" rel="noreferrer" aria-label="Sneha Nagaraju's portfolio">
        <FontAwesomeIcon icon={faGlobe} /> Portfolio <FontAwesomeIcon className="external-icon" icon={faArrowUpRightFromSquare} />
      </a>
    </nav>
  </footer>
);

export default Footer;
