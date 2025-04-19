import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, doc, setDoc } from "firebase/firestore"; 
import {getAuth} from "firebase/auth";
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
const analytics = getAnalytics(app);
const db = getFirestore(app); 
const auth=getAuth(app); 


export{app,analytics,auth,db,doc,setDoc};
// Function to create a user document
// const createUser = async (userId, username, email,password) => {
//     try {
//       await setDoc(doc(db, "users", userId), {
//         username:username,
//         email:email,
//         password:password, // Will hash later
//         created_at: new Date(),
//       });
//       console.log("User created successfully");
//     } catch (error) {
//       console.error("Error adding user: ", error);
//     }
// };

// Function to create an artisan document
// const createArtisan = async (artisanId, userId, name, shopName, mobileNumber, description, profileImg) => {
//     try {
//       await setDoc(doc(db, "artisans", artisanId), {
//         user_id: userId,
//         name: name,
//         mobile_number: mobileNumber,
//         shop_name: shopName,
//         description: description,
//         created_at: new Date(),
//         profile_img: profileImg,
//       });
//       console.log("Artisan created successfully");
//     } catch (error) {
//       console.error("Error adding artisan: ", error);
//     }
// };

// Function to create a product document
// const createProduct = async (productId, artisanId, name, description, price, category, quantity, product_img) => {
//     try {
//       await setDoc(doc(db, "products", productId), {
//         artisan_id: artisanId,
//         name: name,
//         description: description,
//         price: price,
//         created_at: new Date(),
//         product_img: product_img,
//         category: category,
//         quantity: quantity,
//       });
//       console.log("Product created successfully");
//     } catch (error) {
//       console.error("Error adding product: ", error);
//     }
// };

// Function to create an order document
// const createOrder = async (orderId, userId, productId, quantity, totalAmount) => {
//     try {
//       await setDoc(doc(db, "orders", orderId), {
//         user_id: userId,
//         product_id: productId,
//         quantity: quantity,
//         created_at: new Date(),
//         total_amount: totalAmount,
//       });
//       console.log("Order created successfully");
//     } catch (error) {
//       console.error("Error adding order: ", error);
//     }
// };
