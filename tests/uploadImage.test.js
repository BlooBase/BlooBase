// tests/uploadImage.test.js

import { uploadImage } from '../src/firebase/uploadImage';
import { ref, uploadBytes } from 'firebase/storage';

jest.mock('firebase/storage', () => ({
  ref: jest.fn(),
  uploadBytes: jest.fn(),
}));

describe('uploadImage', () => {
  const mockFile = { name: 'test.png', type: 'image/png' };

  beforeAll(() => {
    Object.defineProperty(global, 'crypto', {
      value: {
        randomUUID: jest.fn(() => 'mocked-uuid'),
      },
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('uploads a file and returns the correct storage path', async () => {
    uploadBytes.mockResolvedValueOnce();

    const result = await uploadImage(mockFile, 'test_folder');

    expect(result).toBe('test_folder/mocked-uuid_test.png');
    expect(ref).toHaveBeenCalledWith(expect.anything(), 'test_folder/mocked-uuid_test.png');
    expect(uploadBytes).toHaveBeenCalledWith(expect.anything(), mockFile);
  });

  it('defaults to "shop_images" folder if none is provided', async () => {
    uploadBytes.mockResolvedValueOnce();

    const result = await uploadImage(mockFile);

    expect(result).toBe('shop_images/mocked-uuid_test.png');
    expect(ref).toHaveBeenCalledWith(expect.anything(), 'shop_images/mocked-uuid_test.png');
  });

  it('throws an error if uploadBytes fails', async () => {
    const error = new Error('Simulated upload error');
    uploadBytes.mockRejectedValueOnce(error);

    await expect(uploadImage(mockFile, 'fail_folder')).rejects.toThrow('Simulated upload error');
  });
});
