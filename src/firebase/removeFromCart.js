import { apiRequest } from "./firebase";

export const removeFromCart = async (productId) => {
  return apiRequest('/api/cart/remove', 'POST', { productId });
};