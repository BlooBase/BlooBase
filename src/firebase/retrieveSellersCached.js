import { collection, getDocs } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';
import { cachedSellers } from './retrieveSellers';

// Hardcoded fallback products
const hardcodedProducts = [
  {
    id: 'h1',
    title: 'poiandkeely',
    image: '/keely.jpg',
    description: '3d Modeling and Character Design, @poiandkeely',
    color: '#FFEFF8',
    textColor: '#A38FF7',
    genre: 'Digital Art',
  },
  {
    id: 'h2',
    title: 'Inio Asano',
    image: '/Asano.jpg',
    description: "Author and artist of 'Goodnight Punpun', 'Solanin' and 'A Girl On the Shore'.",
    color: '#ffffff',
    textColor: '#598EA0',
    genre: 'Drawing',
  },
  {
    id: 'h3',
    title: '조기석 Cho Gi-Seok',
    image: '/Chogiseok.jpg',
    description: 'Korean photographer, director and artisan, @chogiseok',
    color: '#e7e4d7',
    textColor: '#141118',
    genre: 'Photography',
  },
  {
    id: 'h4',
    title: 'Yusuke Murata',
    image: '/Murata.gif',
    description: "Artist of 'One Punch Man' and 'Eyeshield 21'.",
    color: '#1e1e1e',
    textColor: '#ffffff',
    genre: 'Drawing',
  },
  {
    id: 'h5',
    title: 'Inspired Island',
    image: '/Island.jpg',
    description: 'Digital Media editor, artist and director, @CultureStudios',
    color: '#8C2C54',
    textColor: '#FFDFE2',
    genre: 'Digital Art',
  },
  {
    id: 'h6',
    title: 'Jamie Hewlett',
    image: '/Hewlett.jpg',
    description: 'Digital Artist - @Hewll',
    color: '#1c6e7b',
    textColor: '#ffffff',
    genre: 'Digital Art',
  },
  {
    id: 'h7',
    title: 'Kim Jung Gi',
    image: '/Kim.jpg',
    description: 'Physical inking artist and illustrator',
    color: '#ffffff',
    textColor: '#181818',
    genre: 'Photography',
  },
];

export async function retrieveSellersCached() {
  try {
    // Return cached data if available
    if (cachedSellers) {
      return cachedSellers;
    }

    const snapshot = await getDocs(collection(db, 'Sellers'));
    const fetchedSellers = [];

    for (const doc of snapshot.docs) {
      const data = doc.data();

      let imageUrl = '';
      if (data.image) {
        const imgRef = ref(storage, data.image);
        imageUrl = await getDownloadURL(imgRef);
      }

      fetchedSellers.push({
        id: doc.id,
        title: data.title || 'Untitled',
        description: data.description || '',
        image: imageUrl,
        color: data.color || '#ffffff',
        textColor: data.textColor || '#000000',
        genre: data.genre || 'Unknown',
      });
    }

    let combinedSellers = [...hardcodedProducts, ...fetchedSellers];
    return combinedSellers; // Return the combined sellers
  } catch (error) {
    console.error('Error fetching sellers:', error);
    return [];
  }
}