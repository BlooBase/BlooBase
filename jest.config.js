module.exports = {
  rootDir: './',
  collectCoverage: true,
  collectCoverageFrom: [ //parts of code you want to check covered for
    "src/**/*.{js,jsx}",
    "!src/**/*.test.js",
    "!**/node_modules/**" 

    /*'index.js',
    'sum.js', // Include other files you want to cover
    'firebase.js',
    'CreateShop.js',
    'UploadProducts.js',
    'verifyArtisan.js',
    'Search.js',
    'App.js',
    'index.js',
    'Login.js',
    'Register.js',
    'Homepage.js',
    'setupTests.js',
    'reportWebVitals.js',*/

    
  ],
  coverageReporters: ["lcov", "text"],
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest"
  }
};