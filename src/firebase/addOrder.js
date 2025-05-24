import { apiRequest, auth, addToProductTotal } from "./firebase";

/**
 * Adds a new order to the system.
 * @param {object} orderDetails - The details of the order, including cart items.
 * @returns {Promise<object>} A promise that resolves to the result of the API request.
 * @throws {Error} If the user is not authenticated or if there's an error placing the order.
 */
export const addOrder = async (orderDetails = {}) => {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');

  try {
    const result = await apiRequest('/api/orders', 'POST', orderDetails);

    if (orderDetails.cartItems && Array.isArray(orderDetails.cartItems)) {
      for (const item of orderDetails.cartItems) {
        const price = typeof item.price === "number" ? item.price : parseFloat(String(item.price).replace(/[^\d.]/g, ''));
        await addToProductTotal(item.id, price);
      }
    }

    return result;
  } catch (error) {
    console.error("Error placing order:", error);
    throw error;
  }
};