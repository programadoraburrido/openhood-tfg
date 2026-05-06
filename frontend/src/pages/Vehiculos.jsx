import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import FormularioVehiculo from '../components/FormularioVehiculo';
import ModalPublicar from '../components/ModalPublicar';
import ModalDespublicar from '../components/ModalDespublicar';

const Vehiculos = () => {
  const [vehiculos, setVehiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [vehiculoAEditar, setVehiculoAEditar] = useState(null);
  const [matriculaABorrar, setMatriculaABorrar] = useState(null);
  const [publicarModalOpen, setPublicarModalOpen] = useState(false);
  const [despublicarModalOpen, setDespublicarModalOpen] = useState(false);

  const fetchVehiculos = async () => {
    try {
      const res = await api.get('/vehiculos');
      setVehiculos(res.data);
    } catch (error) {
      console.error("Error al cargar:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVehiculos(); }, []);

  const confirmarBorradoVehiculo = async () => {
    if (!matriculaABorrar) return;
    try {
      await api.delete(`/vehiculos/${matriculaABorrar}`);
      fetchVehiculos();
      setMatriculaABorrar(null);
    } catch (error) {
      alert("No se pudo eliminar el vehículo.");
      setMatriculaABorrar(null);
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-500">Cargando mis vehículos...</div>;

  return (
    <div className="bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto">
        
        {/* CABECERA */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 border-l-4 border-blue-600 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Mis Vehículos</h1>
            <p className="text-gray-500 mt-1">Gestiona tu flota y mantenimientos</p>
          </div>
          <button onClick={() => { setVehiculoAEditar(null); setModalOpen(true); }} 
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-2 shadow-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            Nuevo Vehículo
          </button>
         <button onClick={() => setPublicarModalOpen(true)} 
            className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition shadow-sm mr-2">
            Publicar Anuncio
          </button>
         <button onClick={() => setDespublicarModalOpen(true)} 
              className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition shadow-sm mr-2">
              Retirar Anuncio
        </button>
        </div>

        {/* LISTA DE VEHÍCULOS */}
        <div className="grid gap-4">
          {vehiculos.length > 0 ? vehiculos.map((v) => (
            <div key={v.matricula} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between hover:border-blue-300 transition">
              
              <Link to={`/historial/${v.matricula}`} className="flex-1 flex items-center gap-4">
                {/* FOTO */}
                <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 border border-gray-200">
                  {v.fotoUrl ? (
                    <img 
                      src={`http://localhost:3000${v.fotoUrl}`} 
                      alt={v.marca} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    </div>
                  )}
                </div>
                
                {/* INFO */}
                <div>
                  <h3 className="font-bold text-xl text-gray-800">{v.marca} {v.modelo}</h3>
                  <p className="text-gray-600">Matrícula: {v.matricula} | {v.kilometraje} km</p>
                </div>
              </Link>
              
              {/* BOTONES */}
              <div className="flex gap-2">
                <button 
                  onClick={() => { setVehiculoAEditar(v); setModalOpen(true); }} 
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </button>
                <button 
                  onClick={() => setMatriculaABorrar(v.matricula)} 
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition"
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
          )) : <p className="text-center text-gray-500 py-10">No tienes vehículos registrados.</p>}
        </div>

        <FormularioVehiculo 
          isOpen={modalOpen} 
          onClose={() => setModalOpen(false)} 
          vehiculoAEditar={vehiculoAEditar} 
          onSuccess={fetchVehiculos} 
        />
        <ModalPublicar 
          isOpen={publicarModalOpen} 
          onClose={() => setPublicarModalOpen(false)}
          vehiculos={vehiculos}
          onSuccess={fetchVehiculos} 
          />
        <ModalDespublicar 
          isOpen={despublicarModalOpen} 
          onClose={() => setDespublicarModalOpen(false)}
          vehiculos={vehiculos}
          onSuccess={fetchVehiculos} 
          />

        {/* Modal Borrado */}
        {matriculaABorrar && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">¿Eliminar vehículo?</h3>
              <div className="flex gap-3 justify-center">
                <button onClick={() => setMatriculaABorrar(null)} className="px-4 py-2 bg-gray-100 rounded-xl w-full">Cancelar</button>
                <button onClick={confirmarBorradoVehiculo} className="px-4 py-2 text-white bg-red-600 rounded-xl w-full">Sí, eliminar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Vehiculos;