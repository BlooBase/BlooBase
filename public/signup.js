import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

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

const signupForm = document.getElementById('signupForm');
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
    }

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            alert("Account created!");
            window.location.href = "login.html";
        })
        .catch((error) => {
            alert(`Signup failed: ${error.message}`);
        });
});