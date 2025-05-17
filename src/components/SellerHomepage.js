import React, { useEffect, useState } from 'react';
import { getUserName } from '../firebase/firebase';
import { Link, useNavigate } from "react-router-dom";
import { updateCredentials, deleteAccount, logout } from "../firebase/firebase";
import { retrieveSellerProducts } from "../firebase/retrieveSellerProducts";
import { auth } from "../firebase/firebase";
import '../SellerHome.css';
import cartTotal from './cartTotal';

const SellerHomePage = () => {
  const [user, setUser] = useState({ name: '' });
  const [products, setProducts] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    newpassword: "",
  });

  useEffect(() => {
    const fetchUserAndProducts = async () => {
      const name = await getUserName();
      setUser({ name });

      // Get sellerId from auth
      const sellerId = auth.currentUser?.uid;
      if (!sellerId) return;

      const sellerProducts = await retrieveSellerProducts(sellerId);

      // Only show products with at least 1 sale
      const soldProducts = sellerProducts.filter(
        (p) => (typeof p.sales === "number" ? p.sales : 0) > 0
      );
      setProducts(soldProducts);

      // Calculate total income using cartTotal
      const soldProductsForTotal = soldProducts.flatMap(product =>
        Array(product.sales).fill({ price: product.price })
      );
      setTotalIncome(cartTotal(soldProductsForTotal));
    };
    fetchUserAndProducts();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    try {
      await updateCredentials(formData);
      alert("Settings updated successfully!");
    } catch (error) {
      alert("Failed to update settings: " + error.message);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const name = await getUserName();
      setUser({ name });
    };
    fetchUser();
  }, []);

  const handleCancel = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      newpassword: "",
    });
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your account?");
    if (!confirmDelete) return;

    try {
      const password = prompt("Enter your current password to confirm:");
      if (!password) return;
      await deleteAccount(password);
      alert("Account deleted successfully.");
      await logout();
      navigate("/");
    } catch (error) {
      alert("Failed to delete account: " + error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      alert("Failed to log out: " + error.message);
    }
  };

  return (
    <section className="seller-home">
      <section className="seller-header">
        <img src="/bloobase.png" alt="Bloobase" className="seller-logo" />
        <section className="welcome-bg-seller">
          <h1 className="seller-title">Welcome, {user.name}</h1>
        </section>
        <nav className="seller-nav">
          <Link to="/" className="seller-nav-link">HOME</Link>
          <Link to="/CardCreator" className="seller-nav-link">Your Store</Link>
        </nav>
      </section>

      <section className="seller-orders-section">
        <section className="orders-grid">
          <section className="floating-orders-card">
            <h3 className="orders-card-title">SALES</h3>
            <section className="total-income-label">
              Total Income: <strong>R{totalIncome.toFixed(2)}</strong>
            </section>
              <section className="orders-card-scroll">
                {products.length === 0 ? (
                  <p className="orders-empty">No sales yet.</p>
                ) : (
                products.map(product => (
                  <article key={product.id} className="order-preview">
                    <figure className="order-preview-figure">
                      <img
                        src={product.imageUrl || product.image}
                        alt={product.title || product.name}
                        className="order-preview-img"
                      />
                      <figcaption className="order-preview-info">
                        <section className="order-preview-name">
                          <strong>Product:</strong> <small>{product.title || product.name}</small>
                        </section>
                        <section className="order-preview-price">
                          <strong>Sold:</strong> <data value={product.sales}>{product.sales} times</data>
                        </section>
                        <section className="order-preview-type">
                          <em>
                            Price: R
                            {typeof product.price === "string"
                              ? product.price.replace(/[^\d.]/g, "")
                              : product.price}
                          </em>
                        </section>
                      </figcaption>
                    </figure>
                  </article>
                ))
                )}
              </section>
          </section>
        </section>

        <section className="seller-settings">
           <h3 className="settings-title">SETTINGS</h3>
          <form className="settings-form" onSubmit={(e) => e.preventDefault()}>
            <fieldset className="form-container">
              <section className="form-field">
                <label htmlFor="name" className="form-label">Name:</label>
                <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="form-input" />
                <label htmlFor="email" className="form-label">Email:</label>
                <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className="form-input" />
              </section>
              <section className="form-field">
                <label htmlFor="password" className="form-label">Current Password:</label>
                <input type="password" name="password" id="password" value={formData.password} onChange={handleChange} className="form-input" />
              </section>
              <section className="form-field">
                <label htmlFor="newpassword" className="form-label">New Password:</label>
                <input type="password" name="newpassword" id="newpassword" value={formData.newpassword} onChange={handleChange} className="form-input" />
              </section>
              <section className="settings-buttons">
                <button type="button" onClick={handleSave} className="nav-button">Save Changes</button>
                <button type="button" onClick={handleCancel} className="nav-button">Cancel</button>
                  <section className="red-buttons">
                    <button type="button" onClick={handleDeleteAccount} className="delete-button">Delete Account</button>
                    <button type="button" onClick={handleLogout} className="delete-button">Log Out</button>
                  </section>
              </section>
            </fieldset>
          </form>
        </section>
      </section>

      <section className="sparkle-overlay">
        {[...Array(30)].map((_, i) => (
          <p
            key={i}
            className="sparkle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </section>

      <footer className="buyer-footer">
        © 2025 BlooBase. All rights reserved.
      </footer>
    </section>
  );
};

export default SellerHomePage;