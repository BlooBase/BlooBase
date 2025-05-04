import { db } from "./firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { uploadImage } from "./uploadImage"; // Ensure this is correctly imported

/**
 * Adds a new product to the Products collection in Firestore.
 * Uploads the image to Firebase Storage first and stores the image path.
 * @param {Object} productData - The data for the product item.
 * @param {File} productData.image - File object to be uploaded.
 * @param {string} productData.Seller - Name of the seller.
 * @param {string} productData.SellerID - ID of the seller.
 * @param {string} productData.name - Name of the product.
 * @param {string} productData.price - Price of the product.
 * @param {number} productData.stock - Stock quantity of the product.
 */
export async function addProduct(productData) {
  try {
    const {
      Seller,
      SellerID,
      image, // File object
      name,
      price,
      stock
    } = productData;

    if (!Seller || !SellerID || !image || !name || !price || stock == null) {
      throw new Error("Missing required product data fields.");
    }

    // Upload the image and get the storage path
    const imagePath = await uploadImage(image, "product_images");

    // Always generate a new unique ID for the product
    const docRef = doc(db, "Products", crypto.randomUUID());

    await setDoc(docRef, {
      Seller,
      SellerID,
      image: imagePath, // Save the storage path
      name,
      price,
      stock,
      createdAt: serverTimestamp()
    });

    console.log("Product added successfully!");
  } catch (error) {
    console.error("Failed to add product:", error);
  }
}