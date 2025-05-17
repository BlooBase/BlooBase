import { auth, db, doc, getDoc, setDoc, collection } from './firebase';

/**
 * Places an order for the current user by moving their cart items to an Orders collection.
 * @param {Object} orderDetails - Additional order details (e.g., orderType, total).
 * @returns {Promise<Object>} The created order data.
 */
export const addOrder = async (orderDetails = {}) => {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');

  // 1. Get the user's cart document from Firestore
  const cartDocRef = doc(db, 'Carts', user.uid);
  const cartDocSnap = await getDoc(cartDocRef);
  const cartData = cartDocSnap.exists() ? cartDocSnap.data() : null;
  const cartItems = cartData?.items || [];

  if (!cartItems.length) throw new Error('Cart is empty');

  // 2. Create the order object
  const orderPayload = {
    userId: user.uid,
    items: cartItems,
    ...orderDetails,
    createdAt: new Date().toISOString(),
    status: 'Pending',
  };

  // 3. Add the order to the Orders collection (auto-generated id)
  const orderDocRef = doc(collection(db, 'Orders'));
  await setDoc(orderDocRef, orderPayload);

  // 4. Clear the user's cart (remove items field)
  await setDoc(cartDocRef, { items: [] }, { merge: true });

  return { id: orderDocRef.id, ...orderPayload };
};