import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import CustomerRegistrationPage from './pages/CustomerRegistrationPage';
import AdminRegistrationPage from './pages/AdminRegistrationPage';
import AdminLoginPage from './pages/AdminLoginPage';
import EmailVerificationPage from './pages/EmailVerificationPage';
import './App.css';

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li><Link to="/">Home (Placeholder)</Link></li>
            <li><Link to="/register-customer">Customer Registration</Link></li>
            <li><Link to="/register-admin">Admin Registration</Link></li>
            <li><Link to="/admin-login">Admin Login</Link></li>
          </ul>
        </nav>
        <hr />
        <Routes>
          <Route path="/" element={<div><h2>Welcome! Select an option from the navigation.</h2></div>} />
          <Route path="/register-customer" element={<CustomerRegistrationPage />} />
          <Route path="/register-admin" element={<AdminRegistrationPage />} />
          <Route path="/admin-login" element={<AdminLoginPage />} />
          <Route path="/verify-email" element={<EmailVerificationPage />} />
          {/* Add other routes here */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;