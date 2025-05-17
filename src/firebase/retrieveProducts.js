import { ref, getDownloadURL } from "firebase/storage";
import { storage,apiRequest } from "./firebase";

export async function retrieveProducts() {
  try {
    // Fetch product data from your backend
    const products = await apiRequest("/api/products", "GET");

    // Convert image storage paths to download URLs
    const productsWithUrls = await Promise.all(
      products.map(async (product) => {
        let imageUrl = null;
        try {
          if (product.image && typeof product.image === "string") {
            const imageRef = ref(storage, product.image);
            imageUrl = await getDownloadURL(imageRef);
          }
        } catch (error) {
          console.error(`Error fetching image for product ${product.id}:`, error);
        }

        return {
          ...product,
          imageUrl,
        };
      })
    );

    return productsWithUrls;
  } catch (error) {
    console.error("Error retrieving products:", error);
    return [];
  }
}
