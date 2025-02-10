import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import MedicineStockPage from './MedicineStockPage';
import { database, auth } from './firebaseConfig';
import { ref, onValue } from 'firebase/database';

// Mock Firebase authentication
jest.mock('./firebaseConfig', () => ({
  auth: {
    currentUser: { uid: 'testUser123' },
  },
  database: {},
}));

// Mock Firebase Realtime Database
jest.mock('firebase/database', () => ({
  ref: jest.fn(),
  onValue: jest.fn((refPath, callback) => {
    // Simulating Firebase returning medicine data
    const mockSnapshot = {
      val: () => ({
        med1: { name: 'Paracetamol', dosage: 500, pillsPerDay: 2, price: 10, stock: 20 },
        med2: { name: 'Ibuprofen', dosage: 400, pillsPerDay: 1, price: 15, stock: 4 },
      }),
    };
    callback(mockSnapshot);
  }),
}));

describe('MedicineStockPage Component', () => {
  it('renders Medicine Stock title', () => {
    render(<MedicineStockPage />);
    expect(screen.getByText('Medicine Stock')).toBeInTheDocument();
  });

  it('fetches and displays medicines from Firebase', async () => {
    render(<MedicineStockPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Paracetamol')).toBeInTheDocument();
      expect(screen.getByText('Ibuprofen')).toBeInTheDocument();
    });

    expect(screen.getByText('500')).toBeInTheDocument();  // Dosage of Paracetamol
    expect(screen.getByText('400')).toBeInTheDocument();  // Dosage of Ibuprofen
  });

  it('applies correct row classes based on stock levels', async () => {
    render(<MedicineStockPage />);

    await waitFor(() => {
      const highStockRow = screen.getByText('Paracetamol').closest('tr');
      const lowStockRow = screen.getByText('Ibuprofen').closest('tr');

      expect(highStockRow).toHaveClass('stock-high'); // 20 / 2 = 10 (High stock)
      expect(lowStockRow).toHaveClass('stock-low');   // 4 / 1 = 4 (Low stock)
    });
  });
});
