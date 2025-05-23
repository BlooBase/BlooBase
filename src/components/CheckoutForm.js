import React from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import '../CheckoutForm.css';
import { addOrder } from '../firebase/addOrder';
import { removeFromCart } from '../firebase/removeFromCart';
import { retrieveProductByID } from '../firebase/retrieveProductByID';

const CheckoutForm = ({ total, orderType, cartItems }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading) return;

    if (!stripe || !elements) {
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      toast.error('Your cart is empty. Please add items before checking out.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
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

    setLoading(true);

    try {
      // Check stock for all items in the cart
      const updatedCartItems = await Promise.all(
        cartItems.map(async (cartItem) => {
          try {
            const product = await retrieveProductByID(cartItem.id);
            if (!product || product.stock <= 0) {
              await removeFromCart(cartItem.id); // Remove out-of-stock item from the cart
              return null; // Mark this item as removed
            }
            return cartItem; // Keep the item if it's in stock
          } catch (error) {
            console.error('Error checking stock for item:', cartItem.id, error);
            return null; // Treat as out-of-stock if there's an error
          }
        })
      );

      // Filter out null items (out-of-stock items)
      const filteredCartItems = updatedCartItems.filter((item) => item !== null);

      if (filteredCartItems.length !== cartItems.length) {
        toast.error('Some items are out of stock and have been removed from your cart.', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setLoading(false);
        return;
      }

      // Format the total to two decimal places before passing it to addOrder
      const formattedTotal = parseFloat(total).toFixed(2);

      // Place the order in Firestore with the formatted total
      await addOrder({ orderType, total: formattedTotal });

      toast.success('Order placed successfully!', {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        onClose: () => navigate('/BuyerHomePage'),
      });
    } catch (error) {
      toast.error('Failed to place order: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="checkout-form-3">
        <CardElement className="card-element-3" />
        <button
          type="submit"
          className="checkout-button-3"
          disabled={!stripe || loading}
        >
          {loading ? 'Processing...' : 'Pay Now'}
        </button>
      </form>
    </>
  );
};

export default CheckoutForm;