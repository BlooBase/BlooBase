// Mock Firebase Storage
jest.mock('firebase/storage', () => ({
  ref: jest.fn(),
  uploadBytes: jest.fn(),
}));

jest.mock('../src/firebase/firebase', () => ({
  storage: { __test: true }, // Mock storage object
}));


import { uploadImage } from '../src/firebase/uploadImage';
import { ref, uploadBytes } from 'firebase/storage';
import { storage } from '../src/firebase/firebase';


// Mock crypto.randomUUID
const mockRandomUUID = 'abc123';
global.crypto = {
  randomUUID: jest.fn(() => mockRandomUUID),
};

describe('uploadImage', () => {
  const mockFile = { name: 'test.png' };
  const mockFolder = 'shop_images';
  const mockStoragePath = `${mockFolder}/${mockRandomUUID}_${mockFile.name}`;
  const mockFileRef = { path: mockStoragePath };

  beforeEach(() => {
    jest.clearAllMocks();
    console.error = jest.fn(); // Mock console.error
  });

  it('uploads file to Firebase Storage and returns storage path', async () => {
    ref.mockReturnValue(mockFileRef);
    uploadBytes.mockResolvedValue();

    const result = await uploadImage(mockFile, mockFolder);

    expect(crypto.randomUUID).toHaveBeenCalled();
    expect(ref).toHaveBeenCalledWith(storage, mockStoragePath);
    expect(uploadBytes).toHaveBeenCalledWith(mockFileRef, mockFile);
    expect(result).toBe(mockStoragePath);
    expect(console.error).not.toHaveBeenCalled();
  });

  it('uses default folder "shop_images" when folder is not provided', async () => {
    ref.mockReturnValue(mockFileRef);
    uploadBytes.mockResolvedValue();

    const result = await uploadImage(mockFile);

    const expectedPath = `shop_images/${mockRandomUUID}_${mockFile.name}`;
    expect(ref).toHaveBeenCalledWith(storage, expectedPath);
    expect(uploadBytes).toHaveBeenCalledWith(mockFileRef, mockFile);
    expect(result).toBe(expectedPath);
    expect(console.error).not.toHaveBeenCalled();
  });

  it('throws error and logs when upload fails', async () => {
    const mockError = new Error('Upload failed');
    ref.mockReturnValue(mockFileRef);
    uploadBytes.mockRejectedValue(mockError);

    await expect(uploadImage(mockFile, mockFolder)).rejects.toThrow('Upload failed');
    expect(crypto.randomUUID).toHaveBeenCalled();
    expect(ref).toHaveBeenCalledWith(storage, mockStoragePath);
    expect(uploadBytes).toHaveBeenCalledWith(mockFileRef, mockFile);
    expect(console.error).toHaveBeenCalledWith('Image upload failed:', mockError);
  });
});