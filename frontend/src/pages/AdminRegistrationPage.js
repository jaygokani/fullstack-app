import React from 'react';
import RegistrationForm from '../components/RegistrationForm';
import apiService from '../services/api';

const AdminRegistrationPage = () => {
  const handleAdminRegister = async (userData) => {
    return apiService.registerAdmin(userData);
  };

  return (
    <div>
      <h1>Admin Registration</h1>
      <RegistrationForm onSubmit={handleAdminRegister} formType="Admin" />
    </div>
  );
};

export default AdminRegistrationPage;
