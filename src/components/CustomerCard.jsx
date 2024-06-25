import React from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';

const CustomerCard = ({ customer}) => {
  const { phoneNumber, firstName, lastName, email, address, organization } = customer;

  const handlePushToCRM = async (customer) => {
    try {
      const response = await axios.post('http://localhost:8000/api/customers/push-to-crm', customer);

      toast.success('CRM integration successful');
      console.log('CRM integration successful:', response.data);
    } catch (error) {
      toast.error('Failed to push to CRM');
      console.error('Failed to push to CRM:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="mb-2">
        <strong>Phone Number:</strong> {phoneNumber}
      </div>
      <div className="mb-2">
        <strong>Name:</strong> {firstName} {lastName}
      </div>
      <div className="mb-2">
        <strong>Email:</strong> {email}
      </div>
      <div className="mb-2">
        <strong>Address:</strong> {address.street}, {address.city}, {address.state} {address.zipCode}
      </div>
      <div>
        <strong>Organization:</strong> {organization || 'N/A'}
      </div>
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={handlePushToCRM}
          className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 focus:outline-none"
        >
          Push to CRM
        </button>
      </div>
    </div>
  );
};

export default CustomerCard;
