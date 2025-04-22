module.exports = {
  rootDir: './',
  collectCoverage: true,
  collectCoverageFrom: [
    // All JS/JSX files in src except test/setup/vitals files
    "src/**/*.{js,jsx}",
    "!src/**/*.test.js",
    "!src/reportWebVitals.js",
    "!src/setupTests.js",
    "!**/node_modules/**",

    // Specific files outside `src/` directory
    "firebase.js",
    "CreateShop.js",
    "UploadProducts.js",
    "verifyArtisan.js",
    "Search.js",
    "App.js",
    "index.js",
    "Login.js",
    "Register.js",
    "Homepage.js",
  ],
  coverageReporters: ["lcov", "text"],
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest"
  },
  testEnvironment: "jsdom", // Required for React DOM testing
};
