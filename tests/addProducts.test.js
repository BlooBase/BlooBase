
// Mock the Firebase and uploadImage dependencies
jest.mock('../src/firebase/firebase', () => ({
  db: jest.fn(),
}));
jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  setDoc: jest.fn(),
  serverTimestamp: jest.fn(),
}));
jest.mock('../src/firebase/uploadImage', () => ({
  uploadImage: jest.fn(),
}));

// Mock crypto.randomUUID
global.crypto = {
  randomUUID: jest.fn(() => 'mocked-uuid'),
};

import { addProduct } from '../src/firebase/addProduct';
import { db } from '../src/firebase/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { uploadImage } from '../src/firebase/uploadImage';

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
    serverTimestamp.mockReturnValue('mocked-timestamp');
    uploadImage.mockResolvedValue('gs://bucket/product_images/test.jpg');
    doc.mockReturnValue('mocked-doc-ref');
    setDoc.mockResolvedValue(undefined);
  });

  it('should add a product successfully with valid data', async () => {
    await addProduct(mockProductData);

    expect(uploadImage).toHaveBeenCalledWith(mockProductData.image, 'product_images');
    expect(doc).toHaveBeenCalledWith(db, 'Products', 'mocked-uuid');
    expect(setDoc).toHaveBeenCalledWith('mocked-doc-ref', {
      Seller: 'George Mnisi',
      SellerID: 'seller123',
      image: 'gs://bucket/product_images/test.jpg',
      name: 'Test Product',
      price: '69.99',
      stock: 10,
      createdAt: 'mocked-timestamp',
    });
    expect(console.log).toHaveBeenCalledWith('Product added successfully!');
  });

  it('should throw an error if required fields are missing', async () => {
    const invalidProductData = { ...mockProductData, Seller: undefined };

    // Mock console.error to suppress error output in tests
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    await addProduct(invalidProductData);

    expect(uploadImage).not.toHaveBeenCalled();
    expect(doc).not.toHaveBeenCalled();
    expect(setDoc).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(
      'Failed to add product:',
      expect.objectContaining({ message: 'Missing required product data fields.' })
    );

    consoleErrorSpy.mockRestore();
  });

  it('should handle errors during image upload', async () => {
    uploadImage.mockRejectedValue(new Error('Image upload failed'));

    // Mock console.error to suppress error output in tests
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    await addProduct(mockProductData);

    expect(uploadImage).toHaveBeenCalledWith(mockProductData.image, 'product_images');
    expect(doc).not.toHaveBeenCalled();
    expect(setDoc).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(
      'Failed to add product:',
      expect.objectContaining({ message: 'Image upload failed' })
    );

    consoleErrorSpy.mockRestore();
  });

  it('should handle errors during Firestore setDoc', async () => {
    setDoc.mockRejectedValue(new Error('Firestore write failed'));

    // Mock console.error to suppress error output in tests
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    await addProduct(mockProductData);

    expect(uploadImage).toHaveBeenCalledWith(mockProductData.image, 'product_images');
    expect(doc).toHaveBeenCalledWith(db, 'Products', 'mocked-uuid');
    expect(setDoc).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(
      'Failed to add product:',
      expect.objectContaining({ message: 'Firestore write failed' })
    );

    consoleErrorSpy.mockRestore();
  });
});