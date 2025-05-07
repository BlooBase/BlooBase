import { db } from "./firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { uploadImage } from "./uploadImage"; // Ensure this is correctly imported

/**
 * Adds a new seller item to the Sellers collection in Firestore.
 * Uploads the image to Firebase Storage first and stores the image path.
 * @param {Object} sellerData - The data for the seller item.
 * @param {File} sellerData.image - File object to be uploaded.
 * @param {string} sellerData.color - Background color.
 * @param {string} sellerData.description - Description of the artwork.
 * @param {string} sellerData.genre - Genre of the art.
 * @param {string} sellerData.textColor - Text color.
 * @param {string} sellerData.title - Title of the art piece.
 */
export async function addSeller(sellerData) {
  try {
    const {
      color,
      description,
      genre,
      image, // File object
      textColor,
      title
    } = sellerData;

    if (!color || !description || !genre || !image || !textColor || !title) {
      throw new Error("Missing required seller data fields.");
    }

    // Upload the image and get the storage path
    const imagePath = await uploadImage(image, "shop_images");

    // Always generate a new unique ID
    const docRef = doc(db, "Sellers", crypto.randomUUID());

    await setDoc(docRef, {
      color,
      description,
      genre,
      image: imagePath, // Save the storage path
      textColor,
      title,
      createdAt: serverTimestamp()
    });

    console.log("Seller item added successfully!");
  } catch (error) {
    console.error("Failed to add seller item:", error);
  }
}