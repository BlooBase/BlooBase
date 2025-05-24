import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, deleteUser} from "firebase/auth";
import { getFirestore, doc, setDoc, getDocs, collection,deleteDoc,query,where,updateDoc,increment,getDoc} from "firebase/firestore";
import { getStorage, ref,uploadBytes,getDownloadURL } from "firebase/storage";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

//const apiURL = 'http://localhost:5000'
const apiURL = 'https://bloobaseapi-cfbrbub4fzg5b8aq.southafricanorth-01.azurewebsites.net'

/**
 * Makes an API request to the backend.
 * @param {string} url - The API endpoint URL.
 * @param {string} method - The HTTP method (GET, POST, PUT, DELETE, PATCH).
 * @param {object | FormData | null} body - The request body.
 * @param {boolean} isFormData - True if the body is FormData, false otherwise.
 * @returns {Promise<object>} A promise that resolves to the JSON response from the API.
 * @throws {Error} If the API response is not OK.
 */
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
      config.body = body;
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

/**
 * Uploads a file to Firebase Storage via an API endpoint.
 * @param {File} file - The file to upload.
 * @param {string} folder - The folder in Firebase Storage to upload the file to.
 * @returns {Promise<string>} A promise that resolves to the path of the uploaded file.
 * @throws {Error} If the user is not authenticated or if the upload fails.
 */
export const uploadFile = async (file, folder) => {
  if (!auth.currentUser) throw new Error("User not authenticated");

  const formData = new FormData();
  formData.append('image', file);
  formData.append('folder', folder);

  const response = await apiRequest('/api/upload', 'POST', formData, true);
  return response.path;
};

/**
 * Adds a new user's data to Firestore via an API.
 * @param {string} userId - The Firebase Authentication user ID.
 * @param {string} email - The user's email.
 * @param {string} name - The user's name.
 * @param {string} role - The user's role.
 * @param {string} authProvider - The authentication provider  "Firebase Auth" or "Google"
 * @returns {Promise<void>} A promise that resolves when the user is added.
 * @throws {Error} If there's an error adding the user.
 */
export async function addUserToFirestore(userId, email, name, role, authProvider) {
  try {
    await apiRequest('/api/users', 'POST', { userId, email, name, role, authProvider });
    console.log("User added via API!");
  } catch (error) {
    console.error("Error adding user via API:", error);
    throw error;
  }
}

/**
 * Fetches the current user's data from the backend.
 * @returns {Promise<object>} A promise that resolves to the user's data.
 * @throws {Error} If the user is not authenticated or if fetching fails.
 */
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

/**
 * Fetches the current user's name.
 * @returns {Promise<string | null>} A promise that resolves to the user's name, or null if an error occurs.
 */
export async function getUserName() {
  try {
    const userData = await getUserData();
    return userData.Name;
  } catch (error) {
    console.error("Error fetching user name via API:", error);
    return null;
  }
}

/**
 * Fetches the current user's role.
 * @returns {Promise<string | null>} A promise that resolves to the user's role, or null if an error occurs.
 */
export async function getUserRole() {
  try {
    const userData = await getUserData();
    return userData.Role;
  } catch (error) {
    console.error("Error fetching user role via API:", error);
    return null;
  }
}

/**
 * Fetches the current user's authentication provider.
 * @returns {Promise<string | null>} A promise that resolves to the user's authentication provider, or null if an error occurs.
 */
export async function getUserAuthProvider() {
  try {
    const userData = await getUserData();
    return userData.authProvider;
  } catch (error) {
    console.error("Error fetching user auth provider via API:", error);
    return null;
  }
}

/**
 * Logs out the current user from Firebase Authentication.
 * @returns {Promise<void>} A promise that resolves when the user is signed out.
 */
export const logout = async () => {
  try {
    await auth.signOut();
    console.log("User signed out");
  } catch (error) {
    console.error("Sign-out error:", error);
  }
};

/**
 * Gets the number of users with a specific role.
 * @param {string} name - The name of the role.
 * @returns {Promise<number>} A promise that resolves to the count of users with the specified role.
 */
export const getRoleSize = async (name) => {
  try {
    const result = await apiRequest(`/api/roles/${name}/size`);
    
    return result.count;
  } catch (error) {
    console.error(`Error fetching size of role ${name} via API:`, error);
    return 0;
  }
};

/**
 * Gets the size (number of documents) of a collection in the database.
 * @param {string} name - The name of the collection.
 * @returns {Promise<number>} A promise that resolves to the count of documents in the collection.
 */
