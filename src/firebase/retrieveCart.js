import { apiRequest } from "./firebase";

// Retrieves the current user's cart items from Firestore
export const retrieveCart = async () => {
  return apiRequest('/api/cart');
};