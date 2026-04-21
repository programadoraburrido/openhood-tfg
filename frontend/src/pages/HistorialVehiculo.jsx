import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

const HistorialVehiculo = () => {
  const { matricula } = useParams();
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- NUEVOS ESTADOS PARA LA IA ---
  // Guardamos qué reparación está siendo analizada para ponerle el "loading" solo a esa
  const [analizandoId, setAnalizandoId] = useState(null);
  // Guardamos las respuestas de la IA. Es un objeto donde la clave es el ID del presupuesto
  const [veredictosIA, setVeredictosIA] = useState({});

  useEffect(() => {
    const buscarHistorial = async () => {
      try {
        const response = await api.get(`/reparaciones/vehiculo/${matricula}`);
        setHistorial(response.data);
      } catch (err) {
        console.error(err);
        setError('No se encontró el historial para este vehículo.');
        setHistorial([]);
      } finally {
        setLoading(false);
      }
    };

    if (matricula) {
      buscarHistorial();
    }
  }, [matricula]);

  // --- NUEVA FUNCIÓN PARA LLAMAR AL PERITO CÍNICO ---
  const analizarPresupuesto = async (presupuestoId) => {
    setAnalizandoId(presupuestoId); // Encendemos el spinner
    try {
      // Llamamos al endpoint de Groq que hiciste en Node
      const response = await api.get(`/comparador/${presupuestoId}/analizar`);
      
      // Guardamos la respuesta asociándola a su ID para saber dónde pintarla
      setVeredictosIA(prev => ({
        ...prev,
        [presupuestoId]: response.data.veredicto_ia
      }));
    } catch (error) {
      console.error("Error al analizar:", error);
      alert("El perito está descansando ahora mismo. Inténtalo más tarde.");
    } finally {
      setAnalizandoId(null); // Apagamos el spinner
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 border-l-4 border-blue-600">
          <h1 className="text-3xl font-bold text-gray-800">
            Historial del Vehículo: <span className="text-blue-600 uppercase">{matricula}</span>
          </h1>
          <p className="text-gray-500 mt-2">Revisando reparaciones y peritajes asociados.</p>
        </div>

        {loading && <div className="text-center text-gray-600 my-8 font-semibold animate-pulse">Cargando historial...</div>}
        {error && !loading && <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">{error}</div>}

        {!loading && historial.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-700">Reparaciones Encontradas ({historial.length})</h2>
            
            {historial.map((reparacion) => (
              <div key={reparacion.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                      {new Date(reparacion.fecha).toLocaleDateString()}
                    </span>
                    <h3 className="text-lg font-bold text-gray-800 mt-3">{reparacion.descripcion}</h3>
                    <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                      {reparacion.kilometraje_momento} km
                    </p>
                  </div>
                  
                  {reparacion.presupuesto ? (
                    <div className="text-right flex flex-col items-end">
                      <span className="block text-2xl font-bold text-gray-900">
                        {reparacion.presupuesto.importe_total}€
                      </span>
                      <span className="text-xs text-gray-500 mb-3">IVA incluido</span>
                      
                      {/* --- BOTÓN DE IA MÁGICO --- */}
                      {!veredictosIA[reparacion.presupuesto.id] && (
                          <button 
                            onClick={() => analizarPresupuesto(reparacion.presupuesto.id)}
                            disabled={analizandoId === reparacion.presupuesto.id}
                            className={`flex items-center gap-2 text-sm px-4 py-2 rounded-md font-medium transition-colors
                                ${analizandoId === reparacion.presupuesto.id 
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                    : 'bg-purple-100 text-purple-700 hover:bg-purple-200 border border-purple-200'}`}
                          >
                            {/* Icono de Chispas / IA */}
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                            {analizandoId === reparacion.presupuesto.id ? 'Peritando...' : 'Consultar Perito IA'}
                          </button>
                      )}
                    </div>
                  ) : (
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-full font-medium">
                      Sin presupuesto
                    </span>
                  )}
                </div>

                {/* --- CAJA DEL VEREDICTO (Se muestra si existe una respuesta para este ID) --- */}
                {veredictosIA[reparacion.presupuesto?.id] && (
                    <div className="mt-4 p-4 bg-purple-50 border border-purple-100 rounded-lg">
                        <div className="flex items-center gap-2 mb-2 text-purple-800 font-bold">
                            <span className="bg-purple-200 p-1 rounded-full text-xs">🤖</span>
                            Veredicto del Perito:
                        </div>
                        {/* Renderizamos los saltos de línea correctamente */}
                        <div className="text-gray-700 text-sm whitespace-pre-line leading-relaxed">
                            {veredictosIA[reparacion.presupuesto.id]}
                        </div>
                    </div>
                )}
              </div>
            ))}
          </div>
        )}

        {!loading && historial.length === 0 && !error && (
            <div className="bg-white p-12 text-center rounded-lg shadow-sm border border-gray-200">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                <p className="text-gray-500 text-lg">Este vehículo aún no tiene reparaciones registradas en el taller.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default HistorialVehiculo;