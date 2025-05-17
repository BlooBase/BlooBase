import { addProduct } from '../src/firebase/addProduct';
import { apiRequest, uploadFile } from '../src/firebase/firebase';

// Mock the Firebase dependencies
jest.mock('../src/firebase/firebase', () => ({
  apiRequest: jest.fn(),
  uploadFile: jest.fn(),
}));

describe('addProduct', () => {
  const mockProductData = {
    Seller: 'John Dumbuza',
    SellerID: 'seller123',
    image: new File([''], 'test.jpg', { type: 'image/jpeg' }),
    name: 'Test Product',
    price: '29.99',
    stock: 10,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    uploadFile.mockResolvedValue('gs://bucket/product_images/test.jpg');
    apiRequest.mockResolvedValue(undefined);
  });

  it('should add a product successfully with valid data', async () => {
    await addProduct(mockProductData);

    expect(uploadFile).toHaveBeenCalledWith(mockProductData.image, 'product_images');
    expect(apiRequest).toHaveBeenCalledWith('/api/products', 'POST', {
      Seller: 'John Dumbuza',
      SellerID: 'seller123',
      image: 'gs://bucket/product_images/test.jpg',
      name: 'Test Product',
      price: '29.99',
      stock: 10,
    });
  });

  it('should handle errors during image upload', async () => {
    uploadFile.mockRejectedValue(new Error('Image upload failed'));

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    await expect(addProduct(mockProductData)).rejects.toThrow('Image upload failed');

    expect(uploadFile).toHaveBeenCalledWith(mockProductData.image, 'product_images');
    expect(apiRequest).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error adding product:',
      expect.objectContaining({ message: 'Image upload failed' })
    );

    consoleErrorSpy.mockRestore();
  });

  it('should handle errors during apiRequest', async () => {
    apiRequest.mockRejectedValue(new Error('API request failed'));

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    await expect(addProduct(mockProductData)).rejects.toThrow('API request failed');

    expect(uploadFile).toHaveBeenCalledWith(mockProductData.image, 'product_images');
    expect(apiRequest).toHaveBeenCalledWith('/api/products', 'POST', {
      Seller: 'John Dumbuza',
      SellerID: 'seller123',
      image: 'gs://bucket/product_images/test.jpg',
      name: 'Test Product',
      price: '29.99',
      stock: 10,
    });
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error adding product:',
      expect.objectContaining({ message: 'API request failed' })
    );

    consoleErrorSpy.mockRestore();
  });

  it('should process product data without an image', async () => {
    const productDataWithoutImage = { ...mockProductData, image: null };

    await addProduct(productDataWithoutImage);

    expect(uploadFile).not.toHaveBeenCalled();
    expect(apiRequest).toHaveBeenCalledWith('/api/products', 'POST', {
      Seller: 'John Dumbuza',
      SellerID: 'seller123',
      image: null,
      name: 'Test Product',
      price: '29.99',
      stock: 10,
    });
  });
});