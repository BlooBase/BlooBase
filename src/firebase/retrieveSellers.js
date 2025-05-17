import { ref, getDownloadURL } from "firebase/storage";
import { storage,apiRequest } from "./firebase";
import { hardcodedSellers } from "./retrieveSellersCached"; // optional separate file

export let cachedSellers = null;

export async function retrieveSellers() {
  try {
    const sellers = await apiRequest("/api/sellers", "GET");

    const sellersWithUrls = await Promise.all(
      sellers.map(async (seller) => {
        let imageUrl = seller.image;

        if (imageUrl && !imageUrl.startsWith("http")) {
          try {
            const imageRef = ref(storage, imageUrl);
            imageUrl = await getDownloadURL(imageRef);
          } catch (e) {
            console.error(`Error fetching image for seller ${seller.id}:`, e);
            imageUrl = ""; // fallback
          }
        }

        return {
          ...seller,
          image: imageUrl,
          title: seller.title || "Untitled",
          description: seller.description || "",
          color: seller.color || "#ffffff",
          textColor: seller.textColor || "#000000",
          genre: seller.genre || "Unknown",
        };
      })
    );

    cachedSellers = [...hardcodedSellers, ...sellersWithUrls];
    return cachedSellers;
  } catch (error) {
    console.error("Error retrieving sellers:", error);
    return cachedSellers || hardcodedSellers;
  }
}
