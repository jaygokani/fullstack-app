import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import apiService from '../services/api';

const EmailVerificationPage = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState('Verifying your email...');
  const [error, setError] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      apiService.verifyEmail(token)
        .then(response => {
          setMessage(response.data.message || 'Email verified successfully! You can now log in.');
          setError('');
        })
        .catch(err => {
          setError(err.response?.data?.message || 'Failed to verify email. The link may be invalid or expired.');
          setMessage('');
        });
    } else {
      setError('No verification token found. Please check the link or try registering again.');
      setMessage('');
    }
  }, [searchParams]);

  return (
    <div>
      <h1>Email Verification</h1>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {/* You can add a link to the login page here */}
      {(message.includes('successfully') || message.includes('already verified')) && (
        <p><Link to="/admin-login">Go to Admin Login</Link></p>
        // Add a link to customer login if you create one
      )}
    </div>
  );
};

export default EmailVerificationPage;
