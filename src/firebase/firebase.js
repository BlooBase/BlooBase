// firebase.js (in src/firebase/ directory)
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBLRZEHtvWJex2S_6wUgU9-0PyUZ6XvYdc",
  authDomain: "bloobase-fc939.firebaseapp.com",
  projectId: "bloobase-fc939",
  storageBucket: "bloobase-fc939.appspot.com",
  messagingSenderId: "897530812763",
  appId: "1:897530812763:web:7f5ece875f7921f7c6227e",
  measurementId: "G-YDRE0F2FHC"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

async function addUserToFirestore(userId, email, name, role) {
  try {
    const userDocRef = doc(db, "Users", userId);
    const userData = {
      Email: email,
      Name: name,
      joinedAt: serverTimestamp(),
      authProvider: "Firebase Auth",
      Role: role,
    };
    await setDoc(userDocRef, userData);
    console.log("User added to Firestore!");
  } catch (error) {
    console.error("Error adding user to Firestore:", error);
  }
}

const signupNormUser = ({ name, email, password, confirmPassword, role }) => {
  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      addUserToFirestore(user.uid, email, name, role);
    
    })
    .catch((error) => {
      alert(`Signup failed: ${error.message}`);
    });
};

export {
  auth,
  db,
  storage,
  doc,
  setDoc,
  signupNormUser,
  addUserToFirestore
};
