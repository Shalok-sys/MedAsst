import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { auth } from './firebaseConfig';

// Mocking Firebase auth module
jest.mock('./firebaseConfig', () => ({
  auth: {
    currentUser: null, // Default to no user
  },
}));

describe('App Component', () => {
  it('renders correctly without a user logged in', () => {
    render(<App />); // No need for MemoryRouter here
    expect(screen.getByText('Medicine Stock Monitor')).toBeInTheDocument();
    expect(screen.getByText('Add Medicine')).toBeInTheDocument();
    expect(screen.getByText('View Stock')).toBeInTheDocument();
    expect(screen.getByText('Unsaved Data')).toBeInTheDocument();
  });

  it('shows the logged-in user when authenticated', () => {
    // Mocking authenticated user
    auth.currentUser = { displayName: 'Test User' };

    render(<App />); // No need for MemoryRouter here
    expect(screen.getByText('Hello! Test User')).toBeInTheDocument();
  });
});
