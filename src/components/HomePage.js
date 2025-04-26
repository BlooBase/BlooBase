import React from 'react';
import '../Home.css';
import { Link } from 'react-router-dom';

const HomePage = () => {
  // Sample product data (replace with actual data fetching)
  const products = [
    { id: 1, name: 'Elegant Gold Ring', price: 'R45.99', store: 'Sparkle Gems', image: '/jewelry.jpg' },
    { id: 2, name: 'Bohemian Clothing', price: 'R79.50', store: 'Bee Finds', image: '/fashion.jpg' },
    { id: 3, name: 'Kulu paintings', price: 'R39.00', store: 'Crafted Wonders', image: '/art.jpg' },
    { id: 4, name: 'Dangle Pottery', price: 'R72.00', store: 'Gemstone Gallery', image: '/pottery.jpg' },
  ];

  const handleProductClick = (product) => {
    // Navigate to product detail page or show modal
    console.log('Product clicked:', product);
    
  };

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
          {products.map((product) => (
            <section 
              key={product.id} 
              className="product-item"
              onClick={() => handleProductClick(product)}
              role="button"
              tabIndex="0"
              aria-label={`View details of ${product.name}`}
              onKeyPress={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleProductClick(product);
                }
              }}
            >
              <section className="product-image-container">
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-image"
                />
              </section>
              <section className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">{product.price}</p>
                <p className="store-name">{product.store}</p>
              </section>
            </section>
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