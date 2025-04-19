import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { getFirestore, doc, setDoc,serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js"; // Import Firestore


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
const db = getFirestore(app);

const signupForm = document.getElementById('signupForm');
async function addUserToFirestore(userId, email,name,role) {
    try {
        const userDocRef = doc(db, "Users", userId); // Document reference
        console.log('here');
        const userData = {
            Email: email,
            Name:name,
            joinedAt: serverTimestamp() ,
            authProvider: 'FireBase Auth',
            Role :role,
            // Add other default properties here if needed
        };
        console.log('here1')
        await setDoc(userDocRef, userData); // Set document data
        console.log("User added to Firestore!");
        console.log("Firestore write successful for user:", userId); // Added success log
    } catch (error) {
        console.error("Error adding user to Firestore:", error);
    }
}
function isUserAuthenticated() {
    return new Promise((resolve, reject) => {
      const auth = getAuth();
      auth.authStateReady().then(() => {
        const user = auth.currentUser;
        resolve(user !== null);
      }).catch(reject);
    });
  }
  


signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const role = document.getElementById('userRole').value;
    const name = document.getElementById('signupName').value;
    if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
    }

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;

            console.log(user.uid);
            console.log(email);
            console.log(name);
            console.log(role)
            addUserToFirestore(user.uid, email,name,role);
            alert("Account created!");
            
           
        })
        .catch((error) => {
            alert(`Signup failed: ${error.message}`);
        });
});
const navigateButton = document.getElementById('movepagebutton')
navigateButton.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent default link behavior
  
    isUserAuthenticated()
      .then((authenticated) => {
        if (authenticated) {
          // User is logged in, redirect to the home page
          alert('Going to Home Page');
          window.location.href = '/loginsucccess.html';
        } else {
          // User is not logged in, show an alert
          alert('You must be logged in to go to the Home Page.');
        }
      })
      .catch((error) => {
        console.error("Error checking authentication:", error);
        alert("An error occurred. Please try again."); // User-friendly error message
      });
  });
