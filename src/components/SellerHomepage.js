import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { updateCredentials, getUserData, logout, getUserAuthProvider, deleteAccount } from "../firebase/firebase";
import { retrieveSellerProducts } from "../firebase/retrieveSellerProducts";
import { auth, getSellerCard } from "../firebase/firebase";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import '../SellerHome.css';
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

  // Helper function to clean and format price
  const formatPrice = (price) => {
    if (typeof price === 'string') {
      // Remove 'R' and any other non-digit, non-decimal characters
      const cleanedPrice = price.replace(/[^\d.]/g, '');
      const parsedPrice = parseFloat(cleanedPrice);
      return isNaN(parsedPrice) ? '0.00' : parsedPrice.toFixed(2);
    }
    // If it's already a number or null/undefined, just format it
    return parseFloat(price || 0).toFixed(2);
  };

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

      // Calculate total income by summing the 'total' field of each product (default to 0 if missing)
      const totalIncomeSum = soldProducts.reduce(
        (sum, product) => sum + (typeof product.total === "number" ? product.total : 0),
        0
      );
      setTotalIncome(totalIncomeSum);
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
          const totalIncomeValue = products.reduce(
            (sum, product) => sum + (typeof product.total === "number" ? product.total : parseFloat(formatPrice(product.total))),
            0
          );

          doc.setFont("helvetica", "bold");
          doc.text("Total Income:", 14, y);
          doc.setFont("helvetica", "normal");
          doc.text(`R${totalIncomeValue.toFixed(2)}`, 50, y);
          y += 12;

          // Sales header
          doc.setFont("helvetica", "bold");
          doc.setFontSize(11);
          doc.text("Sales:", 14, y);
          y += 8;

          products.forEach((product, index) => {
            const title = `${index + 1}. - ${product.title || product.name || `Product ${index + 1}`}`;
            const sales = typeof product.sales === "number" ? product.sales : 0;
            const income = typeof product.total === "number"
              ? product.total
              : parseFloat(formatPrice(product.total));

            doc.setFont("helvetica", "bold");
            doc.text(title, 14, y);
            y += 6;

            doc.setFont("helvetica", "normal");
            doc.text(`   Sold: ${sales}`, 14, y);
            y += 6;
            doc.text(`   Income: R${income.toFixed(2)}`, 14, y);
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

  const [isGoogleUser, setIsGoogleUser] = useState(false);

  useEffect(() => {
    const checkProvider = async () => {
      const provider = await getUserAuthProvider();
      console.log("Auth provider fetched:", provider);
      setIsGoogleUser(provider === "Google");
    };
    checkProvider();
  }, []);

  useEffect(() => {
    console.log("isGoogleUser state changed:", isGoogleUser);
  }, [isGoogleUser]);

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
      toast.success("Account deleted successfully!");
      navigate("/");
    } catch (error) {
      toast.error("Failed to delete account: " + error.message);
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
            <h3 className="orders-card-title-1">SALES</h3>
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
              {/* Use formatPrice for display */}
              Total Income: <strong>R{formatPrice(totalIncome)}</strong>
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
                            Income: R
                            {formatPrice(product.total)}
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
          <form className="settings-form-1" onSubmit={(e) => e.preventDefault()}>
            <fieldset className="form-container-1">
              <section className="form-field-1">
                <label htmlFor="name" className="form-label">Name:</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input-1"
                />
              </section>
              <section className="form-field-1" style={{ display: isGoogleUser ? 'none' : 'flex' }}>
                <label htmlFor="email" className="form-label">Email:</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input-1"
                  disabled={isGoogleUser}
                />
              </section>
              <section className="settings-buttons-1">
                <button type="button" onClick={handleSave} className="nav-button-1">Save Changes</button>
                <button type="button" onClick={handleCancel} className="nav-button-1">Clear</button>
                <section className="red-buttons-1">
                  <button type="button" onClick={handleLogout} className="delete-button-1">Log Out</button>
                  {!isGoogleUser && (
                    <button type="button" onClick={handleDeleteAccount} className="delete-button-1">Delete Account</button>
                  )}
                </section>
              </section>
            </fieldset>
          </form>
        </section>
      </section>

      <footer className="buyer-footer">
        © 2025 BlooBase. All rights reserved.
      </footer>
    </section>
  );
};

export default SellerHomePage;