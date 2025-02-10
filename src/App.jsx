import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import MedicineInputPage from './MedicineInputPage';
import MedicineStockPage from './MedicineStockPage';
import Login from './Login';
import Home from './Home';
import './App.css';
import { auth } from './firebaseConfig';

const App = () => {
  const [user, setUser] = useState(null);

  return (
      <div>
        <Router>
        <nav>
          <ul>
            <li><Link to="/add-medicine">Add Medicine</Link></li>
            <li><Link to="/view-stock">View Stock</Link></li>
            <li><Login setUser={setUser} /> </li>
            <li>{auth.currentUser ? (<p>Hello! {auth.currentUser.displayName}</p>): (<h3>Unsaved Data</h3>)}</li>
          </ul>
        </nav>

        <h1>Medicine Stock Monitor</h1>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add-medicine" element={<MedicineInputPage />} />
          <Route path="/view-stock" element={<MedicineStockPage />} />
        </Routes>
        </Router>
      </div>
  );
};

export default App;
