/**
 * @jest-environment node
 */
const { clearCart } = require('../src/clearCart');

describe('clearCart', () => {
  it('should return an empty array when called', () => {
    const result = clearCart();
    expect(result).toEqual([]);
  });

  it('should not return null or undefined', () => {
    const result = clearCart();
    expect(result).not.toBeNull();
    expect(result).not.toBeUndefined();
  });

  it('should always return a new array', () => {
    const result = clearCart();
    expect(Array.isArray(result)).toBe(true);
  });
});
