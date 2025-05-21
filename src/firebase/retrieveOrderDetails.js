import { apiRequest } from "./firebase";
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
