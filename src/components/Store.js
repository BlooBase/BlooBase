import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../Store.css';
import Navbar from '../components/Navbar';
import FloatingCart from '../components/FloatingCart';
import { retrieveSellersCached } from '../firebase/retrieveSellersCached';
import { retrieveSellerProducts } from '../firebase/retrieveSellerProducts';
import { auth } from '../firebase/firebase'; // Import Firebase auth
import { getUserRole } from '../firebase/firebase'; // Import the function to get the user's role

const user = {
  name: 'DigitalJosh',
  avatarUrl: 'https://i.pravatar.cc/100',
  avatarLocal: '/pfp.jpeg',
};

const Store = () => {
  const { id } = useParams();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [userRole, setUserRole] = useState(null); // State to store the user's role

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

  useEffect(() => {
    const fetchProducts = async () => {
      if (id) {
        try {
          const sellerProducts = await retrieveSellerProducts(id);
          setProducts(sellerProducts);
        } catch (err) {
          console.error('Error fetching seller products:', err);
        } finally {
          setProductsLoading(false);
        }
      }
    };

    fetchProducts();
  }, [id]);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (auth.currentUser) {
        const role = await getUserRole();
        setUserRole(role);
      }
    };

    fetchUserRole();
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
          {productsLoading ? (
            <p>Loading products...</p>
          ) : (
            <section className="products-grid">
            {products.map((product) => (
              <section
                key={product.id}
                className="product-item"
              >
                <section className="product-image-container">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="product-image"
                    loading="lazy"
                  />
                </section>
                <section className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-price">{product.price}</p>
                  {auth.currentUser && userRole === 'Buyer' && (
                      <button
                        className="add-to-cart-button"
                        onClick={() => console.log(`Added ${product.name} to cart`)}
                      >
                        Add to Cart
                      </button>
                    )}
                </section>
              </section>
            ))}
          </section>
          )}
        </section>
      </section>

      <section className="opacity-fade1" />

      {/* Conditionally render FloatingCart */}
      {auth.currentUser && userRole === 'Buyer' && <FloatingCart />}

    </section>
  );
};

export default Store;