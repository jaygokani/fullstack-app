import React from 'react';
import RegistrationForm from '../components/RegistrationForm';
import apiService from '../services/api';

const CustomerRegistrationPage = () => {
  const handleCustomerRegister = async (userData) => {
    return apiService.registerCustomer(userData);
  };

  return (
    <div>
      <h1>Customer Registration</h1>
      <RegistrationForm onSubmit={handleCustomerRegister} formType="Customer" />
    </div>
  );
};

export default CustomerRegistrationPage;