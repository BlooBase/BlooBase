module.exports = {
  rootDir: './',
  collectCoverage: true,
  collectCoverageFrom: [
     'src/checkPasswordStrength.js',
    'src/firebase/uploadImage.js',
    'src/cart_test.js',
    'src/checkoutTotal.js',
    'src/clearCart.js',
    'src/Api_GET.js',
     'src/components/Login.js',
    '!**/node_modules/**',
    '!src/**/*.test.js', // Exclude test files from coverage
    '!src/reportWebVitals.js', // Exclude reportWebVitals
    '!src/setupTests.js', // Exclude setupTests
  ],
  coverageReporters: ['lcov', 'text'],
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest', // Transform JS/JSX/TS/TSX files
  },
  testEnvironment: 'jsdom', // Required for React components
  setupFilesAfterEnv: ['./src/setupTests.js'], // Include Jest DOM extensions
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // Mock CSS imports
  },
};