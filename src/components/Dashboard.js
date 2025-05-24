import React, { useState, useEffect } from "react";
import "../Dashboard.css"; // Ensure this path is correct
import { getRoleSize, getCollectionSize, getUserName } from "../firebase/firebase";
import { getLatestOrders, getLatestSellers, getTotalSales, getTopSellers } from "../firebase/adminDashFunctions";
import { fetchMonthlySalesPerformance } from "../firebase/adminDashFunctions"; // Ensure this function correctly fetches data
import { Link, useNavigate } from "react-router-dom"; // Corrected import if there was a typo previously

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
  const [monthlySalesData, setMonthlySalesData] = useState([]);
  const [monthlySalesLoading, setMonthlySalesLoading] = useState(true);
  const [monthlySalesError, setMonthlySalesError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const roles = await getAllRoleSizes();
      setRoleCounts(roles);

      const orders = await getCollectionSize("Orders");
      setOrdersCount(orders);

      const transactions = await getLatestOrders();
      const formattedTransactions = transactions.map(t => ({
        ...t,
        total: parseFloat(t.total || 0).toFixed(2)
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
        setTotalSales(sales);
      } catch (err) {
        console.error("Error fetching overall sales:", err);
        setTotalSales(0);
      }

      setTopSellersLoading(true);
      setTopSellersError(null);
      try {
        const topSellersData = await getTopSellers();
        setTopPerformingSellers(topSellersData);
      } catch (err) {
        console.error("Error fetching top performing sellers:", err);
        setTopSellersError("Failed to load top performing artisans.");
        setTopPerformingSellers([]);
      } finally {
        setTopSellersLoading(false);
      }

      setMonthlySalesLoading(true);
      setMonthlySalesError(null);
      try {
        const data = await fetchMonthlySalesPerformance(); // This is the crucial data source
        
        // --- LOG 1: Check raw data from Firebase ---
        console.log("Raw monthly sales data from Firebase:", data);

        // Ensure 'data' contains objects with a 'total' property that can be summed.
        // It's good practice to ensure 'total' is a number before summing.
        const numericData = data.map(item => ({
            ...item,
            total: parseFloat(item.total || 0) // Ensure total is a float, default to 0 if null/undefined
        }));

        const totalSum = numericData.reduce((sum, item) => sum + item.total, 0);
        const averageSales = numericData.length > 0 ? totalSum / numericData.length : 0;

        // --- LOG 2: Check calculated average sales ---
        console.log("Calculated Average Sales (before toFixed):", averageSales);

        // Create an object for the average bar
        const averageBarData = {
          month: 'Avg', // Label for the average bar
          year: null, // No specific year for average
          total: averageSales, // The calculated average
          isAverage: true // Flag to identify this bar for styling
        };

        // Append the average data to the existing monthly sales data
        const combinedData = [...numericData, averageBarData];
        setMonthlySalesData(combinedData);

        // --- LOG 3: Check the final array sent to state ---
        console.log("Monthly Sales Data (including Avg, after setMonthlySalesData):", combinedData);
        

      } catch (err) {
        console.error("Error fetching monthly sales performance:", err);
        setMonthlySalesError("Failed to load monthly sales data. Make sure 'total' fields are numbers.");
        setMonthlySalesData([]);
      } finally {
        setMonthlySalesLoading(false);
      }
    }

    fetchData();
  }, []); // Empty dependency array means this useEffect runs once on mount

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
      // Assuming 'count' is the property to determine performance
      return topPerformingSellers.reduce((max, seller) => Math.max(max, seller.count), 1);
    }
    return 1;
  };

  const maxCount = getMaxSellerCount();

  // Determine the maximum sales value for the bar graph to scale bars
  // This now correctly considers all items in monthlySalesData, including the average bar.
  const maxMonthlySales = monthlySalesData.reduce((max, month) => Math.max(max, month.total), 0);
  
  // --- LOG 4: Check max sales for scaling ---
  console.log("Max Monthly Sales for Chart Scaling:", maxMonthlySales);


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
                  <li key={sellerData.id || index} className="store-item">
                    <Link
                      to={`/Artists/${sellerData.id}`}
                      className="store-name"
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      {sellerData.seller}
                    </Link>
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
            <h3>Monthly Sales Performance (Last 12 Months)</h3>
            {monthlySalesLoading ? (
              <p>Loading monthly sales data...</p>
            ) : monthlySalesError ? (
              <p className="error-message">{monthlySalesError}</p>
            ) : monthlySalesData.length > 0 ? (
              <>
                <section className="sales-bar-chart">
                  {monthlySalesData.map((monthData, index) => (
                    <section key={index} className="bar-container">
                      <span className="bar-value">
                        R {monthData.total.toFixed(2)}
                      </span>
                      <section
                        // Using template literal for class names is standard React practice
                        className={`bar ${monthData.isAverage ? 'average-bar' : ''}`}
                        style={{ height: `${(monthData.total / maxMonthlySales) * 100}%` }}
                        title={`R ${monthData.total.toFixed(2)}`}
                      ></section>
                      <span className="month-label">{monthData.month}</span>
                    </section>
                  ))}
                </section>
                {/* Key/Legend */}
                <section className="graph-key">
                  <section className="key-item">
                    <span className="key-color normal-sales"></span>
                    <span>Monthly Sales</span>
                  </section>
                  <section className="key-item">
                    <span className="key-color average-sales"></span>
                    <span>12-Month Average</span>
                  </section>
                </section>
              </>
            ) : (
              <p>No monthly sales data available.</p>
            )}
          </article>
        </section>

      </main>
    </section>
  );
};

export default Dashboard;