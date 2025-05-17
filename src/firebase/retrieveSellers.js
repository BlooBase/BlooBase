import { collection, getDocs } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';

export let cachedSellers = null; // Cache for sellers data

export async function retrieveSellers() {
  try {
    const snapshot = await getDocs(collection(db, 'Sellers'));
    const fetchedSellers = await Promise.all(snapshot.docs.map(async (doc) => {
      const data = doc.data();
      let imageUrl = '';
      if (data.image) {
        try {
          const imgRef = ref(storage, data.image);
          imageUrl = await getDownloadURL(imgRef);
        } catch (e) {
          imageUrl = '';
        }
      }
      return {
        id: doc.id,
        title: data.title || 'Untitled',
        description: data.description || '',
        image: imageUrl,
        color: data.color || '#ffffff',
        textColor: data.textColor || '#000000',
        genre: data.genre || 'Unknown',
      };
    }));
    cachedSellers = fetchedSellers;
    return fetchedSellers;
  } catch (error) {
    console.error('Error fetching sellers:', error);
    return cachedSellers || [];
  }
}