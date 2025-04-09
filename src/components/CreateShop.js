import React from "react";
import "../CreateShop.css";//Note that CreateShop.css contains styling for CreateShop.js,verifyArtisan.js and UploadProducts.js
import { Link } from "react-router-dom";

const CreateShop = () => {
  return (
    <div className="create-shop-container">
      {/* Progress Bar */}
      <div className="progress-container">
        <div className="progress-bar"></div>
      </div>

      <div className="header">
        <img src="./profile.png" alt="Profile" className="step-icon" />
        <span className="step">1. Create a profile</span>
        <img src="./product.png" alt="Product" className="step-icon" />
        <span className="step">2. Upload your products</span>
        <img src="./verify.png" alt="Verify" className="step-icon" />
        <span className="step">3. Get verified</span>
      </div>

      <div className="form-box">
        <h2>Sign up to create a store with BlooBase.</h2>
        <p>Enter your profile info.</p>
        <div className="form-row">
          <input type="text" placeholder="First Name" className="input half-width" />
          <input type="text" placeholder="Last Name" className="input half-width" />
        </div>
        <input type="text" placeholder="Mobile Number" className="input" />
        <input type="email" placeholder="Store Name" className="input" />
        <div className="password-field">
          <input type="password" placeholder="Description of the store" className="input" />

        </div>

        <div className="checkbox-row">
          <input type="checkbox" id="offers" />
          <label htmlFor="offers">Be the first to know about our offers and upcoming updates.</label>
        </div>

        <div className="checkbox-row">
          <input type="checkbox" id="terms" />
          <label htmlFor="terms">I agree to Grupy's <span className="terms-link">terms</span></label>
        </div>

       <Link to="/UploadProducts" style={{ textDecoration: 'none' }}>
        <button className="next-button">Next</button>
        </Link>
      </div>
    </div>
  );
};

export default CreateShop;