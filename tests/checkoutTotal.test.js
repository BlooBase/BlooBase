/**
 * @jest-environment node
 */
const { checkoutTotal } = require('../src/checkoutTotal');

describe('checkoutTotal', () => {
  it('should return 0 for an empty cart', () => {
    const cart = [];
    const result = checkoutTotal(cart);
    expect(result).toBe(0);
  });

  it('should return 0 if cartItems is not an array', () => {
    const result = checkoutTotal(null);
    expect(result).toBe(0);
  });

  it('should calculate total for a cart with multiple items', () => {
    const cart = [
      { price: 100, quantity: 2 }, 
      { price: 50, quantity: 1 }    
    ];
    const result = checkoutTotal(cart);
    expect(result).toBe(250);
  });

  it('should handle items with missing price or quantity safely', () => {
    const cart = [
      { price: 100 },         
      { quantity: 3 },       
      { price: 20, quantity: 2 } 
    ];
    const result = checkoutTotal(cart);
    expect(result).toBe(40);
  });

  it('should handle items where price or quantity is zero', () => {
    const cart = [
      { price: 0, quantity: 5 },   
      { price: 30, quantity: 0 }, 
      { price: 10, quantity: 1 }   
    ];
    const result = checkoutTotal(cart);
    expect(result).toBe(10);
  });
});
