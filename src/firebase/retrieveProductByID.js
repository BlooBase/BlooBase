import { apiRequest } from "./firebase";

/**
 * Retrieves product details by its ID.
 * @param {string} productId - The unique identifier of the product.
 * @returns {Promise<object>} A promise that resolves to the product data.
 */
export async function retrieveProductByID(productId) {
  return await apiRequest(`/api/products/${productId}`);
}