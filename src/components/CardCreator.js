import React, { useRef, useState, useEffect } from 'react';
import '../CardCreator.css';
import Navbar from '../components/Navbar';
import { addSeller } from '../firebase/addSeller';

const CardCreator = () => {
  const fileInputRef = useRef();
  const cardRef = useRef();
  const [animateCard, setAnimateCard] = useState(false);

  const storedData = JSON.parse(localStorage.getItem('cardData')) || {};

  const [statusMessage, setStatusMessage] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(storedData.image || null);
  const [backgroundColor, setBackgroundColor] = useState(storedData.backgroundColor || '#fff0e6');
  const [textColor, setTextColor] = useState(storedData.textColor || '#93aed9');
  const [name, setName] = useState(storedData.name || 'Name');
  const [description, setDescription] = useState(storedData.description || 'Bio');
  const [genre, setGenre] = useState(storedData.genre || 'Genre');

  const genres = ['Digital Art', 'Drawing', 'Painting', 'Photography', 'Sculptures', 'Mixed Media'];

  const savedProductCreators = JSON.parse(localStorage.getItem('productCreators')) || [
  { image: null, imagePreview: null, title: '' }
];

const [productCreators, setProductCreators] = useState(savedProductCreators);


  useEffect(() => {
    localStorage.setItem('cardData', JSON.stringify({
      image: imagePreview,
      backgroundColor,
      textColor,
      name,
      description
    }));
  }, [imagePreview, backgroundColor, textColor, name, description]);

  useEffect(() => {
  localStorage.setItem('productCreators', JSON.stringify(productCreators));
}, [productCreators]);


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

  const triggerAnimationFail = (message) => {
    setStatusMessage('');
    setTimeout(() => {
      setStatusMessage(message);
    }, 50);
  };

  const handlePublish = async () => {
    if (!image || !name || !description) {
      triggerAnimationFail('Please fill in all fields.');
      return;
    }

    try {
      await addSeller({
        image,
        color: backgroundColor,
        description,
        genre,
        textColor,
        title: name,
      });

      triggerAnimation('Card Published');
    } catch (error) {
      console.error('Failed to publish card:', error);
      triggerAnimation('Failed to Publish');
    }
  };

  const handleRemove = () => {
    triggerAnimation('Card Removed');
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

  const handleProductTitleChange = (index, value) => {
    const updated = [...productCreators];
    updated[index].title = value;
    setProductCreators(updated);
  };

  const addProductCreator = () => {
    setProductCreators([...productCreators, { image: null, imagePreview: null, title: '' }]);
  };

  const removeProductCreator = (index) => {
    const updated = productCreators.filter((_, i) => i !== index);
    setProductCreators(updated);
    triggerAnimation('Product Removed');
  };

  const handleProductPublish = (index) => {
    const { image, title } = productCreators[index];
    if (!image || !title) {
      triggerAnimationFail('Please provide product image and title.');
      return;
    }
    triggerAnimation(`Product ${index + 1} Published`);
  };

  const handleProductRemove = (index) => {
    triggerAnimation(`Product ${index + 1} Removed`);
  };

  return (
    <section className="card-creator-wrapper" style={{ backgroundColor }}>
      <Navbar pageTitle="Card Creator" bgColor="#fff6fb" textColor="#165a9c" />

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
            <button className="action-button" onClick={handlePublish}>Publish</button>
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
          <section className="product-image-uploader" onClick={() => {
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
            placeholder="Enter product title"
            value={creator.title}
            onChange={(e) => handleProductTitleChange(index, e.target.value)}
          />

          <section className="product-buttons">
            <button className="product-action-button" onClick={() => handleProductPublish(index)}>Publish</button>
            <button className="product-action-button" onClick={() => handleProductRemove(index)}>Remove</button>
            <button className="product-action-button" onClick={() => removeProductCreator(index)}>
              <p style={{ color: 'red', fontSize: '20px' }}>🗑</p>
            </button>
          </section>
        </section>
      ))}

      <section className="add-product-bar" onClick={addProductCreator} style={{ cursor: 'pointer', textAlign: 'center', marginTop: '1rem' }}>
        <p style={{ fontSize: '2rem', color: '#4a4a4a' }}>
          <img src="/plus.png" alt="add-product-plus" style={{ width: '40px', height: '40px',  }} />
        </p>
      </section>

      <section className="opacity-fade2" />
    </section>
  );
};

export default CardCreator;
