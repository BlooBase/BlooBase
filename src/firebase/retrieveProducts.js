// retrieveProducts.js
import { collection, getDocs } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import { db, storage } from "./firebase"; // your existing firebase setup

export async function retrieveProducts() {
  const productsRef = collection(db, "Products");

  try {
    const snapshot = await getDocs(productsRef);

    const products = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const data = doc.data();

        let imageUrl = null;
        try {
          const imageRef = ref(storage, data.image);
          imageUrl = await getDownloadURL(imageRef);
        } catch (error) {
          console.error(`Error fetching image for product ${doc.id}:`, error);
        }
        console.log("Resolved imageUrl:", imageUrl);

        return {
          id: doc.id,
          ...data,
          imageUrl,
        };
      })
    );

    return products;
  } catch (error) {
    console.error("Error retrieving products:", error);
    return [];
  }
}
