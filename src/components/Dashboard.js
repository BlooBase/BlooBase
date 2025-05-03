import React, { useState, useRef, useEffect } from "react";
import "../Dashboard.css";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [optionsOpen, setOptionsOpen] = useState(false);
  const optionsRef = useRef(null);

  // Effect to close options dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setOptionsOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [optionsRef]);

  

  // Mock user data (replace with actual user data from your app)
  const user = {
    name: "Admin",
    avatarLocal: "/user_profile.png", 
  };

  return (
    <section className="dashboard-container">
      <header className="navbar">
        <section className="nav-left">
          <Link to="/" className="site-title" style={{ textDecoration: "none" }}>
            <section style={{ display: "flex", alignItems: "center", gap: "0.9rem" }}>
              <img
                src="/BlooBase.png"
                alt="BlooBase logo"
                style={{ height: "32px", width: "30px", objectFit: "contain",marginLeft:"19px"}}
              />
              <h2 style={{ color: "#343a40", margin: 0 }}>BlooBase</h2>
            </section>
          </Link>
        </section>

        <section className="nav-center">
          <h3 className="page-title" style={{ color: "#343a40", margin: 0 }}>
            Dashboard
          </h3>
        </section>

        <section className="nav-right" ref={optionsRef}>
          <section className="user-info">
            <section
              className={`options-button ${optionsOpen ? "selected" : ""}`}
              onClick={() => setOptionsOpen((prev) => !prev)}
            >
              <img
                className="options"
                src="/options-lines.png"
                alt="Options Button"
              />
            </section>
            
            <p className="username" style={{ color: "#343a40" }}>
              {user.name}
            </p>
            <img
              className="user-avatar"
              src={user.avatarLocal}
              alt={`${user.name}'s avatar`}
            />

            {optionsOpen && (
              <section className="dropdown-card">
                <Link
                  to="/HomePage"
                  className="dropdown-item"
                  style={{ textDecoration: "none", color: "#000000" }}
                >
                  Home
                </Link>
                <Link
                  to="/Artists"
                  className="dropdown-item"
                  style={{ textDecoration: "none", color: "#000000" }}
                >
                  Artisans
                </Link>
                <Link
                  to="/reviews"
                  className="dropdown-item"
                  style={{ textDecoration: "none", color: "#000000" }}
                >
                  Reviews
                </Link>
                <Link
                  to="/settings"
                  className="dropdown-item"
                  style={{ textDecoration: "none", color: "#000000" }}
                >
                  Settings
                </Link>
                <button className="dropdown-item">Log Out</button>
              </section>
            )}
          </section>
        </section>

        
      </header>


      <main className="dashboard-main">
        
        <section className="stats-row">
          <article className="stat-card">
            <span>
              Artisans <img src="artisan.png" alt="artisan-img" className="icons" />
            </span>
            <p className="stat-value">35</p>
          </article>
          <article className="stat-card">
            <span>
              Sales <img src="sales.png" alt="sales-img" className="icons" />
            </span>
            <p className="stat-value sales">R9 700</p>
          </article>
          <article className="stat-card">
            <span>
              Stores <img src="shop.png" alt="store-img" className="icons" />
            </span>
            <p className="stat-value">70</p>
          </article>
          <article className="stat-card">
            <span>
              Orders <img src="product.png" alt="order-img" className="icons" />
            </span>
            <p className="stat-value">105</p>
          </article>
        </section>

        <section className="overview-row">
          <aside className="user-card">
            <h3>New Stores</h3>
            <p>
              Paul's furniture{" "}
              <img src="verify.png" alt="Verified" className="verify-icon" />
            </p>
            <p>
              Slim Jim <img src="verify.png" alt="Verified" className="verify-icon" />
            </p>
            <p>
              Pop offs <img src="verify.png" alt="Verified" className="verify-icon" />
            </p>
          </aside>

          <article className="progress-card">
            <h3>Most performing stores</h3>
            <ul className="store-list">
              <li className="store-item">
                <span className="store-name">Artisan Crafts Co.</span>
                <section className="store-bar">
                  <section
                    className="store-progress"
                    style={{ width: "85%" }}
                  ></section>
                </section>
                <span className="store-value">85+</span>
              </li>
              <li className="store-item">
                <span className="store-name">Handmade Haven</span>
                <section className="store-bar">
                  <section
                    className="store-progress"
                    style={{ width: "72%" }}
                  ></section>
                </section>
                <span className="store-value">72+</span>
              </li>
              <li className="store-item">
                <span className="store-name">Craft Corner</span>
                <section className="store-bar">
                  <section
                    className="store-progress"
                    style={{ width: "64%" }}
                  ></section>
                </section>
                <span className="store-value">64+</span>
              </li>
            </ul>
          </article>

          <article className="transactions">
            <h3>Latest Transactions</h3>
            <section className="transaction-item">
              <p>Crown Jewels</p>
              <p className="amount">R 1,250.00</p>
            </section>
            <section className="transaction-item">
              <p>Slim Jimm</p>
              <p className="amount">R 845.50</p>
            </section>
            <section className="transaction-item">
              <p>Craft Corner</p>
              <p className="amount">R 320.75</p>
            </section>
          </article>
        </section>

        <section className="details-row">
          <article className="graph-section">
            <h3>Monthly Sales Performance</h3>
            <section className="graph-container">
              <section className="graph-y-axis">
                <span>5k</span>
                <span>4k</span>
                <span>3k</span>
                <span>2k</span>
                <span>1k</span>
                <span>0</span>
              </section>
              <section className="graph-content">
                <section className="graph-bar" style={{ height: "30%" }}>
                  <span className="graph-tooltip">Jan: R1,500</span>
                </section>
                <section className="graph-bar" style={{ height: "40%" }}>
                  <span className="graph-tooltip">Feb: R2,000</span>
                </section>
                <section className="graph-bar" style={{ height: "35%" }}>
                  <span className="graph-tooltip">Mar: R1,750</span>
                </section>
                <section className="graph-bar" style={{ height: "60%" }}>
                  <span className="graph-tooltip">Apr: R3,000</span>
                </section>
                <section className="graph-bar active" style={{ height: "80%" }}>
                  <span className="graph-tooltip">May: R4,000</span>
                </section>
                <section className="graph-bar forecast" style={{ height: "70%" }}>
                  <span className="graph-tooltip">Jun: R3,500 (forecast)</span>
                </section>
              </section>
              <section className="graph-x-axis">
                <span>May</span>
                <span>June</span>
                <span>July</span>
                <span>Aug</span>
                <span>Sep</span>
                <span>Oct</span>
              </section>
            </section>
            <section className="graph-legend">
              <section className="legend-item">
                <span className="legend-color"></span>
                <span>Monthly Sales</span>
              </section>
              <section className="legend-item">
                <span className="legend-color forecast"></span>
                <span>Forecast</span>
              </section>
            </section>
          </article>
          <article className="tasks-section">
            <h3>Admin Tasks: 3/5</h3>
            <section className="task-progress">
              <p>Tasks</p>
              <progress className="progress-bar" value="60" max="100"></progress>
              <p>60%</p>
            </section>
            <ol className="task-list">
              <li>
                Review Artisan Applications
                <img src="verify.png" alt="Verified" className="verify-icon" />
              </li>
              <li>
                Update Marketplace Listings
                <img src="verify.png" alt="Verified" className="verify-icon" />
              </li>
              <li>
                Check Order Status
                <img src="verify.png" alt="Verified" className="verify-icon" />
              </li>
              <li>Approve New Products</li>
              <li>Customer Support</li>
            </ol>
          </article>
        </section>
      </main>
    </section>
  );
};

export default Dashboard;