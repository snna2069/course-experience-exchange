import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

const Profile = () => {
  const { user } = useAuth();
  return <main className="profile-page"><div className="profile-card"><div className="profile-avatar">{user ? user.name.split(' ').map((word) => word[0]).join('') : '?'}</div><span className="eyebrow">STUDENT PROFILE</span><h1>{user ? user.name : 'Your learning space'}</h1><p>{user ? user.email : 'Sign in to personalize your course discoveries and share your experience.'}</p>{user ? <div className="profile-stats"><div><strong>4</strong><span>Saved courses</span></div><div><strong>12</strong><span>Notes shared</span></div><div><strong>2025</strong><span>Member since</span></div></div> : <Link className="button profile-button" to="/login">Sign in to continue ↗</Link>}</div></main>;
};
export default Profile;
