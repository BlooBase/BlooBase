/**
 * @jest-environment node
 */
const { isPasswordStrong } = require('../src/checkPasswordStrength');

test("Valid password returns true", () => {
  expect(isPasswordStrong("wfgQF11!")).toBe(true);
});

test("Password with no number returns false", () => {
  expect(isPasswordStrong("Pnfge@!v")).toBe(false);
});

test("Password with no special character returns false", () => {
  expect(isPasswordStrong("QFxqgq142d")).toBe(false);
});

test("Short password returns false", () => {
  expect(isPasswordStrong("Vbdt2#")).toBe(false);
});
