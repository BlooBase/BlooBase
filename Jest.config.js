module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.js',  // Includes all .js files in the project directory and subdirectories
  ],
  coverageReporters: ["lcov", "text"],
};
