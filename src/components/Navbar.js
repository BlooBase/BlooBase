import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../Navbar.css';

const Navbar = ({ pageTitle, user, bgColor = '#f8f9fa', textColor = '#343a40' }) => {
  const [optionsOpen, setOptionsOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

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
                {currentPath !== '/Account' && (
                  <button className="dropdown-item">Account</button>
                )}
                {currentPath !== '/Cart' && (
                  <button className="dropdown-item">Cart</button>
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
                {currentPath !== '/CardCreator' && (
                  <Link
                    to="/CardCreator"
                    className="dropdown-item"
                    style={{ textDecoration: 'none', color: '#000000' }}
                  >
                    Card Creator
                  </Link>
                )}
                {currentPath !== '/Orders' && (
                  <Link
                    to="/CardCreator"
                    className="dropdown-item"
                    style={{ textDecoration: 'none', color: '#000000' }}
                  >
                    Orders
                  </Link>
                )}
                <button className="dropdown-item">Log Out</button>
              </section>
            )}

            <p className="username" style={{ color: textColor }}>{user.name}</p>
            <img
              className="user-avatar"
              src={user.avatarLocal}
              alt={`${user.name}'s avatar`}
            />
          </section>
        )}
      </section>
    </section>
  );
};

export default Navbar;
