import React, { useEffect, useState } from 'react';
import { database, auth } from './firebaseConfig';
import { ref, onValue, remove } from "firebase/database";
import './MedicineStockPage.css';

const MedicineStockPage = () => {
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    if (auth.currentUser) {
      const userId = auth.currentUser.uid;
      const medicinesRef = ref(database, `users/${userId}/medicines`);
      onValue(medicinesRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const updatedMedicines = Object.keys(data).map(key => {
            const medicine = data[key];
            const daysPassed = calculateDaysPassed(medicine.createdAt);
            let updatedStock = medicine.stock - (daysPassed * medicine.pillsPerDay);
            if (isNaN(updatedStock) || updatedStock < 0) {
              updatedStock = 0;
            }
            return { ...medicine, id: key, stock: updatedStock };
          });
          setMedicines(updatedMedicines);
        } else {
          setMedicines([]);
        }
      });
    }
  }, [auth.currentUser]);

  const calculateDaysPassed = (createdAt) => {
    if (!createdAt) return 0;
    const currentDate = new Date();
    const creationDate = new Date(createdAt);
    const timeDifference = currentDate - creationDate;
    const daysPassed = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    return daysPassed;
  };

  const handleDelete = (id) => {
    const userId = auth.currentUser.uid;
    const medicineRef = ref(database, `users/${userId}/medicines/${id}`);
    
    remove(medicineRef)
      .then(() => {
        setMedicines((prevMedicines) => prevMedicines.filter(med => med.id !== id));
        alert('Medicine deleted successfully!');
      })
      .catch((error) => {
        console.error('Error deleting medicine: ', error);
      });
  };
  

  const getRowClass = (stock, pillsPerDay) => {
    if (stock / pillsPerDay >= 5) return 'stock-high';
    if (stock / pillsPerDay >= 2 && stock / pillsPerDay <= 4) return 'stock-low';
    return 'stock-out';
  };

  return (
    <div className="stock-container">
      <h2 className="stock-title">Medicine Stock</h2>
      <div className="stock-table-wrapper">
        <table className="stock-table">
          <thead>
            <tr>
              <th>Medicine Name</th>
              <th>Dosage (mg)</th>
              <th>Pills per Day</th>
              <th>Price (Rs)</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {auth.currentUser ? medicines.map((medicine, index) => (
              <tr key={index} className={getRowClass(medicine.stock, medicine.pillsPerDay)}>
                <td>{medicine.name}</td>
                <td>{medicine.dosage}</td>
                <td>{medicine.pillsPerDay}</td>
                <td>{medicine.price}</td>
                <td>{medicine.stock}</td>
                <td>
                  <button onClick={() => handleDelete(medicine.id)}>Delete</button>
                </td>
              </tr>
            )) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MedicineStockPage;
