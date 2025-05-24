import { apiRequest,auth } from "./firebase";

/**
 * Adds a product to the current user's cart.
 * @param {object} product - The product object to be added to the cart.
 * @returns {Promise<void>} A promise that resolves when the product is added to the cart.
 * @throws {Error} If the user is not authenticated.
 */
export async function addToCart(product) {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  await apiRequest("/api/cart/add", "POST", {
    id: product.id,
    name: product.name,
    price: product.price,
    imageUrl: product.imageUrl,
    Seller: product.Seller,
  });
}