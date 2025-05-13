import React, { useEffect, useState} from 'react';
import '../Home.css';
import { retrieveProducts } from '../firebase/retrieveProducts';
import { getUserRole } from '../firebase/firebase';
import { auth } from '../firebase/firebase'; // Import Firebase auth
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../components/Navbar';
import FloatingCart from '../components/FloatingCart';
import { addToCart } from '../firebase/addToCart';
import { toast } from 'react-toastify';

const HomePage = () => {
   const [products, setProducts] = useState([]);
   const [filteredProducts, setFilteredProducts] = useState([]);
   const [searchQuery, setSearchQuery] = useState('');
   const [userRole, setUserRole] = useState(null); // State to store the user's role
   const [selectedCategory, setSelectedCategory] = useState('All');

   // Fetch the user's role on component mount
   useEffect(() => {
      const fetchUserRole = async () => {
         if (auth.currentUser) {
            const role = await getUserRole();
            setUserRole(role);
         }
      };

      fetchUserRole();
   }, []);

   // Categories similar to the genres in Artists page
   const categories = ['All', 'Clothing', 'Accessories', 'Crafts', 'Jewelry','Art', 'Furniture', 'Mixed media'];

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
      bgImg.src = './assets/BG.png';
   }, []);

   // Filter products based on search query and selected category
   useEffect(() => {
      let result = [...products];

      // Filter by category
      if (selectedCategory !== 'All') {
         result = result.filter(product =>
            product.category?.toLowerCase() === selectedCategory.toLowerCase()
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
      <main className="homepage">
         <section id="bg-preload"></section>
         <Navbar pageTitle="Explore" bgColor="#fff6fb" textColor="#165a9c" />

         <section className="products-section">
   
            {/* Search bar with internal icon */}
            <section className="search-bar-wrapper">
               <section className="search-input-container">
                  <input
                     type="text"
                     className="search-bar"
                     placeholder="Search products..."
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  
               </section>
            </section>

            {/* Category filter buttons similar to Artists page */}
            <section className="category-filter-wrapper">
               {categories.map((category) => (
                  <button
                     key={category}
                     className={`category-button ${selectedCategory === category ? 'active' : ''}`}
                     onClick={() => setSelectedCategory(category)}
                  >
                     {category}
                  </button>
               ))}
            </section>
            
            <section className="products-grid">
               {filteredProducts.map((product) => (
                  <section
                     key={product.id}
                     className="product-item"
                     role="button"
                     tabIndex="0"
                     aria-label={`View details of ${product.name}`}
                  >
                     <section className="product-image-container">
                        {!imagesLoaded.products[product.id] && (
                           <section className="product-image-placeholder">
                              <section className="loading-spinner"></section>
                           </section>
                        )}
                        <img
                           src={product.imageUrl}
                           alt={product.name}
                           className={`product-image ${imagesLoaded.products[product.id] ? 'fade-in' : 'hidden'}`}
                           onLoad={() => setImagesLoaded(prev => ({
                              ...prev,
                              products: { ...prev.products, [product.id]: true }
                           }))}
                           loading="lazy"
                        />
                     </section>
                     <section className="product-info">
                        <h3 className="product-name">{product.name}</h3>
                        <p className="product-price">{product.price}</p>
                        <p className="store-name">{product.Seller}</p>
                        {auth.currentUser && userRole === 'Buyer' && (
                           <button
                              className="add-to-cart-button"
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
         </section>

         {/* Conditionally render FloatingCart */}
         {auth.currentUser && userRole === 'Buyer' && <FloatingCart />}

         <footer className="footer-text">
            © 2025 BlooBase. All rights reserved.
         </footer>
      </main>
   );
};

export default HomePage;