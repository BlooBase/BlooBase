import React, { useState, useEffect } from "react";
import "../Signup.css";
import { Link, useNavigate } from "react-router-dom";
import { signupNormUser } from "../firebase/firebase";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setConfirmShowPassword] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [popup, setPopup] = useState({ show: false, message: "", status: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const logoImg = new Image();
    logoImg.src = "/bloobase.png";
    logoImg.onload = () => setImageLoaded(true);

    const eyeImg = new Image();
    eyeImg.src = "/eye.png";

    const crossedEyeImg = new Image();
    crossedEyeImg.src = "/crossed-eye.png";
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear errors when user starts typing
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }
    
    // Role validation
    if (!formData.role) {
      newErrors.role = "Please select a role";
      isValid = false;
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }
    
    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setPopup({
        show: true,
        message: "Please fix the errors in the form",
        status: "error",
      });
      setTimeout(() => {
        setPopup({ show: false, message: "", status: "" });
      }, 3000);
      return;
    }
    
    try {
      await signupNormUser(formData);
      setPopup({
        show: true,
        message: "Sign up successful",
        status: "success",
      });
      
      // Only navigate after validation and successful signup
      setTimeout(() => {
        setPopup({ show: false, message: "", status: "" });
        //go to Uploadproducts if it's a seller
        if (formData.role==="Seller"){
          navigate("/CreateShop");
        }else{
          navigate("/HomePage");
        }
        
      }, 1000);
    } catch (error) {
      setPopup({
        show: true,
        message: error.message || "Signup failed. Please try again.",
        status: "error",
      });
      setTimeout(() => {
        setPopup({ show: false, message: "", status: "" });
      }, 1000);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleConfirmPasswordVisibility = () => {
    setConfirmShowPassword(!showConfirmPassword);
  };

  return (
    <main className="signup-wrapper relative">
      <section className="signup-container">
        {popup.show && (
          <section
            className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg text-white text-center z-50 ${
              popup.status === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {popup.message}
          </section>
        )}

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
            className={errors.name ? "input-error" : ""}
            required
          />
          {errors.name && <span className="error-message">{errors.name}</span>}

          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? "input-error" : ""}
            required
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
          
          <section className="role-selector">
            <label htmlFor="role">Role</label>
            <select 
              name="role" 
              value={formData.role} 
              onChange={handleChange} 
              className={errors.role ? "input-error" : ""}
              required
            >
              <option value="">Select a role</option>
              <option value="Buyer">Buyer</option>
              <option value="Seller">Seller</option>
            </select>
            {errors.role && <span className="error-message">{errors.role}</span>}
          </section>
          
          <section className="password-input-container">
            <label htmlFor="password">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? "input-error" : ""}
              required
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
            <span
              className="toggle-password-icon"
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              )}
            </span>
          </section>
          
          <section className="confirm-password-input-container">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? "input-error" : ""}
              required
            />
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
            <span
              className="toggle-password-icon"
              onClick={toggleConfirmPasswordVisibility}
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
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