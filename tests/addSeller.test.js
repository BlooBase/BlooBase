import { addSeller } from '../src/firebase/addSeller';
import { db } from '../src/firebase/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { uploadImage } from '../src/firebase/uploadImage';

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

describe('addSeller', () => {
  const mockSellerData = {
    color: '#FFFFFF',
    description: 'A beautiful artwork',
    genre: 'Abstract',
    image: new File([''], 'art.jpg', { type: 'image/jpeg' }),
    textColor: '#000000',
    title: 'Sunset Bliss',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    serverTimestamp.mockReturnValue('mocked-timestamp');
    uploadImage.mockResolvedValue('gs://bucket/shop_images/art.jpg');
    doc.mockReturnValue('mocked-doc-ref');
    setDoc.mockResolvedValue(undefined);
  });

  it('should add a seller item successfully with valid data', async () => {
    await addSeller(mockSellerData);

    expect(uploadImage).toHaveBeenCalledWith(mockSellerData.image, 'shop_images');
    expect(doc).toHaveBeenCalledWith(db, 'Sellers', 'mocked-uuid');
    expect(setDoc).toHaveBeenCalledWith('mocked-doc-ref', {
      color: '#FFFFFF',
      description: 'A beautiful artwork',
      genre: 'Abstract',
      image: 'gs://bucket/shop_images/art.jpg',
      textColor: '#000000',
      title: 'Sunset Bliss',
      createdAt: 'mocked-timestamp',
    });
    expect(console.log).toHaveBeenCalledWith('Seller item added successfully!');
  });

  it('should throw an error if required fields are missing', async () => {
    const invalidSellerData = { ...mockSellerData, title: undefined };

    // Mock console.error to suppress error output in tests
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    await addSeller(invalidSellerData);

    expect(uploadImage).not.toHaveBeenCalled();
    expect(doc).not.toHaveBeenCalled();
    expect(setDoc).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(
      'Failed to add seller item:',
      expect.objectContaining({ message: 'Missing required seller data fields.' })
    );

    consoleErrorSpy.mockRestore();
  });

  it('should handle errors during image upload', async () => {
    uploadImage.mockRejectedValue(new Error('Image upload failed'));

    // Mock console.error to suppress error output in tests
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    await addSeller(mockSellerData);

    expect(uploadImage).toHaveBeenCalledWith(mockSellerData.image, 'shop_images');
    expect(doc).not.toHaveBeenCalled();
    expect(setDoc).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(
      'Failed to add seller item:',
      expect.objectContaining({ message: 'Image upload failed' })
    );

    consoleErrorSpy.mockRestore();
  });

  it('should handle errors during Firestore setDoc', async () => {
    setDoc.mockRejectedValue(new Error('Firestore write failed'));

    // Mock console.error to suppress error output in tests
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    await addSeller(mockSellerData);

    expect(uploadImage).toHaveBeenCalledWith(mockSellerData.image, 'shop_images');
    expect(doc).toHaveBeenCalledWith(db, 'Sellers', 'mocked-uuid');
    expect(setDoc).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(
      'Failed to add seller item:',
      expect.objectContaining({ message: 'Firestore write failed' })
    );

    consoleErrorSpy.mockRestore();
  });
});