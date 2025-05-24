import { ref, getDownloadURL } from "firebase/storage";
import { apiRequest,storage } from "./firebase"; 

/**
 * Retrieves all products for a given seller, fetching their data from the backend and converting image storage paths to download URLs.
 * @param {string} sellerId - The ID of the seller whose products are to be retrieved.
 * @returns {Promise<Array<object>>} A promise that resolves to an array of product objects, each with an `imageUrl` property.
 */
export async function retrieveSellerProducts(sellerId) {
  try {
    const products = await apiRequest(`/api/seller/products?sellerId=${sellerId}`, "GET");

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
    console.error("Error retrieving seller products:", error);
    return [];
  }
}