import React from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import '../CheckoutForm.css';
import { addOrder } from '../firebase/addOrder';

const CheckoutForm = ({ total, orderType }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement || !cardElement._complete) {
      toast.error('Please fill in your card details before paying.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    try {
      // Place the order in Firestore
      await addOrder({ orderType, total });

      toast.success('Order placed successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        onClose: () => navigate('/Homepage'),
      });
    } catch (error) {
      toast.error('Failed to place order: ' + error.message);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="checkout-form-3">
        <CardElement className="card-element-3" />
        <button type="submit" className="checkout-button-3" disabled={!stripe}>
          Pay Now
        </button>
      </form>
    </>
  );
};

export default CheckoutForm;