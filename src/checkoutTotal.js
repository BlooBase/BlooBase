function checkoutTotal(cartItems) {
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return 0;
    }
  
    return cartItems.reduce((total, item) => {
      const itemTotal = (item.price || 0) * (item.quantity || 0);
      return total + itemTotal;
    }, 0);
  }
  
  module.exports = { checkoutTotal };
  