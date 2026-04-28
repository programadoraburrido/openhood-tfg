import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import FormularioReparacion from '../components/FormularioReparacion';

const HistorialVehiculo = () => {
  const { matricula } = useParams();
  const [historial, setHistorial] = useState([]);
  const [vehiculo, setVehiculo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalCrearReparacionOpen, setModalCrearReparacionOpen] = useState(false);
  const [modalActualizarReparacion, setModalActualizarReparacion] = useState(null);
  const [analizandoId, setAnalizandoId] = useState(null);
  const [modalIA, setModalIA] = useState({ isOpen: false, contenido: '' });
  const [reparacionABorrar, setReparacionABorrar] = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const resReparaciones = await api.get(`/reparaciones/vehiculo/${matricula}`);
        setHistorial(resReparaciones.data);

        const resVehiculo = await api.get(`/vehiculos/${matricula}`);
        setVehiculo(resVehiculo.data);

      } catch (err) {
        console.error(err);
        setError('No se pudo cargar la información del vehículo.');
      } finally {
        setLoading(false);
      }
    };

    if (matricula) cargarDatos();
  }, [matricula]);

  const analizarPresupuesto = async (presupuestoId) => {
    setAnalizandoId(presupuestoId);
    try {
      const response = await api.get(`/comparador/${presupuestoId}/analizar`);
      setModalIA({ isOpen: true, contenido: response.data.veredicto_ia });
    } catch (error) {
      console.error("Error al analizar:", error);
      alert("El perito está descansando ahora mismo.");
    } finally {
      setAnalizandoId(null);
    }
  };

  const intentarBorrar = (id) => {
    setReparacionABorrar(id);
  };

  const confirmarBorrado = async () => {
    if (!reparacionABorrar) return;

    try {
      await api.delete(`/reparaciones/${reparacionABorrar}`);
      setHistorial(historial.filter(reparacion => reparacion.id !== reparacionABorrar));
      setReparacionABorrar(null);
    } catch (error) {
      console.error("Error al borrar:", error);
      alert("Hubo un error al intentar borrar la reparación.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 relative">
      <div className="max-w-4xl mx-auto">
        
        {/* CABECERA */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 border-l-4 border-blue-600 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Historial del Vehículo
            </h1>
            {vehiculo && (
                <h3 className="text-lg text-gray-500 mt-2 font-medium flex items-center gap-2">
                    <span>{vehiculo.marca} {vehiculo.modelo} • {matricula}</span>
                </h3>
            )}
          </div>
          
          {/* Botón Maestro para CREAR REPARACIÓN */}
          <button 
            onClick={() => {
                setModalActualizarReparacion(null); // Nos aseguramos de que va vacío
                setModalCrearReparacionOpen(true); 
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-2 shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            Nueva Reparación
          </button>
        </div>

        {loading && <div className="text-center text-gray-600 my-8 animate-pulse">Cargando datos...</div>}
        {error && !loading && <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">{error}</div>}

        {/* LISTA DE REPARACIONES */}
        {!loading && historial.length > 0 && (
          <div className="space-y-6">
            
            {historial.map((reparacion) => (
              <div key={reparacion.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                
                <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-100">
                  <div>
                    <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                      {new Date(reparacion.fecha).toLocaleDateString()}
                    </span>
                    <h3 className="text-xl font-bold text-gray-800 mt-3">{reparacion.descripcion}</h3>
                    <p className="text-sm text-gray-600 mt-1">Kilometraje: {reparacion.kilometraje_momento} km  |  Taller: {reparacion.taller_nombre}</p>
                  </div>

                {/* Acciones de la Reparación (Editar / Borrar) */}
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                        setModalActualizarReparacion(reparacion); // Le pasamos los datos para editar
                        setModalCrearReparacionOpen(true);
                    }} 
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition group"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      className="transition-transform duration-200 group-hover:-rotate-12 group-hover:scale-110">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                  <button onClick={() => intentarBorrar(reparacion.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition"
                    onMouseEnter={e => {
                      const svg = e.currentTarget.querySelector('svg');
                      svg.classList.remove('animate-shake');
                      void svg.offsetWidth;
                      svg.classList.add('animate-shake');
                    }}
                    onMouseLeave={e => e.currentTarget.querySelector('svg').classList.remove('animate-shake')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3,6 5,6 21,6"/>
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                      <path d="M10 11v6"/>
                      <path d="M14 11v6"/>
                      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                    </svg>
                  </button>
                </div>
                  
                </div>
                
                {/* Zona del Presupuesto */}
                <div className="bg-gray-50 p-4 rounded-md flex justify-between items-center">
                    {reparacion.presupuesto ? (
                        <>
                            <div>
                                <span className="block text-2xl font-bold text-gray-900">
                                {reparacion.presupuesto.importe_total}€
                                </span>
                                <span className="text-xs text-gray-500">IVA incluido</span>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <button onClick={() => alert('Editar Presupuesto')} className="text-sm text-gray-500 hover:text-blue-600">Editar</button>
                                <button onClick={() => alert('Borrar Presupuesto')} className="text-sm text-gray-500 hover:text-red-600">Borrar</button>
                                
                                <button 
                                    onClick={() => analizarPresupuesto(reparacion.presupuesto.id)}
                                    disabled={analizandoId === reparacion.presupuesto.id}
                                    className={`flex items-center gap-2 text-sm px-4 py-2 rounded-md font-medium transition-colors ml-2
                                        ${analizandoId === reparacion.presupuesto.id 
                                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                                            : 'bg-purple-600 text-white hover:bg-purple-700 shadow-sm'}`}
                                >
                                    {analizandoId === reparacion.presupuesto.id ? 'Peritando...' : '🤖 Consultar Perito IA'}
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="w-full flex justify-between items-center">
                            <span className="text-gray-500 italic">No hay presupuesto asociado.</span>
                            <button 
                                onClick={() => alert('Abrir formulario para Crear Presupuesto')}
                                className="bg-green-100 text-green-700 px-4 py-2 rounded-md hover:bg-green-200 transition font-medium text-sm"
                            >
                                + Añadir Presupuesto
                            </button>
                        </div>
                    )}
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

      {modalIA.isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden transform transition-all">
                
                <div className="bg-purple-600 p-4 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        🤖 Veredicto del Perito
                    </h3>
                    <button 
                        onClick={() => setModalIA({ isOpen: false, contenido: '' })}
                        className="text-purple-200 hover:text-white"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                <div className="p-6 max-h-[70vh] overflow-y-auto">
                    <div className="text-gray-700 text-base whitespace-pre-line leading-relaxed">
                        {modalIA.contenido}
                    </div>
                </div>

                <div className="bg-gray-50 p-4 flex justify-end">
                    <button 
                        onClick={() => setModalIA({ isOpen: false, contenido: '' })}
                        className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition font-medium"
                    >
                        Cerrar peritaje
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* ========================================= */}
      {/* MODAL DE CONFIRMACIÓN DE BORRADO */}
      {/* ========================================= */}
      {reparacionABorrar && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden text-center p-6 transform transition-all animate-fade-in-up">
            
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-800 mb-2">¿Eliminar reparación?</h3>
            <p className="text-gray-500 mb-8 text-sm px-2">
              Esta acción no se puede deshacer. Se eliminarán permanentemente los datos de la avería y su <b>presupuesto asociado</b>.
            </p>
            
            <div className="flex gap-3 justify-center">
              <button 
                onClick={() => setReparacionABorrar(null)}
                className="px-4 py-2.5 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition font-medium w-full"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmarBorrado}
                className="px-4 py-2.5 text-white bg-red-600 hover:bg-red-700 rounded-xl transition font-medium w-full shadow-sm flex justify-center items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL PARA CREAR/EDITAR REPARACIÓN CON TUS VARIABLES */}
      <FormularioReparacion 
        isOpen={modalCrearReparacionOpen} 
        onClose={() => setModalCrearReparacionOpen(false)} 
        matricula={matricula}
        reparacionAEditar={modalActualizarReparacion} 
        onSuccess={() => {
            window.location.reload(); 
        }}
      />

    </div>
  );
};

export default HistorialVehiculo;