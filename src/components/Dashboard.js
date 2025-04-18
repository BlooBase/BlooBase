import React, { useState } from "react";
import "../Dashboard.css";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <main className="dashboard-container">
      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
        <section className="sidebar-header">
          <img src="./bloobase.png" alt="Dashboard" className="sidebar-icon" />
        </section>
        <nav className="sidebar-nav">
          <Link to="/dashboard" className="sidebar-link" data-tooltip="Home">
            <img src="./home.png" alt="Home" className="sidebar-link-icon" />
          </Link>
          <Link to="/users" className="sidebar-link" data-tooltip="Users">
            <img src="./users.png" alt="Users" className="sidebar-link-icon" />
          </Link>
          <Link to="/analytics" className="sidebar-link" data-tooltip="Analytics">
            <img src="./analytics.png" alt="Analytics" className="sidebar-link-icon" />
          </Link>
          <Link to="/settings" className="sidebar-link" data-tooltip="Settings">
            <img src="./setting.png" alt="Settings" className="sidebar-link-icon" />
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <section className="main-content">
          <button onClick={toggleSidebar} className="menu-button">
            <img src="./menu.png" alt="Menu" className="menu-icon" />
          </button>
        

        {/* Search Bar,will connect to database */}
        <section className="search-container">
          <img src="./search.png" alt="Search" className="search-icon" />
          <input
            type="text"
            placeholder="Search for artisan/store"
            className="search-input"
          />
        </section>

        {/* Stats Section with sample data */}
        <section className="stats-container">
          <article className="stat-item">
            <img src="./users.png" alt="Users" className="stat-icon" />
            <section className="stat-info">
              <span className="stat-value">234</span>
              <h3 className="stat-title">Total Artisans</h3>
            </section>
          </article>
          <article className="stat-item">
            <img src="./revenue.png" alt="Revenue" className="stat-icon" />
            <section className="stat-info">
              <span className="stat-value">R56,789</span>
              <h3 className="stat-title">Average Revenue per Store</h3>
            </section>
          </article>
          <article className="stat-item">
            <img src="./stores.png" alt="Stores" className="stat-icon" />
            <section className="stat-info">
              <span className="stat-value">156</span>
              <h3 className="stat-title">Active Stores</h3>
            </section>
          </article>
        </section>

        {/* Table and Chart with sample data */}
        <section className="content-container">
          <article className="table-box">
            <h2 className="table-title">Recent Artisans</h2>
            <table className="users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>John Kelly</td>
                  <td>johnk2424@gmail.com</td>
                  <td><span className="status-active">Active</span></td>
                </tr>
                <tr>
                  <td>Thato Mazibuko</td>
                  <td>thatoMazib@icloud.com</td>
                  <td><span className="status-inactive">Inactive</span></td>
                </tr>
              </tbody>
            </table>
          </article>
          <article className="table-box">
            <h2 className="table-title">Most Popular Stores</h2>
            <table className="users-table">
              <thead>
                <tr>
                  <th>Store Name</th>
                  <th>Total Sales</th>
                  <th>Rating</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Artisan Crafts</td>
                  <td>R120,000</td>
                  <td>4.8</td>
                </tr>
                <tr>
                  <td>Handmade Treasures</td>
                  <td>R95,000</td>
                  <td>4.5</td>
                </tr>
              </tbody>
            </table>
          </article>
          <article className="table-box">
            <h2 className="table-title">Recent Transactions</h2>
            <table className="users-table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Store Name</th>
                  <th>Amount</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>TX123456</td>
                  <td>Artisan Crafts</td>
                  <td>R2,500</td>
                  <td>2025-04-17</td>
                </tr>
                <tr>
                  <td>TX123457</td>
                  <td>Handmade Treasures</td>
                  <td>R1,800</td>
                  <td>2025-04-16</td>
                </tr>
              </tbody>
            </table>
          </article>
          <article className="chart-box">
            <h2 className="chart-title">Performance Chart</h2>
            <section className="chart-placeholder">
              <span>Chart Placeholder (e.g., Sales Chart)</span>
            </section>
          </article>
        </section>
      </section>
    </main>
  );
};

export default Dashboard;