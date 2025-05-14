import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "./firebase";

// Retrieves the current user's cart items from Firestore
export async function retrieveCart() {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const cartRef = doc(db, "Carts", user.uid);
  const cartSnap = await getDoc(cartRef);

  if (cartSnap.exists()) {
    return cartSnap.data().items || [];
  } else {
    return [];
  }
}