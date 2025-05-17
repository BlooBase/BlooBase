import { apiRequest,auth } from "./firebase";

export async function removeFromCart(productId) {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const result = await apiRequest("/api/cart/remove", "POST", { productId });
  return result.updatedItems || [];
}
