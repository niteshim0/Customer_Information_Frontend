import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import toast from 'react-hot-toast';
import CustomerCard from './CustomerCard';

// Custom zip code validation according to different countries
const zipCodeValidation = (value, context) => {
  const country = context.from[1].value;
  const zipCodePatterns = {
    US: /^[0-9]{5}(-[0-9]{4})?$/, // USA
    CA: /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/, // Canada
    UK: /^([A-Z]{1,2}\d[A-Z\d]? \d[A-Z]{2}|GIR 0AA)$/, // UK
    DE: /^\d{5}$/, // Germany
    FR: /^\d{5}$/, // France
    AU: /^\d{4}$/, // Australia
    IN: /^\d{6}$/, // India
  };

  if (country && zipCodePatterns[country]) {
    return zipCodePatterns[country].test(value) || 'Invalid zip/postal code';
  }

  return true;
};

// Validation schema for customer information form
const schema = yup.object().shape({
  phoneNumber: yup.string().required('Phone number is required'),
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  address: yup.object().shape({
    street: yup.string().required('Street is required'),
    city: yup.string().required('City is required'),
    state: yup.string().required('State is required'),
    zipCode: yup.string().test('is-valid-zip', 'Invalid zip/postal code', zipCodeValidation),
  }),
  organization: yup.string(),
});

const CustomerForm = () => {
  const { register, handleSubmit, control, watch, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
  });
  const [customers, setCustomers] = useState([]);

  const country = watch('address.country', 'IN'); // Default country is India

  const onSubmit = async (data) => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/customers/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      reset();
      const responseData = await response.json();
      setCustomers([...customers, responseData]);
      toast.success('Customer added successfully');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to add customer');
    }
  };

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/v1/customers/all');
        if (!response.ok) {
          throw new Error('Failed to fetch customers');
        }
        const data = await response.json();
        setCustomers(data);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };

    fetchCustomers();
  }, [onSubmit]);

  return (
    <div className="container mx-auto p-6 mt-8">
      <div className="max-w-md mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
        <h1 className="text-center text-cyan-600">Customer Form</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-gray-700">Phone Number</label>
            <Controller
              name="phoneNumber"
              control={control}
              render={({ field }) => (
                <PhoneInput
                  {...field}
                  country={'in'}
                  inputClass="w-full px-3 py-2 border rounded"
                  containerStyle={{ width: '100%' }}
                  inputStyle={{ width: '100%' }}
                  specialLabel=""
                />
              )}
            />
            {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">First Name</label>
            <input
              {...register('firstName')}
              type="text"
              className="w-full px-3 py-2 border rounded"
            />
            {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Last Name</label>
            <input
              {...register('lastName')}
              type="text"
              className="w-full px-3 py-2 border rounded"
            />
            {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              {...register('email')}
              type="email"
              className="w-full px-3 py-2 border rounded"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Street</label>
            <input
              {...register('address.street')}
              type="text"
              className="w-full px-3 py-2 border rounded"
            />
            {errors.address?.street && <p className="text-red-500 text-sm">{errors.address.street.message}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">City</label>
            <input
              {...register('address.city')}
              type="text"
              className="w-full px-3 py-2 border rounded"
            />
            {errors.address?.city && <p className="text-red-500 text-sm">{errors.address.city.message}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">State</label>
            <input
              {...register('address.state')}
              type="text"
              className="w-full px-3 py-2 border rounded"
            />
            {errors.address?.state && <p className="text-red-500 text-sm">{errors.address.state.message}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Zip Code</label>
            <input
              {...register('address.zipCode')}
              type="text"
              className="w-full px-3 py-2 border rounded"
            />
            {errors.address?.zipCode && <p className="text-red-500 text-sm">{errors.address.zipCode.message}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Current Organization</label>
            <input
              {...register('organization')}
              type="text"
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
            Submit
          </button>
        </form>
      </div>

      <div className="max-w-4xl mx-auto p-6 bg-gray-200 rounded-lg shadow-lg mt-8">
        <h1 className="text-center text-cyan-600">Customer Information List</h1>
        {customers?.data?.length > 0 && (
          <div className="bg-white p-4 rounded-lg shadow-lg mt-4">
            <h2 className="text-xl font-bold mb-2">Customer List</h2>
            <div className="grid grid-cols-2 gap-4">
              {customers.data.map((customer) => (
                <CustomerCard
                  key={customer._id}
                  customer={customer}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerForm;
