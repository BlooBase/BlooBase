import React from "react";
import "../CreateShop.css";
import { Link } from "react-router-dom";

const CreateShop = () => {
  return (
    <section className="create-shop-container">
      {/* Progress Bar */}
      <section className="progress-container">
        <section className="progress-bar"></section>
      </section>

      <section className="upload-header">
        <img src="./user_profile.png" alt="Profile" className="upload-step-icon" />
        <span className="upload-step">1. Create a profile</span>
        <img src="./product.png" alt="Product" className="upload-step-icon" />
        <span className="upload-step">2. Upload your products</span>
        <img src="./verify.png" alt="Verify" className="upload-step-icon" />
        <span className="upload-step">3. Get verified</span>
      </section>

      <section className="form-box">
        <h2>Create a store with BlooBase.</h2>
        <p>Enter your profile info.</p>
        <section className="form-row">
          <input type="text" placeholder="First Name" className="input half-width" />
          <input type="text" placeholder="Last Name" className="input half-width" />
        </section>
        <input type="text" placeholder="Mobile Number" className="input" />
        <input type="email" placeholder="Store Name" className="input" />
        <section className="password-field">
          <input type="password" placeholder="Description of the store" className="input" />
        </section>

        <section className="checkbox-row">
          <input type="checkbox" id="offers" />
          <label htmlFor="offers">Be the first to know about our offers and upcoming updates.</label>
        </section>

        <section className="checkbox-row">
          <input type="checkbox" id="terms" />
          <label htmlFor="terms">
            I agree to BlooBase's <Link to="/TermsAndConditions" className="terms-link">terms</Link>
          </label>
        </section>

        <Link to="/UploadProducts" style={{ textDecoration: 'none' }}>
          <button className="next-button">Next</button>
        </Link>
      </section>
    </section>
  );
};

export default CreateShop;