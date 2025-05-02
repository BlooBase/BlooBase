import React, { useRef, useState, useEffect } from 'react';
import '../CardCreator.css';
import Navbar from '../components/Navbar';

const CardCreator = () => {
  const fileInputRef = useRef();
  const cardRef = useRef();
  const [animateCard, setAnimateCard] = useState(false);

  const storedData = JSON.parse(localStorage.getItem('cardData')) || {};

  const [statusMessage, setStatusMessage] = useState('');
  const [image, setImage] = useState(storedData.image || null);
  const [backgroundColor, setBackgroundColor] = useState(storedData.backgroundColor || '#fff0e6');
  const [textColor, setTextColor] = useState(storedData.textColor || '#93aed9');
  const [name, setName] = useState(storedData.name || 'Name');
  const [description, setDescription] = useState(storedData.description || 'Bio');

  useEffect(() => {
    localStorage.setItem('cardData', JSON.stringify({
      image,
      backgroundColor,
      textColor,
      name,
      description
    }));
  }, [image, backgroundColor, textColor, name, description]);

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
  

  const handlePublish = () => {
    triggerAnimation('Card Published');
  };

  const handleUpdate = () => {
    triggerAnimation('Card Updated');
  };

  const handleRemove = () => {
    triggerAnimation('Card Removed');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
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
        <div className="status-notification">{statusMessage}</div>
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
          {image ? (
            <img src={image} alt="Card Preview" className="artist-card-image" />
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
          <button className="action-button" onClick={() => setImage(null)}>Remove Image</button>

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
            <button className="action-button" onClick={handleUpdate}>Update</button>
            <button className="action-button" onClick={handleRemove}>Remove</button>
          </section>

        </section>
      </section>
      <section className="opacity-fade2" />
    </section>
  );
};

export default CardCreator;
