import { apiRequest } from "./firebase";

// Retrieves the current user's cart items from Firestore
export async function retrieveCart() {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const result = await apiRequest("/api/cart/retrieve");
  return result.items || [];
}
