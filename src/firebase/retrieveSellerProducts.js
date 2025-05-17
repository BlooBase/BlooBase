import { ref, getDownloadURL } from "firebase/storage";
import { apiRequest,storage } from "./firebase"; 

export async function retrieveSellerProducts(sellerId) {
  try {
    // Fetch product metadata from backend
    //console.log(sellerId)
    const products = await apiRequest(`/api/seller/products?sellerId=${sellerId}`, "GET");

    // Convert image paths to URLs
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
