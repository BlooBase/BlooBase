import { apiRequest } from "./firebase";

/**
 * Fetches the current user's orders.
 * @returns {Promise<Array<object>>} A promise that resolves to an array of the user's orders.
 * @throws {Error} If there's an error fetching the user's orders.
 */
export const getUserOrders = async () => {
  try {
    const orders = await apiRequest('/api/orders');
    return orders;
  } catch (error) {
    console.error("Error fetching user orders:", error);
    throw error;
  }
};