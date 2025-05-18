import React, { useEffect, useState} from 'react';
import '../Home.css';
import { retrieveProducts } from '../firebase/retrieveProducts';
import { getUserRole } from '../firebase/firebase';
import { auth } from '../firebase/firebase';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import FloatingCart from '../components/FloatingCart';
import { addToCart } from '../firebase/addToCart';
import { toast } from 'react-toastify';

// Hardcoded fallback products (Artist Cards)
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
      genre: 'Digital Art',
    },
    {
      id: 'h3',
      title: '조기석 Cho Gi-Seok',
      image: '/Chogiseok.jpg',
      description: 'Korean photographer, director and artisan, @chogiseok',
      color: '#e7e4d7',
      textColor: '#141118',
      genre: 'Mixed media',
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
      genre: 'Mixed media',
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
      genre: 'Art',
    },
  ];

const HomePage = () => {
   const [products, setProducts] = useState([]);
   const [filteredProducts, setFilteredProducts] = useState([]);
   const [searchQuery, setSearchQuery] = useState('');
   const [userRole, setUserRole] = useState(null); // State to store the user's role
   const [selectedCategory, setSelectedCategory] = useState('All');

   // Artist Image Carousel Logic
   const [currentArtistIndex, setCurrentArtistIndex] = useState(0);
   const [artistImage, setArtistImage] = useState(hardcodedProducts[0].image);

   useEffect(() => {
      const intervalId = setInterval(() => {
         setCurrentArtistIndex((prevIndex) => (prevIndex + 1) % hardcodedProducts.length);
      }, 3000); // Change image every 3 seconds

      return () => clearInterval(intervalId); // Clear interval on unmount
   }, []);

   useEffect(() => {
      setArtistImage(hardcodedProducts[currentArtistIndex].image);
   }, [currentArtistIndex]);

   // Fetch the user's role on component mount
   // filepath: c:\University\SD\BlooBase\Coding_New\BlooBase\src\components\HomePage.js
useEffect(() => {
   const unsubscribe = auth.onAuthStateChanged(async (user) => {
     if (user) {
       const role = await getUserRole();
       console.log(role)
       setUserRole(role);
       
     } else {
       setUserRole(null);
     }
   });
   return () => unsubscribe();
 }, []);

   // Categories similar to the genres in Artists page
   const categories = ['All','Digital Art', 'Clothing', 'Accessories', 'Crafts', 'Jewelry','Art', 'Furniture', 'Mixed media'];

   // Effect to close options dropdown when clicking outside

   const [imagesLoaded, setImagesLoaded] = useState({
      logo: false,
      products: {}
   });

   useEffect(() => {
      const fetchProducts = async () => {
         const fetchedProducts = await retrieveProducts();
         setProducts(fetchedProducts);
         setFilteredProducts(fetchedProducts);

         // Preload and check if product images are cached
         fetchedProducts.forEach((product) => {
            const img = new Image();
            img.src = product.imageUrl;

            if (img.complete && img.naturalHeight !== 0) {
               setImagesLoaded(prev => ({
                  ...prev,
                  products: { ...prev.products, [product.id]: true }
               }));
            } else {
               img.onload = () => {
                  setImagesLoaded(prev => ({
                     ...prev,
                     products: { ...prev.products, [product.id]: true }
                  }));
               };
            }
         });
      };

      fetchProducts();

      // Preload logo image
      const logoImg = new Image();
      logoImg.src = "/bloobase.png";
      if (logoImg.complete && logoImg.naturalHeight !== 0) {
         setImagesLoaded(prev => ({ ...prev, logo: true }));
      } else {
         logoImg.onload = () =>
            setImagesLoaded(prev => ({ ...prev, logo: true }));
      }

      // Preload background image
      const bgImg = new Image();
      bgImg.src = './assets/BG0.jpg';
   }, []);

   // Filter products based on search query and selected category
   useEffect(() => {
      let result = [...products];

      // Filter out products with stock === 0 or stock is falsy
      result = result.filter(product => product.stock === undefined || Number(product.stock) > 0);

      // Filter by category
      if (selectedCategory !== 'All') {
        result = result.filter(product =>
            (product.genre?.toLowerCase() === selectedCategory.toLowerCase()) ||
            (product.category?.toLowerCase() === selectedCategory.toLowerCase())
        );
      }

      // Search by product name
      if (searchQuery) {
         result = result.filter(product =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase())
         );
      }

      setFilteredProducts(result);
   }, [searchQuery, selectedCategory, products]);

   
   return (
    <section className="page-wrapper-home-1">
    <section id="bg-preload-1"></section>
    <Navbar pageTitle="Explore" bgColor="#fff6fb" textColor="#165a9c" />

    <section className="products-container-1">
      <section className="artist-search-container-1">
        <Link to="/Artists" className="artist-button-link">
          <section className="artist-button-1">
            <img
              src={artistImage}
              alt="Artist Preview"
              className="artist-button-image-1"
            />
            <p className="artist-button-text-1">Artists</p>
          </section>
        </Link>

        <section className="search-bar-wrapper-1">
          <input
            type="text"
            className="search-bar-1"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </section>
      </section>

      <section className="genre-filter-wrapper-1">
        {categories.map((category) => (
          <button
            key={category}
            className={`genre-button-1 ${
              selectedCategory === category ? 'active' : ''
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </section>

      <section className="products-grid-home-1">
        {filteredProducts.map((product) => (
          <section
            key={product.id}
            className="product-card-1"
            role="button"
            tabIndex="0"
            aria-label={`View details of ${product.name}`}
          >
            <section className="product-image-container-1">
              {!imagesLoaded.products[product.id] && (
                <section className="product-image-placeholder-1">
                  <section className="loading-spinner-1"></section>
                </section>
              )}
              <img
                src={product.imageUrl}
                alt={product.name}
                className={`product-image-1 ${
                  imagesLoaded.products[product.id] ? 'fade-in' : 'hidden'
                }`}
                onLoad={() =>
                  setImagesLoaded((prev) => ({
                    ...prev,
                    products: { ...prev.products, [product.id]: true },
                  }))
                }
                loading="lazy"
              />
            </section>
            <section className="product-info-1">
              <h3 className="product-title-1">{product.name}</h3>
              <p className="product-price-1">{product.price}</p>
              <p className="store-name-1">{product.Seller}</p>
              {auth.currentUser && userRole === 'Buyer' && (
                <button
                className="add-to-cart-button-1"
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

      <section className="opacity-fade-2" />
    </section>

     {/* Conditionally render FloatingCart */}
     {auth.currentUser && userRole === 'Buyer' && <FloatingCart />}

    <footer className="page-footer-1">© 2025 BlooBase. All rights reserved.</footer>
  </section>
    );
};

export default HomePage;