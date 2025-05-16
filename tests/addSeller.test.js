import { addSeller } from '../src/firebase/addSeller';
import { apiRequest, uploadFile } from '../src/firebase/firebase';

// Mock the Firebase dependencies
jest.mock('../src/firebase/firebase', () => ({
  apiRequest: jest.fn(),
  uploadFile: jest.fn(),
}));

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
    uploadFile.mockResolvedValue('gs://bucket/shop_images/art.jpg');
    apiRequest.mockResolvedValue(undefined);
  });

  it('should add a seller item successfully with valid data', async () => {
    await addSeller(mockSellerData);

    expect(uploadFile).toHaveBeenCalledWith(mockSellerData.image, 'shop_images');
    expect(apiRequest).toHaveBeenCalledWith('/api/sellers', 'POST', {
      color: '#FFFFFF',
      description: 'A beautiful artwork',
      genre: 'Abstract',
      image: 'gs://bucket/shop_images/art.jpg',
      textColor: '#000000',
      title: 'Sunset Bliss',
    });
  });

  it('should handle errors during image upload', async () => {
    uploadFile.mockRejectedValue(new Error('Image upload failed'));

    // Mock console.error to suppress error output in tests
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    await expect(addSeller(mockSellerData)).rejects.toThrow('Image upload failed');

    expect(uploadFile).toHaveBeenCalledWith(mockSellerData.image, 'shop_images');
    expect(apiRequest).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error adding seller item:',
      expect.objectContaining({ message: 'Image upload failed' })
    );

    consoleErrorSpy.mockRestore();
  });

  it('should handle errors during apiRequest', async () => {
    apiRequest.mockRejectedValue(new Error('API request failed'));

    // Mock console.error to suppress error output in tests
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    await expect(addSeller(mockSellerData)).rejects.toThrow('API request failed');

    expect(uploadFile).toHaveBeenCalledWith(mockSellerData.image, 'shop_images');
    expect(apiRequest).toHaveBeenCalledWith('/api/sellers', 'POST', {
      color: '#FFFFFF',
      description: 'A beautiful artwork',
      genre: 'Abstract',
      image: 'gs://bucket/shop_images/art.jpg',
      textColor: '#000000',
      title: 'Sunset Bliss',
    });
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error adding seller item:',
      expect.objectContaining({ message: 'API request failed' })
    );

    consoleErrorSpy.mockRestore();
  });

  it('should process seller data without an image', async () => {
    const sellerDataWithoutImage = { ...mockSellerData, image: null };

    await addSeller(sellerDataWithoutImage);

    expect(uploadFile).not.toHaveBeenCalled();
    expect(apiRequest).toHaveBeenCalledWith('/api/sellers', 'POST', {
      color: '#FFFFFF',
      description: 'A beautiful artwork',
      genre: 'Abstract',
      image: null,
      textColor: '#000000',
      title: 'Sunset Bliss',
    });
  });
});