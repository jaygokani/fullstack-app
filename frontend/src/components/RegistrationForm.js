import React, { useState } from 'react';

const RegistrationForm = ({ onSubmit, formType = "Customer" }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const { firstName, lastName, email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    if (!firstName || !lastName || !email || !password) {
      setError('All fields are required.');
      return;
    }
    try {
      const response = await onSubmit(formData);
      setMessage(response.data.message || `${formType} registration successful! Please check your email.`);
      setFormData({ firstName: '', lastName: '', email: '', password: '' }); // Clear form
    } catch (err) {
      setError(err.response?.data?.message || `Error during ${formType.toLowerCase()} registration.`);
      console.error(err);
    }
  };

  return (
    <div>
      <h2>{formType} Registration</h2>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name:</label>
          <input
            type="text"
            name="firstName"
            value={firstName}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <label>Last Name:</label>
          <input
            type="text"
            name="lastName"
            value={lastName}
            onChange={onChange}
            required
          />
        </div>
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
            minLength="6"
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegistrationForm;