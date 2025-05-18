import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, deleteUser} from "firebase/auth";
import { getFirestore, doc, setDoc, getDocs,  collection,deleteDoc,query,where,updateDoc,increment,getDoc} from "firebase/firestore";
import { getStorage, ref,uploadBytes,getDownloadURL } from "firebase/storage";

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

//const apiURL = 'https://bloobaseapi-cfbrbub4fzg5b8aq.southafricanorth-01.azurewebsites.net'
const apiURL = 'http://localhost:5000'
//API requests fucntion
export const apiRequest = async (url, method = 'GET', body = null, isFormData = false) => {
  const headers = {};

  const currentUser = auth.currentUser;
  if (currentUser) {
    const token = await currentUser.getIdToken();
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
  };

  if (body) {
    if (isFormData) {
      config.body = body; // leave FormData as is
      // Do not set Content-Type for FormData, browser will set it with boundary
    } else {
      headers['Content-Type'] = 'application/json';
      config.body = JSON.stringify(body);
    }
  }

  const response = await fetch(`${apiURL}${url}`, config);

  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorMessage;
    } catch (_) {}
    throw new Error(errorMessage);
  }

  return await response.json();
};

export const uploadFile = async (file, folder) => {
  if (!auth.currentUser) throw new Error("User not authenticated");

  const formData = new FormData();
  formData.append('image', file);
  formData.append('folder', folder);

  const response = await apiRequest('/api/upload', 'POST', formData, true);
  return response.path; // assuming backend returns { path: '...' }
};


export async function addUserToFirestore(userId, email, name, role, authProvider) {
  try {
    await apiRequest('/api/users', 'POST', { userId, email, name, role, authProvider });
    console.log("User added via API!");
  } catch (error) {
    console.error("Error adding user via API:", error);
    throw error; // Re-throw the error for the calling component to handle
  }
}

export async function getUserData() {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("User is not authenticated");
  }
  try {
    const userData = await apiRequest(`/api/users/${user.uid}`);
    
    return userData;
  } catch (error) {
    console.error("Error fetching user data via API:", error);
    throw error;
  }
}

export async function getUserName() {
  try {
    const userData = await getUserData();
    return userData.Name;
  } catch (error) {
    console.error("Error fetching user name via API:", error);
    return null;
  }
}

export async function getUserRole() {
  try {
    const userData = await getUserData();
    return userData.Role;
  } catch (error) {
    console.error("Error fetching user role via API:", error);
    return null;
  }
}

export async function getUserAuthProvider() {
  try {
    const userData = await getUserData();
    return userData.authProvider;
  } catch (error) {
    console.error("Error fetching user auth provider via API:", error);
    return null;
  }
}

export const logout = async () => {
  try {
    await auth.signOut();
    console.log("User signed out");
    // Optionally call an API endpoint on your server for logout-related tasks
  } catch (error) {
    console.error("Sign-out error:", error);
  }
};

export const getRoleSize = async (name) => {
  try {
    const result = await apiRequest(`/api/roles/${name}/size`); // Define this API endpoint
    
    return result.count;
  } catch (error) {
    console.error(`Error fetching size of role ${name} via API:`, error);
    return 0;
  }
};

export const getCollectionSize = async (name) => {
  try {
    const result = await apiRequest(`/api/collections/${name}/size`); // Define this API endpoint
    return result.count;
  } catch (error) {
    console.error(`Error fetching size of collection ${name} via API:`, error);
    return 0;
  }
};

