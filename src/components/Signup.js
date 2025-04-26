import React, { useState } from "react";
import "../Signup.css";
import { Link, useNavigate } from "react-router-dom";
const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Signup data submitted:", formData);
    // add Firebase or backend API integration here
  };
const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  }

  return (
    <main className="signup">
<header className="logo">
        <img src="/bloobase.png" alt="BlooBase Logo"/>
    </header>

    <section className="signup-container">
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
            <img
              src={showPassword ? "/crossed-eye.png" : "/eye.png"}
              alt="Toggle Password Visibility"
              className="toggle-password-icon"
              onClick={togglePasswordVisibility}
            />
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
