const { sum, subtract } = require('../sum');

describe('sum function tests', () => {
  test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3);  // Passes
  });

  test('adds 0 + 0 to equal 0', () => {
    expect(sum(0, 0)).toBe(0);  // Passes
  });

  test('adds -1 + 1 to equal 0', () => {
    expect(sum(-1, 1)).toBe(0);  // Passes
  });

  test('adds 5 + 5 to equal 15', () => {
    expect(sum(5, 5)).toBe(15);  // Fails, it should be 10
  });

  test('adds 10 + 5 to equal 15', () => {
    expect(sum(10, 5)).toBe(15);  // Passes
  });
});

describe('subtract function tests', () => {
  test('subtracts 5 - 2 to equal 3', () => {
    expect(subtract(5, 2)).toBe(3);  // Passes
  });

  test('subtracts 10 - 5 to equal 6', () => {
    expect(subtract(10, 5)).toBe(6);  // Fails, it should be 5
  });

  test('subtracts -1 - (-1) to equal 0', () => {
    expect(subtract(-1, -1)).toBe(0);  // Passes
  });
});