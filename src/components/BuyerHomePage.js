import React, { useEffect, useState } from 'react';
import { getUserName } from '../firebase/firebase';
import { Link, useNavigate } from "react-router-dom";
import { updateCredentials, deleteAccount, logout } from "../firebase/firebase";
import '../BuyerHome.css';

const BuyerHomePage = () => {
  const [user, setUser] = useState({ name: '' });
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    newpassword: "",
  });

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

  useEffect(() => {
    const fetchUser = async () => {
      const name = await getUserName();
      setUser({ name });
    };
    fetchUser();
  }, []);

  return (
    <section className="buyer-home">
      <section className="buyer-header">
        <img src="/bloobase.png" alt="Bloobase" className="buyer-logo" />
        <section className="welcome-bg">
          <h1 className="buyer-title">Welcome, {user.name}</h1>
        </section>
        <nav className="buyer-nav">
          <Link to="/" className="buyer-nav-link">HOME</Link>
        </nav>
      </section>

      <section className="buyer-orders-section">
        <section className="orders-grid">
          <section className="floating-orders-card">
            <h3 className="orders-card-title">ORDERS</h3>
            <section className="orders-card-scroll">
              {[...Array(8)].map((_, i) => (
                <section key={i} className="order-blob" />
              ))}
            </section>
          </section>
        </section>

        <section className="buyer-settings">
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
          <span
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

export default BuyerHomePage;
