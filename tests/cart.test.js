/**
 * @jest-environment node
 */
const {checkCart}= require('../src/cart_test');
describe('checkCart', () => {
    let setErrorMock;
  
    beforeEach(() => {
      setErrorMock = jest.fn(); //mock function
    });
  
    it('should return false and call setError if quantity is 0', () => {
      const result = checkCart(0, 100, setErrorMock);
      expect(result).toBe(false);
      expect(setErrorMock).toHaveBeenCalledWith("Cart is empty,please add items");
    });
  
    it('should return false and call setError if price is 0', () => {
      const result = checkCart(1, 0, setErrorMock);
      expect(result).toBe(false);
      expect(setErrorMock).toHaveBeenCalledWith("Cart is empty,please add items");
    });
  
    it('should return false and call setError if both quantity and price are 0', () => {
      const result = checkCart(0, 0, setErrorMock);
      expect(result).toBe(false);
      expect(setErrorMock).toHaveBeenCalledWith("Cart is empty,please add items");
    });
  
    it('should return true and not call setError if quantity and price are non-zero', () => {
      const result = checkCart(2, 150, setErrorMock);
      expect(result).toBe(true);
      expect(setErrorMock).not.toHaveBeenCalled();
    });
  });