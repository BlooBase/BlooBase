// src/components/Navbar.js
import React from 'react';
import '../Navbar.css';

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
        <h2 className="site-title" style={{ color: textColor }}>BlooBase</h2>
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
              src={user.avatarUrl}
              alt={`${user.name}'s avatar`}
            />
          </section>
        )}
      </section>
    </section>
  );
};

export default Navbar;
