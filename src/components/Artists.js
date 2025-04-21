import React from 'react';
import '../Artists.css'; // Use a dedicated CSS file
import { Link } from 'react-router-dom';


const Products = () => {
  const productList = [
    {
      id: 1,
      title: "Yusuke Murata",
      image: "/Murata.gif",
      description: "Artist of 'One Punch Man' and 'Eyeshield 21'.",
      color: '#696867',
      textColor: '#ffffff' 
    },
    {
      id: 2,
      title: "Inio Asano",
      image: "/Asano.jpg",
      description: "Author and artist of 'Goodnight Punpun', 'Solanin' and 'A Girl On the Shore'.",
      color: '#ffffff',
      textColor: '#598EA0'
    },
    {
      id: 3,
      title: "Inspired Island",
      image: "/Island.jpg",
      description: "Digital Media editor, artist and director, @CultureStudios ",
      color: '#D492C3',
      textColor: '#FFDFE2'
    },
    {
      id: 4,
      title: "poiandkeely",
      image: "/keely.jpg",
      description: "3d Modeling and Character Design, @poiandkeely",
      color: '#FFEFF8',
      textColor: '#A38FF7'
    },
    {
      id: 5,
      title: "조기석 Cho Gi-Seok",
      image: "/Chogiseok.jpg",
      description: "Korean photographer, director and artisan, 조기석 Cho Gi-Seok @chogiseok",
      color: '#e7e4d7',
      textColor: '#141118'
    }
  ];

  return (
    <div className="page-wrapper">
  <div className="products-container">
    <h1 className="artists-heading">Artists</h1>

    <div className="products-grid">
      {productList.map((product) => (
        <Link to={`/product/${product.id}`} key={product.id} className="product-link">
          <div className="product-card" style={{ backgroundColor: product.color }}>
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
          </div>
        </Link>
      ))}
    </div>
  </div>

  <footer className="page-footer">
    © 2025. All Rights Reserved.
  </footer>
</div>

  );
};

export default Products;
