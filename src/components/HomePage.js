import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Home.css';
import { Link } from 'react-router-dom';
import { retrieveProducts } from '../firebase/retrieveProducts';
import { getUserRole } from '../firebase/firebase';

const HomePage = () => {
   const [optionsOpen, setOptionsOpen] = useState(false);
   const [products, setProducts] = useState([]);
   const [filteredProducts, setFilteredProducts] = useState([]);
   const [searchQuery, setSearchQuery] = useState('');
   const [selectedCategory, setSelectedCategory] = useState('All');
   const optionsRef = useRef(null);
   const navigate = useNavigate();

   // Categories similar to the genres in Artists page
   const categories = ['All', 'Clothing', 'Accessories', 'Crafts', 'Jewelry','Art', 'Furniture', 'Mixed media'];

   // Effect to close options dropdown when clicking outside
   useEffect(() => {
      function handleClickOutside(event) {
         if (optionsRef.current && !optionsRef.current.contains(event.target)) {
            setOptionsOpen(false);
         }
      }

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
      };
   }, [optionsRef]);

   const [imagesLoaded, setImagesLoaded] = useState({
      logo: false,
      products: {}
   });

   const user = {
      name: "Admin",
      avatarLocal: "/user_profile.png",
   };

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

   const handleProductClick = (product) => {
      console.log('Product clicked:', product);
   };

   const handleHomepage = async () => {
      try {
         const role = await getUserRole();
         if (role === "Buyer") {
            navigate("/BuyerHomepage");
         } else if (role === "Seller") {
            navigate("/SellerHomepage");
         } else if (role === "Admin") {
            navigate("/Dashboard");
         } else {
            navigate("/");
         }
      } catch (error) {
         console.error("Error fetching user role:", error);
         alert("Unable to determine user role. Please try again.");
      }
   };

   return (
      <main className="homepage">
         <section id="bg-preload"></section>
         <header className="navbar">
            <section className="nav-left">
               <Link to="/" className="site-title" style={{ textDecoration: "none" }}>
                  <section style={{ display: "flex", alignItems: "center", gap: "0.9rem" }}>
                     <img
                        src="/bloobase.png"
                        alt="BlooBase logo"
                        style={{ height: "32px", width: "30px", objectFit: "contain", marginLeft: "19px" }}
                     />
                     <h2 style={{ color: "#343a40", margin: 0 }}>BlooBase</h2>
                  </section>
               </Link>
            </section>

            <section className="nav-center">
               
            </section>

            <section className="nav-right" ref={optionsRef}>
               <section className="user-info">
                  <section
                     className={`options-button ${optionsOpen ? "selected" : ""}`}
                     onClick={() => setOptionsOpen((prev) => !prev)}
                  >
                     <img
                        className="options"
                        src="/options-lines.png"
                        alt="Options Button"
                     />
                  </section>

                  <img
                     className="user-avatar"
                     src={user.avatarLocal}
                     alt={`${user.name}'s avatar`}
                  />

                  {optionsOpen && (
                     <section className="dropdown-card-home">
                        <button
                           onClick={() => navigate("/Login")}
                           className="dropdown-item-home"
                           style={{ textDecoration: "none", color: "#000000", background: "none", border: "none", cursor: "pointer" }}
                        >
                           Login
                        </button>
                        <button
                           onClick={() => navigate("/Signup")}
                           className="dropdown-item-home"
                           style={{ textDecoration: "none", color: "#000000", background: "none", border: "none", cursor: "pointer" }}
                        >
                           Sign up
                        </button>
                        <button
                           onClick={() => navigate("/Artists")}
                           className="dropdown-item-home"
                           style={{ textDecoration: "none", color: "#000000", background: "none", border: "none", cursor: "pointer" }}
                        >
                           Artists
                        </button>
                        <button
                           onClick={handleHomepage}
                           className="dropdown-item-home"
                           style={{ textDecoration: "none", color: "#000000", background: "none", border: "none", cursor: "pointer" }}
                        >
                           Homepage
                        </button>
                     </section>
                  )}
               </section>
            </section>
         </header>

         <section className="products-section">
            <h2 className="products-heading">Browse Products</h2>
            
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
                     onClick={() => handleProductClick(product)}
                     role="button"
                     tabIndex="0"
                     aria-label={`View details of ${product.name}`}
                     onKeyPress={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                           handleProductClick(product);
                        }
                     }}
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
                     </section>
                  </section>
               ))}
            </section>
         </section>

         <footer className="footer-text">
            © 2025 BlooBase. All rights reserved.
         </footer>
      </main>
   );
};

export default HomePage;