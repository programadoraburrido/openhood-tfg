import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png'; 

const Navbar = () => {
  const navigate = useNavigate();
  
  // Comprobamos si hay un token guardado para saber si estamos logueados
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  const handleLogout = () => {
    // Borramos el token y redirigimos al login
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/login'); 
  };

  return (
    // Aplicamos el bg-blue-500 que pediste
    <nav className="bg-white text-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          <Link to="/vehiculos" className="flex items-center gap-3 hover:opacity-80 transition">
            {/* El icono / imagen */}
            <img src={logo} alt="Icono OpenHood" className="h-10 object-contain rounded-xl bg-white p-1" />
            
            {/* El texto aplicando tu nueva clase CSS */}
            <span className="text-2xl tracking-tight font-montserrat text-black">
              Openhood
            </span>
          </Link>

          {/* Menú derecho: Enlaces y Botón de Auth */}
          <div className="flex items-center gap-6">
            
            {/* Solo mostramos los enlaces si está logueado */}
            {isLoggedIn && (
              <>
                <Link to="/vehiculos" className="text-blue-600 hover:text-blue-700 font-medium transition">
                  Mis Vehículos
                </Link>
                <Link to="/marketplace" className="text-blue-600 hover:text-blue-700 font-medium transition">
                  Marketplace
                </Link>
                <Link to="/foro" className="text-blue-600 hover:text-blue-700 font-medium transition">
                  Foro
                </Link>
                <Link to="/perfil" className="text-blue-600 hover:text-blue-700 font-medium transition">
                  Mi Perfil
                </Link>
              </>
            )}

            {/* Renderizado condicional del botón de sesión */}
            {isLoggedIn ? (
              <button 
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition shadow-sm"
              >
                Cerrar sesión
              </button>
            ) : (
              <Link 
                to="/login"
                className="bg-gray-100 text-blue-600 hover:bg-gray-200 px-4 py-2 rounded-lg font-medium transition shadow-sm"
              >
                Iniciar sesión
              </Link>
            )}
            
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;