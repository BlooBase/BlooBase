import { storage } from "./firebase";
import { ref, uploadBytes } from "firebase/storage";


/**
 * Uploads a file to Firebase Storage and returns the storage path (not the URL).
 * @param {File} file - The file object to upload.
 * @param {string} folder - Folder path in Firebase Storage (e.g., "shop_images").
 * @returns {Promise<string>} - The full storage path (e.g., "shop_images/abc123_file.png").
 */
export async function uploadImage(file, folder = "shop_images") {
  try {
    const uniqueFileName = `${crypto.randomUUID()}_${file.name}`;
    const storagePath = `${folder}/${uniqueFileName}`;
    const fileRef = ref(storage, storagePath);

    await uploadBytes(fileRef, file);

    return storagePath; // This is what you'll store in Firestore
  } catch (error) {
    console.error("Image upload failed:", error);
    throw error;
  }
}
