import React, { useEffect, useState } from 'react';
import '../Home.css';
import { Link } from 'react-router-dom';
import { retrieveProducts } from '../firebase/retrieveProducts';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [imagesLoaded, setImagesLoaded] = useState({
    logo: false,
    products: {}
  });

  useEffect(() => {
    const fetchProducts = async () => {
      const fetchedProducts = await retrieveProducts();
      setProducts(fetchedProducts);

      // Preload and check if product images are cached
      fetchedProducts.forEach((product) => {
        const img = new Image();
        img.src = product.imageUrl;

        if (img.complete && img.naturalHeight !== 0) {
          // Image is cached and loaded
          setImagesLoaded(prev => ({
            ...prev,
            products: { ...prev.products, [product.id]: true }
          }));
        } else {
          img.onload = () => {
            setImagesLoaded(prev => ({
              ...prev,
              products: { ...prev.products, [product.id]: true }
            }));
          };
        }
      });
    };

    fetchProducts();

    // Preload logo image
    const logoImg = new Image();
    logoImg.src = "/bloobase.png";
    if (logoImg.complete && logoImg.naturalHeight !== 0) {
      setImagesLoaded(prev => ({ ...prev, logo: true }));
    } else {
      logoImg.onload = () =>
        setImagesLoaded(prev => ({ ...prev, logo: true }));
    }

    // Optionally preload background image
    const bgImg = new Image();
    bgImg.src = './assets/BG.png';
  }, []);

  const handleProductClick = (product) => {
    console.log('Product clicked:', product);
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
                {!imagesLoaded.products[product.id] && (
                  <section className="product-image-placeholder">
                    <section className="loading-spinner"></section>
                  </section>
                )}
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className={`product-image ${imagesLoaded.products[product.id] ? 'fade-in' : 'hidden'}`}
                  onLoad={() => setImagesLoaded(prev => ({
                    ...prev,
                    products: { ...prev.products, [product.id]: true }
                  }))}
                  loading="lazy"
                />
              </section>
              <section className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">{product.price}</p>
                <p className="store-name">{product.Seller}</p>
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
