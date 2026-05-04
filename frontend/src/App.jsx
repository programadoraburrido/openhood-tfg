import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Vehiculos from './pages/Vehiculos'; 
import HistorialVehiculo from './pages/HistorialVehiculo'; 

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas de Identidad y Garaje (Tu trabajo) */}
        <Route path="/login" element={<Login />} />
        <Route path="/vehiculos" element={<Vehiculos />} />
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* Rutas de Historial (Trabajo de tu compañero) */}
        <Route path="/historial/:matricula" element={<HistorialVehiculo />} />
      </Routes>
    </Router>
  );
}

export default App;