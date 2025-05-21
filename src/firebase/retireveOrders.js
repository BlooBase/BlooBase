import { apiRequest } from "./firebase";
export const getUserOrders = async () => {
  
  try {
    const orders = await apiRequest('/api/orders');
    return orders;
  } catch (error) {
    console.error("Error fetching user orders:", error);
    throw error;
  }
};
