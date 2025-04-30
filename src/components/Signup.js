
import React, { useState, useEffect } from "react";
import "../Signup.css";
import { Link } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Preload images
  useEffect(() => {
    const logoImg = new Image();
    logoImg.src = "/bloobase.png";
    logoImg.onload = () => setImageLoaded(true);

    // Preload eye icons too
    const eyeImg = new Image();
    eyeImg.src = "/eye.png";
    
    const crossedEyeImg = new Image();
    crossedEyeImg.src = "/crossed-eye.png";
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Signup data submitted:", formData);
    // Add Firebase or backend API integration here
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <main className="signup-wrapper">
      <section className="signup-container">
        {/* Logo with loading state */}
        <header className="logo">
          {!imageLoaded && <section className="image-placeholder">BlooBase</section>}
          <img 
            src="/bloobase.png" 
            alt="BlooBase Logo" 
            className={imageLoaded ? "fade-in" : "hidden"}
            onLoad={() => setImageLoaded(true)}
          />
        </header>
        
        <h2 className="signup-title">Create an Account With BlooBase</h2>

        <form className="signup-form" onSubmit={handleSubmit}>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <section className="password-input-container">
            <label htmlFor="password">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {/* Using inline SVGs instead of image files for faster loading */}
            <span 
              className="toggle-password-icon" 
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              )}
            </span>
          </section>

          <button type="submit">Sign Up</button>
        </form>

        <p className="register-link">
          Already have an account? <Link to="/Login">Login</Link>
        </p>
      </section>
    </main>
  );
};

export default Signup;
