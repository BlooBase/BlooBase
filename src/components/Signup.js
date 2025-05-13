import React, { useState, useEffect } from "react";
import "../Signup.css";
import { Link, useNavigate} from "react-router-dom";
import { isPasswordStrong } from "../checkPasswordStrength";
import { signupNormUser,GoogleSignup, logout } from "../firebase/firebase";

const Signup = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword:"",
    role:""
  });

  const [showPassword, setShowPassword] = useState(false);
  const[showConfirmPassword,setConfirmShowPassword] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [googleRole, setGoogleRole] = useState("");
  const [passwordError,setPasswordError] =useState(""); 
  const[passwordMatch,setPasswordMatch]=useState("");
  const handleGoogleSignup = async () => {
    if (!googleRole) {
      alert("Please select a role before signing up with Google.");
      return;
    }
    try {
      const result = await GoogleSignup(googleRole);
      if (!result || result.success === false) {
        alert(result?.message || "Google signup failed. Please try again.");
        return; // Stop here if signup failed
      }
      await logout();
      navigate("/Login");
    } catch (error) {
      console.error("Google signup failed:", error);
      alert("Google signup failed. Please try again.");
      return; // Stop here if error thrown
    }
  };
  
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
// shows error messages if the passswords dont match or the password is weak
  const handleSignup = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordMatch("");

    if (!isPasswordStrong(formData.password)) {
      setPasswordError("Password must be at least 8 characters including a capital letter,a number and a special character.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setPasswordMatch("Passwords do not match");
      return;
    }
    try {
      const result = await signupNormUser(formData);
      if (!result || result.success === false) {
        setPasswordError(result?.message || "Signup failed. Please try again.");
        return; // Stop here if signup failed
      }
      await logout();
      navigate("/Login");
    } catch (error) {
      console.error("Signup failed:", error);
      alert("Signup failed. Please try again.");
      return; // Stop here if error thrown
    }
  };
  

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const toggleConfirmPasswordVisibility= () => {
    setConfirmShowPassword(!showConfirmPassword);
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

        <form className="signup-form" onSubmit={handleSignup}>
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
          <section className="role-selector"> 
            <label htmlFor="role">Role</label>
            <select name="role" value={formData.role} onChange={handleChange} required>
            <option value="">Select a role</option>
            <option value="Buyer">Buyer</option>
            <option value="Seller">Seller</option>
          </select>

          </section>
          <section className="input-group password-group">
  <label htmlFor="password">Password</label>
  <section className="password-input-wrapper">
    <input
      type={showPassword ? "text" : "password"}
      name="password"
      placeholder="Enter your password"
      value={formData.password}
      onChange={handleChange}
      required
    />
    <section
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
    </section>
  </section>
  {passwordError && <p className="password-error">{passwordError}</p>}
</section>

<section className="input-group password-group">
  <label htmlFor="confirmPassword">Confirm Password</label>
  <section className="password-input-wrapper">
    <input
      type={showConfirmPassword ? "text" : "password"}
      name="confirmPassword"
      placeholder="Confirm your password"
      value={formData.confirmPassword}
      onChange={handleChange}
      required
    />
  {/*using svg instead of images for faster loading time*/}
    <section
      className="toggle-password-icon"
      onClick={toggleConfirmPasswordVisibility}
      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
    >
      {showConfirmPassword ? (
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
    </section>
  </section>
   {passwordMatch && <p className="password-match">{passwordMatch}</p>}
</section>


          <button type="submit">Sign Up</button>
        </form>
        
        <section className="google-signup-section">
          <label htmlFor="google-role">Role for Google Signup</label>
        <select
          name="google-role"
          value={googleRole}
          onChange={(e) => setGoogleRole(e.target.value)}
          className="google-role-selector"
          required
        >
          <option value="">Select a role</option>
          <option value="Buyer">Buyer</option>
          <option value="Seller">Seller</option>
        </select>

        <button type="button" className="google-signup-button" onClick={handleGoogleSignup}>
          <img src="/google.png" alt="Google icon" className="google-icon" />
          Sign Up with Google
        </button>
      </section>




        <p className="register-link">
          Already have an account? <Link to="/Login">Login</Link>
        </p>
      </section>
    </main>
  );
};

export default Signup;