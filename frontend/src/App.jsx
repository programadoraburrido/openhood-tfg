import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HistorialVehiculo from './pages/HistorialVehiculo'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/historial/:matricula" element={<HistorialVehiculo />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;