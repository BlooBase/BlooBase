// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification ,signInWithEmailAndPassword,GoogleAuthProvider,signInWithPopup, updatePassword, updateEmail,deleteUser,EmailAuthProvider,reauthenticateWithCredential} from "firebase/auth";
// Remove Firestore and Storage imports as you'll be interacting via API
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

const API_BASE_URL = 'http://localhost:5000'; // Define your backend URL

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // No direct Firestore access anymore
const storage = getStorage(app); // No direct Storage access anymore

// Utility function for making API requests
const apiRequest = async (url, method = 'GET', body = null) => {
  const headers = {
    'Content-Type': 'application/json',
    // You might need to add authorization headers if your API requires it
  };
  const config = {
    method,
    headers,
  };
  if (body) {
    config.body = JSON.stringify(body);
  }
  const response = await fetch(`${API_BASE_URL}${url}`, config); // Prepend the base URL here
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }
  return await response.json();
};

async function addUserToFirestore(userId, email, name, role,autheProvider) {
  try {
    await apiRequest('/api/users', 'POST', { userId, email, name, role, autheProvider });
    console.log("User added via API!");
  } catch (error) {
    console.error("Error adding user via API:", error);
    throw error; // Re-throw the error for the calling component to handle
  }
}

async function getUserData() {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("User is not authenticated");
  }
  try {
    const userData = await apiRequest(`/api/users/${user.uid}`);
    console.log("User data fetched via API:", userData);
    return userData;
  } catch (error) {
    console.error("Error fetching user data via API:", error);
    throw error;
  }
}

async function getUserName() {
  try {
    const userData = await getUserData();
    return userData.Name;
  } catch (error) {
    console.error("Error fetching user name via API:", error);
    return null;
  }
}

async function getUserRole() {
  try {
    const userData = await getUserData();
    return userData.Role;
  } catch (error) {
    console.error("Error fetching user role via API:", error);
    return null;
  }
}

async function getUserAuthProvider() {
  try {
    const userData = await getUserData();
    return userData.authProvider;
  } catch (error) {
    console.error("Error fetching user auth provider via API:", error);
    return null;
  }
}

const logout = async () => {
  try {
    await auth.signOut();
    console.log("User signed out");
    // Optionally call an API endpoint on your server for logout-related tasks
  } catch (error) {
    console.error("Sign-out error:", error);
  }
};

const getRoleSize = async (name) => {
  try {
    const result = await apiRequest(`/api/roles/${name}/size`); // Define this API endpoint
    console.log(`Number of ${name}:`, result.count);
    return result.count;
  } catch (error) {
    console.error(`Error fetching size of role ${name} via API:`, error);
    return 0;
  }
};

const getCollectionSize = async (name) => {
  try {
    const result = await apiRequest(`/api/collections/${name}/size`); // Define this API endpoint
    return result.count;
  } catch (error) {
    console.error(`Error fetching size of collection ${name} via API:`, error);
    return 0;
  }
};

const signupNormUser = async ({ name, email, password, confirmPassword, role }) => {
  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log(user.emailVerified);

    await sendEmailVerification(user);
    await apiRequest('/api/users', 'POST', { userId: user.uid, email, name, role, autheProvider: 'Firebase Auth' });
    alert("Account created! Please check your email for verification.");
  } catch (error) {
    alert(`Signup failed: ${error.message}`);
  }
};

const GoogleSignup = async (role) => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const existingUser = await apiRequest(`/api/users/${user.uid}`).catch(() => null);

    if (!existingUser) {
      await apiRequest('/api/users', 'POST', {
        userId: user.uid,
        email: user.email,
        name: user.displayName || "Google User",
        role: role,
        authProvider: "Google",
      });
    }

    alert("Signed in with Google!");
  } catch (error) {
    console.error("Google Sign-in Error:", error);
    alert(`Google Sign-in failed: ${error.message}`);
  }
};

const loginNormUser = async ({ email, password }) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (!user.emailVerified) {
      alert("Please verify your email before logging in.");
      await auth.signOut();
      throw new Error("Email not verified");
    }

    alert('Login successful!');
    return user;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

const updateCredentials = async ({ name, email, password, newpassword }) => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  try {
    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email;
    if (newpassword) updates.newpassword = newpassword;
    if (password && (email || newpassword)) updates.password = password; // Need current password for email/password update

    await apiRequest(`/api/users/${user.uid}`, 'PATCH', updates);
    alert("Credentials updated successfully!");
  } catch (error) {
    console.error("Error updating credentials via API:", error);
    alert(`Error updating credentials: ${error.message}`);
    throw error;
  }
};

const deleteAccount = async (currentPassword) => {
  const user = auth.currentUser;
  if (!user || !user.email) throw new Error("User not authenticated");

  try {
    await apiRequest(`/api/users/${user.uid}`, 'DELETE', { currentPassword });
    await deleteUser(user);
    alert("Account deleted successfully!");
  } catch (error) {
    console.error("Error deleting account via API:", error);
    alert(`Error deleting account: ${error.message}`);
    throw error;
  }
};

const GoogleLogin = async () => {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const existingUser = await apiRequest(`/api/users/${user.uid}`).catch(() => null);

    if (!existingUser) {
      alert("User does not exist (likely a signup issue).");
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
  app, // You might need the app instance for other Firebase services
   db, // No direct export
   storage, // No direct export
   doc, // No direct export
  setDoc, // No direct export
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