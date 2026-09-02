import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  if (user) return <main className="auth-page"><div className="auth-card"><span className="auth-symbol">✳</span><span className="eyebrow">YOUR SPACE</span><h1>Welcome back,<br /><em>{user.name}.</em></h1><p>Your course notes and recommendations are ready.</p><button className="auth-button" onClick={() => navigate('/')}>Explore courses ↗</button><button className="text-button" onClick={logout}>Log out</button></div></main>;
  const submit = (event) => { event.preventDefault(); login({ id: `demo-${Date.now()}`, name: email.split('@')[0] || 'Student', email, joinYear: new Date().getFullYear(), savedCourses: 0, notesShared: 0 }); navigate('/'); };
  return <main className="auth-page"><div className="auth-card"><span className="auth-symbol">✳</span><span className="eyebrow">WELCOME BACK</span><h1>Find a class<br /><em>you'll love.</em></h1><p>Sign in to share notes and keep track of your discoveries.</p><form onSubmit={submit}><label>Email address<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@university.edu" required /></label><label>Password<input type="password" placeholder="••••••••" required /></label><button className="auth-button" type="submit">Continue ↗</button></form><div className="auth-switch">New here? <Link to="/signup">Create an account</Link></div></div></main>;
};
export default Login;
