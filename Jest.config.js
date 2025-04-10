module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [ //parts of code you want to check covered for
    //'**/*.js',  // Includes all .js files in the project directory and subdirectories

     'index.js',
      'sum.js', // Include other files you want to cover

  ],
  coverageReporters: ["lcov", "text"],
};
