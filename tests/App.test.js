/**
 * @jest-environment node
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../src/App';

const renderWithRoute = (initialRoute) => {
  render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <App />
    </MemoryRouter>
  );
};

describe('App Routing', () => {
  test('renders HomePage on default route', () => {
    renderWithRoute('/');
    expect(screen.getByText(/For Artists By Artists/i)).toBeInTheDocument(); // Adjust based on actual content
  });

  test('renders CreateShop page', () => {
    renderWithRoute('/CreateShop');
    expect(screen.getByText(/CreateShop/i)).toBeInTheDocument();
  });

  test('renders UploadProducts page', () => {
    renderWithRoute('/UploadProducts');
    expect(screen.getByText(/UploadProducts/i)).toBeInTheDocument();
  });

  test('renders VerifyArtisan page', () => {
    renderWithRoute('/verifyArtisan');
    expect(screen.getByText(/VerifyArtisan/i)).toBeInTheDocument();
  });

  test('renders Login page', () => {
    renderWithRoute('/Login');
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
  });

  test('renders Dashboard page', () => {
    renderWithRoute('/Dashboard');
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
  });

  test('renders Artists page', () => {
    renderWithRoute('/Artists');
    expect(screen.getByText(/Artists/i)).toBeInTheDocument();
  });
});
