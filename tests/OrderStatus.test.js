/**
 * @jest-environment node
 */
const { fetchOrderStatus } = require('../src/OrderStatus');

// Mock DB collection
const mockCollection = {
  findOne: jest.fn(),
};
const mockDb = {
  collection: jest.fn(() => mockCollection),
};

describe('fetchOrderStatus', () => {
  beforeEach(() => {
    // Clear mock calls before each test
    jest.clearAllMocks();
  });

  // Successful case: Valid order and authorized user
  test('should return order details for valid order and authorized user', async () => {
    const order = {
      _id: 'order123',
      userId: 'user456',
      status: 'shipped',
      items: [
        {
          productId: 'prod789',
          name: 'T-Shirt',
          quantity: 2,
          price: 169.99,
          variant: { size: 'M', color: 'Blue' },
        },
      ],
      total: 339.98,
      shippingAddress: { street: '13 Mamba St', city: 'Cape Town', country: 'South Africa' },
      createdAt: '2025-05-14T12:30:00Z',
      updatedAt: '2025-05-14T12:45:00Z',
      tracking: { carrier: 'UPS', trackingNumber: '1Z9999', url: 'https://ups.com/track/1Z9999' },
    };
    mockCollection.findOne.mockResolvedValue(order);

    const result = await fetchOrderStatus({ orderId: 'order123', userId: 'user456' }, mockDb);

    expect(mockCollection.findOne).toHaveBeenCalledWith({ _id: 'order123' });
    expect(result).toEqual({
      success: true,
      data: {
        orderId: 'order123',
        status: 'shipped',
        items: [
          {
            productId: 'prod789',
            name: 'T-Shirt',
            quantity: 2,
            price: 169.99,
            variant: { size: 'M', color: 'Blue' },
          },
        ],
        total: 339.98,
        shippingAddress: { street: '123 Mamba St', city: 'Cape Town', country: 'South Africa' },
        createdAt: '2025-05-14T12:30:00Z',
        updatedAt: '2025-05-14T12:45:00Z',
        tracking: { carrier: 'UPS', trackingNumber: '1Z9999', url: 'https://ups.com/track/1Z9999' },
      },
    });
  });

  // Invalid order ID
  test('should throw error for invalid order ID', async () => {
    await expect(fetchOrderStatus({ orderId: '', userId: 'user456' }, mockDb)).rejects.toThrow(
      'Invalid or missing order ID.'
    );
    expect(mockCollection.findOne).not.toHaveBeenCalled();
  });

  // Missing user ID
  test('should throw error for missing user ID', async () => {
    await expect(fetchOrderStatus({ orderId: 'order123', userId: null }, mockDb)).rejects.toThrow(
      'Invalid or missing user ID.'
    );
    expect(mockCollection.findOne).not.toHaveBeenCalled();
  });

  // Non-existent order
  test('should throw error for non-existent order', async () => {
    mockCollection.findOne.mockResolvedValue(null);

    await expect(fetchOrderStatus({ orderId: 'order999', userId: 'user456' }, mockDb)).rejects.toThrow(
      'Order not found.'
    );
    expect(mockCollection.findOne).toHaveBeenCalledWith({ _id: 'order999' });
  });

  // Unauthorized user
  test('should throw error for unauthorized user', async () => {
    const order = {
      _id: 'order123',
      userId: 'user789', // Different user
      status: 'shipped',
      items: [],
      total: 39.98,
      shippingAddress: {},
      createdAt: '2025-05-14T12:30:00Z',
      updatedAt: '2025-05-14T12:45:00Z',
    };
    mockCollection.findOne.mockResolvedValue(order);

    await expect(fetchOrderStatus({ orderId: 'order123', userId: 'user456' }, mockDb)).rejects.toThrow(
      'Unauthorized access to order.'
    );
    expect(mockCollection.findOne).toHaveBeenCalledWith({ _id: 'order123' });
  });

  // Database error
  test('should throw error for database failure', async () => {
    mockCollection.findOne.mockRejectedValue(new Error('Database connection failed'));

    await expect(fetchOrderStatus({ orderId: 'order123', userId: 'user456' }, mockDb)).rejects.toThrow(
      'Failed to retrieve order status: Database connection failed'
    );
    expect(mockCollection.findOne).toHaveBeenCalledWith({ _id: 'order123' });
  });
});