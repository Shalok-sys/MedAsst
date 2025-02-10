import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MedicineInputPage from './MedicineInputPage';
import { database, auth } from './firebaseConfig';
import { ref, push } from 'firebase/database';

global.alert = jest.fn();

const mockedRef = {}; // Define a valid reference object

jest.mock('firebase/database', () => ({
  ref: jest.fn(() => mockedRef), // Mock ref to return mockedRef
  push: jest.fn(),
}));

jest.mock('./firebaseConfig', () => ({
  database: {},
  auth: { currentUser: { uid: 'testUser123' } },
}));

describe('MedicineInputPage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the form correctly', () => {
    render(<MedicineInputPage />);

    expect(screen.getByPlaceholderText('Medicine Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Dosage per Pill (mg)')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Pills per Day')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Price ($)')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Stock Quantity')).toBeInTheDocument();
    expect(screen.getByText('Add Medicine')).toBeInTheDocument();
  });

  test('updates input values correctly', () => {
    render(<MedicineInputPage />);

    const nameInput = screen.getByPlaceholderText('Medicine Name');
    fireEvent.change(nameInput, { target: { value: 'Paracetamol' } });

    expect(nameInput.value).toBe('Paracetamol');
  });

  test('submits form and adds medicine to Firebase', () => {
    render(<MedicineInputPage />);

    fireEvent.change(screen.getByPlaceholderText('Medicine Name'), { target: { value: 'Paracetamol' } });
    fireEvent.change(screen.getByPlaceholderText('Dosage per Pill (mg)'), { target: { value: '500' } });
    fireEvent.change(screen.getByPlaceholderText('Pills per Day'), { target: { value: '2' } });
    fireEvent.change(screen.getByPlaceholderText('Price ($)'), { target: { value: '10' } });
    fireEvent.change(screen.getByPlaceholderText('Stock Quantity'), { target: { value: '20' } });

    fireEvent.click(screen.getByText('Add Medicine'));

    expect(ref).toHaveBeenCalledWith(expect.anything(), 'users/testUser123/medicines'); // Ensure correct path
    expect(push).toHaveBeenCalledWith(
      mockedRef, // Now ref() returns a valid value
      expect.objectContaining({
        name: 'Paracetamol',
        dosage: '500',
        pillsPerDay: '2',
        price: '10',
        stock: '20',
      })
    );

    expect(screen.getByPlaceholderText('Medicine Name').value).toBe('');
  });

  test('shows alert if user is not logged in', () => {
    auth.currentUser = null;

    global.alert = jest.fn(); // Mock alert

    render(<MedicineInputPage />);
    fireEvent.click(screen.getByText('Add Medicine'));

    expect(global.alert).toHaveBeenCalledWith('Please log in to save medicines.');
  });
});
