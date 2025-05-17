import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../Store.css';
import Navbar from '../components/Navbar';
import FloatingCart from '../components/FloatingCart';
import { retrieveSellersCached } from '../firebase/retrieveSellersCached';
import { retrieveSellerProducts } from '../firebase/retrieveSellerProducts';
import { auth } from '../firebase/firebase'; // Import Firebase auth
import { getUserRole } from '../firebase/firebase'; // Import the function to get the user's role
import 'react-toastify/dist/ReactToastify.css';
import { addToCart } from '../firebase/addToCart';
import { toast } from 'react-toastify';

//mock data
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
  const [userRole, setUserRole] = useState(null); 

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
          //console.log(id)
          console.log(sellerProducts)
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
    <section className="store-page-2" style={{ backgroundColor: artist.color }}>
      <Navbar pageTitle="Artist" user={user} bgColor="transparent" textColor="#165a9c" />

      <section className="store-header-2">
        <img src={artist.image} alt={artist.title} className="store-image-2" />
        <h1 className="store-title-2" style={{ color: artist.textColor }}>
          {artist.title}
        </h1>
      </section>

      <section className="store-main-2">
        <section
          className="store-column-info-2"
          style={{ backgroundColor: artist.textColor, color: artist.color }}
        >
          <h2 className="section-title-2">Information</h2>
          <p className="store-description-2">{artist.description}</p>
          <p className="store-genre-2">Genre: {artist.genre}</p>
        </section>

        <section
          className="store-column-products-2"
          style={{ backgroundColor: artist.textColor, color: artist.color }}
        >
          <h2 className="section-title-2">Products</h2>
          {productsLoading ? (
            <p>Loading products...</p>
          ) : (
            <section className="products-grid-2">
            {products.map((product) => (
              <section
                key={product.id}
                className="product-item-2"
              >
                <section className="product-image-container-2">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="product-image-2"
                    loading="lazy"
                  />
                </section>
                <section className="product-info-2">
                  <h3 className="product-name-2">{product.name}</h3>
                  <p className="product-price-2">{product.price}</p>
                  {auth.currentUser && userRole === 'Buyer' && (
                    <button
                      className="add-to-cart-button-2"
                      style={{ backgroundColor: "#165a9c", color: "#ffffff" }}
                      onClick={async () => {
                        try {
                          await addToCart(product);
                          toast.success(`Added ${product.name} to cart`);
                        } catch (error) {
                          toast.error("Failed to add to cart: " + error.message);
                        }
                      }}
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

      <section className="opacity-fade1-2" />

      {/* Conditionally render FloatingCart */}
      {auth.currentUser && userRole === 'Buyer' && <FloatingCart />}
      
    </section>
  );
};

export default Store;