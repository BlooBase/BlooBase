import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../Store.css';
import Navbar from '../components/Navbar';
import FloatingCart from '../components/FloatingCart';
import { collection, getDocs } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase/firebase';

const hardcodedProducts = [
  {
    id: 'h1',
    title: 'poiandkeely',
    image: '/keely.jpg',
    description: '3d Modeling and Character Design, @poiandkeely',
    color: '#FFEFF8',
    textColor: '#A38FF7',
    genre: '3D Modeling',
  },
  {
    id: 'h2',
    title: 'Inio Asano',
    image: '/Asano.jpg',
    description: "Author and artist of 'Goodnight Punpun', 'Solanin' and 'A Girl On the Shore'.",
    color: '#ffffff',
    textColor: '#598EA0',
    genre: 'Digital Art',
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
    genre: 'Digital Art',
  },
  {
    id: 'h5',
    title: 'Inspired Island',
    image: '/Island.jpg',
    description: 'Digital Media editor, artist and director, @CultureStudios',
    color: '#8C2C54',
    textColor: '#FFDFE2',
    genre: 'Video Editing',
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
    genre: 'Physical Art',
  },
];

const user = {
  name: 'DigitalJosh',
  avatarUrl: 'https://i.pravatar.cc/100',
  avatarLocal: '/pfp.jpeg',
};

const Store = () => {
  const { id } = useParams();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'Sellers'));
        const fetchedStores = [];

        for (const doc of snapshot.docs) {
          const data = doc.data();

          let imageUrl = '';
          if (data.image) {
            const imgRef = ref(storage, data.image);
            imageUrl = await getDownloadURL(imgRef);
          }

          fetchedStores.push({
            id: doc.id,
            title: data.title || 'Untitled',
            description: data.description || '',
            image: imageUrl,
            color: data.color || '#ffffff',
            textColor: data.textColor || '#000000',
            genre: data.genre || 'Unknown',
          });
        }

        // Combine hardcoded and fetched stores
        setStores([...hardcodedProducts, ...fetchedStores]);
      } catch (err) {
        console.error('Error fetching stores:', err);
        setStores(hardcodedProducts); // Fallback to hardcoded data
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) return <p>Loading...</p>;

  const artist = stores.find((p) => p.id === id);

  if (!artist) return <p>Artist not found.</p>;

  return (
    <section className="store-page" style={{ backgroundColor: artist.color }}>
      <Navbar pageTitle="Artist" user={user} bgColor="transparent" textColor="#165a9c" />

      <section className="store-header">
        <img src={artist.image} alt={artist.title} className="store-image" />
        <h1 className="store-title" style={{ color: artist.textColor }}>
          {artist.title}
        </h1>
      </section>

      <section className="store-main">
        <section
          className="store-column info"
          style={{ backgroundColor: artist.textColor, color: artist.color }}
        >
          <h2 className="section-title">Information</h2>
          <p className="store-description">{artist.description}</p>
          <p className="store-genre">Genre: {artist.genre}</p>
        </section>

        <section
          className="store-column products"
          style={{ backgroundColor: artist.textColor, color: artist.color }}
        >
          <h2 className="section-title">Art</h2>
          {/* Product listings go here */}
        </section>
      </section>

      <section className="opacity-fade1" />

      <FloatingCart />
    </section>
  );
};

export default Store;