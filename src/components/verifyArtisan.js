import React from "react";
import "../CreateShop.css"; //Note that CreateShop.css contains styling for CreateShop.js,verifyArtisan.js and UploadProducts.js
import { Link } from "react-router-dom";

const verifyArtisan = () => {
  return (
    <div className="verify-shop-container">
      {/* Progress Bar */}
      <div className="verify-progress-container">
        <div className="verify-progress-bar" style={{ width: "100%" }}></div>
      </div>

      <div className="verify-header">
        <img src="./profile.png" alt="Profile" className="verify-step-icon" />
        <span className="verify-step">1. Create a profile</span>
        <img src="./product.png" alt="Product" className="verify-step-icon" />
        <span className="verify-step">2. Upload your products</span>
        <img src="./verify.png" alt="Verify" className="verify-step-icon" />
        <span className="verify-step">3. Get verified</span>
      </div>

      <div className="verify-form-box">
        <h2>Verify Your Account</h2>
        <p>Enter the verification code sent to your email.</p>

        <input
          type="text"
          placeholder="Verification Code"
          className="verify-input"
        />

        <button className="verify-home-button">Verify</button>
      </div>
    </div>
  );
};

export default verifyArtisan;