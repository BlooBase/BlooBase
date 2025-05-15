// Mock Firestore methods
jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  setDoc: jest.fn(),
  getDoc: jest.fn(),
  updateDoc: jest.fn(),
  arrayUnion: jest.fn((item) => item), // Mock arrayUnion to return the item
}));

jest.mock('../src/firebase/firebase', () => ({
  db: { __test: true }, // Dummy db object
  auth: { currentUser: null }, // Mock auth
}));

import { addToCart } from '../src/firebase/addToCart';
import { doc, setDoc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db, auth } from '../src/firebase/firebase';

describe('addToCart', () => {
  const mockProduct = {
    id: 'prod123',
    name: 'Test Product',
    price: 19.99,
    imageUrl: 'http://example.com/image.jpg',
    Seller: 'Test Seller',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    auth.currentUser = null; // Reset user
    console.log('Running test setup'); // Debug log to confirm test execution
  });

  it('throws error if user is not authenticated', async () => {
    await expect(addToCart(mockProduct)).rejects.toThrow('User not authenticated');
    expect(doc).not.toHaveBeenCalled();
    expect(getDoc).not.toHaveBeenCalled();
    expect(setDoc).not.toHaveBeenCalled();
    expect(updateDoc).not.toHaveBeenCalled();
  });

  it('creates new cart with product if cart does not exist', async () => {
    auth.currentUser = { uid: 'user123' };
    const cartRef = { id: 'cartRef' };
    doc.mockReturnValue(cartRef);
    getDoc.mockResolvedValue({
      exists: () => false,
    });
    setDoc.mockResolvedValue();

    await addToCart(mockProduct);

    expect(doc).toHaveBeenCalledWith(db, 'Carts', 'user123');
    expect(getDoc).toHaveBeenCalledWith(cartRef);
    expect(setDoc).toHaveBeenCalledWith(cartRef, {
      items: [{
        id: 'prod123',
        name: 'Test Product',
        price: 19.99,
        imageUrl: 'http://example.com/image.jpg',
        Seller: 'Test Seller',
        quantity: 1,
      }],
    });
    expect(updateDoc).not.toHaveBeenCalled();
  });

  it('adds product to existing cart if product not already in cart', async () => {
    auth.currentUser = { uid: 'user123' };
    const cartRef = { id: 'cartRef' };
    doc.mockReturnValue(cartRef);
    getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({
        items: [{ id: 'otherProd', name: 'Other Product', price: 9.99, quantity: 1 }],
      }),
    });
    updateDoc.mockResolvedValue();

    await addToCart(mockProduct);

    expect(doc).toHaveBeenCalledWith(db, 'Carts', 'user123');
    expect(getDoc).toHaveBeenCalledWith(cartRef);
    expect(updateDoc).toHaveBeenCalledWith(cartRef, {
      items: {
        id: 'prod123',
        name: 'Test Product',
        price: 19.99,
        imageUrl: 'http://example.com/image.jpg',
        Seller: 'Test Seller',
        quantity: 1,
      },
    });
    expect(setDoc).not.toHaveBeenCalled();
  });

  it('does not add duplicate product to existing cart', async () => {
    auth.currentUser = { uid: 'user123' };
    const cartRef = { id: 'cartRef' };
    doc.mockReturnValue(cartRef);
    getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({
        items: [{
          id: 'prod123',
          name: 'Test Product',
          price: 19.99,
          quantity: 1,
        }],
      }),
    });

    await addToCart(mockProduct);

    expect(doc).toHaveBeenCalledWith(db, 'Carts', 'user123');
    expect(getDoc).toHaveBeenCalledWith(cartRef);
    expect(updateDoc).not.toHaveBeenCalled();
    expect(setDoc).not.toHaveBeenCalled();
  });

  it('handles null items array in existing cart', async () => {
    auth.currentUser = { uid: 'user123' };
    const cartRef = { id: 'cartRef' };
    doc.mockReturnValue(cartRef);
    getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({ items: null }),
    });
    updateDoc.mockResolvedValue();

    await addToCart(mockProduct);

    expect(doc).toHaveBeenCalledWith(db, 'Carts', 'user123');
    expect(getDoc).toHaveBeenCalledWith(cartRef);
    expect(updateDoc).toHaveBeenCalledWith(cartRef, {
      items: {
        id: 'prod123',
        name: 'Test Product',
        price: 19.99,
        imageUrl: 'http://example.com/image.jpg',
        Seller: 'Test Seller',
        quantity: 1,
      },
    });
    expect(setDoc).not.toHaveBeenCalled();
  });
});