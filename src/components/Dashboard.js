import React, { useState, useEffect } from "react";
import "../Dashboard.css";
import { getRoleSize, getCollectionSize, getUserName } from "../firebase/firebase";
import { getLatestOrders, getLatestSellers, getTotalSales, getTopSellers } from "../firebase/adminDashFunctions";
import { Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

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
  const [ordersCount, setOrdersCount] = useState(null);
  const [user, setUser] = useState({ name: '' });
  const [latestTransactions, setLatestTransactions] = useState([]);
  const [latestSellers, setLatestSellers] = useState([]);
  const [sellersLoading, setSellersLoading] = useState(true);
  const [sellersError, setSellersError] = useState(null);
  const [totalSales, setTotalSales] = useState(0);
  const [topPerformingSellers, setTopPerformingSellers] = useState([]);
  const [topSellersLoading, setTopSellersLoading] = useState(true);
  const [topSellersError, setTopSellersError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const roles = await getAllRoleSizes();
      setRoleCounts(roles);

      const orders = await getCollectionSize("Orders");
      setOrdersCount(orders);

      const transactions = await getLatestOrders();
      // Ensure transaction totals are numbers and formatted to 2 decimals
      const formattedTransactions = transactions.map(t => ({
        ...t,
        total: parseFloat(t.total || 0).toFixed(2) // Format total here
      }));
      setLatestTransactions(formattedTransactions);

      setSellersLoading(true);
      setSellersError(null);
      try {
        const sellers = await getLatestSellers();
        setLatestSellers(sellers);
      } catch (err) {
        console.error("Error fetching latest sellers:", err);
        setSellersError("Failed to load new artisans.");
        setLatestSellers([]);
      } finally {
        setSellersLoading(false);
      }

      try {
        const sales = await getTotalSales();
        setTotalSales(sales); // totalSales will be formatted in the JSX
      } catch (err) {
        console.error("Error fetching overall sales:", err);
        setTotalSales(0);
      }

      setTopSellersLoading(true);
      setTopSellersError(null);
      try {
        const topSellersData = await getTopSellers();
        setTopPerformingSellers(topSellersData);
        console.log("top sellers");
        console.log(topSellersData);
      } catch (err) {
        console.error("Error fetching top performing sellers:", err);
        setTopSellersError("Failed to load top performing artisans.");
        setTopPerformingSellers([]);
      } finally {
        setTopSellersLoading(false);
      }
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

  const handleTransactionClick = (orderId) => {
    navigate(`/orderdetails/${orderId}`);
  };

  const getMaxSellerCount = () => {
    if (topPerformingSellers.length > 0) {
      return topPerformingSellers[0].count;
    }
    return 1;
  };

  const maxCount = getMaxSellerCount();

  return (
    <section className="dashboard-container">
      <section className="seller-header">
        <img src="/bloobase.png" alt="Bloobase" className="seller-logo" />
        <section className="welcome-bg-dash">
          <h1 className="seller-title">Welcome, {user.name}</h1>
        </section>
        <nav className="seller-nav">
          <Link to="/" className="seller-nav-link">HOME</Link>
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
            {/* Format totalSales here */}
            <p className="stat-value sales">R {parseFloat(totalSales).toFixed(2)}</p>
          </article>
          <article className="stat-card">
            <p>
              Orders <img src="product.png" alt="order-img" className="icons" />
            </p>
            <p className="stat-value">{ordersCount ? ordersCount : "Loading.."}</p>
          </article>
        </section>

        <section className="overview-row">
          <aside className="user-card">
            <h3>New Artisans</h3>
            {sellersLoading ? (
              <p>Loading new artisans...</p>
            ) : sellersError ? (
              <p className="error-message">{sellersError}</p>
            ) : latestSellers.length > 0 ? (
              latestSellers.map((seller, index) => (
                <Link key={seller.id || index} to={`/Artists/${seller.id}`} className="seller-link">
                  <p>{seller.name} </p>
                </Link>
              ))
            ) : (
              <p>No new artisans found.</p>
            )}
          </aside>

          <article className="progress-card">
            <h3>Most performing artisans</h3>
            {topSellersLoading ? (
              <p>Loading top performing artisans...</p>
            ) : topSellersError ? (
              <p className="error-message">{topSellersError}</p>
            ) : topPerformingSellers.length > 0 ? (
              <ul className="store-list">
                {topPerformingSellers.map((sellerData, index) => (
                  <li key={index} className="store-item">
                    <p className="store-name">{sellerData.seller}</p>
                    <section className="store-bar">
                      <section
                        className="store-progress"
                        style={{ width: `${(sellerData.count / maxCount) * 100}%` }}
                      ></section>
                    </section>
                    <p className="store-value">{sellerData.count}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No performance data available.</p>
            )}
          </article>

          <article className="transactions">
            <h3>Latest Transactions</h3>
            {latestTransactions.length > 0 ? (
              <ul className="transaction-list">
                {latestTransactions.map((transaction) => (
                  <li key={transaction.id}>
                    <button
                      className="transaction-button"
                      onClick={() => handleTransactionClick(transaction.id)}
                    >
                      <p className="transaction-id">Order ID: {transaction.id}</p>
                      {/* transaction.total is already formatted in useEffect */}
                      <p className="amount">R {transaction.total}</p>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No recent transactions found.</p>
            )}
          </article>
        </section>

        <section className="details-row">
          <article className="graph-section">
            <h3>Monthly Sales Performance</h3>
            <section className="graph-container">
              <section className="graph-y-axis">
                {/* These are static, illustrative values. If they were dynamic, they'd need formatting. */}
                <p>5k</p>
                <p>4k</p>
                <p>3k</p>
                <p>2k</p>
                <p>1k</p>
                <p>0</p>
              </section>
              <section className="graph-content">
                {/* Static graph data with manual formatting. If dynamic, ensure values are formatted. */}
                <section className="graph-bar" style={{ height: "30%" }}>
                  <p className="graph-tooltip">Jan: R1,500.00</p>
                </section>
                <section className="graph-bar" style={{ height: "40%" }}>
                  <p className="graph-tooltip">Feb: R2,000.00</p>
                </section>
                <section className="graph-bar" style={{ height: "35%" }}>
                  <p className="graph-tooltip">Mar: R1,750.00</p>
                </section>
                <section className="graph-bar" style={{ height: "60%" }}>
                  <p className="graph-tooltip">Apr: R3,000.00</p>
                </section>
                <section className="graph-bar active" style={{ height: "80%" }}>
                  <p className="graph-tooltip">May: R4,000.00</p>
                </section>
                <section className="graph-bar forecast" style={{ height: "70%" }}>
                  <p className="graph-tooltip">Jun: R3,500.00 (forecast)</p>
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