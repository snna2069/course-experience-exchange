import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Signup = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '' });
  const submit = (event) => { event.preventDefault(); login({ id: `demo-${Date.now()}`, name: form.name, email: form.email, joinYear: new Date().getFullYear(), savedCourses: 0, notesShared: 0 }); navigate('/'); };
  return <main className="auth-page"><div className="auth-card"><span className="auth-symbol">✳</span><span className="eyebrow">JOIN THE EXCHANGE</span><h1>Make learning<br /><em>more human.</em></h1><p>Save your favorite discoveries and add your voice to the catalog.</p><form onSubmit={submit}><label>Your name<input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Alex Morgan" required /></label><label>Email address<input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="you@university.edu" required /></label><label>Password<input type="password" placeholder="••••••••" required /></label><button className="auth-button" type="submit">Create account ↗</button></form><div className="auth-switch">Already a member? <Link to="/login">Sign in</Link></div></div></main>;
};
export default Signup;
