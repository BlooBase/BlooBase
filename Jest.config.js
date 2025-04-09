// jest.config.js
module.exports = {
    collectCoverage: true,
    collectCoverageFrom: [
        'index.js',
        'sum.js', // Include other files you want to cover
      ],
    coverageReporters: ["lcov", "text"],
  };
  