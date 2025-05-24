import React, { useState, useEffect } from "react";
import "../Dashboard.css";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { getRoleSize, getCollectionSize, getUserName,auth } from "../firebase/firebase";
import { getLatestOrders, getLatestSellers, getTotalSales, getTopSellers } from "../firebase/adminDashFunctions";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
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

   const handleDownloadPDF=async()=>{
      try {
      const user = auth.currentUser;
      if (!user) {
        toast.error("You must be logged in to download a PDF.");
        return;
      }

      // Fetch data
      const userName = await getUserName();
      const roleSizes = await getAllRoleSizes();
      const ordersCount = await getCollectionSize("Orders");
      const totalSales = await getTotalSales();
      const latestOrders = await getLatestOrders();
      const latestSellers = await getLatestSellers();
      const topSellers = await getTopSellers();

      const logo = new Image();
      logo.src = "/bloobase.png";

      logo.onload = () => {
        try {
          const doc = new jsPDF();
          const now = new Date();
          const formattedDate = now.toLocaleString("en-ZA", {
            dateStyle: "medium",
            timeStyle: "short",
          });

          // Add logo
          doc.addImage(logo, "PNG", 150, 10, 40, 28);

          // Heading: BlooBase
          doc.setFont("helvetica", "bold");
          doc.setTextColor(0, 86, 179);
          doc.setFontSize(22);
          doc.text("BlooBase Dashboard Report", 14, 20);

          // Reset color and font
          doc.setTextColor(0, 0, 0);
          doc.setFontSize(12);

          let y = 40;

          // User Information
          doc.setFont("helvetica", "bold");
          doc.text("User:", 14, y);
          doc.setFont("helvetica", "normal");
          doc.text(`${userName || user.displayName || "Artisan"}`, 40, y);
          y += 8;

          // Email
          doc.setFont("helvetica", "bold");
          doc.text("Email:", 14, y);
          doc.setFont("helvetica", "normal");
          doc.text(`${user.email || "Not available"}`, 40, y);
          y += 8;

          // Generated Date
          doc.setFont("helvetica", "bold");
          doc.text("Generated:", 14, y);
          doc.setFont("helvetica", "normal");
          doc.text(`${formattedDate}`, 40, y);
          y += 12;

          // Role Sizes
          doc.setFont("helvetica", "bold");
          doc.setFontSize(11);
          doc.text("User Roles:", 14, y);
          y += 8;
          doc.setFont("helvetica", "normal");
          doc.text(`Buyers: ${roleSizes.Buyer || 0}`, 14, y);
          y += 6;
          doc.text(`Sellers: ${roleSizes.Seller || 0}`, 14, y);
          y += 6;
          doc.text(`Admins: ${roleSizes.Admin || 0}`, 14, y);
          y += 12;

          // Total Orders
          doc.setFont("helvetica", "bold");
          doc.text("Total Orders:", 14, y);
          doc.setFont("helvetica", "normal");
          doc.text(`${ordersCount || 0}`, 40, y);
          y += 12;

          // Total Sales
          doc.setFont("helvetica", "bold");
          doc.text("Total Sales:", 14, y);
          doc.setFont("helvetica", "normal");
          doc.text(`R${parseFloat(totalSales || 0).toFixed(2)}`, 40, y);
          y += 12;

          // Latest Transactions
          doc.setFont("helvetica", "bold");
          doc.text("Latest Transactions:", 14, y);
          y += 8;
          if (latestOrders && latestOrders.length > 0) {
            latestOrders.slice(0, 5).forEach((order, index) => {
              const orderId = order.id || `Order ${index + 1}`;
              const total = parseFloat(order.total || 0).toFixed(2);
              doc.setFont("helvetica", "normal");
              doc.text(`${index + 1}. Order ID: ${orderId} - R${total}`, 14, y);
              y += 6;
            });
          } else {
            doc.setFont("helvetica", "normal");
            doc.text("No recent transactions.", 14, y);
            y += 6;
          }
          y += 6;

          // Latest Sellers
          doc.setFont("helvetica", "bold");
          doc.text("New Artisans:", 14, y);
          y += 8;
          if (latestSellers && latestSellers.length > 0) {
            latestSellers.slice(0, 5).forEach((seller, index) => {
              const sellerName = seller.name || `Seller ${index + 1}`;
              doc.setFont("helvetica", "normal");
              doc.text(`${index + 1}. ${sellerName}`, 14, y);
              y += 6;
            });
          } else {
            doc.setFont("helvetica", "normal");
            doc.text("No new artisans.", 14, y);
            y += 6;
          }
          y += 6;

          // Top Performing Sellers
          doc.setFont("helvetica", "bold");
          doc.text("Top Performing Artisans:", 14, y);
          y += 8;
          if (topSellers && topSellers.length > 0) {
            topSellers.slice(0, 5).forEach((seller, index) => {
              const sellerName = seller.seller || `Seller ${index + 1}`;
              const count = seller.count || 0;
              doc.setFont("helvetica", "normal");
              doc.text(`${index + 1}. ${sellerName} - ${count} sales`, 14, y);
              y += 6;
            });
          } else {
            doc.setFont("helvetica", "normal");
            doc.text("No top performers data available.", 14, y);
            y += 6;
          }

          
          doc.save("dashboard_report.pdf");
          console.log("PDF generated successfully");
         
        } catch (pdfError) {
          console.error("PDF generation error:", pdfError);
          toast.error("Failed to generate PDF document");
        }
      };

      logo.onerror = () => {
        toast.error("Failed to load BlooBase logo.");
      };
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error(error.message || "Unknown error");
    }
  };
   
  return (
    <section className="dashboard-container">
      <section className="seller-header">
        <img src="/bloobase.png" alt="Bloobase" className="seller-logo" />
        <section className="welcome-bg-dash">
          <h1 className="seller-title">Welcome, {user.name}</h1>
        </section>
        <nav className="seller-nav">
          <Link to="/" className="seller-nav-link">HOME</Link>
           <button onClick={handleDownloadPDF} className="download-button">
            <h5>Download report  </h5>
            <img src="/download.png" alt="Download PDF" className="download-icon" />
          </button>
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