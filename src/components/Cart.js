import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';
import '../Cart.css';
import cartTotal from './cartTotal';
import Navbar from './Navbar';
import { retrieveCart } from '../firebase/retrieveCart';
import { removeFromCart } from '../firebase/removeFromCart';
import { retrieveProductByID } from '../firebase/retrieveProductByID'; // <-- Import here
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';

const stripePromise = loadStripe('pk_test_51RM99WQ7pA4YvjQvIvIwI09MPnYHtckTQP8oaxV2CDIwjYbUPhf1UbWp0fN3lUNWfNe4mWHYT0bNDi2DVMkDyYEq002fjR855W');

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [imagesLoaded, setImagesLoaded] = useState({ products: {} });
  const [orderType, setOrderType] = useState('Delivery');

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const items = await retrieveCart();

        // Fetch latest product data for each cart item
        const itemsWithProductData = await Promise.all(
          items.map(async (cartItem) => {
            try {
              const product = await retrieveProductByID(cartItem.id);
              // If product doesn't exist, treat as out of stock
              if (!product || Object.keys(product).length === 0) {
                return { ...cartItem, stock: 0, deleted: true };
              }
              return { ...cartItem, ...product };
            } catch (error) {
              // If product fetch fails (e.g., deleted), treat as out of stock
              return { ...cartItem, stock: 0, deleted: true };
            }
          })
        );

        // Remove out-of-stock or deleted items from cart in DB (but don't show them)
        itemsWithProductData.forEach(async (item) => {
          if (
            (item.stock !== undefined && Number(item.stock) <= 0) ||
            item.deleted
          ) {
            await removeFromCart(item.id);
          }
        });

        // Only keep items with stock > 0 or undefined (legacy)
        const filteredItems = itemsWithProductData.filter(
          item => (item.stock === undefined || Number(item.stock) > 0) && !item.deleted
        );
        setCartItems(filteredItems);

        // Preload and check if product images are cached
        filteredItems.forEach((item) => {
          const img = new Image();
          img.src = item.imageUrl;

          if (img.complete && img.naturalHeight !== 0) {
            setImagesLoaded((prev) => ({
              ...prev,
              products: { ...prev.products, [item.id]: true },
            }));
          } else {
            img.onload = () => {
              setImagesLoaded((prev) => ({
                ...prev,
                products: { ...prev.products, [item.id]: true },
              }));
            };
          }
        });
      } catch (error) {
        setCartItems([]);
      }
    };

    fetchCart();
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
                onClick={async () => {
                  try {
                    const updatedItems = await removeFromCart(item.id);
                    setCartItems(updatedItems);
                    toast.success(`Removed ${item.name} from cart`);
                  } catch (error) {
                    toast.error("Failed to remove item: " + error.message);
                  }
                }}
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
            <CheckoutForm total={total} orderType={orderType} cartItems={cartItems} />
          </Elements>
        </section>
      </section>
      <section className="opacity-fade" />
    </section>
  );
};

export default Cart;