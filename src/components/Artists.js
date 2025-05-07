import React, { useState, useEffect, useRef } from 'react';
import Masonry from 'masonry-layout';
import imagesLoaded from 'imagesloaded';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import FloatingCart from '../components/FloatingCart';
import '../Artists.css';
import { retrieveSellers } from '../firebase/retrieveSellers';

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

const Products = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [cardLoaded, setCardLoaded] = useState({});

  const gridRef = useRef(null);

  const genres = ['All', 'Drawing', 'Painting', 'Digital Art', 'Photography', 'Sculptures', 'Mixed media'];

  useEffect(() => {
    const fetchArtists = async () => {
      // Step 1: Immediately show hardcoded products
      setProducts(hardcodedProducts);
  
      try {
        const combinedSellers = await retrieveSellers(); // this includes hardcoded + Firestore
        setProducts(combinedSellers); // Replaces with full list once loaded
      } catch (err) {
        console.error('Error fetching artists:', err);
      }
    };
  
    fetchArtists();
  }, []);

  const filteredProducts = products.filter(
    (p) =>
      (selectedGenre === 'All' || p.genre === selectedGenre) &&
      p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const msnry = new Masonry(grid, {
      itemSelector: '.product-card',
      columnWidth: '.grid-sizer',
      gutter: 20,
      percentPosition: true,
    });

    imagesLoaded(grid, () => {
      msnry.layout();
    });

    return () => {
      msnry.destroy();
    };
  }, [filteredProducts]);

  return (
    <section className="page-wrapper">
      <Navbar pageTitle="Artists" bgColor="#fff6fb" textColor="#165a9c" />

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
          <section className="products-grid" ref={gridRef}>
            <section className="grid-sizer" />
            {filteredProducts.map((product) => {
              const isLoaded = cardLoaded[product.id];

              return (
                <Link to={`/artists/${product.id}`} key={product.id} className="product-link">
                  <section
                    className={`product-card ${!isLoaded ? 'loading' : ''}`}
                    style={{
                      backgroundColor: product.color,
                      opacity: isLoaded ? 1 : 0.5,
                      transition: 'opacity 0.4s ease',
                    }}
                  >
                    {product.image && (
                      <img
                        src={product.image}
                        alt={product.title}
                        className="product-image"
                        loading="lazy"
                        onLoad={() =>
                          setCardLoaded((prev) => ({ ...prev, [product.id]: true }))
                        }
                        onError={() =>
                          setCardLoaded((prev) => ({ ...prev, [product.id]: true }))
                        }
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
              );
            })}
          </section>
        </section>

        <section className="opacity-fade" />
      </section>

      <FloatingCart />
      <footer className="page-footer">© 2025. All Rights Reserved.</footer>
    </section>
  );
};

export default Products;
