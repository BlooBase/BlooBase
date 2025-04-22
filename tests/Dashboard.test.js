import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Dashboard from '../components/Dashboard'; // adjust path as needed
import { MemoryRouter } from 'react-router-dom';

describe('Dashboard Component', () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
  });

  test('renders sidebar icons with navigation links', () => {
    expect(screen.getByAltText('Dashboard')).toBeInTheDocument();
    expect(screen.getByAltText('Home')).toBeInTheDocument();
    expect(screen.getByAltText('Users')).toBeInTheDocument();
    expect(screen.getByAltText('Analytics')).toBeInTheDocument();
    expect(screen.getByAltText('Settings')).toBeInTheDocument();
  });

  test('renders search bar and placeholder', () => {
    expect(screen.getByAltText('Search')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search for artisan/store')).toBeInTheDocument();
  });

  test('renders all stat items with values', () => {
    expect(screen.getByText('234')).toBeInTheDocument();
    expect(screen.getByText('Total Artisans')).toBeInTheDocument();
    expect(screen.getByText('R56,789')).toBeInTheDocument();
    expect(screen.getByText('Average Revenue per Store')).toBeInTheDocument();
    expect(screen.getByText('156')).toBeInTheDocument();
    expect(screen.getByText('Active Stores')).toBeInTheDocument();
  });

  test('renders recent artisans table with users', () => {
    expect(screen.getByText('Recent Artisans')).toBeInTheDocument();
    expect(screen.getByText('John Kelly')).toBeInTheDocument();
    expect(screen.getByText('Thato Mazibuko')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Inactive')).toBeInTheDocument();
  });

  test('renders most popular stores table', () => {
    expect(screen.getByText('Most Popular Stores')).toBeInTheDocument();
    expect(screen.getByText('Artisan Crafts')).toBeInTheDocument();
    expect(screen.getByText('Handmade Treasures')).toBeInTheDocument();
    expect(screen.getByText('4.8')).toBeInTheDocument();
    expect(screen.getByText('4.5')).toBeInTheDocument();
  });

  test('renders recent transactions table', () => {
    expect(screen.getByText('Recent Transactions')).toBeInTheDocument();
    expect(screen.getByText('TX123456')).toBeInTheDocument();
    expect(screen.getByText('TX123457')).toBeInTheDocument();
    expect(screen.getByText('R2,500')).toBeInTheDocument();
    expect(screen.getByText('R1,800')).toBeInTheDocument();
  });

  test('renders chart placeholder', () => {
    expect(screen.getByText('Performance Chart')).toBeInTheDocument();
    expect(screen.getByText(/Chart Placeholder/i)).toBeInTheDocument();
  });

  test('toggles sidebar visibility on menu click', () => {
    const menuButton = screen.getByAltText('Menu').closest('button');
    const sidebar = document.querySelector('.sidebar');

    expect(sidebar.classList.contains('sidebar-closed')).toBe(true);
    fireEvent.click(menuButton);
    expect(document.querySelector('.sidebar').classList.contains('sidebar-open')).toBe(true);
  });
});
