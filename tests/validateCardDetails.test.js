/**
 * @jest-environment node
 */
const { validateCardDetails } = require('../src/validateCardDetails');

describe('validateCardDetails', () => {
  // Valid test case
  test('should validate correct card details', () => {
    const cardDetails = {
      cardNumber: '4532015112830366', // Valid Visa test card
      expiryDate: '12/27',
      cvv: '123',
      cardHolderName: 'Cynthia Samuels',
    };
    const result = validateCardDetails(cardDetails);
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  // Invalid card number
  test('should reject invalid card number', () => {
    const cardDetails = {
      cardNumber: '1234567890123456', 
      expiryDate: '12/27',
      cvv: '123',
      cardHolderName: 'Tetelo Chuene',
    };
    const result = validateCardDetails(cardDetails);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Invalid card number.');
  });

  // Empty card number
  test('should reject empty card number', () => {
    const cardDetails = {
      cardNumber: '',
      expiryDate: '12/27',
      cvv: '123',
      cardHolderName: 'Luthando Msiza',
    };
    const result = validateCardDetails(cardDetails);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Card number is required.');
  });

  // Invalid expiry date format
  test('should reject invalid expiry date format', () => {
    const cardDetails = {
      cardNumber: '4532015112830366',
      expiryDate: '13/25', // Invalid month
      cvv: '123',
      cardHolderName: 'John Molapo',
    };
    const result = validateCardDetails(cardDetails);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Invalid expiry date. Use MM/YY format.');
  });

  // Expired card
  test('should reject expired card', () => {
    const cardDetails = {
      cardNumber: '4532015112830366',
      expiryDate: '12/20', // Expired
      cvv: '123',
      cardHolderName: 'Katleho Molapo',
    };
    const result = validateCardDetails(cardDetails);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Card has expired.');
  });

  // Invalid CVV for Visa
  test('should reject invalid CVV for Visa', () => {
    const cardDetails = {
      cardNumber: '4532015112830366', // Visa
      expiryDate: '12/27',
      cvv: '12', // Too short
      cardHolderName: 'John Doe',
    };
    const result = validateCardDetails(cardDetails);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('CVV must be 3 digits.');
  });

  // Non-numeric CVV
  test('should reject non-numeric CVV', () => {
    const cardDetails = {
      cardNumber: '4532015112830366',
      expiryDate: '12/27',
      cvv: '12a',
      cardHolderName: 'James George',
    };
    const result = validateCardDetails(cardDetails);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Invalid CVV.');
  });

  // Empty cardholder name
  test('should reject empty cardholder name', () => {
    const cardDetails = {
      cardNumber: '4532015112830366',
      expiryDate: '12/27',
      cvv: '123',
      cardHolderName: '',
    };
    const result = validateCardDetails(cardDetails);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Cardholder name is required.');
  });

  // Invalid cardholder name
  test('should reject invalid cardholder name', () => {
    const cardDetails = {
      cardNumber: '4532015112830366',
      expiryDate: '12/27',
      cvv: '123',
      cardHolderName: 'J', // Too short
    };
    const result = validateCardDetails(cardDetails);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Invalid cardholder name.');
  });

  // Multiple invalid fields
  test('should handle multiple invalid fields', () => {
    const cardDetails = {
      cardNumber: '1234567890123456', // Invalid Luhn
      expiryDate: '12/20', // Expired
      cvv: '12', // Too short
      cardHolderName: '',
    };
    const result = validateCardDetails(cardDetails);
    expect(result.isValid).toBe(false);
    expect(result.errors).toEqual([
      'Invalid card number.',
      'Card has expired.',
      'CVV must be 3 digits.',
      'Cardholder name is required.',
    ]);
  });
});