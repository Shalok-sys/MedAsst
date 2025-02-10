import React, { useEffect, useState } from 'react';
import { database, auth } from './firebaseConfig';
import { ref, onValue } from "firebase/database";
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
          setMedicines(Object.values(data));
        } else {
          setMedicines([]);
        }
      });
    }
  }, [auth.currentUser]);

  const getRowClass = (stock, pillsPerDay) => {
    if (stock/ pillsPerDay >= 5) return 'stock-high';
    if (stock / pillsPerDay >= 2 && stock / pillsPerDay <=4) return 'stock-low';
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
            </tr>
          </thead>
          <tbody>
            {medicines.map((medicine, index) => (
              <tr key={index} className={getRowClass(medicine.stock, medicine.pillsPerDay)}>
                <td>{medicine.name}</td>
                <td>{medicine.dosage}</td>
                <td>{medicine.pillsPerDay}</td>
                <td>{medicine.price}</td>
                <td>{medicine.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default MedicineStockPage;
