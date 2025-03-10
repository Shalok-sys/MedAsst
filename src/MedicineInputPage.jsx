import React, { useState } from 'react';
import { database, auth } from './firebaseConfig';
import { ref, push } from "firebase/database";
import './MedicineInputPage.css';

const MedicineInputPage = () => {
  const [medicine, setMedicine] = useState({
    name: '',
    dosage: '',
    pillsPerDay: '',
    price: '',
    stock: ''
  });

  const handleChange = (e) => {
    setMedicine({ ...medicine, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check if any field in the medicine object is empty
    if (!medicine.name || !medicine.dosage || !medicine.pillsPerDay || !medicine.price || !medicine.stock) {
      alert('Please fill in all fields before adding the medicine.');
      return;
    }
  
    if (auth.currentUser) {
      const userId = auth.currentUser.uid;
      const currentDate = new Date().toISOString(); // Get the current date and time in ISO format
      const medicineWithDate = { ...medicine, createdAt: currentDate }; // Add the creation date to the medicine object
      
      push(ref(database, `users/${userId}/medicines`), medicineWithDate); // Store under user UID
      
      setMedicine({ name: '', dosage: '', pillsPerDay: '', price: '', stock: '' });
      alert('Medicine added successfully!');
    } else {
      alert('Please log in to save medicines.');
      setMedicine({ name: '', dosage: '', pillsPerDay: '', price: '', stock: '' });
    }
  };
  

  return (
    <div className="medicine-container">
      <h2 className="medicine-title">Enter Medicine Details</h2>
      <form className="medicine-form" onSubmit={handleSubmit}>
        <input type="text" name="name" value={medicine.name} onChange={handleChange} placeholder="Medicine Name" />
        <input type="number" name="dosage" value={medicine.dosage} onChange={handleChange} placeholder="Dosage per Pill (mg)" />
        <input type="number" name="pillsPerDay" value={medicine.pillsPerDay} onChange={handleChange} placeholder="Pills per Day" />
        <input type="number" name="price" value={medicine.price} onChange={handleChange} placeholder="Price ($)" />
        <input type="number" name="stock" value={medicine.stock} onChange={handleChange} placeholder="Stock Quantity" />
        <button type="submit" className="submit-btn">Save Medicine</button>
      </form>
    </div>
  );
};

export default MedicineInputPage;
