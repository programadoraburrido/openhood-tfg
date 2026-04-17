import { useState } from 'react';
import api from '../services/api'; // Tu servicio con el Token automático

const HistorialVehiculo = () => {
  const [matricula, setMatricula] = useState('');
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const buscarHistorial = async (e) => {
    e.preventDefault(); // Evita que la página recargue
    setLoading(true);
    setError(null);

    try {
      // Llamamos a tu endpoint del backend
      const response = await api.get(`/reparaciones/vehiculo/${matricula}`);
      setHistorial(response.data);
    } catch (err) {
      console.error(err);
      setError('No se encontró el vehículo o hubo un error.');
      setHistorial([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Cabecera y Buscador */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Historial del Vehículo</h1>
        
        <form onSubmit={buscarHistorial} className="bg-white p-6 rounded-lg shadow-md mb-8 flex gap-4">
          <input
            type="text"
            placeholder="Ej: 1234AAA"
            value={matricula}
            onChange={(e) => setMatricula(e.target.value)}
            className="flex-1 border border-gray-300 rounded-md px-4 py-2 uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button 
            type="submit" 
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
        </form>

        {/* Mensajes de error */}
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
            {error}
          </div>
        )}

        {/* Lista de Reparaciones */}
        {historial.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-700">Reparaciones Encontradas ({historial.length})</h2>
            
            {historial.map((reparacion) => (
              <div key={reparacion.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-sm text-gray-500">{new Date(reparacion.fecha).toLocaleDateString()}</span>
                    <h3 className="text-lg font-bold text-gray-800">{reparacion.descripcion}</h3>
                    <p className="text-sm text-gray-600 mt-1">Kilometraje: {reparacion.kilometraje_momento} km</p>
                  </div>
                  
                  {/* Si tiene presupuesto asociado, lo mostramos */}
                  {reparacion.presupuesto ? (
                    <div className="text-right">
                      <span className="block text-2xl font-bold text-green-600">
                        {reparacion.presupuesto.importe_total}€
                      </span>
                      <span className="text-xs text-gray-500">IVA incluido</span>
                    </div>
                  ) : (
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                      Sin presupuesto
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistorialVehiculo;