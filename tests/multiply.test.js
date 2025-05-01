/**
 * @jest-environment node
 */

const { multiply} = require('../src/multiply');
describe('multiply function', () => {
  test('multiplies two positive numbers', () => {
    expect(multiply(3, 4)).toBe(12);
  });

  test('multiplies a number by zero', () => {
    expect(multiply(5, 0)).toBe(0);
  });

  test('multiplies two negative numbers', () => {
    expect(multiply(-2, -3)).toBe(6);
  });

  test('multiplies a positive and a negative number', () => {
    expect(multiply(6, -2)).toBe(-12);
  });
});
