import React, { useEffect, useState } from 'react';
import '../Artists.css';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { collection, getDocs } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import { db, storage } from '../firebase/firebase';


// Hardcoded products
const hardcodedProducts = [
  {
    id: 'h1',
    title: "poiandkeely",
    image: "/keely.jpg",
    description: "3d Modeling and Character Design, @poiandkeely",
    color: '#FFEFF8',
    textColor: '#A38FF7',
    genre: '3D Modeling'
  },
  {
    id: 'h2',
    title: "Inio Asano",
    image: "/Asano.jpg",
    description: "Author and artist of 'Goodnight Punpun', 'Solanin' and 'A Girl On the Shore'.",
    color: '#ffffff',
    textColor: '#598EA0',
    genre: 'Digital Art'
  },
  {
    id: 'h3',
    title: "조기석 Cho Gi-Seok",
    image: "/Chogiseok.jpg",
    description: "Korean photographer, director and artisan, 조기석 Cho Gi-Seok @chogiseok",
    color: '#e7e4d7',
    textColor: '#141118',
    genre: 'Photography'
  },
  {
    id: 'h4',
    title: "Yusuke Murata",
    image: "/Murata.gif",
    description: "Artist of 'One Punch Man' and 'Eyeshield 21'.",
    color: '#1e1e1e',
    textColor: '#ffffff',
    genre: 'Digital Art'	
  },
  {
    id: 'h5',
    title: "Inspired Island",
    image: "/Island.jpg",
    description: "Digital Media editor, artist and director, @CultureStudios ",
    color: '#8C2C54',
    textColor: '#FFDFE2',
    genre:'Video Editing'
  },
  {
    id: 'h6',
    title: "Jamie Hewlett",
    image: "/Hewlett.jpg",
    description: "Digital Artist - @Hewll",
    color: '#1c6e7b',
    textColor: '#ffffff',
    genre: 'Digital Art'
  },
  {
    id: 'h7',
    title: "Kim Jung Gi",
    image: "/Kim.jpg",
    description: "Physical inking artist and illustrator",
    color: '#ffffff',
    textColor: '#181818',
    genre: 'Physical Art'
  }
];

const Products = () => {
  // State to manage all products
  const [products, setProducts] = useState([]); // initially empty
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');

  // Fetch artists from Firestore when the component loads
  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'Sellers'));
        const fetchedArtists = [];

        for (const doc of querySnapshot.docs) {
          const artistData = doc.data();

          let imageUrl = '';
          if (artistData.image) {
            const imageRef = ref(storage, artistData.image);
            imageUrl = await getDownloadURL(imageRef);
          }

          fetchedArtists.push({
            id: doc.id,
            title: artistData.title || 'Untitled',
            description: artistData.description || '',
            image: imageUrl,
            color: artistData.color || '#ffffff',
            textColor: artistData.textColor || '#000000',
            genre: artistData.genre || 'Unknown'
          });
        }

        // Combine fetched and hardcoded artists
        setProducts([...hardcodedProducts, ...fetchedArtists]);
      } catch (error) {
        console.error('Error fetching Sellers:', error);
        setProducts(hardcodedProducts); // fallback to hardcoded only
      }
    };

    fetchArtists();
  }, []); // run once when component mounts

  const genres = ['All', 'Physical Art', '3D Modeling', 'Digital Art', 'Video Editing', 'Photography', 'Sculpting'];

  const filteredProducts = products.filter((product) =>
    (selectedGenre === 'All' || product.genre === selectedGenre) &&
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const user = {
    name: 'DigitalJosh',
    avatarUrl: 'https://i.pravatar.cc/100',
    avatarLocal: '/pfp.jpeg'
  };

  return (
    <section className="page-wrapper">
      <Navbar
        pageTitle="Artists"
        user={user}
        bgColor="#fff6fb"
        textColor="#165a9c"
      />

      <section className="products-container">
        <section className="search-bar-wrapper">
          <input
            type="text"
            placeholder="Search for an artist..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-bar"
          />
        </section>

        <section className="genre-filter-wrapper">
          {genres.map((genre) => (
            <button
              key={genre}
              className={`genre-button ${selectedGenre === genre ? 'active' : ''}`}
              onClick={() => setSelectedGenre(genre)}
            >
              {genre}
            </button>
          ))}
        </section>

        <section className="products-grid-wrapper">
          <section className="products-grid">
            {filteredProducts.map((product) => (
              <Link to={`/product/${product.id}`} key={product.id} className="product-link">
                <section className="product-card" style={{ backgroundColor: product.color }}>
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.title}
                      className="product-image"
                    />
                  )}
                  <h3 className="product-title" style={{ color: product.textColor }}>
                    {product.title}
                  </h3>
                  <p className="product-description" style={{ color: product.textColor }}>
                    {product.description}
                  </p>
                </section>
              </Link>
            ))}
          </section>
        </section>

        <section className="opacity-fade" />
      </section>

      <footer className="page-footer">
        © 2025. All Rights Reserved.
      </footer>
    </section>
  );
};

export default Products;
