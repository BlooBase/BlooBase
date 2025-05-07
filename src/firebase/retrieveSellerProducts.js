import { collection, getDocs, query, where } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import { db, storage } from "./firebase"; // Import your Firebase setup

export async function retrieveSellerProducts(sellerId) {
  const productsRef = collection(db, "Products");

  try {
    // Query products where SellerID matches the provided sellerId
    const sellerQuery = query(productsRef, where("SellerID", "==", sellerId));
    const snapshot = await getDocs(sellerQuery);

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

        return {
          id: doc.id,
          ...data,
          imageUrl,
        };
      })
    );

    return products;
  } catch (error) {
    console.error("Error retrieving seller products:", error);
    return [];
  }
}