import { auth, db, collection, getDocs, query, where } from './firebase';

/**
 * Retrieves all orders for the current user from the Orders collection.
 * @returns {Promise<Array>} Array of order objects.
 */
export const getUserOrders = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');

  const ordersRef = collection(db, 'Orders');
  const q = query(ordersRef, where('userId', '==', user.uid));
  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};