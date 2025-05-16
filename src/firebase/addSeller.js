import { apiRequest,uploadFile } from "./firebase";

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
export const addSeller = async (sellerData) => {
  const { image, ...rest } = sellerData;
  let imagePath = null;
  if (image instanceof File) {
    imagePath = await uploadFile(image, "shop_images");
  }
  return apiRequest('/api/sellers', 'POST', { ...rest, image: imagePath });
};