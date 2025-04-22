import React from 'react';
import '../Home.css';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <main className="homepage">
      <section className="header-section">
        <section className="homepage-container">
          <header className="logo-header">
            <img src="/bloobase.png" alt="BlooBase Logo" className="ghost-logo" />
          </header>

          <header className="header">
            <h1 className="brand-title">BlooBase</h1>
          </header>

          <nav className="nav-buttons">
            <Link to="/artists" className="nav-button">Artists</Link>
            <Link to="/signup" className="nav-button">Sign Up</Link>
            <Link to="/login" className="nav-button">Log In</Link>
          </nav>

          <h1 className="hero-title">For Artists By Artists</h1>
          <p className="hero-subtitle">
            The ever expanding global artist marketplace for all your needs.
          </p>
        </section>
      </section>

      <section className="products-section">
        <h2 className="products-heading">Browse Products</h2>
        <section className="products-grid">
          {[1, 2, 3, 4].map((product) => (
            <article className="product-card" key={product}>
              <figure>
                <img 
                   src="/jewelry.jpg"
                  alt={`Product ${product}`} 
                  className="product-image" 
                />
                <figcaption className="product-info">
                  <h3 className="product-name">Product Name {product}</h3>
                  <p className="product-price">$99.99</p>
                  <p className="store-name">Store Name</p>
                </figcaption>
              </figure>
            </article>
          ))}
        </section>
      </section>

      <footer className="footer-text">
        © 2025 BlooBase. All rights reserved.
      </footer>
    </main>
  );
};

export default HomePage;