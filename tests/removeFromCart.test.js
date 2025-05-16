// this page tests the removeFromCart firebase function

// Mock Firestore methods
jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  setDoc: jest.fn(),
  getDoc: jest.fn(),
  updateDoc: jest.fn(),
}));

jest.mock('../src/firebase/firebase', () => ({
  db: { __test: true }, // Dummy db object
  auth: { currentUser: null }, // Mock auth
}));

import { removeFromCart } from '../src/firebase/removeFromCart';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../src/firebase/firebase';



describe('removeFromCart', () => {
  const mockUser = { uid: 'testUser123' };
  const mockProductId = 'product123';
  const mockCartRef = { id: 'cartRef' };

  beforeEach(() => {
    jest.clearAllMocks();
    auth.currentUser = mockUser;
    doc.mockReturnValue(mockCartRef);
  });

  test('throws error if user is not authenticated', async () => {
    auth.currentUser = null;

    await expect(removeFromCart(mockProductId)).rejects.toThrow('User not authenticated');
    expect(doc).not.toHaveBeenCalled();
    expect(getDoc).not.toHaveBeenCalled();
    expect(updateDoc).not.toHaveBeenCalled();
  });

  test('removes item from existing cart', async () => {
    const mockCartData = {
      items: [
        { id: 'product123', name: 'Item 1' },
        { id: 'product456', name: 'Item 2' }
      ]
    };
    const mockCartSnap = {
      exists: () => true,
      data: () => mockCartData
    };
    getDoc.mockResolvedValue(mockCartSnap);
    updateDoc.mockResolvedValue();

    const result = await removeFromCart(mockProductId);

    expect(doc).toHaveBeenCalledWith(db, 'Carts', mockUser.uid);
    expect(getDoc).toHaveBeenCalledWith(mockCartRef);
    expect(updateDoc).toHaveBeenCalledWith(mockCartRef, {
      items: [{ id: 'product456', name: 'Item 2' }]
    });
    expect(result).toEqual([{ id: 'product456', name: 'Item 2' }]);
  });

  test('handles empty cart items', async () => {
    const mockCartData = { items: [] };
    const mockCartSnap = {
      exists: () => true,
      data: () => mockCartData
    };
    getDoc.mockResolvedValue(mockCartSnap);
    updateDoc.mockResolvedValue();

    const result = await removeFromCart(mockProductId);

    expect(doc).toHaveBeenCalledWith(db, 'Carts', mockUser.uid);
    expect(getDoc).toHaveBeenCalledWith(mockCartRef);
    expect(updateDoc).toHaveBeenCalledWith(mockCartRef, { items: [] });
    expect(result).toEqual([]);
  });

  test('returns empty array when cart does not exist', async () => {
    const mockCartSnap = {
      exists: () => false
    };
    getDoc.mockResolvedValue(mockCartSnap);

    const result = await removeFromCart(mockProductId);

    expect(doc).toHaveBeenCalledWith(db, 'Carts', mockUser.uid);
    expect(getDoc).toHaveBeenCalledWith(mockCartRef);
    expect(updateDoc).not.toHaveBeenCalled();
    expect(result).toEqual([]);
  });
});