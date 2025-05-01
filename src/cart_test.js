function checkCart(quantity, price) {
    if (quantity === 0 || price === 0) {
      setError("Cart is empty,please add items");
      return false;
    }
    return true;
  }
  
  module.exports = {checkCart};