export const getCollectionSize = async (name) => {
  try {
    const result = await apiRequest(`/api/collections/${name}/size`);
    return result.count;
  } catch (error) {
    console.error(`Error fetching size of collection ${name} via API:`, error);
    return 0;
  }
};

/**
 * Signs up a new user with email and password, and sends an email verification.
 * @param {object} userData - The user's signup data, including name, email, password, confirmPassword, and role.
 * @returns {Promise<boolean>} A promise that resolves to true on successful signup, false otherwise.
 */
export const signupNormUser = async ({ name, email, password, confirmPassword, role }) => {
  if (password !== confirmPassword) {
    toast.error("Passwords do not match");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await sendEmailVerification(user);

    const token = await user.getIdToken(true);

    await apiRequest('/api/users', 'POST', { userId: user.uid, email, name, role, authProvider: 'Firebase Auth' }, false, token);

    toast.success("Account created! Please check your email for verification.");
    return true;
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      toast.error("Email already in use");
    } else {
      toast.error(`Signup failed: ${error.message}`);
    }
    return false;
  }
};

/**
 * Signs up a user using Google authentication.
 * @param {string} role - The role to assign to the user.
 * @returns {Promise<boolean>} A promise that resolves to true on successful signup/login, false otherwise.
 */
export const GoogleSignup = async (role) => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    let existingUser = await apiRequest(`/api/users/${user.uid}`).catch(() => null);

    if (!existingUser) {
      await apiRequest('/api/users', 'POST', {
        userId: user.uid,
        email: user.email,
        name: user.displayName || "Google User",
        role: role,
        authProvider: "Google",
      });
      existingUser = await apiRequest(`/api/users/${user.uid}`);
    }

    return true;
  } catch (error) {
    if (error.code === "auth/popup-closed-by-user") {
      return false;
    }
    console.error("Google Sign-up failed:", error);
    toast.error(`Google sign in failed: ${error.message}`);
    return false;
  }
};

/**
 * Logs in a user with email and password.
 * @param {object} credentials - The user's login credentials, including email and password.
 * @returns {Promise<object>} A promise that resolves to the authenticated user object.
 * @throws {Error} If login fails or email is not verified.
 */
export const loginNormUser = async ({ email, password }) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (!user.emailVerified) {
      await auth.signOut();
      throw new Error("Please verify your email before logging in.");
    }

    return user;
  } catch (error) {
    let message = "";
    if (error.code === "auth/invalid-credential") {
      message = "Invalid sign in credentials";
    } else if (error.message !== "Please verify your email before logging in.") {
      message = `Login failed: ${error.message}`;
    } else {
      message = error.message;
    }
    throw new Error(message);
  }
};

/**
 * Updates a user's credentials (name, email, password).
 * @param {object} updates - An object containing the fields to update, including name, email, password, and newpassword.
 * @returns {Promise<void>} A promise that resolves when the credentials are updated.
 * @throws {Error} If the user is not authenticated or if the update fails.
 */
export const updateCredentials = async ({ name, email, password, newpassword }) => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  try {
    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email;
    if (newpassword) updates.newpassword = newpassword;
    if (password && (email || newpassword)) updates.password = password;

    await apiRequest(`/api/users/${user.uid}`, 'PATCH', updates);
  } catch (error) {
    console.error("Error updating credentials via API:", error);
    throw error;
  }
};

/**
 * Deletes the current user's account.
 * @param {string} currentPassword - The current password of the user for re-authentication.
 * @returns {Promise<void>} A promise that resolves when the account is deleted.
 * @throws {Error} If the user is not authenticated or if the deletion fails.
 */
export const deleteAccount = async (currentPassword) => {
  const user = auth.currentUser;
  if (!user || !user.email) throw new Error("User not authenticated");

  try {
    await apiRequest(`/api/users/${user.uid}`, 'DELETE', currentPassword ? { currentPassword } : undefined);
    await deleteUser(user);
  } catch (error) {
    console.error("Error deleting account via API:", error);
    toast.error(`Error deleting account: ${error.message}`);
    throw error;
  }
};

/**
 * Logs in a user using Google authentication.
 * @returns {Promise<boolean>} A promise that resolves to true on successful login, false otherwise.
 */
export const GoogleLogin = async () => {
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const existingUser = await apiRequest(`/api/users/${user.uid}`).catch(() => null);

    if (!existingUser) {
      toast.error("Sign up first");
      return false;
    }

    return true;
  } catch (error) {
    if (error.code === "auth/popup-closed-by-user") {
      return false;
    }
    console.error("Google Login Error:", error);
    toast.error(`Google Login failed: ${error.message}`);
    return false;
  }
};

/**
 * Uploads a file to Firebase Storage and returns the storage path (not the URL).
 * @param {File} file - The file object to upload.
 * @param {string} folder - Folder path in Firebase Storage
 * @returns {Promise<string>} - The full storage path 
 * @throws {Error} If the image upload fails.
 */
export async function uploadImage(file, folder = "shop_images") {
  try {
    const uniqueFileName = `${crypto.randomUUID()}_${file.name}`;
    const storagePath = `${folder}/${uniqueFileName}`;
    const fileRef = ref(storage, storagePath);

    await uploadBytes(fileRef, file);

    return storagePath;
  } catch (error) {
    console.error("Image upload failed:", error);
    throw error;
  }
}

/**
 * Creates or updates a seller's shop card.
 * @param {object} cardData - The data for the seller card, including image, color, description, genre, textColor, and title.
 * @returns {Promise<void>} A promise that resolves when the seller card is upserted.
 * @throws {Error} If the user is not authenticated.
 */
export const upsertSellerCard = async (cardData) => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  let imagePath = cardData.image;

  if (cardData.image instanceof File) {
    imagePath = await uploadImage(cardData.image, "shop_images");
  }

  await apiRequest(`/api/seller/card`, "POST", {
    image: imagePath,
    color: cardData.color,
    description: cardData.description,
    genre: cardData.genre,
    textColor: cardData.textColor,
    title: cardData.title,
  });
};

/**
 * Deletes the current user's seller card.
 * @returns {Promise<void>} A promise that resolves when the seller card is deleted.
 * @throws {Error} If the user is not authenticated.
 */
export const deleteSellerCard = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  await apiRequest(`/api/seller/card`, "DELETE");
};

/**
 * Adds a new product for the current seller.
 * @param {object} productData - The product data, including image, name, price, and stock.
 * @returns {Promise<void>} A promise that resolves when the product is added.
 * @throws {Error} If the user is not authenticated.
 */
export const addProduct = async ({ image, name, price, stock }) => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  let imageUrl = image;
  if (image instanceof File) {
    imageUrl = await uploadImage(image, "product_images");
  }

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
    stock,
  });
};

/**
 * Fetches all products associated with the current seller.
 * @returns {Promise<Array<object>>} A promise that resolves to an array of seller's products, with image URLs and formatted prices.
 * @throws {Error} If the user is not authenticated.
 */
export const getSellerProducts = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");
  
  const rawProducts = await apiRequest("/api/products/seller");

  const products = [];
  for (const data of rawProducts) {
    if (data.image && typeof data.image === "string" && !data.image.startsWith("http")) {
      try {
        data.image = await getDownloadURL(ref(storage, data.image));
      } catch {
        data.image = null;
      }
    }

    let price = data.price;
    if (typeof price === "string" && price.startsWith("R")) {
      price = Number(price.slice(1));
    }

    products.push({ ...data, price });
  }

  return products;
};

/**
 * Updates an existing product for the current seller.
 * @param {object} productData - The product data to update, including id, image, name, price, and stock.
 * @returns {Promise<void>} A promise that resolves when the product is updated.
 * @throws {Error} If the user is not authenticated.
 */
export const updateProduct = async ({ id, image, name, price, stock }) => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  let imageUrl = image;
  if (image instanceof File) {
    imageUrl = await uploadImage(image, "product_images");
  }

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
    stock, 
  });
};

/**
 * Deletes a product associated with the current seller.
 * @param {string} id - The ID of the product to delete.
 * @returns {Promise<void>} A promise that resolves when the product is deleted.
 * @throws {Error} If the user is not authenticated.
 */
export const deleteProduct = async (id) => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  await apiRequest(`/api/products/${id}`, "DELETE");
};

/**
 * Fetches the current seller's shop card details.
 * @returns {Promise<object | null>} A promise that resolves to the seller's card data, with image URL, or null if not found.
 * @throws {Error} If the user is not authenticated.
 */
export const getSellerCard = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const data = await apiRequest("/api/seller/card");

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

/**
 * Updates the total sales amount for a specific product.
 * @param {string} productId - The ID of the product to update.
 * @param {number} amount - The amount to add to the product's total.
 * @returns {Promise<void>} A promise that resolves when the product total is updated.
 */
export const addToProductTotal = async (productId, amount) => {
  await apiRequest(`/api/products/${productId}/total`, 'PATCH', { amount });
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