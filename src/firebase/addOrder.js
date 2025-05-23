import { apiRequest, auth, addToProductTotal } from "./firebase";

export const addOrder = async (orderDetails = {}) => {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');

  try {
    const result = await apiRequest('/api/orders', 'POST', orderDetails);

    // After order is placed, update each product's total
    if (orderDetails.cartItems && Array.isArray(orderDetails.cartItems)) {
      for (const item of orderDetails.cartItems) {
        // item.price should be a number, if not, parse it
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
