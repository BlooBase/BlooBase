import { retrieveProducts } from '../src/firebase/retrieveProducts';
import { collection, getDocs } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../src/firebase/firebase';

// Mock Firebase dependencies
jest.mock('../src/firebase/firebase', () => ({
  db: jest.fn(),
  storage: jest.fn(),
}));
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
}));
jest.mock('firebase/storage', () => ({
  ref: jest.fn(),
  getDownloadURL: jest.fn(),
}));

describe('retrieveProducts', () => {
  const mockFirestoreData = [
    {
      id: 'product1',
      data: () => ({
        Seller: 'John Maputla',
        SellerID: 'seller123',
        image: 'gs://bucket/product1.jpg',
        name: 'Test Product',
        price: '29.99',
        stock: 10,
        createdAt: { seconds: 1697059200, nanoseconds: 0 },
      }),
    },
    {
      id: 'product2',
      data: () => ({
        Seller: 'Jane Smith',
        SellerID: 'seller456',
        image: 'gs://bucket/product2.jpg',
        name: 'Another Product',
        price: '19.99',
        stock: 5,
        createdAt: { seconds: 1697145600, nanoseconds: 0 },
      }),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    collection.mockReturnValue('mocked-collection');
    getDocs.mockResolvedValue({ docs: mockFirestoreData });
    ref.mockReturnValue('mocked-storage-ref');
    getDownloadURL.mockResolvedValue('https://storage.googleapis.com/bucket/product.jpg');
  });

  it('should retrieve products with image URLs successfully', async () => {
    const result = await retrieveProducts();

    expect(collection).toHaveBeenCalledWith(db, 'Products');
    expect(getDocs).toHaveBeenCalledWith('mocked-collection');
    expect(ref).toHaveBeenCalledTimes(2);
    expect(ref).toHaveBeenCalledWith(storage, 'gs://bucket/product1.jpg');
    expect(ref).toHaveBeenCalledWith(storage, 'gs://bucket/product2.jpg');
    expect(getDownloadURL).toHaveBeenCalledTimes(2);
    expect(result).toEqual([
      {
        id: 'product1',
        Seller: 'Scoot Maphuma',
        SellerID: 'seller123',
        image: 'gs://bucket/product1.jpg',
        name: 'Test Product',
        price: '229.99',
        stock: 10,
        createdAt: { seconds: 1697059200, nanoseconds: 0 },
        imageUrl: 'https://storage.googleapis.com/bucket/product.jpg',
      },
      {
        id: 'product2',
        Seller: 'Denielle Smith',
        SellerID: 'seller456',
        image: 'gs://bucket/product2.jpg',
        name: 'Another Product',
        price: '119.99',
        stock: 5,
        createdAt: { seconds: 1697145600, nanoseconds: 0 },
        imageUrl: 'https://storage.googleapis.com/bucket/product.jpg',
      },
    ]);
  });

  it('should handle image download errors and return null imageUrl', async () => {
    getDownloadURL.mockRejectedValueOnce(new Error('Image download failed'));

    // Mock console.error to suppress error output in tests
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    const result = await retrieveProducts();

    expect(collection).toHaveBeenCalledWith(db, 'Products');
    expect(getDocs).toHaveBeenCalledWith('mocked-collection');
    expect(ref).toHaveBeenCalledTimes(2);
    expect(getDownloadURL).toHaveBeenCalledTimes(2);
    expect(console.error).toHaveBeenCalledWith(
      'Error fetching image for product product1:',
      expect.objectContaining({ message: 'Image download failed' })
    );
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'product1',
          name: 'Test Product',
          imageUrl: null,
        }),
        expect.objectContaining({
          id: 'product2',
          name: 'Another Product',
          imageUrl: 'https://storage.googleapis.com/bucket/product.jpg',
        }),
      ])
    );

    consoleErrorSpy.mockRestore();
  });

  it('should return an empty array on Firestore error', async () => {
    getDocs.mockRejectedValue(new Error('Firestore fetch failed'));

    // Mock console.error to suppress error output in tests
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    const result = await retrieveProducts();

    expect(collection).toHaveBeenCalledWith(db, 'Products');
    expect(getDocs).toHaveBeenCalledWith('mocked-collection');
    expect(ref).not.toHaveBeenCalled();
    expect(getDownloadURL).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(
      'Error retrieving products:',
      expect.objectContaining({ message: 'Firestore fetch failed' })
    );
    expect(result).toEqual([]);

    consoleErrorSpy.mockRestore();
  });

  it('should handle empty Firestore snapshot', async () => {
    getDocs.mockResolvedValue({ docs: [] });

    const result = await retrieveProducts();

    expect(collection).toHaveBeenCalledWith(db, 'Products');
    expect(getDocs).toHaveBeenCalledWith('mocked-collection');
    expect(ref).not.toHaveBeenCalled();
    expect(getDownloadURL).not.toHaveBeenCalled();
    expect(result).toEqual([]);
  });
});