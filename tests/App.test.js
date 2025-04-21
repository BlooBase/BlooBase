import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../src/App';

describe('App routing', () => {
  const renderWithRoute = (route) => {
    render(
      <MemoryRouter initialEntries={[route]}>
        <App />
      </MemoryRouter>
    );
  };

  test('renders HomePage by default', async () => {
    renderWithRoute('/');
    await waitFor(() => {
      expect(screen.getByText(/For Artists By Artists/i)).toBeInTheDocument(); // Adjust to actual content
    });
  });

  test('navigates to CreateShop', async () => {
    renderWithRoute('/CreateShop');
    await waitFor(() => {
      expect(screen.getByText(/CreateShop/i)).toBeInTheDocument(); // Adjust if needed
    });
  });

  test('navigates to UploadProducts', async () => {
    renderWithRoute('/UploadProducts');
    await waitFor(() => {
      expect(screen.getByText(/UploadProducts/i)).toBeInTheDocument();
    });
  });

  test('navigates to VerifyArtisan', async () => {
    renderWithRoute('/verifyArtisan');
    await waitFor(() => {
      expect(screen.getByText(/VerifyArtisan/i)).toBeInTheDocument();
    });
  });

  test('navigates to Login', async () => {
    renderWithRoute('/Login');
    await waitFor(() => {
      expect(screen.getByText(/Login/i)).toBeInTheDocument();
    });
  });

  test('navigates to Dashboard', async () => {
    renderWithRoute('/Dashboard');
    await waitFor(() => {
      expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    });
  });
});
