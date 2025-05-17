import React, { useState, useEffect, useRef } from 'react';
import Masonry from 'masonry-layout';
import imagesLoaded from 'imagesloaded';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import FloatingCart from '../components/FloatingCart';
import '../Artists.css';
import { retrieveSellers } from '../firebase/retrieveSellers';
import { auth } from '../firebase/firebase'; // Import Firebase auth
import { getUserRole } from '../firebase/firebase'; // Import the function to get the user's role

const Products = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [cardLoaded, setCardLoaded] = useState({});
  const [userRole, setUserRole] = useState(null); // State to store the user's role
  
  const gridRef = useRef(null);

  const genres = ['All','Digital Art', 'Clothing', 'Accessories', 'Crafts', 'Jewelry','Art', 'Furniture', 'Mixed media'];

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const combinedSellers = await retrieveSellers(); // this includes hardcoded + Firestore
        setProducts(combinedSellers); // Replaces with full list once loaded
      } catch (err) {
        console.error('Error fetching artists:', err);
      }
    };
  
    fetchArtists();
  }, []);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (auth.currentUser) {
        const role = await getUserRole();
        setUserRole(role);
      }
    };

    fetchUserRole();
  }, []);

  const filteredProducts = products.filter(
    (p) =>
      (selectedGenre === 'All' || 
        p.genre?.trim().toLowerCase() === selectedGenre.trim().toLowerCase()
      ) &&
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

      {/* Conditionally render FloatingCart */}
      {auth.currentUser && userRole === 'Buyer' && <FloatingCart />}

      <footer className="page-footer">© 2025. All Rights Reserved.</footer>
    </section>
  );
};

export default Products;
