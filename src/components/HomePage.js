import React, { useRef, useState } from 'react';
import '../Home.css';
import CreateShop from './CreateShop';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

const HomePage = () => {
  const searchInputRef = useRef();
  const [popupMessage, setPopupMessage] = useState('');

  //will connect to database
  function handleSearch() {
    const query = searchInputRef.current.value.trim();
    if (query.length === 0) {
      setPopupMessage("Please enter a search term");
    } else {
      setPopupMessage(`Item not found: ${query}`);
    }

    setTimeout(() => {
      setPopupMessage('');
    }, 3000);
  }

  return (
    <main style={styles.homepage}>
      {/* Popup Message */}
      {popupMessage && (
        <section style={styles.popup}>
          {popupMessage}
        </section>
      )}

      <header style={styles.header}>
        <img src="/bloobase.png" alt="BlooBase Logo" style={styles.logo} />
        <h1 style={styles.brandTitle}>BlooBase</h1>
      </header>

      <main style={styles.mainContent}>
        <nav className="navbar">
          <section className="searchContainer">
            <input
              type="text"
              placeholder="Search for products..."
              className="search-bar"
              ref={searchInputRef}
            />
            <button className="search-button" onClick={handleSearch}>
              <img src="/search.png" alt="Search icon" className="searchIcon" />
            </button>
          </section>

          <Link to="/Login">
            <button className="login">Login</button>
          </Link>

          <button className="register">Register</button>

          <Link to="/CreateShop" style={{ textDecoration: 'none' }}>
            <button className="shop">
              Create a shop
              <img src="/shop.png" alt="shop icon" style={styles.shopIcon} />
            </button>
          </Link>
        </nav>

        <section className="options-section">
          <button className="option-btn">Paintings</button>
          <button className="option-btn">Jewelry</button>
          <button className="option-btn">Hand-made Crafts</button>
          <button className="option-btn">Clothing & Accessories</button>
          <button className="option-btn">Home & Garden</button>
          <button className="option-btn">Toys</button>
        </section>

        <h2>Products will be displayed here</h2>
      </main>
    </main>
  );
};

const styles = {
  homepage: {
    fontFamily: 'DM Sans, sans-serif',
    textAlign: 'center',
    padding: '40px',
    position: 'relative',
  },
  popup: {
    position: 'fixed',
    top: '100px',
    left: '50%',
    transform: 'translateX(-50%)',
    color: '#1d1d1d1', 
    fontSize: '1rem',
    zIndex: 1000,
  },
  
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    position: 'absolute',
    top: '20px',
    left: '20px',
  },
  logo: {
    width: '20%',
    height: '20%',
  },
  brandTitle: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    marginTop: '-29px',
    left: '60px',
    color: '#2c7fc7',
  },
  shopIcon: {
    width: '20px',
    height: '20px',
    marginRight: '12px',
    verticalAlign: 'middle',
  },
  mainContent: {
    marginTop: '120px',
  },
};

export default HomePage;