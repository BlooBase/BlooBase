import React, { useEffect, useState } from 'react';
import '../Home.css'; 
import { Link } from 'react-router-dom';
import { getUserName } from '../firebase/firebase';

const SellerHomePage = () => {
  const [user, setUser] = useState({ name: '' });
  const [stores, setStores] = useState([]);
 
  const [imagesLoaded, setImagesLoaded] = useState({ stores: {}, logo: false });

 
  useEffect(() => {
    const fetchUserData = async () => {
      const userName = await getUserName();
      setUser({ name: userName });
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const logoImg = new Image();
    logoImg.src = "/bloobase.png";
    logoImg.onload = () => setImagesLoaded(prev => ({ ...prev, logo: true }));

    stores.forEach(store => {
      const img = new Image();
      img.src = store.image;
      img.onload = () =>
        setImagesLoaded(prev => ({
          ...prev,
          stores: { ...prev.stores, [store.id]: true },
        }));
    });
  }, [stores]);
  useEffect(() => {
    setStores([
      { id: 1, name: 'Detour Potters', location: 'Fish' , image: '../detourPotters.png' },
      
    ]);
  }, []);
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
            <Link to="/SellerSettings" className="nav-button">Settings</Link>
            <Link to="/" className="nav-button">Home</Link>
          </nav>

          <h2 className="hero-title">Your Stores</h2>
        </section>
      </section>

      <section className="products-section">
        <h2 className="products-heading">Manage Your Stores</h2>
        <section className="products-grid">
          {stores.map((store) => (
            <section key={store.id} className="product-item">
              <section className="product-image-container">
                {!imagesLoaded.stores[store.id] && (
                  <section className="product-image-placeholder">
                    <section className="loading-spinner"></section>
                  </section>
                )}
                <img
                  src={store.image}
                  alt={store.name}
                  className={`product-image ${imagesLoaded.stores[store.id] ? 'fade-in' : 'hidden'}`}
                  loading="lazy"
                />
              </section>
              <section className="product-info">
                <h3 className="product-name">{store.name}</h3>
                <p className="product-stock">Inventory: {store.inventoryCount} items</p>
                <Link to={`/edit-store/${store.id}`} className="nav-button">Edit</Link>
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

export default SellerHomePage;
