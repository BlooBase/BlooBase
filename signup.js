import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBZF6B4SKasuGtqc3pVDnuivjsF0txDgCM",
  authDomain: "bloobasetest-82497.firebaseapp.com",
  projectId: "bloobasetest-82497",
  storageBucket: "bloobasetest-82497.firebasestorage.app",
  messagingSenderId: "982771689968",
  appId: "1:982771689968:web:a516d96eed7b8093729535",
  measurementId: "G-5GZB24CC92"
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