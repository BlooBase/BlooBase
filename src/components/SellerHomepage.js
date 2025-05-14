// SellerHomePage.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUserName } from '../firebase/firebase';
import '../SellerHome.css';

const SellerHomePage = () => {
  const [user, setUser] = useState({ name: '' });
  const [stores, setStores] = useState([]);
  const [imageStatus, setImageStatus] = useState({ logo: false, stores: {} });

  useEffect(() => {
    const fetchUser = async () => {
      const name = await getUserName();
      setUser({ name });
    };
    fetchUser();

    setStores([
      {
        id: 1,
        name: 'Detour Potters',
        location: 'Fish Market',
        inventoryCount: 87,
        image: '/detourPotters.png',
      },
    ]);
  }, []);

  useEffect(() => {
    const logo = new Image();
    logo.src = '/bloobase.png';
    logo.onload = () => setImageStatus(prev => ({ ...prev, logo: true }));

    stores.forEach(store => {
      const img = new Image();
      img.src = store.image;
      img.onload = () =>
        setImageStatus(prev => ({
          ...prev,
          stores: { ...prev.stores, [store.id]: true },
        }));
    });
  }, [stores]);

  return (
    <div className="seller-home">
      <header className="seller-header">
        <div className="seller-logo-wrapper">
          {!imageStatus.logo && <div className="logo-placeholder">BlooBase</div>}
          <img
            src="/bloobase.png"
            alt="Bloobase"
            className={`seller-logo ${imageStatus.logo ? 'visible' : 'hidden'}`}
          />
        </div>
        <h1 className="seller-welcome">Welcome, {user.name}</h1>
        <nav className="seller-nav">
          <Link to="/" className="seller-nav-link">Home</Link>
          <Link to="/SellerSettings" className="seller-nav-link">Settings</Link>
        </nav>
      </header>

      <section className="seller-section">
        <h2 className="section-title">Manage Your Stores</h2>
        <div className="store-grid">
          {stores.map(store => (
            <div className="store-card" key={store.id}>
              <div className="store-image-wrapper">
                {!imageStatus.stores[store.id] && <div className="image-placeholder" />}
                <img
                  src={store.image}
                  alt={store.name}
                  className={`store-image ${imageStatus.stores[store.id] ? 'visible' : 'hidden'}`}
                />
              </div>
              <div className="store-info">
                <h3>{store.name}</h3>
                <p>Inventory: {store.inventoryCount} items</p>
                <Link to={`/edit-store/${store.id}`} className="edit-button">Edit Store</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="seller-footer">
        © 2025 BlooBase. All rights reserved.
      </footer>
    </div>
  );
};

export default SellerHomePage;
