import React, { useEffect, useState } from 'react';
import { getUserName } from '../firebase/firebase';
import { Link, useNavigate } from "react-router-dom";
import { updateCredentials, deleteAccount, logout, getUserAuthProvider, getUserData } from "../firebase/firebase";
import '../BuyerHome.css';
import { getUserOrders } from '../firebase/retireveOrders';
import { GoogleAuthProvider, reauthenticateWithPopup } from "firebase/auth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth } from "../firebase/firebase";

const BuyerHomePage = () => {
  const [user, setUser] = useState({ name: '' });
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    newpassword: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    //console.log("Form data changed:", { ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await updateCredentials(formData);
      alert("Settings updated successfully!");
    } catch (error) {
      alert("Failed to update settings: " + error.message);
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userOrders = await getUserOrders();
        setOrders(userOrders);
        console.log("Fetched orders:", userOrders);
      } catch (error) {
        setOrders([]);
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, []);

  const handleCancel = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      newpassword: "",
    });
    console.log("Form data reset");
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your account?");
    if (!confirmDelete) return;

    try {
      // Always check provider at the moment of deletion for reliability
      const providerId = auth.currentUser?.providerData?.[0]?.providerId;
      const isGoogle = isGoogleUser || providerId === "google.com";

      if (isGoogle) {
        const provider = new GoogleAuthProvider();
        await reauthenticateWithPopup(auth.currentUser, provider);
        await deleteAccount();
      } else {
        const password = window.prompt("Enter your current password to confirm:");
        if (!password) return;
        await deleteAccount(password);
      }

      toast.success("Account deleted successfully.");
      await logout();
      navigate("/");
    } catch (error) {
      toast.error("Failed to delete account: " + error.message);
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

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      alert("Failed to log out: " + error.message);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const name = await getUserName();
      setUser({ name });
      console.log("Fetched user name:", name);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUserData();
        setFormData(prev => ({
          ...prev,
          name: userData.Name || "",
          email: userData.Email || ""
        }));
        console.log("Auto-populated formData:", {
          name: userData.Name,
          email: userData.Email
        });
      } catch (error) {
        console.error("Failed to fetch user data for auto-populate:", error);
      }
    };
    fetchUserData();
  }, []);

  return (
    <section className="buyer-home">
      <section className="buyer-header">
        <img src="/bloobase.png" alt="Bloobase" className="buyer-logo" />
        <section className="welcome-bg">
          <h1 className="buyer-title">Welcome, {user.name}</h1>
        </section>
        <nav className="buyer-nav">
          <Link to="/" className="buyer-nav-link">HOME</Link>
        </nav>
      </section>

      <section className="buyer-orders-section">
        <section className="orders-grid">
          <section className="floating-orders-card">
            <h3 className="orders-card-title">ORDERS</h3>
              <section className="orders-card-scroll">
                {orders.length === 0 ? (
                  <p className="orders-empty">No orders yet.</p>
                ) : (
                orders.map(order => {
                  const firstItem = order.items?.[0];
                  const orderTotal = order.items?.reduce((sum, item) => {
                    let price = item.price;
                    if (typeof price === 'string') price = price.replace('R', '');
                    price = parseFloat(price) || 0;
                    return sum + price;
                  }, 0) || 0;

                  return (
                    <article key={order.id} className="order-preview">
                      {firstItem && (
                        <figure className="order-preview-figure">
                          <img
                            src={firstItem.image || firstItem.imageUrl}
                            alt={firstItem.name}
                            className="order-preview-img"
                          />
                          <figcaption className="order-preview-info">
                            <section className="order-preview-name">
                              <strong>Order ID:</strong> <small>{order.id.slice(0, 6)}...</small>
                            </section>
                            <section className="order-preview-price">
                              <strong>Total:</strong> <data value={orderTotal}>R{orderTotal.toFixed(2)}</data>
                            </section>
                            <section
                              className={`order-preview-type ${order.orderType?.toLowerCase()}`}
                              aria-label="Order Type"
                            >
                              <em>{order.orderType}</em>
                            </section>
                          </figcaption>
                        </figure>
                      )}
                    </article>
                  );
                })
                )}
              </section>
          </section>
        </section>

        <section className="buyer-settings">
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
              {console.log("Rendering settings form. isGoogleUser:", isGoogleUser)}
              {!isGoogleUser && (
                <>
                  <section className="form-field">
                    <label htmlFor="email" className="form-label">Email:</label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </section>
                  <section className="form-field">
                    <label htmlFor="password" className="form-label">Current Password:</label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </section>
                  <section className="form-field">
                    <label htmlFor="newpassword" className="form-label">New Password:</label>
                    <input
                      type="password"
                      name="newpassword"
                      id="newpassword"
                      value={formData.newpassword}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </section>
                </>
              )}
              <section className="settings-buttons">
                <button type="button" onClick={handleSave} className="nav-button">Save Changes</button>
                <button type="button" onClick={handleCancel} className="nav-button">Cancel</button>
                <section className="red-buttons">
                  <button type="button" onClick={handleDeleteAccount} className="delete-button">Delete Account</button>
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

export default BuyerHomePage;
