import { apiRequest,uploadFile } from "./firebase";

/**
 * Adds a new product to the Products collection in Firestore, including uploading its image to Firebase Storage.
 * @param {Object} productData - The data for the product item, including the image file and product details.
 * @returns {Promise<object>} A promise that resolves to the result of the API request.
 */
export const addProduct = async (productData) => {
  const { image, ...rest } = productData;
  let imagePath = null;
  if (image instanceof File) {
    imagePath = await uploadFile(image, "product_images");
  }
  return apiRequest('/api/products', 'POST', { ...rest, image: imagePath });
};