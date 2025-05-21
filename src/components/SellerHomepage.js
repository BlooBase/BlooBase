import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { updateCredentials, getUserData, logout, } from "../firebase/firebase";
import { retrieveSellerProducts } from "../firebase/retrieveSellerProducts";
import { auth, getSellerCard } from "../firebase/firebase";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import '../SellerHome.css';
import cartTotal from './cartTotal';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SellerHomePage = () => {
  const [products, setProducts] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    newpassword: "",
  });

  useEffect(() => {
    const fetchUserAndProducts = async () => {
      // Get sellerId from auth
      const sellerId = auth.currentUser?.uid;
      if (!sellerId) return;

      const sellerProducts = await retrieveSellerProducts(sellerId);

      // Only show products with at least 1 sale
      const soldProducts = sellerProducts.filter(
        (p) => (typeof p.sales === "number" ? p.sales : 0) > 0
      );
      setProducts(soldProducts);

      // Calculate total income using cartTotal
      const soldProductsForTotal = soldProducts.flatMap(product =>
        Array(product.sales).fill({ price: product.price })
      );
      setTotalIncome(cartTotal(soldProductsForTotal));
    };
    fetchUserAndProducts();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleDownloadPDF = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error("You must be logged in to download a PDF.");
        return;
      }

      // Retrieve seller info
      let sellerCard;
      try {
        sellerCard = await getSellerCard();
        if (!sellerCard || !sellerCard.storeName) {
          sellerCard = { storeName: user.displayName || "Artisan" };
        }
      } catch (error) {
        console.error("Error fetching seller card:", error);
        sellerCard = { storeName: user.displayName || "Artisan" };
      }

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
          doc.text("BlooBase Sales Report", 14, 20);

          // Reset color
          doc.setTextColor(0, 0, 0);
          doc.setFontSize(12);

          let y = 40;

          // Seller
          doc.setFont("helvetica", "bold");
          doc.text("Seller:", 14, y);
          doc.setFont("helvetica", "normal");
          doc.text(`${sellerCard.storeName}`, 40, y);
          y += 8;

          // Email
          doc.setFont("helvetica", "bold");
          doc.text("Email:", 14, y);
          doc.setFont("helvetica", "normal");
          doc.text(`${user.email || "Not available"}`, 40, y);
          y += 8;

          // Generated
          doc.setFont("helvetica", "bold");
          doc.text("Generated:", 14, y);
          doc.setFont("helvetica", "normal");
          doc.text(`${formattedDate}`, 40, y);
          y += 8;

          // Total Income
          const totalIncome = products.reduce((sum, product) => {
            let price = typeof product.price === "string"
              ? parseFloat(product.price.replace(/[^\d.]/g, "")) || 0
              : product.price || 0;
            let sales = typeof product.sales === "number" ? product.sales : 0;
            return sum + price * sales;
          }, 0);

          doc.setFont("helvetica", "bold");
          doc.text("Total Income:", 14, y);
          doc.setFont("helvetica", "normal");
          doc.text(`R${totalIncome.toFixed(2)}`, 50, y);
          y += 12;

          // Sales header
          doc.setFont("helvetica", "bold");
          doc.setFontSize(11);
          doc.text("Sales:", 14, y);
          y += 8;

          products.forEach((product, index) => {
            let price = typeof product.price === "string"
              ? parseFloat(product.price.replace(/[^\d.]/g, "")) || 0
              : product.price || 0;
            let sales = typeof product.sales === "number" ? product.sales : 0;
            const total = price * sales;

            const title = `${index + 1}. - ${product.title || product.name || `Product ${index + 1}`}`;

            doc.setFont("helvetica", "bold");
            doc.text(title, 14, y);
            y += 6;

            doc.setFont("helvetica", "normal");
            doc.text(`   Price: R${price.toFixed(2)}`, 14, y);
            y += 6;
            doc.text(`   Sold: ${sales}`, 14, y);
            y += 6;
            doc.text(`   Total: R${total.toFixed(2)}`, 14, y);
            y += 10;
          });

          doc.save("sales_report.pdf");
          console.log("PDF generated successfully");
          // Optionally: toast.success("PDF generated successfully!");
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


  const handleSave = async () => {
    try {
      await updateCredentials(formData);
      toast.success("Settings updated successfully!");
    } catch (error) {
      toast.error("Failed to update settings: " + error.message);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUserData();
        setFormData(prev => ({
          ...prev,
          name: userData.Name || "",
          email: userData.Email || ""
        }));
        console.log("Auto-populated seller formData:", {
          name: userData.Name,
          email: userData.Email
        });
      } catch (error) {
        console.error("Failed to fetch seller data for auto-populate:", error);
      }
    };
    fetchUserData();
  }, []);

  const handleCancel = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      newpassword: "",
    });
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      toast.error("Failed to log out: " + error.message);
    }
  };

  return (
    <section className="seller-home">
      <section className="seller-header">
        <img src="/bloobase.png" alt="Bloobase" className="seller-logo" />
        <section className="welcome-bg-seller">
          <h1 className="seller-title">Welcome, {formData.name}</h1>
        </section>
        <nav className="seller-nav">
          <Link to="/" className="seller-nav-link">HOME</Link>
          <Link to="/CardCreator" className="seller-nav-link">Your Store</Link>
        </nav>
      </section>

      <section className="seller-orders-section">
        <section className="orders-grid">
          <section className="floating-orders-card">
            <h3 className="orders-card-title">SALES</h3>
            <section className="download-sales">
              <img
                src="/download.png"
                alt="Download Sales Statement"
                onClick={handleDownloadPDF}
                className="download-icon"
                title="Download Sales Statement"
              />
            </section>
            <section className="total-income-label">
              Total Income: <strong>R{totalIncome.toFixed(2)}</strong>
            </section>
              <section className="orders-card-scroll">
                {products.length === 0 ? (
                  <p className="orders-empty">No sales yet.</p>
                ) : (
                products.map(product => (
                  <article key={product.id} className="order-preview">
                    <figure className="order-preview-figure">
                      <img
                        src={product.imageUrl || product.image}
                        alt={product.title || product.name}
                        className="order-preview-img"
                      />
                      <figcaption className="order-preview-info">
                        <section className="order-preview-name">
                          <strong>Product:</strong> <small>{product.title || product.name}</small>
                        </section>
                        <section className="order-preview-price">
                          <strong>Sold:</strong> <data value={product.sales}>{product.sales} times</data>
                        </section>
                        <section className="order-preview-type">
                          <em>
                            Price: R
                            {typeof product.price === "string"
                              ? product.price.replace(/[^\d.]/g, "")
                              : product.price}
                          </em>
                        </section>
                      </figcaption>
                    </figure>
                  </article>
                ))
                )}
              </section>
          </section>
        </section>

        <section className="seller-settings">
          <h3 className="settings-title">SETTINGS</h3>
          <form className="settings-form" onSubmit={(e) => e.preventDefault()}>
            <fieldset className="form-container">
              <section className="form-field">
                <label htmlFor="name" className="form-label">Name:</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                />
              </section>
              <section className="settings-buttons">
                <button type="button" onClick={handleSave} className="nav-button">Save Changes</button>
                <button type="button" onClick={handleCancel} className="nav-button">Clear</button>
                <section className="red-buttons">
                  <button type="button" onClick={handleLogout} className="delete-button">Log Out</button>
                </section>
              </section>
            </fieldset>
          </form>
        </section>
      </section>

      <section className="sparkle-overlay">
        {[...Array(30)].map((_, i) => (
          <p
            key={i}
            className="sparkle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </section>

      <footer className="buyer-footer">
        © 2025 BlooBase. All rights reserved.
      </footer>
    </section>
  );
};

export default SellerHomePage;