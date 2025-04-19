import React from 'react';
import '../Home.css';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <section className="homepage-container">
      <header className="logo-header">
      < img src="/bloobase.png" alt="BlooBase Logo" className="ghost-logo" />
      </header>

    <header className="header">
      <h1 className="brand-title">BlooBase</h1>
    </header>


      <nav className="nav-buttons">
        <Link to="/products" className="nav-button">Products</Link>
        <Link to="/signup" className="nav-button">Sign Up</Link>
        <Link to="/login" className="nav-button">Log In</Link>
      </nav>

      <h1 className="hero-title">For Artists By Artists</h1>
      <p className="hero-subtitle">
        The ever expanding global artist marketplace for all your needs.
      </p>
      <footer className="footer-text">
        © 2025. All Rights Reserved.
      </footer>

    </section>
  );
};

export default HomePage;