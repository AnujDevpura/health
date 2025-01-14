// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import HomePage from './components/HomePage';
import PatientPortal from './components/PatientPortal';
import DoctorPortal from './components/DoctorPortal';
import Admin from './components/Admin';  // Import Admin component

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          
          {/* Other pages */}
          <Route path="/PatientPortal" element={<PatientPortal />} />
          <Route path="/DoctorPortal" element={<DoctorPortal />} />

          {/* Admin page */}
          <Route path="/Admin" element={<Admin contractAddress="0xF6AC235503c2e6257c13C1104E04225588754257" />} />  {/* Replace with your contract address */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
