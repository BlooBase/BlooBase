import { apiRequest,auth } from "./firebase";
export const addOrder = async (orderDetails = {}) => {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');

  try {
    const result = await apiRequest('/api/orders', 'POST', orderDetails);
    return result;
  } catch (error) {
    console.error("Error placing order:", error);
    throw error;
  }
};
