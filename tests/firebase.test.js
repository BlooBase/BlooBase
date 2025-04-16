import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  terminate
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAgBSpJB0B2XEFNAfeoqtt5KRERZVhJ10k',
  authDomain: 'bloobase-6179e.firebaseapp.com',
  projectId: 'bloobase-6179e',
  storageBucket: 'bloobase-6179e.firebasestorage.app',
  messagingSenderId: '272512255909',
  appId: '1:272512255909:web:112b08aa2458c2fd51ca4c',
  measurementId: 'G-JD0KF0LJHB',
};

let db;

beforeAll(() => {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
});

afterAll(async () => {
  await terminate(db);
});

test('should create a user and retrieve it from Firestore', async () => {
  const userId = 'user_001';
  const username = 'johnDoe';
  const email = 'john@example.com';

  await setDoc(doc(db, 'users', userId), {
    username,
    email,
    password: 'hashed_password',
    created_at: new Date(),
  });

  const userDoc = await getDoc(doc(db, 'users', userId));
  expect(userDoc.exists()).toBe(true);

  const userData = userDoc.data();
  expect(userData.username).toBe(username);
  expect(userData.email).toBe(email);
});

test('should create and retrieve an artisan', async () => {
  const artisanId = 'artisan_001';
  const userId = 'user_001';
  const name = 'John the Painter';
  const shopName = 'ColorVibes';
  const mobileNumber = '1234567890';
  const description = 'We paint everything!';
  const profileImg = 'profile_img_url';

  await setDoc(doc(db, 'artisans', artisanId), {
    user_id: userId,
    name,
    mobile_number: mobileNumber,
    shop_name: shopName,
    description,
    created_at: new Date(),
    profile_img: profileImg,
  });

  const artisanDoc = await getDoc(doc(db, 'artisans', artisanId));
  expect(artisanDoc.exists()).toBe(true);

  const artisanData = artisanDoc.data();
  expect(artisanData.name).toBe(name);
  expect(artisanData.shop_name).toBe(shopName);
  expect(artisanData.mobile_number).toBe(mobileNumber);
});

test('should list all products', async () => {
  const productsRef = collection(db, 'products');
  const snapshot = await getDocs(productsRef);
  const products = snapshot.docs.map(doc => doc.data());

  expect(products.length).toBeGreaterThan(0);
});
