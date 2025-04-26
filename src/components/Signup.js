import React, { useState } from "react";
import "../Signup.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

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

  return (
    <main className="signup">
<header className="logo">
        <img src="/bloobase.png" alt="BlooBase Logo"/>
    </header>

    <section className="signup-container">
      <h2 className="signup-title">Create an Account With BlooBase</h2>
      <form className="signup-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
    </section>
    </main>
  );
};

export default Signup;
