import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HomePage from '../components/HomePage';

describe('HomePage Component', () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
  });

  test('renders BlooBase logo and title', () => {
    expect(screen.getByAltText('BlooBase Logo')).toBeInTheDocument();
    expect(screen.getByText('BlooBase')).toBeInTheDocument();
  });

  test('renders navigation links', () => {
    expect(screen.getByText('Artists')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
    expect(screen.getByText('Log In')).toBeInTheDocument();
  });

  test('renders hero title and subtitle', () => {
    expect(screen.getByText('For Artists By Artists')).toBeInTheDocument();
    expect(
      screen.getByText('The ever expanding global artist marketplace for all your needs.')
    ).toBeInTheDocument();
  });

  test('renders product grid with 4 items', () => {
    const productImages = screen.getAllByAltText(/Product \d/);
    expect(productImages.length).toBe(4);
    productImages.forEach((img, index) => {
      expect(img).toHaveAttribute('src', '/jewelry.jpg');
      expect(screen.getByText(`Product Name ${index + 1}`)).toBeInTheDocument();
    });
  });

  test('renders footer', () => {
    expect(screen.getByText(/© 2025 BlooBase/i)).toBeInTheDocument();
  });
});
