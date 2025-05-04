import React, { useEffect, useState } from 'react';
import '../Home.css'; // Reuse existing styles
import { Link } from 'react-router-dom';
import { getUserName } from '../firebase/firebase';

const BuyerHomePage = () => {
  const [user, setUser] = useState({ name: '' });
  const [purchases, setPurchases] = useState([
    { id: 1, name: 'Gold Ring', image: '/jewelry.jpg', status: 'Delivered' },
    { id: 2, name: 'Art Print', image: '/art.jpg', status: 'In Transit' },
  ]);
  const [imagesLoaded, setImagesLoaded] = useState({ purchases: {}, logo: false });

  // Async function to load user data
  useEffect(() => {
    const fetchUserData = async () => {
      const userName = await getUserName(); // Fetch the user's name asynchronously
      setUser({ name: userName });
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const logoImg = new Image();
    logoImg.src = "/bloobase.png";
    logoImg.onload = () => setImagesLoaded(prev => ({ ...prev, logo: true }));

    purchases.forEach(item => {
      const img = new Image();
      img.src = item.image;
      img.onload = () =>
        setImagesLoaded(prev => ({
          ...prev,
          purchases: { ...prev.purchases, [item.id]: true },
        }));
    });
  }, [purchases]);

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
            <h1 className="brand-title">Welcome, {user.name}</h1>
          </header>

          <nav className="nav-buttons">
            <Link to="/BuyerSettings" className="nav-button">Settings</Link>
            <Link to="/" className="nav-button">Home</Link>
          </nav>

          <h2 className="hero-title">Your Orders</h2>
        </section>
      </section>

      <section className="products-section">
        <h2 className="products-heading">Order History</h2>
        <section className="products-grid">
          {purchases.map((item) => (
            <section key={item.id} className="product-item">
              <section className="product-image-container">
                {!imagesLoaded.purchases[item.id] && (
                  <section className="product-image-placeholder">
                    <section className="loading-spinner"></section>
                  </section>
                )}
                <img
                  src={item.image}
                  alt={item.name}
                  className={`product-image ${imagesLoaded.purchases[item.id] ? 'fade-in' : 'hidden'}`}
                  loading="lazy"
                />
              </section>
              <section className="product-info">
                <h3 className="product-name">{item.name}</h3>
                <p className="product-price">Status: {item.status}</p>
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

export default BuyerHomePage;
