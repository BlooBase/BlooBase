import { apiRequest } from "./firebase";

export async function retrieveProductByID(productId) {
  return await apiRequest(`/api/products/${productId}`);
}