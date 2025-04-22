// src/components/Navbar.js
import React from 'react';
import '../Navbar.css';
import { Link } from 'react-router-dom';

const Navbar = ({ pageTitle, user, bgColor = '#f8f9fa', textColor = '#343a40' }) => {
  return (
    <section
      className="navbar"
      style={{
        backgroundColor: bgColor,
        color: textColor,
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' // Drop shadow
      }}
    >
       <section className="nav-left">
        {/* Wrap BlooBase title with Link to navigate to homepage */}
        <Link to="/" className="site-title" style={{ textDecoration: 'none' }}>
        <section style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <img
            src="/bloobase.png" // Make sure this is the correct path
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
