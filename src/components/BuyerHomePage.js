// BuyerHomePage.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUserName } from '../firebase/firebase';
import '../BuyerHome.css';

const BuyerHomePage = () => {
  const [user, setUser] = useState({ name: '' });
  const [orders, setOrders] = useState([]);
  const [imageStatus, setImageStatus] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      const name = await getUserName();
      setUser({ name });
    };
    fetchUser();

    const dummyOrders = [
      { id: 1, name: 'Gold Ring', image: '/jewelry.jpg', status: 'Delivered' },
      { id: 2, name: 'Art Print', image: '/art.jpg', status: 'In Transit' },
    ];
    setOrders(dummyOrders);

    dummyOrders.forEach((order) => {
      const img = new Image();
      img.src = order.image;
      img.onload = () => {
        setImageStatus((prev) => ({ ...prev, [order.id]: true }));
      };
    });
  }, []);

  return (
    <div className="buyer-home">
      <header className="buyer-header">
        <img src="/bloobase.png" alt="Bloobase" className="buyer-logo" />
        <h1 className="buyer-title">Welcome, {user.name}</h1>
        <nav className="buyer-nav">
          <Link to="/" className="buyer-nav-link">Home</Link>
          <Link to="/BuyerSettings" className="buyer-nav-link">Settings</Link>
        </nav>
      </header>

      <section className="buyer-orders-section">
        <h2 className="section-title">Your Order History</h2>
        <div className="orders-grid">
          {orders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-image-wrapper">
                {!imageStatus[order.id] && <div className="image-placeholder" />}
                <img
                  src={order.image}
                  alt={order.name}
                  className={`order-image ${imageStatus[order.id] ? 'visible' : 'hidden'}`}
                />
              </div>
              <div className="order-info">
                <h3>{order.name}</h3>
                <p>Status: {order.status}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="buyer-footer">
        © 2025 BlooBase. All rights reserved.
      </footer>
    </div>
  );
};

export default BuyerHomePage;
