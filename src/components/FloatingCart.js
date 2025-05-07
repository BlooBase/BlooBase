// src/components/FloatingCart.js
import React, { useRef, useEffect, useState } from 'react';
import '../FloatingCart.css';
import { Link } from 'react-router-dom';

const clampPosition = (top, left, cartWidth = 100, cartHeight = 100) => {
  const maxLeft = window.innerWidth - cartWidth;
  const maxTop = window.innerHeight - cartHeight;
  return {
    top: Math.min(Math.max(0, top), maxTop),
    left: Math.min(Math.max(0, left), maxLeft),
  };
};

const FloatingCart = () => {
  const cartRef = useRef(null);

  const [position, setPosition] = useState(() => {
    const saved = localStorage.getItem('floatingCartPosition');
    const initial = saved ? JSON.parse(saved) : { top: 150, left: 20 };
    return clampPosition(initial.top, initial.left);
  });

  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (clientX, clientY) => {
      const newTop = clientY - offset.y;
      const newLeft = clientX - offset.x;
      const rect = cartRef.current?.getBoundingClientRect();
      const clamped = clampPosition(newTop, newLeft, rect?.width || 100, rect?.height || 100);
      setPosition(clamped);
      localStorage.setItem('floatingCartPosition', JSON.stringify(clamped));
    };

    const handleMouseMove = (e) => {
      if (dragging) handleMove(e.clientX, e.clientY);
    };

    const handleTouchMove = (e) => {
      if (dragging && e.touches[0]) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const stopDragging = () => setDragging(false);

    const handleResize = () => {
      const rect = cartRef.current?.getBoundingClientRect();
      const clamped = clampPosition(position.top, position.left, rect?.width || 100, rect?.height || 100);
      setPosition(clamped);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', stopDragging);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', stopDragging);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', stopDragging);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', stopDragging);
      window.removeEventListener('resize', handleResize);
    };
  }, [dragging, offset, position]);

  const startDragging = (e) => {
    const rect = cartRef.current.getBoundingClientRect();
    if (e.type === 'mousedown') {
      setOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    } else if (e.type === 'touchstart' && e.touches[0]) {
      setOffset({
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      });
    }
    setDragging(true);
  };

  return (
    <section
      ref={cartRef}
      className="floating-cart"
      style={{ top: `${position.top}px`, left: `${position.left}px` }}
      onMouseDown={startDragging}
      onTouchStart={startDragging}
    >
      <Link to="/Cart">
        <img src="/cart1.png" alt="Cart" style={{ pointerEvents: 'none' }} />
      </Link>
    </section>
  );
};

export default FloatingCart;
