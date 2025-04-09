// jest.config.js
module.exports = {
    collectCoverage: true,
    collectCoverageFrom: [
        "**/*.js",               // Include all JS files
        "!**/node_modules/**",   // Exclude dependencies
        "!**/tests/**",          // Optional: exclude test files if stored separately
        "!jest.config.js"        // Don't try to collect coverage on this config file
      ],
    coverageDirectory: 'coverage', // Directory where Jest should output its coverage files
    coverageReporters: ['lcov', 'text', 'json'],
    testEnvironment: 'node', // Optional: specify your test environment (e.g., 'node', 'jsdom')
  };
  