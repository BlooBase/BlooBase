import React, { useEffect, useState } from 'react';
import '../Home.css'; // Reuse HomePage styles
import { Link } from 'react-router-dom';

const BuyerSettings = () => {
  const [imagesLoaded, setImagesLoaded] = useState({ logo: false });
  const [formData, setFormData] = useState({
    name: 'Jane Doe',
    email: 'jane@example.com',
    password: '',
  });

  useEffect(() => {
    const logoImg = new Image();
    logoImg.src = "/bloobase.png";
    logoImg.onload = () => setImagesLoaded(prev => ({ ...prev, logo: true }));
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = () => {
    // Add Firebase update logic here
    alert("Settings saved (mock)");
  };

  const handleCancel = () => {
    // Reset or fetch real data
    alert("Changes cancelled (mock)");
  };

  const handleDeleteAccount = () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your account?");
    if (confirmDelete) {
      // Add Firebase delete logic here
      alert("Account deleted (mock)");
    }
  };

  return (
    <main className="homepage">
      <section className="header-section">
        <section className="homepage-container">
          <header className="logo-header">
            {!imagesLoaded.logo && <div className="logo-placeholder">BlooBase</div>}
            <img
              src="/bloobase.png"
              alt="BlooBase Logo"
              className={`ghost-logo ${imagesLoaded.logo ? 'fade-in' : 'hidden'}`}
              loading="eager"
            />
          </header>

          <header className="header">
            <h1 className="brand-title">Settings</h1>
          </header>

          <nav className="nav-buttons">
            <Link to="/home" className="nav-button">Home</Link>
            <Link to="/logout" className="nav-button">Log Out</Link>
          </nav>
        </section>
      </section>

      <section className="products-section">
        {/* Move Profile Information heading above the form */}
        <h2 className="profile-heading">Profile Information</h2>
        
        <form className="settings-form" onSubmit={e => e.preventDefault()}>
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
                Password:
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="form-input"
              />
            </div>

            <section className="settings-buttons">
              <button type="button" onClick={handleSave} className="nav-button">Save Changes</button>
              <button type="button" onClick={handleCancel} className="nav-button">Cancel</button>
              <button type="button" onClick={handleDeleteAccount} className="delete-button">
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

export default BuyerSettings;
