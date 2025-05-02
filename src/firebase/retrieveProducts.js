// getProductsWithImages.js
import { collection, getDocs } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import { db, storage } from "./firebase"; // using your existing setup

export async function getProductsWithImages() {
  const productsRef = collection(db, "Products");

  try {
    const snapshot = await getDocs(productsRef);
    
    const products = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const data = doc.data();

        let imageUrl = null;
        try {
          const imageRef = ref(storage, data.image); // image path from Firestore
          imageUrl = await getDownloadURL(imageRef);
        } catch (error) {
          console.error(`Error fetching image for product ${doc.id}:`, error);
        }

        return {
          id: doc.id,
          ...data,
          imageUrl, // Firebase Storage download URL
        };
      })
    );

    return products;
  } catch (error) {
    console.error("Error getting products:", error);
    return [];
  }
}
