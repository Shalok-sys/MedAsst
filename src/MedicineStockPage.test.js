import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import MedicineStockPage from './MedicineStockPage';
import { database, auth } from './firebaseConfig';
import { ref, onValue, remove } from 'firebase/database';

beforeEach(() => {
  global.alert = jest.fn();
});

// Mock Firebase authentication
jest.mock('./firebaseConfig', () => ({
  auth: {
    currentUser: { uid: 'testUser123' },
  },
  database: {},
}));

jest.mock('firebase/database', () => {
  const originalModule = jest.requireActual('firebase/database');

  let mockData = {
    med1: { name: 'Paracetamol', dosage: 500, pillsPerDay: 2, price: 10, stock: 20 },
    med2: { name: 'Ibuprofen', dosage: 400, pillsPerDay: 1, price: 15, stock: 4 },
  };

  return {
    ...originalModule,
    ref: jest.fn((db, path) => ({ path })),
    onValue: jest.fn((refPath, callback) => {
      callback({ val: () => mockData });
    }),
    remove: jest.fn((refPath) => {
      // Simulate deleting Paracetamol from Firebase
      if (refPath.path === 'users/testUser123/medicines/med1') {
        delete mockData.med1;
      }
      return Promise.resolve();
    }),
  };
});

describe('MedicineStockPage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

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
  });

  it('deletes a medicine from Firebase when delete button is clicked', async () => {
    render(<MedicineStockPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Paracetamol')).toBeInTheDocument();
    });

    const deleteButton = screen.getAllByText('Delete')[0]; // Delete Paracetamol

    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(remove).toHaveBeenCalledWith({ path: 'users/testUser123/medicines/med1' });
    });

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Medicine deleted successfully!');
    });

    // UI should update after deletion
    await waitFor(() => {
      expect(screen.queryByText('Paracetamol')).not.toBeInTheDocument();
    });
  });
});
