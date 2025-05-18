import { uploadImage } from "./uploadImage";
import { apiRequest } from "./firebase"; // Make sure you have this utility function

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

    // Upload the image to Firebase Storage
    const imagePath = await uploadImage(image, "shop_images");

    // Send the rest of the data to the backend
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
