/**
 * @jest-environment node
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Dashboard from "../src/components/Dashboard";

const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

describe("Dashboard Component", () => {
  test("renders search input", () => {
    renderWithRouter(<Dashboard />);
    const searchInput = screen.getByPlaceholderText(/Search for artisan\/store/i);
    expect(searchInput).toBeInTheDocument();
  });

  test("toggles sidebar visibility", () => {
    renderWithRouter(<Dashboard />);
    const menuButton = screen.getByRole("button");
    fireEvent.click(menuButton);
    const sidebar = screen.getByRole("complementary"); 
    expect(sidebar.className).toContain("sidebar-open");
  });

  test("displays artisan table", () => {
    renderWithRouter(<Dashboard />);
    expect(screen.getByText("John Kelly")).toBeInTheDocument();
    expect(screen.getByText("thatoMazib@icloud.com")).toBeInTheDocument();
  });
});
