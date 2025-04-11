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
    <div className="login-wrapper">
      <div className="login-container">
        <h2 className="login-title">Welcome Back</h2>
        <p className="login-subtitle">Sign in to your account</p>

        {/* Email/Password Form */}
        <form onSubmit={handleEmailLogin} className="login-form">
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="input-group password-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
              <img
                src={showPassword ? "./eye.png" : "./crossed-eye.png"}
                alt="Toggle Password"
                className="toggle-password-icon"
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Divider */}
        <div className="divider">
          <span>or continue with</span>
        </div>

        {/* Social Login Buttons */}
        <div className="social-buttons">
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
        </div>

        {/* Error Message */}
        {error && <p className="error-message">{error}</p>}

        {/* Register Link */}
        <p className="register-link">
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
