module.exports = {
  rootDir: './',
  collectCoverage: true,
  collectCoverageFrom: [ //parts of code you want to check covered for
    
    //"src/**/*.{js,jsx}",
    //"!src/**/*.test.js",
    //"!src/reportWebVitals.js", //Ignore these files
    //"!src/setupTests.js", //Ignore these files
    //"!**/node_modules/**"
    //Checks all JS Files

    'src/sum.js', 
    'src/multiply.js',
    //'firebase.js',
    'src/index.js',
    'src/App.js',
    /*'index.js',
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
    //Checks specific files

    
  ],
  coverageReporters: ["lcov", "text"],
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest"
  }
};