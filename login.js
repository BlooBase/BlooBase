import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

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