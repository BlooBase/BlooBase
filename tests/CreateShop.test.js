import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CreateShop from "../src/components/CreateShop"; // Adjust the path if necessary

describe("CreateShop Component", () => {
  const renderWithRoute = (initialRoute) => {
    render(
      <MemoryRouter initialEntries={[initialRoute]}>
        <CreateShop />
      </MemoryRouter>
    );
  };

  test("renders CreateShop component correctly", () => {
    renderWithRoute("/CreateShop");

    // Check if the header text appears
    expect(screen.getByText(/Sign up to create a store with BlooBase./i)).toBeInTheDocument();
    expect(screen.getByText(/Enter your profile info./i)).toBeInTheDocument();

    // Check if form fields are rendered
    expect(screen.getByPlaceholderText("First Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Last Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Mobile Number")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Store Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Description of the store")).toBeInTheDocument();

    // Check if checkboxes are rendered
    expect(screen.getByLabelText(/Be the first to know about our offers and upcoming updates./i)).toBeInTheDocument();
    expect(screen.getByLabelText(/I agree to BlooBase's terms/i)).toBeInTheDocument();

    // Check if "Next" button is rendered
    expect(screen.getByText(/Next/i)).toBeInTheDocument();
  });

  test("navigates to UploadProducts page when Next is clicked", () => {
    renderWithRoute("/CreateShop");

    // Check that the 'Next' button is present
    const nextButton = screen.getByText(/Next/i);

    // Simulate a click on the 'Next' button
    fireEvent.click(nextButton);

    // Check if the URL changes to '/UploadProducts' (assuming navigation works as expected)
    expect(window.location.pathname).toBe("/UploadProducts");
  });
});
