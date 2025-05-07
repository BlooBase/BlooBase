import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../Navbar.css';

const Navbar = ({ pageTitle, user, bgColor = '#f8f9fa', textColor = '#343a40' }) => {
  const [optionsOpen, setOptionsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Artists' },
    { path: '/CardCreator', label: 'Card Creator' }
  ];

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
              src="/bloobase.png"
              alt="BlooBase logo"
              style={{ height: '32px', width: '32px', objectFit: 'contain' }}
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
                <button className="dropdown-item">Account</button>
                <button className="dropdown-item">Cart</button>

                {navLinks.map(link => (
                  location.pathname !== link.path && (
                    <Link
                      key={link.path}
                      to={link.path}
                      className="dropdown-item"
                      style={{ textDecoration: 'none', color: '#000000' }}
                    >
                      {link.label}
                    </Link>
                  )
                ))}

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
