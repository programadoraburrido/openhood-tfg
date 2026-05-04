import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './layouts/MainLayout';
import HistorialVehiculo from './pages/HistorialVehiculo'; 
import PoliticaPrivacidad from './pages/PoliticaPrivacidad';
import TerminosUso from './pages/TerminosUso';
import AvisoLegal from './pages/AvisoLegal';

function App() {
  return (
    <BrowserRouter>
      <Routes>  
        <Route element={<Layout />}>
          <Route path="/historial/:matricula" element={<HistorialVehiculo />} />
          <Route path="/politica-privacidad" element={<PoliticaPrivacidad />} />
          <Route path="/terminos-uso" element={<TerminosUso />} />
          <Route path="/aviso-legal" element={<AvisoLegal />} />
        </Route>

        {/* RUTA FUERA DEL LAYOUT: 
            Si algún día haces pantalla de Login y NO quieres que tenga 
            el Navbar y el Footer, simplemente la pones aquí abajo, fuera del padre. */}
        {/* <Route path="/login" element={<Login />} /> */}

      </Routes>
    </BrowserRouter>
  );
}

export default App;