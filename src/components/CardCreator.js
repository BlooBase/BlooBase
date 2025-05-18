import React, { useRef, useState, useEffect } from 'react';
import '../CardCreator.css';
import Navbar from '../components/Navbar';
import { getSellerCard, upsertSellerCard, deleteSellerCard, getSellerProducts, addProduct, updateProduct, deleteProduct } from '../firebase/firebase';

const CardCreator = () => {
  const fileInputRef = useRef();
  const cardRef = useRef();
  const [animateCard, setAnimateCard] = useState(false);

  const [statusMessage, setStatusMessage] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState('#fff0e6');
  const [textColor, setTextColor] = useState('#93aed9');
  const [name, setName] = useState('Name');
  const [description, setDescription] = useState('Bio');
  const [genre, setGenre] = useState('Mixed Media');
  const [productCreators, setProductCreators] = useState([
    { image: null, imagePreview: null, name: '', price: '', stock: 1 }
  ]);
  const [hasStore, setHasStore] = useState(false);
  const [productAnimations, setProductAnimations] = useState([]);
  const genres = ['Digital Art', 'Clothing', 'Accessories', 'Crafts', 'Jewelry', 'Art', 'Furniture', 'Mixed Media'];

  useEffect(() => {
    const fetchSellerCard = async () => {
      try {
        const data = await getSellerCard();
        setHasStore(!!data); // true if store exists
        setImagePreview(data?.image || null);
        setBackgroundColor(data?.color || '#fff0e6');
        setTextColor(data?.textColor || '#93aed9');
        setName(data?.title || 'Name');
        setDescription(data?.description || 'Bio');
        setGenre(data?.genre || 'Genre');
      } catch (error) {
        console.error('Error fetching seller card:', error);
      }
    };
    fetchSellerCard();

      // Fetch and show existing products in tabs
    const fetchProducts = async () => {
      try {
        const prods = await getSellerProducts();
        // Map products to the productCreators format
        setProductCreators(
          prods.map(prod => ({
            image: prod.image,
            imagePreview: prod.image,
            name: prod.name,
            price: prod.price,
            stock: prod.stock ?? 1, // <-- Add this line, default to 1 if undefined
            id: prod.id
          }))
        );
      } catch (e) {
        console.error("Failed to fetch products", e);
      }
    };
    fetchProducts();
  }, []);

  const handleCardTilt = (e) => {
    const card = cardRef.current;
    if (!card) return;

    const { width, height, left, top } = card.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    const rotateX = ((y / height) - 0.5) * 10;
    const rotateY = ((x / width) - 0.5) * -10;

    card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const resetCardTilt = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg)';
  };

  const triggerAnimation = (message) => {
    setStatusMessage('');
    setAnimateCard(false);

    setTimeout(() => {
      setStatusMessage(message);
      setAnimateCard(true);
      setTimeout(() => setAnimateCard(false), 1000);
    }, 50);
  };

  const triggerProductMessage = (message) => {
    setStatusMessage('');
    setTimeout(() => {
      setStatusMessage(message);
    }, 50);
  };

  const triggerAnimationFail = (message) => {
    setStatusMessage('');
    setTimeout(() => {
      setStatusMessage(message);
    }, 50);
  };

  const triggerProductAnimation = (index) => {
  setProductAnimations((prev) => {
    const updated = [...prev];
    updated[index] = true;
    return updated;
  });
  setTimeout(() => {
    setProductAnimations((prev) => {
      const updated = [...prev];
      updated[index] = false;
      return updated;
    });
  }, 1000); // Duration matches your CSS animation
};

  const handlePublish = async () => {
    if ((!image && !imagePreview) || !name || !description) {
      triggerAnimationFail('Please fill in all fields.');
      return;
    }

    try {
      await upsertSellerCard({
        image: image || imagePreview,
        color: backgroundColor,
        description,
        genre,
        textColor,
        title: name,
      });
      triggerAnimation(hasStore ? 'Card Updated' : 'Card Published');
      setHasStore(true); // Ensure hasStore is true after first publish
    } catch (error) {
      console.error('Failed to publish or update card:', error);
      triggerAnimation(hasStore ? 'Failed to Update' : 'Failed to Publish');
    }
  };

  const handleRemove = async () => {
    try {
      await deleteSellerCard();
      setImage(null);
      setImagePreview(null);
      setName('Name');
      setDescription('Bio');
      setGenre('Genre');
      setBackgroundColor('#fff0e6');
      setTextColor('#93aed9');
      setHasStore(false);
      setProductCreators([{ image: null, imagePreview: null, name: '', price: '' }]); // <-- Clear products
      triggerAnimation('Card Removed');
    } catch (error) {
      console.error('Failed to remove card:', error);
      triggerAnimationFail('Failed to Remove');
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
      setImage(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
      setImage(file);
    }
  };

  const handleProductImageChange = (index, file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const updated = [...productCreators];
      updated[index].image = file;
      updated[index].imagePreview = reader.result;
      setProductCreators(updated);
    };
    reader.readAsDataURL(file);
  };

  // Update handlers to use 'name'
  const handleProductNameChange = (index, value) => {
    const updated = [...productCreators];
    updated[index].name = value;
    setProductCreators(updated);
  };

  const handleProductPriceChange = (index, value) => {
    const updated = [...productCreators];
    updated[index].price = value;
    setProductCreators(updated);
  };

  const handleProductStockChange = (index, value) => {
    const updated = [...productCreators];
    updated[index].stock = value;
    setProductCreators(updated);
  };

  const addProductCreator = () => {
    setProductCreators([
      ...productCreators,
      { image: null, imagePreview: null, name: '', price: '', stock: 1 }
    ]);
  };

  const removeProductCreator = (index) => {
    const updated = productCreators.filter((_, i) => i !== index);
    setProductCreators(updated);
    triggerAnimation('Product Removed');
  };

  const handleProductPublish = async (index) => {
    const { image, name, price, id } = productCreators[index];
    if (!image || !name || !price) {
      triggerAnimationFail('Please provide product image, name, and price.');
      return;
    }
    try {
      if (id) {
        await updateProduct({ id, image, name, price });
        triggerProductAnimation(index);
        triggerProductMessage(`Product ${productCreators[index].name} Updated`);
      } else {
        await addProduct({ image, name, price });
        triggerProductAnimation(index);
        triggerProductMessage(`Product ${productCreators[index].name} Published`);
      }
      // Refresh products list
      const prods = await getSellerProducts();
      setProductCreators(
        prods.map(prod => ({
          image: prod.image,
          imagePreview: prod.image,
          name: prod.name,
          price: prod.price,
          stock: prod.stock ?? 1, // <-- Add this line, default to 1 if undefined
          id: prod.id
        }))
      );
    } catch (e) {
      triggerAnimationFail('Failed to publish/update product.');
    }
  };

  const handleProductRemove = async (index) => {
    const { id } = productCreators[index];
    if (id) {
      try {
        await deleteProduct(id);
        triggerProductAnimation(index);
        triggerProductMessage(`Product ${productCreators[index].name} Removed`);
        // Refresh products list
        const prods = await getSellerProducts();
        setProductCreators(
          prods.map(prod => ({
            image: prod.image,
            imagePreview: prod.image,
            name: prod.name,
            price: prod.price,
            id: prod.id
          }))
        );
      } catch (e) {
        triggerAnimationFail('Failed to remove product.');
      }
    } else {
      // Just remove from UI if not saved yet
      triggerProductAnimation(index);
      removeProductCreator(index);
    }
  };

  return (
    <section className="card-creator-wrapper" style={{ backgroundColor }}>
      <Navbar pageTitle="Your Store" bgColor="#fff6fb" textColor="#165a9c" />

      {statusMessage && (
        <section className="status-notification">{statusMessage}</section>
      )}

      <section className="card-creator">
        <section
          className={`artist-card-preview ${animateCard ? 'animate-card' : ''}`}
          style={{ backgroundColor }}
          onMouseMove={handleCardTilt}
          onMouseLeave={resetCardTilt}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          ref={cardRef}
        >
          {imagePreview ? (
            <img src={imagePreview} alt="Card Preview" className="artist-card-image" />
          ) : (
            <section
              className="drop-placeholder"
              style={{ color: '#6e6e6e' }}
              onClick={() => fileInputRef.current.click()}
            >
              Drop or Click to Upload Image
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageUpload}
                hidden
              />
            </section>
          )}

          <h3 className="artist-name" style={{ color: textColor }}>{name}</h3>
          <p className="artist-description" style={{ color: textColor }}>{description}</p>
        </section>

        <section className="card-controls">
          <button 
            className="action-button" 
            onClick={() => {
              setImage(null);
              setImagePreview(null);
            }}
          >
            Remove Image
          </button>
          <label style={{ color: '#242424' }}>
            Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-input"
            />
          </label>

          <label style={{ color: '#242424' }}>
            Description:
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="text-input"
            />
          </label>

          <label style={{ color: '#242424' }}>
            Genre:
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="text-input"
            >
              {genres.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </label>

          <section className="color-picker-row">
            <label style={{ color: '#242424' }}>Background Color</label>
            <section className="color-circle" style={{ backgroundColor }}>
              <input type="color" value={backgroundColor} onChange={(e) => setBackgroundColor(e.target.value)} />
            </section>
          </section>

          <section className="color-picker-row">
            <label style={{ color: '#242424' }}>Text Color</label>
            <section className="color-circle" style={{ backgroundColor: textColor }}>
              <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} />
            </section>
          </section>

          <section className="button-row">
            <button className="action-button" onClick={handlePublish}>
              {hasStore ? "Update" : "Publish"}
            </button>
            <button className="action-button" onClick={handleRemove}>Remove</button>
          </section>
        </section>
      </section>

      {/* Product Creator Section */}
      {productCreators.map((creator, index) => (
        <section
          className="product-creator-bar"
          key={index}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file) handleProductImageChange(index, file);
          }}
        >
          <section 
          className={`product-image-uploader${productAnimations[index] ? ' animate-card' : ''}`}
          onClick={() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = (e) => {
              const file = e.target.files[0];
              if (file) handleProductImageChange(index, file);
            };
            input.click();
          }}>
            {creator.imagePreview ? (
              <img src={creator.imagePreview} alt="Product Preview" className="product-preview-img" />
            ) : (
              <p>Click to Upload Product Image</p>
            )}
          </section>

          <input
            type="text"
            className="product-title-input"
            placeholder="Enter product name"
            value={creator.name}
            onChange={(e) => handleProductNameChange(index, e.target.value)}
          />

          <input
            type="number"
            className="product-price-input"
            placeholder="Enter price"
            value={creator.price}
            onChange={(e) => handleProductPriceChange(index, e.target.value)}
            min="0"
            step="1"
          />

          <input
            type="number"
            className="product-stock-input"
            placeholder="Enter stock"
            value={creator.stock}
            onChange={(e) => handleProductStockChange(index, e.target.value)}
            min="0"
            step="1"
          />

          <section className="product-buttons">
            <button className="product-action-button" onClick={() => handleProductPublish(index)}>
              {creator.id ? "Update" : "Publish"}
            </button>
            <button className="product-action-button" onClick={() => handleProductRemove(index)}>Remove</button>
          </section>
        </section>
      ))}

      {hasStore && (
      <section className="add-product-bar" onClick={addProductCreator} style={{ cursor: 'pointer', textAlign: 'center', marginTop: '1rem' }}>
        <p style={{ fontSize: '2rem', color: '#4a4a4a' }}>
          <img src="/plus.png" alt="add-product-plus" style={{ width: '40px', height: '40px' }} />
        </p>
      </section>
      )}

      <section className="opacity-fade2" />
    </section>
  );
};

export default CardCreator;