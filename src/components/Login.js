import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { loginNormUser, GoogleLogin,getUserRole } from '../firebase/firebase';
import '../Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const navigate = useNavigate();
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginNormUser({ email, password });
      const userRole = await getUserRole();
      console.log(userRole);
      if (userRole === "Seller") {
        navigate("/SellerHomepage");
      } else if (userRole === "Buyer") {
        navigate("/BuyerHomePage");
      }
      else if (userRole === "Admin") {
        navigate("/Dashboard");
      }
      else {
        console.log(userRole)
        alert("User role not recognized");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  
  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await GoogleLogin();
      const userRole = await getUserRole(); 
      if (userRole === "Seller" ) {
        navigate("/SellerHomepage");
      }
      else if(userRole === "Buyer"){
        navigate("/BuyerHomePage")
      }
      else if(userRole==="Admin"){
        navigate("/Dashboard")
      }
      else {
        alert("User role not recognized");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  
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


  return (
    <main className="login-wrapper">
      <section className="login-container">
      <header className="logo">
          {!imageLoaded && <section className="image-placeholder">BlooBase</section>}
          <img 
            src="/bloobase.png" 
            alt="BlooBase Logo" 
            className={imageLoaded ? "fade-in" : "hidden"}
            onLoad={() => setImageLoaded(true)}
          />
        </header>
        <h2 className="login-title">Welcome Back</h2>
        <p className="login-subtitle">Sign in to your account</p>

        {/* Email/Password Form */}
        <form onSubmit={handleEmailLogin} className="login-form">
          <section className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </section>

          <section className="input-group password-group">
            <label htmlFor="password">Password</label>
            <section className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
              <section className="toggle-password-icon" onClick={() => setShowPassword(!showPassword)}>
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
          </section>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

       
        <section className="section-divider">
          <p>or continue with</p>
        </section>

       

        {error && <p className="error-message">{error}</p>}

        <button
  onClick={handleGoogleLogin}
  className="google-login-button"
  style={{
    marginTop: '1rem',
    padding: '0.75rem 1rem',
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    borderRadius: '5px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontWeight: '500',
  }}
>
  <img
    src="https://developers.google.com/identity/images/g-logo.png"
    alt="Google"
    style={{ width: '20px', height: '20px', marginRight: '0.5rem' }}
  />
  Continue with Google
</button>

        <p className="register-link" >
          Don't have an account? <Link to="/Signup">Sign up</Link>
        </p>
      </section>
    </main>
  );
};

export default Login;

