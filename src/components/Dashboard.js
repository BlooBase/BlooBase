import React, { useState, useEffect } from "react";
import "../Dashboard.css";
import { getRoleSize, getCollectionSize, getUserName } from "../firebase/firebase";
import { Link } from "react-router-dom"; // Import Link

const Dashboard = () => {
  async function getAllRoleSizes() {
    try {
      const [buyerCount, sellerCount, adminCount] = await Promise.all([
        getRoleSize("Buyer"),
        getRoleSize("Seller"),
        getRoleSize("Admin"),
      ]);
  
      return {
        Buyer: buyerCount,
        Seller: sellerCount,
        Admin: adminCount,
      };
    } catch (error) {
      console.error("Error getting role sizes:", error);
      return {
        Buyer: 0,
        Seller: 0,
        Admin: 0,
      };
    }
  }

  const [roleCounts, setRoleCounts] = useState(null);
  const [Orders, setOrdersCount] = useState(null);
  const [user, setUser] = useState({ name: '' });

  useEffect(() => {
    async function fetchData() {
      const roles = await getAllRoleSizes();
      setRoleCounts(roles);

      // Get Orders collection sizes
      const orders = await getCollectionSize("Orders");
      setOrdersCount(orders);
    }

    fetchData();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const name = await getUserName();
      setUser({ name });
    };
    fetchUser();
  }, []);

  return (
    <section className="dashboard-container">
      {/* Seller Header */}
      <section className="seller-header">
        <img src="/bloobase.png" alt="Bloobase" className="seller-logo" />
        <section className="welcome-bg-dash">
          <h1 className="seller-title">Welcome, {user.name}</h1>
        </section>
        <nav className="seller-nav">
          <Link to="/" className="seller-nav-link">HOME</Link>
          {/* Removed "Your Store" button */}
        </nav>
      </section>

      <main className="dashboard-main">
        <section className="stats-row">
          <article className="stat-card">
            <p>
              Artisans <img src="artisan.png" alt="artisan-img" className="icons" />
            </p>
            <p className="stat-value">{roleCounts ? roleCounts.Seller : "Loading.."}</p>
          </article>
          <article className="stat-card">
            <p>
              Sales <img src="sales.png" alt="sales-img" className="icons" />
            </p>
            <p className="stat-value sales">0</p>
          </article>
          <article className="stat-card">
            <p>
              Orders <img src="product.png" alt="order-img" className="icons" />
            </p>
            <p className="stat-value">{Orders ? Orders : "Loading.."}</p>
          </article>
        </section>
        {/* this is mock data for testing purposes */}
        <section className="overview-row">
          <aside className="user-card">
            <h3>New Artisans</h3>
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
            <h3>Most performing artisans</h3>
            <ul className="store-list">
              <li className="store-item">
                <p className="store-name">Artisan Crafts Co.</p>
                <section className="store-bar">
                  <section
                    className="store-progress"
                    style={{ width: "85%" }}
                  ></section>
                </section>
                <p className="store-value">85+</p>
              </li>
              <li className="store-item">
                <p className="store-name">Handmade Haven</p>
                <section className="store-bar">
                  <section
                    className="store-progress"
                    style={{ width: "72%" }}
                  ></section>
                </section>
                <p className="store-value">72+</p>
              </li>
              <li className="store-item">
                <p className="store-name">Craft Corner</p>
                <section className="store-bar">
                  <section
                    className="store-progress"
                    style={{ width: "64%" }}
                  ></section>
                </section>
                <p className="store-value">64+</p>
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
                <p>5k</p>
                <p>4k</p>
                <p>3k</p>
                <p>2k</p>
                <p>1k</p>
                <p>0</p>
              </section>
              <section className="graph-content">
                <section className="graph-bar" style={{ height: "30%" }}>
                  <p className="graph-tooltip">Jan: R1,500</p>
                </section>
                <section className="graph-bar" style={{ height: "40%" }}>
                  <p className="graph-tooltip">Feb: R2,000</p>
                </section>
                <section className="graph-bar" style={{ height: "35%" }}>
                  <p className="graph-tooltip">Mar: R1,750</p>
                </section>
                <section className="graph-bar" style={{ height: "60%" }}>
                  <p className="graph-tooltip">Apr: R3,000</p>
                </section>
                <section className="graph-bar active" style={{ height: "80%" }}>
                  <p className="graph-tooltip">May: R4,000</p>
                </section>
                <section className="graph-bar forecast" style={{ height: "70%" }}>
                  <p className="graph-tooltip">Jun: R3,500 (forecast)</p>
                </section>
              </section>
              <section className="graph-x-axis">
                <p>May</p>
                <p>June</p>
                <p>July</p>
                <p>Aug</p>
                <p>Sep</p>
                <p>Oct</p>
              </section>
            </section>
            <section className="graph-legend">
              <section className="legend-item">
                <p className="legend-color"></p>
                <p>Monthly Sales</p>
              </section>
              <section className="legend-item">
                <p className="legend-color forecast"></p>
                <p>Forecast</p>
              </section>
            </section>
          </article>
        </section>
      </main>
    </section>
  );
};

export default Dashboard;