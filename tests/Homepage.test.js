import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HomePage from '../src/HomePage'; 

describe('HomePage Component', () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
  });

  test('renders BlooBase logo and title', () => {
    expect(screen.getByText('BlooBase')).toBeInTheDocument();
    expect(screen.getByAltText('BlooBase Logo')).toHaveAttribute('src', '/bloobase.png');
  });

  test('renders navigation links', () => {
    expect(screen.getByRole('link', { name: /artists/i })).toHaveAttribute('href', '/artists');
    expect(screen.getByRole('link', { name: /sign up/i })).toHaveAttribute('href', '/signup');
    expect(screen.getByRole('link', { name: /log in/i })).toHaveAttribute('href', '/login');
  });

  test('renders hero title and subtitle', () => {
    expect(screen.getByText('For Artists By Artists')).toBeInTheDocument();
    expect(
      screen.getByText('The ever expanding global artist marketplace for all your needs.')
    ).toBeInTheDocument();
  });

  test('renders product grid with 4 items', () => {
    const productImages = screen.getAllByAltText(/Product \d/);
    expect(productImages).toHaveLength(4);
    productImages.forEach((img, index) => {
      expect(img).toHaveAttribute('src', '/jewelry.jpg');
      expect(screen.getByText(`Product Name ${index + 1}`)).toBeInTheDocument();
      expect(screen.getByText('$99.99')).toBeInTheDocument();
      expect(screen.getByText('Store Name')).toBeInTheDocument();
    });
  });

  test('renders footer', () => {
    expect(screen.getByText(/© 2025 BlooBase/i)).toBeInTheDocument();
  });
});