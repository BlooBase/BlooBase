import React, { useState, useEffect } from "react";
import "../Dashboard.css";
import { getRoleSize, getCollectionSize, getUserName, auth } from "../firebase/firebase";
import { getLatestOrders, getLatestSellers, getTotalSales, getTopSellers, fetchMonthlySalesPerformance } from "../firebase/adminDashFunctions";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

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
        const data = await fetchMonthlySalesPerformance();
        console.log("Raw monthly sales data from Firebase:", data);

        const numericData = data.map(item => ({
          ...item,
          total: parseFloat(item.total || 0)
        }));

        const totalSum = numericData.reduce((sum, item) => sum + item.total, 0);
        const averageSales = numericData.length > 0 ? totalSum / numericData.length : 0;

        console.log("Calculated Average Sales (before toFixed):", averageSales);

        const averageBarData = {
          month: 'Avg',
          year: null,
          total: averageSales,
          isAverage: true
        };

        const combinedData = [...numericData, averageBarData];
        setMonthlySalesData(combinedData);

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
      return topPerformingSellers.reduce((max, seller) => Math.max(max, seller.count), 1);
    }
    return 1;
  };

  const maxCount = getMaxSellerCount();

  // Calculate maxMonthlySales for scaling the bar chart
  const maxMonthlySales = monthlySalesData.length > 0
    ? Math.max(...monthlySalesData.map(item => item.total), 1)
    : 1;
  const handleDownloadPDF = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      toast.error("You must be logged in to download a PDF.");
      return;
    }

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

        doc.addImage(logo, "PNG", 150, 10, 40, 28);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 86, 179);
        doc.setFontSize(22);
        doc.text("BlooBase Dashboard Report", 14, 20);
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);

        let y = 40;

        doc.setFont("helvetica", "bold");
        doc.text("User:", 14, y);
        doc.setFont("helvetica", "normal");
        doc.text(`${userName || user.displayName || "Artisan"}`, 40, y);
        y += 8;

        doc.setFont("helvetica", "bold");
        doc.text("Email:", 14, y);
        doc.setFont("helvetica", "normal");
        doc.text(`${user.email || "Not available"}`, 40, y);
        y += 8;

        doc.setFont("helvetica", "bold");
        doc.text("Generated:", 14, y);
        doc.setFont("helvetica", "normal");
        doc.text(`${formattedDate}`, 40, y);
        y += 12;

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

        doc.setFont("helvetica", "bold");
        doc.text("Total Orders:", 14, y);
        doc.setFont("helvetica", "normal");
        doc.text(`${ordersCount || 0}`, 40, y);
        y += 12;

        doc.setFont("helvetica", "bold");
        doc.text("Total Sales:", 14, y);
        doc.setFont("helvetica", "normal");
        doc.text(`R${parseFloat(totalSales || 0).toFixed(2)}`, 40, y);
        y += 12;

        // === Monthly Sales Performance (aligned text columns) ===
        doc.setFont("courier", "bold");
        doc.text("Monthly Sales Performance (Last 12 Months):", 14, y);
        y += 8;

        if (monthlySalesData && monthlySalesData.length > 0) {
          doc.setFont("courier", "normal");
          doc.setFontSize(10);

          const header = `${"Month".padEnd(10)}  ${"Total (R)".padEnd(12)}  ${"Type"}`;
          doc.text(header, 14, y);
          y += 6;
          doc.text("-".repeat(36), 14, y);
          y += 6;

          monthlySalesData.forEach((item) => {
            const month = (item.month || "").padEnd(10);
            const total = `R${item.total.toFixed(2)}`.padEnd(12);
            const type = item.isAverage ? "Average" : "Monthly";
            const line = `${month}  ${total}  ${type}`;
            doc.text(line, 14, y);
            y += 6;

            if (y > 270) {
              doc.addPage();
              y = 20;
            }
          });
        } else {
          doc.setFont("helvetica", "normal");
          doc.text("No monthly sales data available.", 14, y);
          y += 6;
        }

        y += 12;
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
          doc.text("No recent transactions.", 14, y);
          y += 6;
        }

        y += 6;
        doc.setFont("helvetica", "bold");
        doc.text("New Artisans:", 14, y);
        y += 8;
        if (latestSellers && latestSellers.length > 0) {
          latestSellers.slice(0, 5).forEach((seller, index) => {
            doc.setFont("helvetica", "normal");
            doc.text(`${index + 1}. ${seller.name || `Seller ${index + 1}`}`, 14, y);
            y += 6;
          });
        } else {
          doc.text("No new artisans.", 14, y);
          y += 6;
        }

        y += 6;
        // Before writing the heading, check if there's enough space for the heading and at least one entry
        if (y > 265) { // 265 leaves room for heading + first entry
          doc.addPage();
          y = 20;
        }
        doc.setFont("helvetica", "bold");
        doc.text("Top Performing Artisans:", 14, y);
        y += 8;
        if (topSellers && topSellers.length > 0) {
          topSellers.slice(0, 5).forEach((seller, index) => {
            doc.setFont("helvetica", "normal");
            // Check if there's enough space for each entry
            if (y > 270) {
              doc.addPage();
              y = 20;
            }
            doc.text(`${index + 1}. ${seller.seller} - ${seller.count} sale(s)`, 14, y);
            y += 6;
          });
        } else {
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
            <h5>Download report</h5>
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
                  <p>{seller.name}</p>
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
              <p className="error-message">{sellersError}</p>
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
                      <strong className="bar-value">
                        R {monthData.total.toFixed(2)}
                      </strong>
                      <section
                        className={`bar ${monthData.isAverage ? 'average-bar' : ''}`}
                        style={{ height: `${(monthData.total / maxMonthlySales) * 100}%` }}
                        title={`R ${monthData.total.toFixed(2)}`}
                      ></section>
                      <strong className="month-label">{monthData.month}</strong>
                    </section>
                  ))}
                </section>
                <section className="graph-key">
                  <section className="key-item">
                    <strong className="key-color normal-sales"></strong>
                    <strong>Monthly Sales</strong>
                  </section>
                  <section className="key-item">
                    <strong className="key-color average-sales"></strong>
                    <strong>12-Month Average</strong>
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