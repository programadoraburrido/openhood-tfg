import { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

const Perfil = () => {
  const { setUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({ nombre: '', email: '', telefono: '' });
  const [modal, setModal] = useState({ isOpen: false, titulo: '', mensaje: '' });
  const [loading, setLoading] = useState(true);

  // 1. Cargar datos desde el backend
  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        // Asegúrate de que esta ruta coincida con tu app.use('/auth', ...)
        const res = await api.get('/auth/me'); 
        setFormData(res.data);
      } catch (err) {
        console.error("Error al cargar perfil", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPerfil();
  }, []);

  // 2. Guardar cambios
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put('/auth/me', formData);
      // Actualizamos el contexto para que toda la app vea el nuevo nombre
      setUser(res.data.usuario); 
      setModal({ isOpen: true, titulo: '¡Éxito!', mensaje: 'Datos actualizados correctamente.' });
    } catch (err) {
      setModal({ isOpen: true, titulo: 'Error', mensaje: 'No se pudo actualizar.' });
    }
  };

  if (loading) return <div className="p-10 text-center">Cargando perfil...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm border border-gray-100">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Mi Perfil</h2>
        
        <div className="space-y-4">
          <input type="text" placeholder="Nombre" value={formData.nombre} 
            onChange={(e) => setFormData({...formData, nombre: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg"/>
          
          <input type="tel" placeholder="Teléfono" value={formData.telefono || ''} 
            onChange={(e) => setFormData({...formData, telefono: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg"/>
          
          <input type="email" disabled value={formData.email} 
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"/>
        </div>

        <button type="submit" className="w-full mt-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition">
          Guardar Cambios
        </button>
      </form>

      {/* El modal reutilizable que ya usamos antes */}
      {modal.isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-white rounded-2xl p-6 text-center max-w-sm w-full">
            <h3 className="text-xl font-bold mb-2">{modal.titulo}</h3>
            <p className="text-gray-600 mb-6">{modal.mensaje}</p>
            <button onClick={() => setModal({ ...modal, isOpen: false })} className="w-full py-2 bg-blue-600 text-white rounded-xl">Entendido</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Perfil;