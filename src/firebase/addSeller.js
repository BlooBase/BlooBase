import { uploadImage } from "./uploadImage";
import { apiRequest } from "./firebase"; // Make sure you have this utility function

/**
 * Adds a new seller to the system, including uploading their shop image.
 * @param {object} sellerData - The data for the seller, including shop details and an image file.
 * @returns {Promise<void>} A promise that resolves when the seller is added, or rejects on error.
 * @throws {Error} If required seller data fields are missing.
 */
export async function addSeller(sellerData) {
  try {
    const {
      color,
      description,
      genre,
      image,
      textColor,
      title
    } = sellerData;

    if (!color || !description || !genre || !image || !textColor || !title) {
      throw new Error("Missing required seller data fields.");
    }

    const imagePath = await uploadImage(image, "shop_images");

    await apiRequest("/api/sellers", "POST", {
      color,
      description,
      genre,
      image: imagePath,
      textColor,
      title
    });

    console.log("Seller added successfully!");
  } catch (error) {
    console.error("Failed to create seller:", error);
  }
}