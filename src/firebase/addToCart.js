import { apiRequest } from "./firebase";

// Adds a product to the current user's cart in Firestore
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
