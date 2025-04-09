import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, doc, setDoc } from "firebase/firestore"; 

const firebaseConfig = {
  apiKey: "AIzaSyAgBSpJB0B2XEFNAfeoqtt5KRERZVhJ10k",
  authDomain: "bloobase-6179e.firebaseapp.com",
  projectId: "bloobase-6179e",
  storageBucket: "bloobase-6179e.firebasestorage.app",
  messagingSenderId: "272512255909",
  appId: "1:272512255909:web:112b08aa2458c2fd51ca4c",
  measurementId: "G-JD0KF0LJHB"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);  

// Function to create a user document
const createUser = async (userId, username, email,password) => {
    try {
      await setDoc(doc(db, "users", userId), {
        username:username,
        email:email,
        password:password, // Will hash later
        created_at: new Date(),
      });
      console.log("User created successfully");
    } catch (error) {
      console.error("Error adding user: ", error);
    }
};

// Function to create an artisan document
const createArtisan = async (artisanId, userId, name, shopName, mobileNumber, description, profileImg) => {
    try {
      await setDoc(doc(db, "artisans", artisanId), {
        user_id: userId,
        name: name,
        mobile_number: mobileNumber,
        shop_name: shopName,
        description: description,
        created_at: new Date(),
        profile_img: profileImg,
      });
      console.log("Artisan created successfully");
    } catch (error) {
      console.error("Error adding artisan: ", error);
    }
};

// Function to create a product document
const createProduct = async (productId, artisanId, name, description, price, category, quantity, product_img) => {
    try {
      await setDoc(doc(db, "products", productId), {
        artisan_id: artisanId,
        name: name,
        description: description,
        price: price,
        created_at: new Date(),
        product_img: product_img,
        category: category,
        quantity: quantity,
      });
      console.log("Product created successfully");
    } catch (error) {
      console.error("Error adding product: ", error);
    }
};

// Function to create an order document
const createOrder = async (orderId, userId, productId, quantity, totalAmount) => {
    try {
      await setDoc(doc(db, "orders", orderId), {
        user_id: userId,
        product_id: productId,
        quantity: quantity,
        created_at: new Date(),
        total_amount: totalAmount,
      });
      console.log("Order created successfully");
    } catch (error) {
      console.error("Error adding order: ", error);
    }
};

// Sample calls to create user, artisan, product, and order
const createSampleData = async () => {
    const userId = "user_001";
    await createUser(userId, "johnDoe", "john@example.com");

    const artisanId = "artisan_001";
    await createArtisan(artisanId, userId, "John the Painter", "ColorVibes", "1234567890", "We paint everything!", "profile_img_url");

    const productId = "product_001";
    await createProduct(productId, artisanId, "Custom Painting", "Handmade painting", 100, "Paintings", 10, "product_img_url");

    const orderId = "order_001";
    await createOrder(orderId, userId, productId, 1, 100);
};

createSampleData();
