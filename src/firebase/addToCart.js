import { doc, setDoc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db, auth } from "./firebase";

// Adds a product to the current user's cart in Firestore
export async function addToCart(product) {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const cartRef = doc(db, "Carts", user.uid);
  const cartSnap = await getDoc(cartRef);

  if (cartSnap.exists()) {
    // Cart exists, add product to items array (avoid duplicates by id)
    const cartData = cartSnap.data();
    const alreadyInCart = (cartData.items || []).some(item => item.id === product.id);
    if (!alreadyInCart) {
      await updateDoc(cartRef, {
        items: arrayUnion({
          id: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          Seller: product.Seller,
          quantity: 1
        })
      });
    }
  } else {
    // Cart does not exist, create it
    await setDoc(cartRef, {
      items: [{
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        Seller: product.Seller,
        quantity: 1
      }]
    });
  }
}