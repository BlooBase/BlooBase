import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBLRZEHtvWJex2S_6wUgU9-0PyUZ6XvYdc",
  authDomain: "bloobase-fc939.firebaseapp.com",
  projectId: "bloobase-fc939",
  storageBucket: "bloobase-fc939.firebasestorage.app",
  messagingSenderId: "897530812763",
  appId: "1:897530812763:web:7f5ece875f7921f7c6227e",
  measurementId: "G-YDRE0F2FHC"
};

        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);

        const loginButton = document.getElementById('loginButton');
        const signupButton = document.getElementById('signupButton');
       
        loginButton.addEventListener('click', (e) => {
            e.preventDefault(); 
            alert('Going to login page');
            window.location.href = '/login.html';
          });
          signupButton.addEventListener('click', (e) => {
            e.preventDefault(); 
            alert('Going to signup page');
            window.location.href = '/signup.html';
          });
          
          
        