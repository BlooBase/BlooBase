import { ref, getDownloadURL } from "firebase/storage";
import { storage,apiRequest } from "./firebase";

/**
 * Retrieves all products, fetching their data from the backend and converting image storage paths to download URLs.
 * @returns {Promise<Array<object>>} A promise that resolves to an array of product objects, each with a `imageUrl` property.
 */
export async function retrieveProducts() {
  try {
    const products = await apiRequest("/api/products", "GET");

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