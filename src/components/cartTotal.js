// src/components/cartTotal.js

const cartTotal = (items) => {
  return items.reduce((total, item) => {
    let price;

    // Safely convert item.price to a number, handling strings with currency symbols
    if (typeof item.price === 'string') {
      const cleanedPrice = item.price.replace(/[^\d.]/g, ''); // Remove non-numeric except decimal
      price = parseFloat(cleanedPrice);
    } else {
      // If it's already a number, or null/undefined, parseFloat will handle it
      price = parseFloat(item.price);
    }

    // Ensure price is a valid number; default to 0 if NaN
    price = isNaN(price) ? 0 : price;

    return total + price;
  }, 0);
};

export default cartTotal;