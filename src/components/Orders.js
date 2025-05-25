import React, { useEffect, useState } from 'react';
import { retrieveOrderDetails } from '../firebase/retrieveOrderDetails';
import '../Orders.css';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserRole } from '../firebase/firebase'; 

const Orders = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const orderId = id; // Renamed for clarity, but still derived from `id`

  const parsePrice = (priceString) => {
    if (typeof priceString === 'string') {
      const numericString = priceString.replace('R', '').trim();
      return parseFloat(numericString) || 0;
    }
    return parseFloat(priceString) || 0;
  };

  useEffect(() => {
    // Determine redirect path based on role (assuming getUserRole is async)
    const getRedirectPath = async () => {
      const role = await getUserRole(); // Await the role
      return role === 'Buyer' ? '/BuyerHomePage' : '/Dashboard';
    };

    const fetchOrder = async () => {
      setLoading(true);
      setError(null);

      // Early exit if no ID is provided
      if (!id) {
        const path = await getRedirectPath(); // Get path before redirecting
        setError("No order ID provided. Redirecting...");
        setLoading(false);
        setTimeout(() => {
          navigate(path);
        }, 1500);
        return;
      }

      try {
        const orderData = await retrieveOrderDetails(orderId);
        if (orderData) {
          setOrder(orderData);
        } else {
          const path = await getRedirectPath(); // Get path before redirecting
          setError("Order not found. Redirecting...");
          setTimeout(() => {
            navigate(path);
          }, 1500);
        }
      } catch (err) {
        const path = await getRedirectPath(); // Get path before redirecting
        setError(`Failed to fetch order: ${err.message}. Redirecting...`);
        setTimeout(() => {
          navigate(path);
        }, 1500);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, navigate,orderId]); // Removed `orderId` as it's derived from `id`

  const handleBackToOrders = async () => {
    const userRole = await getUserRole(); // Get role to determine back path
    if (userRole === 'Buyer') {
      navigate('/BuyerHomePage');
    } else {
      navigate('/Dashboard');
    }
  };

  let orderContent;
  let orderTitle = "Order Details";

  if (loading) {
    orderContent = <p className="orders-loading">Loading order details...</p>;
  } else if (error && !order) {
    orderContent = <p className="orders-error">{error}</p>;
    orderTitle = "Error";
  } else if (!order) {
    orderContent = <p className="orders-empty">No order details to display.</p>;
    orderTitle = "Order Not Found";
  } else {
    orderTitle = `Order Details (ID: ${order.id})`;

    const calculateTotal = () => {
      return order.items.reduce((sum, item) => {
        const itemPrice = parsePrice(item.price);
        const itemQuantity = typeof item.quantity === 'number' ? item.quantity : 1;
        return sum + (itemPrice * itemQuantity);
      }, 0).toFixed(2);
    };

    orderContent = (
      <>
        <section className="orders-card-scroll">
          {order.items && order.items.length > 0 ? (
            order.items.map((item, index) => (
              <article key={index} className="order-preview">
                <figure className="order-preview-figure">
                  <img
                    src={item.imageUrl || 'placeholder.jpg'}
                    alt={item.name}
                    className="order-preview-img"
                  />
                  <figcaption className="order-preview-info">
                    <h3 className="order-preview-name">{item.name}</h3>
                    <p className="order-preview-price">
                      Quantity: <data value={item.quantity}>{item.quantity}</data> | Price: <data value={parsePrice(item.price) * (typeof item.quantity === 'number' ? item.quantity : 1)}>R{(parsePrice(item.price) * (typeof item.quantity === 'number' ? item.quantity : 1)).toFixed(2)}</data>
                    </p>
                  </figcaption>
                </figure>
              </article>
            ))
          ) : (
            <p className="orders-empty">This order has no items.</p>
          )}
        </section>

        <footer className="order-total">
          <p>Total: <data value={calculateTotal()}>R{calculateTotal()}</data></p>
          {order.orderType && (
            <p className="order-type-display">
              Order Type: <strong className={`order-preview-type ${order.orderType.toLowerCase()}`}>
                <em>{order.orderType}</em>
              </strong>
            </p>
          )}
        </footer>
      </>
    );
  }

  // This outer return block handles the initial error state display
  if (error && !order && !loading) {
    return (
      <nav className="full-page-message">
        <p className="error-message">{error}</p>
        <button onClick={handleBackToOrders} className="back-button-full-page">
          &larr; <strong>BACK TO HOME</strong>
        </button>
      </nav>
    );
  }

  return (
    <main className="buyer-orders-section">
      <section className="orders-grid">
        <article className="floating-orders-card">
          <header>
            <h2 className="orders-card-title">{orderTitle}</h2>
            <button onClick={handleBackToOrders} className="back-button">
              &larr;
              <strong>BACK</strong>
            </button>
          </header>
          {orderContent}
        </article>
      </section>
    </main>
  );
};

export default Orders;