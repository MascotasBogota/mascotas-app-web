import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Client-side validation
    if (!formData.fullName.trim()) {
      setError('Full Name is required.');
      return;
    }
    if (!formData.email.trim()) {
      setError('Email is required.');
      return;
    }
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!formData.password) {
      setError('Password is required.');
      return;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed. Please try again.');
      }

      setSuccess('Registration successful! Redirecting to login...');
      setFormData({ fullName: '', email: '', password: '' }); // Clear form
      setTimeout(() => navigate('/login'), 2000); 
    } catch (err) {
      setError(err.message || 'An error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    width: '300px',
    margin: '50px auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '5px',
  };

  const inputStyle = {
    margin: '10px 0',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '3px',
  };

  const buttonStyle = {
    padding: '10px 15px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer',
  };

  const errorStyle = {
    color: 'red',
    margin: '10px 0',
  };

  const successStyle = {
    color: 'green',
    margin: '10px 0',
  };

  return (
    <div style={formStyle}>
      <h2>Register</h2>
      {error && <p style={errorStyle}>{error}</p>}
      {success && <p style={successStyle}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="fullName">Full Name:</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            style={inputStyle}
            disabled={loading}
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={inputStyle}
            disabled={loading}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            style={inputStyle}
            disabled={loading}
          />
        </div>
        <button type="submit" style={buttonStyle} disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
}

export default Register;
