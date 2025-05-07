import React, { useEffect, useState } from 'react';
import { retrieveProducts } from '../firebase/retrieveProducts'; // Import the product retrieval function
import { loadStripe } from '@stripe/stripe-js'; // Import Stripe
import { Elements } from '@stripe/react-stripe-js'; // Import Elements for Stripe
import CheckoutForm from './CheckoutForm'; // Import the CheckoutForm component
import '../Cart.css';
import cartTotal from './cartTotal'; // Import the cart total calculation function
import Navbar from './Navbar';

const stripePromise = loadStripe('pk_test_51RM99WQ7pA4YvjQvIvIwI09MPnYHtckTQP8oaxV2CDIwjYbUPhf1UbWp0fN3lUNWfNe4mWHYT0bNDi2DVMkDyYEq002fjR855W'); // Replace with your Stripe publishable key

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [imagesLoaded, setImagesLoaded] = useState({ products: {} });
  const [orderType, setOrderType] = useState('Delivery'); // State for order type

  useEffect(() => {
    const fetchProducts = async () => {
      const fetchedProducts = await retrieveProducts();
      setCartItems(fetchedProducts);

      // Preload and check if product images are cached
      fetchedProducts.forEach((product) => {
        const img = new Image();
        img.src = product.imageUrl;

        if (img.complete && img.naturalHeight !== 0) {
          setImagesLoaded((prev) => ({
            ...prev,
            products: { ...prev.products, [product.id]: true },
          }));
        } else {
          img.onload = () => {
            setImagesLoaded((prev) => ({
              ...prev,
              products: { ...prev.products, [product.id]: true },
            }));
          };
        }
      });
    };

    fetchProducts();
  }, []);

  // Convert price strings to numbers and calculate the total
  const total = cartTotal(cartItems);

  return (
    <section className="cart-page">
      <Navbar pageTitle="Cart" bgColor="#fff6fb" textColor="#165a9c" />
      <section className="cart-products-grid">
        {cartItems.map((item) => (
          <section key={item.id} className="cart-product-item">
            <section className="cart-product-image-container">
              {!imagesLoaded.products[item.id] && (
                <section className="cart-product-image-placeholder">
                  <section className="cart-loading-spinner"></section>
                </section>
              )}
              <img
                src={item.imageUrl}
                alt={item.name}
                className={`cart-product-image ${
                  imagesLoaded.products[item.id] ? 'cart-fade-in' : 'cart-hidden'
                }`}
                loading="lazy"
              />
            </section>
            <section className="cart-product-info">
              <h3 className="cart-product-name">{item.name}</h3>
              <p className="cart-product-price">{item.price}</p>
              <button
                className="cart-remove-button"
                onClick={() => setCartItems((prev) => prev.filter((product) => product.id !== item.id))}
              >
                Remove from Cart
              </button>
            </section>
          </section>
        ))}
      </section>
      <section className="cart-footer">
        <section className="cart-checkout-card">
          <p className="cart-total">Total: <label>R{total.toFixed(2)}</label></p>
          <fieldset className="order-type-dropdown">
            <label htmlFor="order-type">Order Preference:</label>
            <select
              id="order-type"
              value={orderType}
              onChange={(e) => setOrderType(e.target.value)}
            >
              <option value="Delivery">Delivery</option>
              <option value="Pickup">Pickup</option>
            </select>
          </fieldset>
          <Elements stripe={stripePromise}>
            <CheckoutForm total={total} orderType={orderType} />
          </Elements>
        </section>
      </section>
    </section>
  );
};

export default Cart;