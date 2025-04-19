import React from "react";
import "../CreateShop.css"; //Note that CreateShop.css contains styling for CreateShop.js,verifyArtisan.js and UploadProducts.js
//import { Link } from "react-router-dom";

const verifyArtisan = () => {
  return (
    <main className="verify-shop-container">
      {/* Progress Bar */}
      <section className="verify-progress-container">
        <section className="verify-progress-bar" style={{ width: "100%" }}></section>
      </section>

      <section className="verify-header">
        <img src="./profile.png" alt="Profile" className="verify-step-icon" />
        <span className="verify-step">1. Create a profile</span>
        <img src="./product.png" alt="Product" className="verify-step-icon" />
        <span className="verify-step">2. Upload your products</span>
        <img src="./verify.png" alt="Verify" className="verify-step-icon" />
        <span className="verify-step">3. Get verified</span>
      </section>

      <section className="verify-form-box">
        <h2>Verify Your Account</h2>
        <p>Enter the verification code sent to your email.</p>

        <input
          type="text"
          placeholder="Verification Code"
          className="verify-input"
        />

        <button className="verify-home-button">Verify</button>
      </section>
    </main>
  );
};

export default verifyArtisan;