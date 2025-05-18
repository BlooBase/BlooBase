import { addOrder } from '../src/firebase/addOrder';
import { auth, db, doc, getDoc, setDoc, collection, increment, updateDoc } from '../src/firebase/firebase';

// Mock Firebase dependencies
jest.mock('../src/firebase/firebase', () => ({
  auth: {
    currentUser: null,
  },
  db: {},
  doc: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  collection: jest.fn(),
  increment: jest.fn(),
  updateDoc: jest.fn(),
}));

describe('addOrder', () => {
  const mockUser = { uid: 'user123' };
  const mockCartItems = [
    { id: 'prod1', name: 'Product 1', quantity: 2 },
    { id: 'prod2', name: 'Product 2', quantity: 1 },
  ];
  const mockOrderDetails = { orderType: 'delivery', total: 99.99 };
  const mockOrderDocId = 'order456';
  const mockTimestamp = '2025-05-18T13:10:00.000Z';

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Date.prototype, 'toISOString').mockReturnValue(mockTimestamp);
    auth.currentUser = mockUser;
  });

  afterEach(() => {
    jest.spyOn(Date.prototype, 'toISOString').mockRestore();
  });

  it('should throw error if user is not authenticated', async () => {
    auth.currentUser = null;
    await expect(addOrder(mockOrderDetails)).rejects.toThrow('User not authenticated');
  });

  it('should throw error if cart is empty', async () => {
    const cartDocRef = { id: 'cart123' };
    doc.mockReturnValue(cartDocRef);
    getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({ items: [] }),
    });

    await expect(addOrder(mockOrderDetails)).rejects.toThrow('Cart is empty');
  });

  it('should successfully place an order and clear cart', async () => {
    const cartDocRef = { id: 'cart123' };
    const orderDocRef = { id: mockOrderDocId };
    const orderCollectionRef = { id: 'orders' };
    const productRef1 = { id: 'prod1' };
    const productRef2 = { id: 'prod2' };

    // Updated doc mock to handle collection names
    doc.mockImplementation((db, collectionName, id) => {
      if (collectionName === 'Carts' && id === mockUser.uid) return cartDocRef;
      if (collectionName === 'Products' && id === 'prod1') return productRef1;
      if (collectionName === 'Products' && id === 'prod2') return productRef2;
      if (collectionName === 'Orders') return orderDocRef;
      return orderDocRef; // Fallback for order document
    });
    collection.mockReturnValue(orderCollectionRef);
    getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({ items: mockCartItems }),
    });
    setDoc.mockResolvedValue();
    updateDoc.mockResolvedValue();
    increment.mockReturnValue('increment(1)');

    const result = await addOrder(mockOrderDetails);

    expect(result).toEqual({
      id: mockOrderDocId,
      userId: mockUser.uid,
      items: mockCartItems,
      orderType: 'delivery',
      total: 99.99,
      createdAt: mockTimestamp,
      status: 'Pending',
    });

    expect(doc).toHaveBeenCalledWith(db, 'Carts', mockUser.uid);
    expect(getDoc).toHaveBeenCalledWith(cartDocRef);
    expect(collection).toHaveBeenCalledWith(db, 'Orders');
    expect(setDoc).toHaveBeenCalledWith(orderDocRef, {
      userId: mockUser.uid,
      items: mockCartItems,
      orderType: 'delivery',
      total: 99.99,
      createdAt: mockTimestamp,
      status: 'Pending',
    });

    expect(doc).toHaveBeenCalledWith(db, 'Products', 'prod1');
    expect(doc).toHaveBeenCalledWith(db, 'Products', 'prod2');
    expect(updateDoc).toHaveBeenCalledTimes(2);
    expect(updateDoc).toHaveBeenCalledWith(productRef1, { sales: 'increment(1)' });
    expect(updateDoc).toHaveBeenCalledWith(productRef2, { sales: 'increment(1)' });

    expect(setDoc).toHaveBeenCalledWith(cartDocRef, { items: [] }, { merge: true });
  });

  it('should handle missing cart document', async () => {
    const cartDocRef = { id: 'cart123' };
    doc.mockReturnValue(cartDocRef);
    getDoc.mockResolvedValue({
      exists: () => false,
    });

    await expect(addOrder(mockOrderDetails)).rejects.toThrow('Cart is empty');
  });

  it('should handle items without id gracefully', async () => {
    const cartDocRef = { id: 'cart123' };
    const orderDocRef = { id: mockOrderDocId };
    const orderCollectionRef = { id: 'orders' };
    const invalidItems = [{ name: 'Product 1', quantity: 1 }];

    // Updated doc mock to handle collection names
    doc.mockImplementation((db, collectionName, id) => {
      if (collectionName === 'Carts' && id === mockUser.uid) return cartDocRef;
      if (collectionName === 'Orders') return orderDocRef;
      return orderDocRef;
    });
    collection.mockReturnValue(orderCollectionRef);
    getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({ items: invalidItems }),
    });
    setDoc.mockResolvedValue();

    const result = await addOrder(mockOrderDetails);

    expect(result.items).toEqual(invalidItems);
    expect(updateDoc).not.toHaveBeenCalled();
    expect(setDoc).toHaveBeenCalledWith(orderDocRef, {
      userId: mockUser.uid,
      items: invalidItems,
      orderType: 'delivery',
      total: 99.99,
      createdAt: mockTimestamp,
      status: 'Pending',
    });
    expect(setDoc).toHaveBeenCalledWith(cartDocRef, { items: [] }, { merge: true });
  });

  it('should handle Firebase errors during order creation', async () => {
    const cartDocRef = { id: 'cart123' };
    const orderDocRef = { id: mockOrderDocId };
    const orderCollectionRef = { id: 'orders' };

    doc.mockImplementation((db, collectionName, id) => {
      if (collectionName === 'Carts' && id === mockUser.uid) return cartDocRef;
      if (collectionName === 'Orders') return orderDocRef;
      return orderDocRef;
    });
    collection.mockReturnValue(orderCollectionRef);
    getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({ items: mockCartItems }),
    });
    setDoc.mockRejectedValueOnce(new Error('Firestore write error'));

    await expect(addOrder(mockOrderDetails)).rejects.toThrow('Firestore write error');
  });
});