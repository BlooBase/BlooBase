function cartTotal(cartItems) {
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return 0;
    }
  
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.price.replace('R', '')) || 0; // Remove "R" and convert to number
      return total + price;
    }, 0);
  }
  
  export default cartTotal;