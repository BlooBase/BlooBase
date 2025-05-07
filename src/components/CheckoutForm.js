import React from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import 'react-toastify/dist/ReactToastify.css'; // Import the toast styles

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate(); // Initialize the navigate function

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    // Simulate payment processing
    toast.success('Order placed successfully!', {
      position: 'top-right',
      autoClose: 3000, // Close after 3 seconds
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      onClose: () => navigate('/Homepage'), // Redirect to Homepage after the toast closes
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="checkout-form">
        <CardElement className="card-element" />
        <button type="submit" className="checkout-button" disabled={!stripe}>
          Pay Now
        </button>
      </form>
      <ToastContainer />
    </>
  );
};

export default CheckoutForm;