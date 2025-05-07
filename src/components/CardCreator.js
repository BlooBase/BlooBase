import React, { useRef, useState, useEffect } from 'react';
import '../CardCreator.css';
import Navbar from '../components/Navbar';
import { addSeller } from '../firebase/addSeller'; // Import the addSeller function

const CardCreator = () => {
  const fileInputRef = useRef();
  const cardRef = useRef();
  const [animateCard, setAnimateCard] = useState(false);

  const storedData = JSON.parse(localStorage.getItem('cardData')) || {};

  const [statusMessage, setStatusMessage] = useState('');
  const [image, setImage] = useState(null); // Store the File object for upload
  const [imagePreview, setImagePreview] = useState(storedData.image || null); // Store the Base64 string for preview
  const [backgroundColor, setBackgroundColor] = useState(storedData.backgroundColor || '#fff0e6');
  const [textColor, setTextColor] = useState(storedData.textColor || '#93aed9');
  const [name, setName] = useState(storedData.name || 'Name');
  const [description, setDescription] = useState(storedData.description || 'Bio');
  const [genre, setGenre] = useState(storedData.genre || 'Genre'); // New state for genre

  const genres = ['Digital Art', 'Drawing', 'Painting', 'Photography', 'Sculptures', 'Mixed Media']; // Predefined genres

  useEffect(() => {
    localStorage.setItem('cardData', JSON.stringify({
      image: imagePreview, // Save base64 string for preview
      backgroundColor,
      textColor,
      name,
      description
    }));
  }, [imagePreview, backgroundColor, textColor, name, description]);
  
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
    setStatusMessage(''); // Clear first to re-trigger visibility
    setAnimateCard(false);
  
    // Small timeout to allow state to reset
    setTimeout(() => {
      setStatusMessage(message);
      setAnimateCard(true);
  
      setTimeout(() => setAnimateCard(false), 1000);
    }, 50);
  };
  

  const handlePublish = async () => {
    if (!image || !name || !description) {
      triggerAnimation('Please fill in all fields.');
      return;
    }

    try {
      // Call addSeller to add the seller to the database
      await addSeller({
        image, // Pass the File object
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
      reader.onloadend = () => setImagePreview(reader.result); // Set Base64 string for preview
      reader.readAsDataURL(file);
      setImage(file); // Set the File object for upload
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result); // Set Base64 string for preview
      reader.readAsDataURL(file);
      setImage(file); // Set the File object for upload
    }
  };

  const user = {
    name: 'DigitalJosh',
    avatarUrl: 'https://i.pravatar.cc/100',
    avatarLocal: '/pfp.jpeg'
  };

  return (
    <section className="card-creator-wrapper" style={{ backgroundColor }}>
      <Navbar pageTitle="Card Creator" user={user} bgColor="#fff6fb" textColor="#165a9c" />

        {/* Notification bubble */}
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
      <section className="opacity-fade2" />
    </section>
  );
};

export default CardCreator;