export const signupNormUser = async ({ name, email, password, confirmPassword, role }) => {
  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await sendEmailVerification(user);

    // Force refresh the ID token to ensure it's up-to-date
    const token = await user.getIdToken(true);

    await apiRequest('/api/users', 'POST', { userId: user.uid, email, name, role, authProvider: 'Firebase Auth' }, false, token); // Pass the token directly

    alert("Account created! Please check your email for verification.");
  } catch (error) {
    alert(`Signup failed: ${error.message}`);
  }
};
export const GoogleSignup = async (role) => {
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

export const loginNormUser = async ({ email, password }) => {
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

export const updateCredentials = async ({ name, email, password, newpassword }) => {
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

export const deleteAccount = async (currentPassword) => {
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

export const GoogleLogin = async () => {
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

//New functions


/**
 * Uploads a file to Firebase Storage and returns the storage path (not the URL).
 * @param {File} file - The file object to upload.
 * @param {string} folder - Folder path in Firebase Storage (e.g., "shop_images").
 * @returns {Promise<string>} - The full storage path (e.g., "shop_images/abc123_file.png").
 */
export async function uploadImage(file, folder = "shop_images") {
  try {
    const uniqueFileName = `${crypto.randomUUID()}_${file.name}`;
    const storagePath = `${folder}/${uniqueFileName}`;
    const fileRef = ref(storage, storagePath);

    await uploadBytes(fileRef, file);

    return storagePath; // This is what you'll store in Firestore
  } catch (error) {
    console.error("Image upload failed:", error);
    throw error;
  }
}
export const upsertSellerCard = async (cardData) => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  let imagePath = cardData.image;

  // Preserve image upload logic
  if (cardData.image instanceof File) {
    imagePath = await uploadImage(cardData.image, "shop_images");
  }

  // Use apiRequest to send the data to the backend
  await apiRequest(`/api/seller/card`, "POST", {
    image: imagePath,
    color: cardData.color,
    description: cardData.description,
    genre: cardData.genre,
    textColor: cardData.textColor,
    title: cardData.title,
  });
};
export const deleteSellerCard = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  await apiRequest(`/api/seller/card`, "DELETE");
};
export const addProduct = async ({ image, name, price }) => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  let imageUrl = image;
  if (image instanceof File) {
    imageUrl = await uploadImage(image, "product_images");
  }

  // Always store as "R" + number
  let randPrice = price;
  if (typeof randPrice === "number") {
    randPrice = `R${randPrice}`;
  } else if (typeof randPrice === "string") {
    randPrice = randPrice.trim();
    if (!randPrice.startsWith("R")) {
      randPrice = `R${randPrice}`;
    }
  }

  await apiRequest("/api/products", "POST", {
    image: imageUrl,
    name,
    price: randPrice,
  });
};
export const getSellerProducts = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");
  
  const rawProducts = await apiRequest("/api/products/seller");

  const products = [];
  for (const data of rawProducts) {
    // Convert image path to download URL if needed
    if (data.image && typeof data.image === "string" && !data.image.startsWith("http")) {
      try {
        data.image = await getDownloadURL(ref(storage, data.image));
      } catch {
        data.image = null;
      }
    }

    // Convert price from "R123" to 123 (number)
    let price = data.price;
    if (typeof price === "string" && price.startsWith("R")) {
      price = Number(price.slice(1));
    }

    products.push({ ...data, price });
  }

  return products;
};
export const updateProduct = async ({ id, image, name, price }) => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  let imageUrl = image;
  if (image instanceof File) {
    imageUrl = await uploadImage(image, "product_images");
  }

  // Format price as "R123"
  let formattedPrice = price;
  if (typeof formattedPrice === "number") {
    formattedPrice = `R${formattedPrice}`;
  } else if (typeof formattedPrice === "string") {
    formattedPrice = formattedPrice.trim();
    if (!formattedPrice.startsWith("R")) {
      formattedPrice = `R${formattedPrice}`;
    }
  }

  await apiRequest(`/api/products/${id}`, "PUT", {
    image: imageUrl,
    name,
    price: formattedPrice,
  });
};
export const deleteProduct = async (id) => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  await apiRequest(`/api/products/${id}`, "DELETE");
};
export const getSellerCard = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const data = await apiRequest("/api/seller/card");

  // Convert image path to download URL if necessary
  if (data?.image) {
    try {
      data.image = await getDownloadURL(ref(storage, data.image));
    } catch (e) {
      console.error("Failed to get image download URL:", e);
      data.image = null;
    }
  }

  return data;
};





export {
  auth,
  db,
  storage,
  doc,
  setDoc,
  collection,
  ref,
  getDocs,
  deleteDoc,
  query,
  where,
  updateDoc,
  increment,
  getDoc
};