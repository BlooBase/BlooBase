/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import Login from '../components/Login'; 
import * as firebase from '../firebase/firebase';

// Mock React Router's useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

// Mock Firebase functions
jest.mock('../firebase/firebase', () => ({
  loginNormUser: jest.fn(),
  GoogleLogin: jest.fn(),
  getUserRole: jest.fn(),
}));

// Mock CSS import
jest.mock('../Login.css', () => ({}), { virtual: true });

describe('Login Component', () => {
  const navigateMock = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    useNavigate.mockReturnValue(navigateMock);

    // Mock Image loading
    global.Image = class {
      constructor() {
        setTimeout(() => {
          this.onload && this.onload();
        }, 100);
      }
    };

    // Mock window alert
    window.alert = jest.fn();
  });

  const renderLoginComponent = () => {
    return render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
  };

  test('renders login form elements', () => {
    renderLoginComponent();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
    expect(screen.getByText(/continue with google/i)).toBeInTheDocument();
  });

  test('handles email login for Buyer role', async () => {
    firebase.loginNormUser.mockResolvedValue({});
    firebase.getUserRole.mockResolvedValue('Buyer');

    renderLoginComponent();

    // Fill form
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'Test@1234' },
    });

    // Submit
    fireEvent.click(screen.getByText(/sign in/i));

    await waitFor(() => {
      expect(firebase.loginNormUser).toHaveBeenCalledWith({ 
        email: 'test@example.com',
        password: 'Test@1234' 
      });
      expect(firebase.getUserRole).toHaveBeenCalled();
      expect(navigateMock).toHaveBeenCalledWith('/BuyerHomePage');
    });
  });

  test('handles email login for Seller role', async () => {
    firebase.loginNormUser.mockResolvedValue({});
    firebase.getUserRole.mockResolvedValue('Seller');

    renderLoginComponent();

    // Fill form
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'seller@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'Password123' },
    });

    // Submit
    fireEvent.click(screen.getByText(/sign in/i));

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith('/SellerHomepage');
    });
  });

  test('handles email login for Admin role', async () => {
    firebase.loginNormUser.mockResolvedValue({});
    firebase.getUserRole.mockResolvedValue('Admin');

    renderLoginComponent();

    // Fill form
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'admin@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'AdminPass123' },
    });

    // Submit
    fireEvent.click(screen.getByText(/sign in/i));

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith('/Dashboard');
    });
  });

  test('handles unrecognized role for email login', async () => {
    firebase.loginNormUser.mockResolvedValue({});
    firebase.getUserRole.mockResolvedValue('UnknownRole');

    renderLoginComponent();

    // Fill form
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'unknown@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'PassUnknown' },
    });

    // Submit
    fireEvent.click(screen.getByText(/sign in/i));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('User role not recognized');
    });
  });

  test('handles Google login for Buyer role', async () => {
    firebase.GoogleLogin.mockResolvedValue({});
    firebase.getUserRole.mockResolvedValue('Buyer');

    renderLoginComponent();
    
    // Click Google login button
    fireEvent.click(screen.getByText(/continue with google/i));

    await waitFor(() => {
      expect(firebase.GoogleLogin).toHaveBeenCalled();
      expect(firebase.getUserRole).toHaveBeenCalled();
      expect(navigateMock).toHaveBeenCalledWith('/BuyerHomePage');
    });
  });

  test('handles Google login for Seller role', async () => {
    firebase.GoogleLogin.mockResolvedValue({});
    firebase.getUserRole.mockResolvedValue('Seller');

    renderLoginComponent();
    
    fireEvent.click(screen.getByText(/continue with google/i));

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith('/SellerHomepage');
    });
  });

  test('handles Google login for Admin role', async () => {
    firebase.GoogleLogin.mockResolvedValue({});
    firebase.getUserRole.mockResolvedValue('Admin');

    renderLoginComponent();
    
    fireEvent.click(screen.getByText(/continue with google/i));

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith('/dashboard');
    });
  });

  test('handles unrecognized role for Google login', async () => {
    firebase.GoogleLogin.mockResolvedValue({});
    firebase.getUserRole.mockResolvedValue('UnknownRole');

    renderLoginComponent();
    
    fireEvent.click(screen.getByText(/continue with google/i));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('User role not recognized');
      expect(navigateMock).not.toHaveBeenCalled();
    });
  });

  test('displays error message on email login failure', async () => {
    const errorMessage = 'Invalid credentials';
    firebase.loginNormUser.mockRejectedValue(new Error(errorMessage));

    renderLoginComponent();
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'fail@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrongpass' },
    });

    fireEvent.click(screen.getByText(/sign in/i));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  test('displays error message on Google login failure', async () => {
    const errorMessage = 'Google authentication failed';
    firebase.GoogleLogin.mockRejectedValue(new Error(errorMessage));

    renderLoginComponent();
    
    fireEvent.click(screen.getByText(/continue with google/i));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  test('toggles password visibility', () => {
    renderLoginComponent();
    
    // Password should initially be hidden
    const passwordInput = screen.getByLabelText(/password/i);
    expect(passwordInput.type).toBe('password');
    
    // Click the eye icon to show password
    const toggleButton = screen.getByRole('generic', { name: '' }).closest('.toggle-password-icon');
    fireEvent.click(toggleButton);
    
    // Password should now be visible
    expect(passwordInput.type).toBe('text');
    
    // Click again to hide
    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('password');
  });
});