import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm'; // Create a separate form component
import '../Checkout.css'; // Add styles for the Checkout Page

const stripePromise = loadStripe('pk_test_51RM99WQ7pA4YvjQvIvIwI09MPnYHtckTQP8oaxV2CDIwjYbUPhf1UbWp0fN3lUNWfNe4mWHYT0bNDi2DVMkDyYEq002fjR855W'); // Replace with your Stripe publishable key

const Checkout = () => {
  return (
    <section className="checkout-page">
      <h1 className="checkout-header">Checkout</h1>
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </section>
  );
};

export default Checkout;