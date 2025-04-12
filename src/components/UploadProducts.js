import React, { useState } from "react";
import "../CreateShop.css";
import { Link } from "react-router-dom";

const UploadProducts = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
  };

  return (
    <main className="upload-shop-container">
      <section className="upload-progress-container">
        <section className="upload-progress-bar" style={{ width: "66.66%" }}></section>
      </section>

      <section className="upload-header">
        <img src="./profile.png" alt="Profile" className="upload-step-icon" />
        <span className="upload-step">1. Create a profile</span>
        <img src="./product.png" alt="Product" className="upload-step-icon" />
        <span className="upload-step">2. Upload your products</span>
        <img src="./verify.png" alt="Verify" className="upload-step-icon" />
        <span className="upload-step">3. Get verified</span>
      </section>

      <section className="upload-form-box">
        <h2>Add Your Products</h2>
        <p>Enter details for your first product.</p>

        <input type="text" placeholder="Product Name" className="upload-input" />

        <section className="upload-form-row">
          <input type="number" placeholder="Price in Rands" className="upload-input upload-half-width" />
          <input type="number" placeholder="Quantity" className="upload-input upload-half-width" />
        </section>

        <textarea
          placeholder="Product Description"
          className="upload-input"
          style={{ minHeight: "100px", resize: "vertical" }}
        ></textarea>

        <section className="upload-form-row">
          <label htmlFor="product-images" className="upload-input" style={{ padding: "0.75rem", cursor: "pointer" }}>
            Upload Product Images
            <input
              type="file"
              id="product-images"
              accept="image/*"
              multiple
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </label>
        </section>

        {selectedFiles.length > 0 && (
          <section className="upload-file-preview">
            <p>Selected Images:</p>
            <ul>
              {selectedFiles.map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
          </section>
        )}

        <Link to="/verifyArtisan" style={{ textDecoration: "none" }}>
          <button className="upload-next-button">Next</button>
        </Link>
      </section>
    </main>
  );
};

export default UploadProducts; 