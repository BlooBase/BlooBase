import React from 'react';
import '../Home.css';
import CreateShop from './CreateShop';
import {BrowserRouter as Router,Route,Routes,Link} from 'react-router-dom';

const HomePage = () => {
  return (
    <div style={styles.homepage}>
      <header style={styles.header}>
        <img src="/bloobase.png" alt="BlooBase Logo" style={styles.logo} />
        <h1 style={styles.brandTitle}>BlooBase</h1>
      </header>

      <main style={styles.mainContent}>
    
        <div className="navbar">
          
        <div className="searchContainer">
        <input type="text" placeholder="Search for products..." className="search-bar" />
        <button className="search-button">
        <img src="/search.png" alt="Search icon" className="searchIcon" />
        </button>
        </div>
        
          <button className='login'>Login</button>
          <button className='register'>Register</button>

          <Link to="/CreateShop" style={{ textDecoration: 'none' }}>
         <button className='shop'>Create a shop
            <img src="/shop.png" alt="shop icon" style={styles.shopIcon}/>
          </button>
        </Link>

        </div>

        <div className="options-section">
        <button className="option-btn">Paintings</button>
        <button className="option-btn">Jewelry</button>
        <button className="option-btn">Hand-made Crafts</button>
        <button className="option-btn">Clothing & Accessories</button>
        <button className="option-btn">Home & Garden</button>
        <button className="option-btn">Toys</button>
        </div>
        <h2>Products will be displaying here</h2>
      </main>
    </div>
  );
};

const styles = {
  homepage: {
    fontFamily: 'DM Sans, sans-serif',
    textAlign: 'center',
    padding: '40px',
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
    marginTop:'-29px',
    left:'60px',
    color:'#2c7fc7',
  },
  shopIcon:{
    width:'20px',
    height:'20px',
    marginRight: '12px',
    verticalAlign: 'middle'
  },
  mainContent: {
    marginTop: '120px',
  },
  
};

export default HomePage;
