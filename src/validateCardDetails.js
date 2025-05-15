
function validateCardDetails({ cardNumber, expiryDate, cvv, cardHolderName }) {
  const errors = [];
  let isValid = true;

  // Helper function to validate Luhn algorithm for card number
  function isValidLuhn(cardNum) {
    const cleaned = cardNum.replace(/\D/g, '');
    if (cleaned.length < 13 || cleaned.length > 19) return false;
    let sum = 0;
    let isEven = false;
    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned[i]);
      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      isEven = !isEven;
    }
    return sum % 10 === 0;
  }

  // Helper function to detect card type for CVV validation
  function getCardType(cardNum) {
    const cleaned = cardNum.replace(/\D/g, '');
    if (/^4/.test(cleaned)) return 'Visa';
    if (/^5[1-5]/.test(cleaned)) return 'MasterCard';
  
    return null;
  }

  // 1. Validate card number
  if (!cardNumber || cardNumber.replace(/\D/g, '').length === 0) {
    errors.push('Card number is required.');
    isValid = false;
  } else if (!isValidLuhn(cardNumber)) {
    errors.push('Invalid card number.');
    isValid = false;
  }

  // 2. Validate expiry date (MM/YY format)
  if (!expiryDate || !/^(0[1-9]|1[0-2])\/[0-9]{2}$/.test(expiryDate)) {
    errors.push('Invalid expiry date. Use MM/YY format.');
    isValid = false;
  } else {
    const [month, year] = expiryDate.split('/').map(Number);
    const currentDate = new Date();
    const expiry = new Date(2000 + year, month - 1);
    if (expiry < currentDate) {
      errors.push('Card has expired.');
      isValid = false;
    }
  }

  // 3. Validate CVV based on card type
  const cardType = getCardType(cardNumber);
  if (!cvv || !/^\d+$/.test(cvv)) {
    errors.push('Invalid CVV.');
    isValid = false;
  } else if (cardType === 'Amex' && cvv.length !== 4) {
    errors.push('Amex CVV must be 4 digits.');
    isValid = false;
  } else if (cardType !== 'Amex' && cvv.length !== 3) {
    errors.push('CVV must be 3 digits.');
    isValid = false;
  }

  // 4. Validate cardholder name
  if (!cardHolderName || cardHolderName.trim().length === 0) {
    errors.push('Cardholder name is required.');
    isValid = false;
  } else if (!/^[a-zA-Z\s]{2,}$/.test(cardHolderName.trim())) {
    errors.push('Invalid cardholder name.');
    isValid = false;
  }

  return {
    isValid,
    errors,
  };
}

module.exports = { validateCardDetails};