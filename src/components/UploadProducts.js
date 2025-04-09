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
    <div className="upload-shop-container">
      <div className="upload-progress-container">
        <div className="upload-progress-bar" style={{ width: "66.66%" }}></div>
      </div>

      <div className="upload-header">
        <img src="./profile.png" alt="Profile" className="upload-step-icon" />
        <span className="upload-step">1. Create a profile</span>
        <img src="./product.png" alt="Product" className="upload-step-icon" />
        <span className="upload-step">2. Upload your products</span>
        <img src="./verify.png" alt="Verify" className="upload-step-icon" />
        <span className="upload-step">3. Get verified</span>
      </div>

      <div className="upload-form-box">
        <h2>Add Your Products</h2>
        <p>Enter details for your first product.</p>

        <input type="text" placeholder="Product Name" className="upload-input" />

        <div className="upload-form-row">
          <input type="number" placeholder="Price in Rands" className="upload-input upload-half-width" />
          <input type="number" placeholder="Quantity" className="upload-input upload-half-width" />
        </div>

        <textarea
          placeholder="Product Description"
          className="upload-input"
          style={{ minHeight: "100px", resize: "vertical" }}
        ></textarea>

        <div className="upload-form-row">
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
        </div>

        {selectedFiles.length > 0 && (
          <div className="upload-file-preview">
            <p>Selected Images:</p>
            <ul>
              {selectedFiles.map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
          </div>
        )}

        <Link to="/verifyArtisan" style={{ textDecoration: "none" }}>
          <button className="upload-next-button">Next</button>
        </Link>
      </div>
    </div>
  );
};

export default UploadProducts;