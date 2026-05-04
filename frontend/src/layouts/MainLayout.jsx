import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* 1. La barra de navegación fija arriba */}
      <Navbar />

      {/* 2. El contenido de la página ocupa el espacio restante */}
      <main className="flex-grow">
        <Outlet /> {/* <--- ¡AQUÍ ES DONDE SE INYECTA EL HISTORIAL O CUALQUIER PÁGINA! */}
      </main>

      {/* 3. El pie de página pegado abajo */}
      <Footer />
    </div>
  );
};

export default Layout;