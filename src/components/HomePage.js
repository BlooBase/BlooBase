import React, { useEffect, useState,useRef } from 'react';
import '../Home.css';
import { Link } from 'react-router-dom';
import { retrieveProducts } from '../firebase/retrieveProducts';

const HomePage = () => {
   const [optionsOpen, setOptionsOpen] = useState(false);
   const [products, setProducts] = useState([]);
  const optionsRef = useRef(null);

  
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

      // Preload and check if product images are cached
      fetchedProducts.forEach((product) => {
        const img = new Image();
        img.src = product.imageUrl;

        if (img.complete && img.naturalHeight !== 0) {
          // Image is cached and loaded
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

    // Optionally preload background image
    const bgImg = new Image();
    bgImg.src = './assets/BG.png';
  }, []);

  const handleProductClick = (product) => {
    console.log('Product clicked:', product);
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
                    style={{ height: "32px", width: "30px", objectFit: "contain",marginLeft:"19px"}}
                  />
                  <h2 style={{ color: "#343a40", margin: 0 }}>BlooBase</h2>
                </section>
              </Link>
            </section>
    
            <section className="nav-center">
              <h3 className="page-title" style={{ color: "#343a40", margin: 0 }}>
              
              </h3>
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
                
               {/* <p className="username" style={{ color: "#343a40" }}>
                  {user.name}
                </p>*/}
                <img
                  className="user-avatar"
                  src={user.avatarLocal}
                  alt={`${user.name}'s avatar`}
                />
    
                {optionsOpen && (
                  <section className="dropdown-card-home">
                    <Link
                      to="/Login"
                      className="dropdown-item-home"
                      style={{ textDecoration: "none", color: "#000000" }}
                    >
                      Login
                    </Link>
                    <Link
                      to="/Signup"
                      className="dropdown-item-home"
                      style={{ textDecoration: "none", color: "#000000" }}
                    >
                      Sign up
                    </Link>
                    <Link
                      to="/Artists"
                      className="dropdown-item-home"
                      style={{ textDecoration: "none", color: "#000000" }}
                    >
                      Artists
                    </Link>
                    <Link
                      to="/Artists"
                      className="dropdown-item-home"
                      style={{ textDecoration: "none", color: "#000000" }}
                    >
                     
                    </Link>
                   
                  </section>
                )}
              </section>
            </section>
    
            
          </header>
    
    

      <section className="products-section">
        <h2 className="products-heading">Browse Products</h2>
        <section className="products-grid">
          {products.map((product) => (
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
