import { apiRequest,uploadFile } from "./firebase";
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
export const addProduct = async (productData) => {
  const { image, ...rest } = productData;
  let imagePath = null;
  if (image instanceof File) {
    imagePath = await uploadFile(image, "product_images");
  }
  return apiRequest('/api/products', 'POST', { ...rest, image: imagePath });
};