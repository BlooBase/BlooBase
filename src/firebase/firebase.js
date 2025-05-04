
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification ,signInWithEmailAndPassword,GoogleAuthProvider,signInWithPopup, updatePassword, updateEmail,deleteUser,EmailAuthProvider,reauthenticateWithCredential} from "firebase/auth";
import { getFirestore,updateDoc, doc, setDoc, serverTimestamp, getDoc, getCountFromServer,where,query, collection,deleteDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";

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
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

async function addUserToFirestore(userId, email, name, role,autheProvider) {
  try {
    const userDocRef = doc(db, "Users", userId);
    const userData = {
      Email: email,
      Name: name,
      joinedAt: serverTimestamp(),
      authProvider: autheProvider,
      Role: role,
    };
    await setDoc(userDocRef, userData);
    console.log("User added to Firestore!");
  } catch (error) {
    console.error("Error adding user to Firestore:", error);
  }
}
// Function to get user data from Firestore
async function getUserData() {
  const user = auth.currentUser; // Accessing the authenticated user
  if (!user) {
    throw new Error("User is not authenticated");
  }

  const userDocRef = doc(db, "Users", user.uid);
  const userDoc = await getDoc(userDocRef);

  if (!userDoc.exists()) {
    throw new Error("User document does not exist in Firestore");
  }
  console.log("Here")
  console.log(userDoc.data().Role)
  console.log("Current user:", auth.currentUser);

  return userDoc.data(); // Returns the user data from Firestore
}

// Function to get the user's name
async function getUserName() {
  try {
    const userData = await getUserData(); // Await the user data
    return userData.Name; // Return the name from the user data
  } catch (error) {
    console.error("Error fetching user name:", error);
    return null; // In case of error, return null
  }
}
async function getUserRole() {
  try {
    const userData = await getUserData();
    return userData.Role; 
  } catch (error) {
    console.error("Error fetching user name:", error);
    return null; 
  }
}
async function getUserAuthProvider() {
  try {
    const userData = await getUserData(); 
    return userData.authProvider;
  } catch (error) {
    console.error("Error fetching user auth provider:", error);
    return null; 
  }
  
}
const logout = async () => {
  try {
    await auth.signOut();
    console.log("User signed out");
    // Optionally redirect or update UI state here
  } catch (error) {
    console.error("Sign-out error:", error);
  }
};
const getRoleSize = async(name)=> {
  const usersRef = collection(db, "Users"); 
  const adminQuery = query(usersRef, where("Role", "==", name));
  const snapshot = await getCountFromServer(adminQuery);
  console.log("Number of ",name,": ", snapshot.data().count);
  return snapshot.data().count;

}

const getCollectionSize= async(name)=>{
  const collectionRef = collection(db,name);
  const collectionQuery = query(collectionRef);
  const snapshot = await getCountFromServer(collectionQuery);
  return snapshot.data().count;
}

const signupNormUser = ({ name, email, password, confirmPassword, role }) => {
  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log(user.emailVerified);
      // Send email verification
      sendEmailVerification(user)
        .then(() => {
          // Add the user to Firestore after verification email is sent
          addUserToFirestore(user.uid, email, name, role, 'Firebase Auth');
          alert("Account created! Please check your email for verification.");
        })
        .catch((error) => {
          console.error("Error sending verification email:", error);
          alert("Error sending verification email.");
        });
    })
    .catch((error) => {
      alert(`Signup failed: ${error.message}`);
    });
};
const GoogleSignup = async (role) => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    if (result._tokenResponse.isNewUser) {
      await addUserToFirestore(
        user.uid,
        user.email,
        user.displayName || "Google User",
        role,
        "Google"
      );
    }

    alert("Signed in with Google!");
  } catch (error) {
    console.error("Google Sign-in Error:", error);
    alert(`Google Sign-in failed: ${error.message}`);
  }
};
const loginNormUser = async ({ email, password }) => {
  try {

    // Perform the email/password sign-in
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    // Check email verification
    if (!user.emailVerified) {
      alert("Please verify your email before logging in.");
      // Sign out the user who just signed in but isn't verified
      await auth.signOut();
      // Throw an error to be caught by the caller (Login.js)
      throw new Error("Email not verified");
    }

    alert('Login successful!');
    // Return the authenticated user object
    return user;

  } catch (error) {
    console.error("Login failed:", error);
    // Re-throw the error so it can be caught in the component
    throw error;
  }
};


const updateCredentials = async ({ name, email, password, newpassword }) => {
  const user = auth.currentUser;
  const path = "Users/" + user.uid;
  const docRef = doc(db, ...path.split("/"));

  try {
    if (name) {
      await updateDoc(docRef, { Name: name });
      console.log("Name updated in Firestore.");
    }

    if (email && email !== user.email) {
      await reauthenticateUser(password);
      await updateEmail(user, email);
      await updateDoc(docRef, { Email: email });
      console.log("Email updated.");
    }

    if (newpassword && password) {
      await reauthenticateUser(password);
      await updatePassword(user, newpassword);
      console.log("Password updated.");
    }
  } catch (error) {
    console.error("Error updating credentials:", error);
    throw error;
  }
};

const reauthenticateUser = async (currentPassword) => {
  const user = auth.currentUser;
  if (!user || !user.email) throw new Error("User not authenticated");
  const credential = EmailAuthProvider.credential(user.email, currentPassword);
  await reauthenticateWithCredential(user, credential);
};

const deleteAccount = async (currentPassword) => {
  const user = auth.currentUser;
  if (!user || !user.email) throw new Error("User not authenticated");

  const credential = EmailAuthProvider.credential(user.email, currentPassword);
  await reauthenticateWithCredential(user, credential);

  await deleteDoc(doc(db, "Users", user.uid));
  await deleteUser(user);
};


const GoogleLogin = async () => {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  try {

    // Perform Google login
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const userDocRef = doc(db, "Users", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      alert("User does not exist");
      return;
    }
   
    alert("Logged in with Google!");
  } catch (error) {
    console.error("Google Login Error:", error);
    alert(`Google Login failed: ${error.message}`);
  }
};

export {
  auth,
  db,
  storage,
  doc,
  setDoc,
  signupNormUser,
  addUserToFirestore,
  loginNormUser,
  GoogleSignup,
  GoogleLogin,
  getUserName,
  getUserRole,
  logout,
  getRoleSize,
  getUserAuthProvider,
  updateCredentials,
  deleteAccount,
  getCollectionSize
};
