import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

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
        console.log('change');
        const loginForm = document.getElementById('loginForm');
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // Signed in
                    const user = userCredential.user;
                    alert('Login successful!');
                    window.location.href = '/login_success.html';
                    // window.location.href = '/dashboard.html'; // optional redirect, replace with your desired page
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    alert(`Login failed: ${errorMessage}`);
                });
        });