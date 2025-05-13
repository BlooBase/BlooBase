import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../Navbar.css';
import {auth} from '../firebase/firebase'; // Import auth from your firebase config
import { getUserName, getUserRole } from '../firebase/firebase';
import {logout} from "../firebase/firebase"; // Adjust path if needed

const Navbar = ({ pageTitle, bgColor = '#f8f9fa', textColor = '#343a40' }) => {
  const [optionsOpen, setOptionsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const [user, setUser] = useState({ name: '' });
  const [userRole, setUserRole] = useState(null); // State to store the user's role

  //this is a navbar component that is called throughout the web app
  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const userName = await getUserName();
        const role = await getUserRole();
        setUser({ name: userName });
        setUserRole(role);
      }
    };
    fetchUserData();
  }, []);

  const handleLogout = async () => {
      try {
        await logout();
        navigate("/");
      } catch (error) {
        alert("Failed to log out: " + error.message);
      }
    };

  return (
    <section
      className="navbar"
      style={{
        backgroundColor: bgColor,
        color: textColor,
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)'
      }}
    >
      <section className="nav-left">
        <Link to="/" className="site-title" style={{ textDecoration: 'none' }}>
          <section style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <img
              className="logo-img"
              src="/bloobase.png"
              alt="BlooBase logo"
            />
            <h2 style={{ color: textColor, margin: 0 }}>BlooBase</h2>
          </section>
        </Link>
      </section>

      <section className="nav-center">
        <h3 className="page-title" style={{ color: textColor }}>{pageTitle}</h3>
      </section>

      <section className="nav-right">
        {user && (
          <section className="user-info">
            <section
              className={`options-button ${optionsOpen ? 'selected' : ''}`}
              onClick={() => setOptionsOpen(prev => !prev)}
            >
              <img
                className="options"
                src="/options-lines.png"
                alt="Options Button"
              />
            </section>

            {optionsOpen && (
              <section className="dropdown-card">
                {auth.currentUser && (
                  (userRole === "Buyer" && currentPath !== '/BuyerHomepage') ? (
                    <Link
                      to="/BuyerHomepage"
                      className="dropdown-item"
                      style={{ textDecoration: 'none', color: '#000000' }}
                    >
                      Account
                    </Link>
                  ) : (userRole === "Seller" && currentPath !== '/SellerHomepage') ? (
                    <Link
                      to="/SellerHomepage"
                      className="dropdown-item"
                      style={{ textDecoration: 'none', color: '#000000' }}
                    >
                      Account
                    </Link>
                  ) : null
                )}


                {auth.currentUser && userRole === "Buyer" && currentPath !== '/Cart' && (
                  <Link
                    to="/Cart"
                    className="dropdown-item"
                    style={{ textDecoration: 'none', color: '#000000' }}
                  >
                    Cart
                  </Link>
                )}
                {currentPath !== '/Artists' && (
                  <Link
                    to="/Artists"
                    className="dropdown-item"
                    style={{ textDecoration: 'none', color: '#000000' }}
                  >
                    Artists
                  </Link>
                )}
                {userRole === "Seller" && auth.currentUser && currentPath !== '/CardCreator' && (
                  <Link
                    to="/CardCreator"
                    className="dropdown-item"
                    style={{ textDecoration: 'none', color: '#000000' }}
                  >
                    Card Creator
                  </Link>
                )}
                {userRole === "Buyer" && auth.currentUser && currentPath !== '/Orders' && (
                  
                  <Link
                    to="/Orders"
                    className="dropdown-item"
                    style={{ textDecoration: 'none', color: '#000000' }}
                  >
                    Orders
                  </Link>
              
                )}
      {/*the dropdown options change based on the page you are currently on */}
                {!auth.currentUser ? (
                  <>
                    <Link
                    to="/LogIn"
                    className="dropdown-item"
                    style={{ textDecoration: 'none', color: '#000000' }}
                  >
                    Log In
                  </Link>
                    <Link
                    to="/SignUp"
                    className="dropdown-item"
                    style={{ textDecoration: 'none', color: '#000000' }}
                  >
                    Sign Up
                  </Link>
                  </>
                ) : (
                  <Link
                    to="/HomePage"
                    onClick={handleLogout}
                    className="dropdown-item"
                    style={{ textDecoration: 'none', color: '#000000' }}
                  >
                    Log Out
                  </Link>
                )}

                {/* Add user role at the bottom of the dropdown */}
                {auth.currentUser && userRole && (
                  <p
                    className="user-role-display"
                    style={{
                      fontSize: '0.9rem',
                      color: '#888',
                      textAlign: 'center',
                      fontStyle: 'italic',
                    }}
                  >
                    Logged in as: {userRole}
                  </p>
                )}
              </section>
            )}


          {auth.currentUser && (
            <>
              <p className="username" style={{ color: textColor }}>{user.name}</p>
              <img
                className="user-avatar"
                src={'/user_profile.png'}
                alt={`${user.name}'s avatar`}
              />
            </>
          )}
          </section>
        )}
      </section>
    </section>
  );
};

export default Navbar;
