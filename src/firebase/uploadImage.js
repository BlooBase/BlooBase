import { storage } from "./firebase";
import { ref, uploadBytes } from "firebase/storage";


/**
 * Uploads a file to Firebase Storage and returns the storage path (not the URL).
 * @param {File} file - The file object to upload.
 * @param {string} folder - Folder path in Firebase Storage
 * @returns {Promise<string>} - The full storage path 
 */
export async function uploadImage(file, folder = "shop_images") {
  try {
    const uniqueFileName = `${crypto.randomUUID()}_${file.name}`;
    const storagePath = `${folder}/${uniqueFileName}`;
    const fileRef = ref(storage, storagePath);

    await uploadBytes(fileRef, file);

    return storagePath;
  } catch (error) {
    console.error("Image upload failed:", error);
    throw error;
  }
}