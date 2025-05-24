import { apiRequest,auth } from "./firebase";

/**
 * Retrieves the current user's cart items.
 * @returns {Promise<Array<object>>} A promise that resolves to an array of the user's cart items.
 * @throws {Error} If the user is not authenticated.
 */
export async function retrieveCart() {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const result = await apiRequest("/api/cart/retrieve");
  return result.items || [];
}