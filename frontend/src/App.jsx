import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from './Login';
import DashboardStudent from './DashboardStudent';
import DashboardProfesor from './DashboardProfesor';

function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/" element={<Login />} />
        <Route path="/student" element={<DashboardStudent />} />
        <Route path="/profesor" element={<DashboardProfesor />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;