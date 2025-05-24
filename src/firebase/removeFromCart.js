import { apiRequest,auth } from "./firebase";

/**
 * Removes a product from the current user's cart.
 * @param {string} productId - The ID of the product to remove from the cart.
 * @returns {Promise<Array<object>>} A promise that resolves to an array of the updated cart items.
 * @throws {Error} If the user is not authenticated.
 */
export async function removeFromCart(productId) {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const result = await apiRequest("/api/cart/remove", "POST", { productId });
  return result.updatedItems || [];
}