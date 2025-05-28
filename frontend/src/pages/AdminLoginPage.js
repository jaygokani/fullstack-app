import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For redirecting after login
import apiService from '../services/api';

const AdminLoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }
    try {
      const response = await apiService.loginAdmin(formData);
      setMessage(response.data.message || 'Admin login successful!');
      // console.log('Logged in admin:', response.data.user); // Or handle JWT
      // Redirect to an admin dashboard or another protected route
      // navigate('/admin/dashboard'); // Example
      setFormData({ email: '', password: ''});
    } catch (err) {
      setError(err.response?.data?.message || 'Error during admin login.');
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Admin Login</h1>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={onChange}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default AdminLoginPage;
