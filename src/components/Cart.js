import React, { useEffect, useState } from 'react';
import { retrieveProducts } from '../firebase/retrieveProducts'; // Import the product retrieval function
import '../Cart.css';
import cartTotal from './cartTotal'; // Import the cart total calculation function
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Navbar from './Navbar';

const Cart = () => {
  const navigate = useNavigate(); // Initialize navigation
  const [cartItems, setCartItems] = useState([]);
  const [imagesLoaded, setImagesLoaded] = useState({ products: {} });

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
  const handleCheckout = () => {
    navigate('/Checkout'); // Navigate to the Checkout Page
  };

  return (
    <section className="cart-page">
      <Navbar pageTitle="Cart" bgColor="#fff6fb" textColor="#165a9c"/>
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
              >
                Remove from Cart
              </button>
            </section>
          </section>
        ))}
      </section>
      <section className="cart-footer">
        <section className="cart-summary">
          <p className="cart-total">Total: <span>R{total.toFixed(2)}</span></p>
          <button className="cart-checkout-button" onClick={handleCheckout}>
            Checkout
          </button>
        </section>
      </section>
    </section>
  );
};

export default Cart;