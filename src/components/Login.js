import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, FacebookAuthProvider } from "firebase/auth";
import { db, doc, setDoc } from '../firebase/firebase';
import '../Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  const createOrUpdateUserDoc = async (user) => {
    try {
      await setDoc(doc(db, "users", user.uid), {
        username: user.displayName || user.email.split('@')[0],
        email: user.email,
        created_at: new Date(),
        last_login: new Date()
      }, { merge: true });
    } catch (err) {
      console.error("Error creating/updating user doc:", err);
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await createOrUpdateUserDoc(userCredential.user);
      navigate('/Dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      await createOrUpdateUserDoc(userCredential.user);
      navigate('/Dashboard');
    } catch (err) {
      setError("Google login failed: " + err.message);
    }
  };

  const handleFacebookLogin = async () => {
    const provider = new FacebookAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      await createOrUpdateUserDoc(userCredential.user);
      navigate('/Dashboard');
    } catch (err) {
      setError("Facebook login failed: " + err.message);
    }
  };

  return (
    <main className="login-wrapper">
      <section className="login-container">
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

       
        <section className="divider">
          <span>or continue with</span>
        </section>

        {/* Social Login Buttons */}
        <section className="social-buttons">
          <button 
            onClick={handleGoogleLogin} 
            className="social-button google-button"
            disabled={loading}
          >
            <img src="./google.png" alt="Google" className="social-icon" />
            Google
          </button>
          <button 
            onClick={handleFacebookLogin} 
            className="social-button facebook-button"
            disabled={loading}
          >
            <img src="./facebook.png" alt="Facebook" className="social-icon" />
            Facebook
          </button>
        </section>

       
        {error && <p className="error-message">{error}</p>}

       
        <p className="register-link">
          Don't have an account? <Link to="/Signup">Sign up</Link>
        </p>
      </section>
    </main>
  );
};

export default Login;
