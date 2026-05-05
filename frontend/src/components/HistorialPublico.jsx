import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

const HistorialPublico = () => {
  const { matricula } = useParams();
  const [historial, setHistorial] = useState([]);
  const [vehiculo, setVehiculo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const resReparaciones = await api.get(`/reparaciones/vehiculo/${matricula}`);
        setHistorial(resReparaciones.data);

        const resVehiculo = await api.get(`/vehiculos/${matricula}`);
        setVehiculo(resVehiculo.data);
      } catch (err) {
        console.error("Error al cargar historial:", err);
      } finally {
        setLoading(false);
      }
    };
    if (matricula) cargarDatos();
  }, [matricula]);

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/marketplace" className="text-gray-500 hover:text-blue-600 mb-6 flex items-center gap-2">
          ← Volver al Marketplace
        </Link>

        {/* CABECERA (Solo lectura) */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8 border-l-4 border-blue-600">
            <h1 className="text-3xl font-bold text-gray-800">Historial de Vehículo Verificado</h1>
            {vehiculo && (
                <p className="text-lg text-gray-600 mt-2">
                    {vehiculo.marca} {vehiculo.modelo}  - {vehiculo.kilometraje} km
                </p>
            )}
        </div>

        {loading ? (
            <div className="text-center py-10">Cargando historial...</div>
        ) : historial.length > 0 ? (
            <div className="space-y-4">
                {historial.map((rep) => (
                    <div key={rep.id} className="bg-white p-6 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-blue-600 font-bold">{new Date(rep.fecha).toLocaleDateString()}</span>
                            <span className="text-sm text-gray-500">Taller: {rep.taller_nombre}</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-800">{rep.descripcion}</h3>
                        <p className="text-sm text-gray-600 mt-1">Kilometraje: {rep.kilometraje_momento} km</p>
                        
                        {rep.presupuesto && (
                            <div className="mt-4 p-3 bg-gray-50 rounded text-sm">
                                <span className="font-semibold text-gray-700">Coste registrado: {rep.presupuesto.importe_total}€</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        ) : (
            <p className="text-center text-gray-500 py-10">Este vehículo aún no tiene registros de mantenimiento.</p>
        )}
      </div>
    </div>
  );
};

export default HistorialPublico;