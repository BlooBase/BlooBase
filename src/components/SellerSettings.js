import React, { useEffect, useState } from "react";
import "../Settings.css";
import { Link, useNavigate } from "react-router-dom";
import {updateCredentials,deleteAccount,logout} from "../firebase/firebase"; // Adjust path if needed

const SellerSettings = () => {
  const navigate = useNavigate();
  const [imagesLoaded, setImagesLoaded] = useState({ logo: false });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    newpassword: "",
  });

  useEffect(() => {
    const logoImg = new Image();
    logoImg.src = "/bloobase.png";
    logoImg.onload = () =>
      setImagesLoaded((prev) => ({ ...prev, logo: true }));
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

  const handleCancel = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      newpassword: "",
    });
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account?"
    );
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
    <main className="homepage">
      <section className="header-section">
        <section className="homepage-container">
          <header className="logo-header">
            {!imagesLoaded.logo && (
              <div className="logo-placeholder">BlooBase</div>
            )}
            <img
              src="/bloobase.png"
              alt="BlooBase Logo"
              className={`ghost-logo ${imagesLoaded.logo ? "fade-in" : "hidden"}`}
              loading="eager"
            />
          </header>

          <header className="header">
            <h1 className="brand-title">Settings</h1>
          </header>

          <nav className="nav-buttons">
            <Link to="/SellerHomepage" className="nav-button">
              Back
            </Link>
            <button onClick={handleLogout} className="nav-button">
    Log Out
  </button>
          </nav>
        </section>
      </section>

      <section className="products-section">
        <h2 className="profile-heading">Profile Information</h2>

        <form className="settings-form" onSubmit={(e) => e.preventDefault()}>
          <fieldset className="form-container">
            <div className="form-field">
              <label htmlFor="name" className="form-label">
                Name:
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-field">
              <label htmlFor="email" className="form-label">
                Email:
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-field">
              <label htmlFor="password" className="form-label">
                Current Password:
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-field">
              <label htmlFor="newpassword" className="form-label">
                New Password:
              </label>
              <input
                type="password"
                name="newpassword"
                id="newpassword"
                value={formData.newpassword}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <section className="settings-buttons">
              <button
                type="button"
                onClick={handleSave}
                className="nav-button"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="nav-button"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="delete-button"
              >
                Delete Account
              </button>
            </section>
          </fieldset>
        </form>
      </section>

      <footer className="footer-text">
        <p>&copy; 2025 BlooBase. All rights reserved.</p>
      </footer>
    </main>
  );
};

export default SellerSettings;
