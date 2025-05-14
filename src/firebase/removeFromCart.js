import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "./firebase";

export async function removeFromCart(productId) {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const cartRef = doc(db, "Carts", user.uid);
  const cartSnap = await getDoc(cartRef);

  if (cartSnap.exists()) {
    const cartData = cartSnap.data();
    const updatedItems = (cartData.items || []).filter(item => item.id !== productId);
    await updateDoc(cartRef, { items: updatedItems });
    return updatedItems;
  } else {
    return [];
  }
}