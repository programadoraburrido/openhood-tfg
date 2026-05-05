import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom'; // 1. Importamos useNavigate

const Marketplace = () => {
  const [vehiculos, setVehiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // 2. Inicializamos el hook

  useEffect(() => {
    // ... (tu lógica de fetch sigue igual)
    const fetchMarketplace = async () => {
      try {
        const res = await api.get('/vehiculos/marketplace');
        setVehiculos(res.data);
      } catch (error) {
        console.error("Error al cargar marketplace:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMarketplace();
  }, []);

  if (loading) return <div className="p-10 text-center">Cargando catálogo...</div>;

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Marketplace</h1>
        
        {vehiculos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehiculos.map((v) => (
              <div 
                key={v.matricula} 
                onClick={() => navigate(`/vehiculos/historial/${v.matricula}`)} // 3. Añadimos el onClick
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition cursor-pointer" // 4. cursor-pointer para que parezca botón
              >
                {/* ... resto del contenido igual ... */}
                <div className="h-48 bg-gray-200 overflow-hidden">
                    {v.fotoUrl ? (
                        <img src={`http://localhost:3000${v.fotoUrl}`} alt={v.marca} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">Sin foto</div>
                    )}
                </div>
                
                <div className="p-4">
                  <h2 className="text-xl font-bold">{v.marca} {v.modelo}</h2>
                  <p className="text-2xl font-bold text-blue-600 my-2">{v.precio ? `${v.precio} €` : 'Consultar'}</p>
                  <p className="text-sm text-gray-500 mb-4">{v.anio} • {v.kilometraje} km</p>
                  
                  <div className="border-t pt-3 mt-2">
                    <p className="text-xs text-gray-400 uppercase font-bold">Vendedor:</p>
                    <p className="font-medium text-gray-800">{v.usuario.nombre}</p>
                  {/* Botón de WhatsApp */}
                    <a 
                    href={`https://wa.me/${v.usuario.telefono?.replace(/\s+/g, '')}?text=${encodeURIComponent(`Hola, me interesa el ${v.marca} ${v.modelo} que he visto en OpenHood.`)}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="mt-3 flex items-center justify-center gap-2 bg-green-500 text-white py-2 px-3 rounded-lg hover:bg-green-600 transition text-sm font-bold shadow-sm"
                    >
                    {/* Icono de WhatsApp Estándar */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.591 5.52 0 10.002-4.48 10.002-10.003 0-5.523-4.482-10.003-10.002-10.003-5.522 0-10.002 4.48-10.002 10.003 0 2.054.599 4.015 1.724 5.736l-1.127 4.116 4.159-1.091zm11.187-7.464c-.08-.135-.292-.211-.513-.323-.223-.112-1.32-.652-1.524-.726-.205-.074-.354-.112-.503.112-.149.224-.577.726-.707.876-.129.15-.259.168-.482.056-.224-.112-.947-.349-1.803-1.114-.666-.594-1.116-1.327-1.247-1.551-.132-.224-.014-.346.098-.458.101-.1.224-.261.336-.392.112-.131.149-.224.224-.374.075-.149.037-.281-.018-.392-.056-.112-.503-1.213-.69-1.662-.182-.437-.367-.377-.503-.384-.13-.007-.279-.009-.429-.009-.15 0-.393.056-.599.28-.206.224-.784.766-.784 1.868s.801 2.172.912 2.321c.112.149 1.572 2.401 3.804 3.369.531.229.946.366 1.27.469.534.17 1.02.146 1.403.089.428-.064 1.32-.54 1.506-1.062.185-.522.185-.968.13-1.062-.056-.094-.206-.15-.486-.285z"/>
                    </svg>
                    Contactar por WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-10">No hay vehículos en venta en este momento.</p>
        )}
      </div>
    </div>
  );
};

export default Marketplace;