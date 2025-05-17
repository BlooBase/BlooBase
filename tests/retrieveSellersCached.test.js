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

import { retrieveSellersCached } from '../src/firebase/retrieveSellersCached';
import { collection, getDocs } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../src/firebase/firebase';
import { cachedSellers } from '../src/firebase/retrieveSellers';



describe('retrieveSellersCached', () => {
  const mockHardcodedProducts = [
    {
      id: 'h1',
      title: 'poiandkeely',
      image: '/keely.jpg',
      description: '3d Modeling and Character Design, @poiandkeely',
      color: '#FFEFF8',
      textColor: '#A38FF7',
      genre: 'Digital Art',
    },
    // Additional hardcoded products omitted for brevity
  ];

  const mockFirestoreData = [
    {
      id: 'seller1',
      data: () => ({
        title: 'Artist One',
        description: 'A great artist',
        image: 'gs://bucket/seller1.jpg',
        color: '#123456',
        textColor: '#654321',
        genre: 'Painting',
      }),
    },
  ];

  const mockCombinedSellers = [
    ...mockHardcodedProducts,
    {
      id: 'seller1',
      title: 'Artist One',
      description: 'A great artist',
      image: 'https://storage.googleapis.com/bucket/seller1.jpg',
      color: '#123456',
      textColor: '#654321',
      genre: 'Painting',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    getDownloadURL.mockResolvedValue('https://storage.googleapis.com/bucket/seller1.jpg');
    ref.mockReturnValue('mocked-storage-ref');
    collection.mockReturnValue('mocked-collection');
    getDocs.mockResolvedValue({ docs: mockFirestoreData });
  });

  it('should return cached sellers if available', async () => {
    // Simulate cached sellers
    cachedSellers.push(...mockCombinedSellers);

    const result = await retrieveSellersCached();

    expect(collection).not.toHaveBeenCalled();
    expect(getDocs).not.toHaveBeenCalled();
    expect(getDownloadURL).not.toHaveBeenCalled();
    expect(result).toEqual(mockCombinedSellers);

    // Clear cachedSellers for other tests
    cachedSellers.length = 0;
  });

  it('should fetch sellers from Firestore and combine with hardcoded products', async () => {
    const result = await retrieveSellersCached();

    expect(collection).toHaveBeenCalledWith(db, 'Sellers');
    expect(getDocs).toHaveBeenCalledWith('mocked-collection');
    expect(ref).toHaveBeenCalledWith(storage, 'gs://bucket/seller1.jpg');
    expect(getDownloadURL).toHaveBeenCalledWith('mocked-storage-ref');
    expect(result).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: 'h1', title: 'poiandkeely' }),
      expect.objectContaining({ id: 'seller1', title: 'Artist One' }),
    ]));
  });

  it('should handle sellers with missing fields gracefully', async () => {
    const mockFirestoreDataWithMissingFields = [
      {
        id: 'seller2',
        data: () => ({
          image: 'gs://bucket/seller2.jpg',
        }),
      },
    ];
    getDocs.mockResolvedValueOnce({ docs: mockFirestoreDataWithMissingFields });

    const result = await retrieveSellersCached();

    expect(result).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: 'h1', title: 'poiandkeely' }),
      expect.objectContaining({
        id: 'seller2',
        title: 'Untitled',
        description: '',
        image: 'https://storage.googleapis.com/bucket/seller2.jpg',
        color: '#ffffff',
        textColor: '#000000',
        genre: 'Unknown',
      }),
    ]));
  });

  it('should handle errors and return an empty array', async () => {
    getDocs.mockRejectedValue(new Error('Firestore fetch failed'));

    // Mock console.error to suppress error output in tests
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    const result = await retrieveSellersCached();

    expect(console.error).toHaveBeenCalledWith(
      'Error fetching sellers:',
      expect.objectContaining({ message: 'Firestore fetch failed' })
    );
    expect(result).toEqual([]);

    consoleErrorSpy.mockRestore();
  });

  it('should handle cases where no image is provided', async () => {
    const mockFirestoreDataNoImage = [
      {
        id: 'seller3',
        data: () => ({
          title: 'No Image Artist',
          description: 'Artist without image',
          color: '#111111',
          textColor: '#222222',
          genre: 'Sculpture',
        }),
      },
    ];
    getDocs.mockResolvedValueOnce({ docs: mockFirestoreDataNoImage });

    const result = await retrieveSellersCached();

    expect(getDownloadURL).not.toHaveBeenCalled();
    expect(result).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: 'h1', title: 'poiandkeely' }),
      expect.objectContaining({
        id: 'seller3',
        title: 'No Image Artist',
        image: '',
        genre: 'Sculpture',
      }),
    ]));
  });
});