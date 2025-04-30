// src/components/FloatingCart.js
import React, { useRef, useEffect, useState } from 'react';
import '../FloatingCart.css';
import { Link } from 'react-router-dom';

const FloatingCart = () => {
  const cartRef = useRef(null);
  const [position, setPosition] = useState(() => {
    // Load position from localStorage or use default
    const saved = localStorage.getItem('floatingCartPosition');
    return saved ? JSON.parse(saved) : { top: 150, left: 20 };
  });

  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (dragging) {
        const newPos = {
          top: e.clientY - offset.y,
          left: e.clientX - offset.x,
        };
        setPosition(newPos);
        localStorage.setItem('floatingCartPosition', JSON.stringify(newPos));
      }
    };

    const handleMouseUp = () => setDragging(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, offset]);

  const startDragging = (e) => {
    const rect = cartRef.current.getBoundingClientRect();
    setOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setDragging(true);
  };

  return (
    <section
      ref={cartRef}
      className="floating-cart"
      style={{ top: `${position.top}px`, left: `${position.left}px` }}
      onMouseDown={startDragging}
    >
      <Link to="/Cart">
        <img src="/cart1.png" alt="Cart" style={{ pointerEvents: 'none' }} />
      </Link>
      
    </section>
  );
};

export default FloatingCart;
