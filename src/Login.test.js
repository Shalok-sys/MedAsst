import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Login from './Login';
import { auth } from './firebaseConfig';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

global.alert = jest.fn();


jest.mock('firebase/auth', () => ({
  GoogleAuthProvider: jest.fn(),
  signInWithPopup: jest.fn(() => Promise.resolve({ user: { displayName: 'Test User' } })),
  signOut: jest.fn(() => Promise.resolve()),
}));

jest.mock('./firebaseConfig', () => ({
  auth: {
    currentUser: null,
  },
}));

describe('Login Component', () => {
  it('renders login button when user is not logged in', () => {
    render(<Login setUser={jest.fn()} />);
    expect(screen.getByText('Login with Google')).toBeInTheDocument();
  });

  it('calls signInWithPopup when login button is clicked', async () => {
    const setUserMock = jest.fn();
    render(<Login setUser={setUserMock} />);

    fireEvent.click(screen.getByText('Login with Google'));
    
    await expect(signInWithPopup).toHaveBeenCalledWith(auth, expect.any(GoogleAuthProvider));
  });

  it('calls signOut when logout button is clicked', async () => {
    auth.currentUser = { displayName: 'Test User' }; // Mock user login state
    const setUserMock = jest.fn();
    render(<Login setUser={setUserMock} />);
  
    fireEvent.click(screen.getByText('Logout'));
  
    await expect(signOut).toHaveBeenCalled();
    expect(global.alert).toHaveBeenCalledWith('Logout successful!'); // Check if alert is called
  });
  
});
