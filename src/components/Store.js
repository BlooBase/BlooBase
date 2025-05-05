import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../Store.css';
import Navbar from '../components/Navbar';
import FloatingCart from '../components/FloatingCart';
import { retrieveSellersCached } from '../firebase/retrieveSellersCached';

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
        const sellers = await retrieveSellersCached();
        setStores(sellers);
      } catch (err) {
        console.error('Error fetching stores:', err);
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
          <h2 className="section-title">Products</h2>
          {/* Product listings go here */}
        </section>
      </section>

      <section className="opacity-fade1" />

      <FloatingCart />
    </section>
  );
};

export default Store;