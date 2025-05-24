import { apiRequest } from "./firebase";

/**
 * Retrieves the details of a specific order by its ID.
 * @param {string} orderId - The ID of the order to retrieve.
 * @returns {Promise<object | null>} A promise that resolves to the order details, or null if the order ID is missing or an error occurs.
 */
export const retrieveOrderDetails = async (orderId) => {
  if (!orderId) {
    console.error("Order ID is required to fetch an order.");
    return null;
  }

  try {
    const result = await apiRequest(`/api/orders/${orderId}`);
    return result;
  } catch (error) {
    console.error("Error fetching order:", error);
    return null;
  }
};