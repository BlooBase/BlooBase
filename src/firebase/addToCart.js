import { apiRequest } from "./firebase";

// Adds a product to the current user's cart in Firestore
export const addToCart = async (product) => {
  return apiRequest('/api/cart/add', 'POST', { productId: product.id }); // Send minimal info
};