import React, { useEffect, useState } from 'react';
import '../Home.css';
import { Link } from 'react-router-dom';

const HomePage = () => {
  // Sample category data
  const categories = [
    { id: 1, name: 'Jewelry', image: '/jewelry.jpg' },
    { id: 2, name: 'Fashion', image: '/fashion.jpg' },
    { id: 3, name: 'Art', image: '/art.jpg' },
    { id: 4, name: 'Pottery', image: '/pottery.jpg' },
  ];

  const [imagesLoaded, setImagesLoaded] = useState({
    logo: false,
    categories: {}
  });

  // Preload images
  useEffect(() => {
    const logoImg = new Image();
    logoImg.src = "/bloobase.png";
    logoImg.onload = () => setImagesLoaded(prev => ({ ...prev, logo: true }));

    categories.forEach(category => {
      const img = new Image();
      img.src = category.image;
      img.onload = () => setImagesLoaded(prev => ({
        ...prev,
        categories: { ...prev.categories, [category.id]: true }
      }));
    });

    const bgImg = new Image();
    bgImg.src = './assets/BG.png';
  }, []);

  const handleCategoryClick = (category) => {
    console.log('Category clicked:', category);
    // You can navigate to category-specific pages here
  };

  return (
    <main className="homepage">
      <section id="bg-preload"></section>

      <section className="header-section">
        <section className="homepage-container">
          <header className="logo-header">
            {!imagesLoaded.logo && <div className="logo-placeholder">BlooBase</div>}
            <img
              src="/bloobase.png"
              alt="BlooBase Logo"
              className={`ghost-logo ${imagesLoaded.logo ? 'fade-in' : 'hidden'}`}
              onLoad={() => setImagesLoaded(prev => ({ ...prev, logo: true }))}
              loading="eager"
            />
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
        <h2 className="products-heading">Browse Categories</h2>
        <section className="products-grid">
          {categories.map((category) => (
            <section
              key={category.id}
              className="product-item"
              onClick={() => handleCategoryClick(category)}
              role="button"
              tabIndex="0"
              aria-label={`View ${category.name} category`}
              onKeyPress={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleCategoryClick(category);
                }
              }}
            >
              <section className="product-image-container">
                {!imagesLoaded.categories[category.id] && (
                  <section className="product-image-placeholder">
                    <section className="loading-spinner"></section>
                  </section>
                )}
                <img
                  src={category.image}
                  alt={category.name}
                  className={`product-image ${imagesLoaded.categories[category.id] ? 'fade-in' : 'hidden'}`}
                  onLoad={() => setImagesLoaded(prev => ({
                    ...prev,
                    categories: { ...prev.categories, [category.id]: true }
                  }))}
                  loading="lazy"
                />
              </section>
              <section className="product-info">
                <h3 className="product-name">{category.name}</h3>
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
