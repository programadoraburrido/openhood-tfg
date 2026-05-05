import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tiempoRelativo } from '../utils/DateUtils';  
import api from '../services/api';

const Foro = () => {
  const [temas, setTemas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  
  // 🚨 NUEVO: Estado para saber qué filtro está activo
  const [filtroActivo, setFiltroActivo] = useState('Todos');
  
  const [nuevoTema, setNuevoTema] = useState({
    titulo: '',
    contenido: '',
    categoria: 'General'
  });

  const cargarTemas = async () => {
    try {
      const response = await api.get('/foro/temas');
      setTemas(response.data);
    } catch (error) {
      console.error("Error al cargar el foro:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarTemas();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const usuarioActivoId = localStorage.getItem('usuarioId'); 
      await api.post('/foro/temas', {
        ...nuevoTema,
        usuarioId: usuarioActivoId
      });
      
      setModalOpen(false);
      setNuevoTema({ titulo: '', contenido: '', categoria: 'General' });
      cargarTemas();
    } catch (error) {
      console.error("Error al publicar:", error);
      alert("Hubo un error al publicar el tema.");
    }
  };

  const getBadgeColor = (categoria) => {
    switch(categoria) {
      case 'Mecánica': return 'bg-red-100 text-red-700';
      case 'Presupuestos': return 'bg-green-100 text-green-700';
      case 'General': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // 🚨 NUEVO: Lógica para filtrar los temas antes de pintarlos
  const temasFiltrados = filtroActivo === 'Todos' 
    ? temas 
    : temas.filter(tema => tema.categoria === filtroActivo);

  // 🚨 NUEVO: Array con las categorías para no escribirlas a mano
  const categoriasFiltro = ['Todos', 'General', 'Mecánica', 'Presupuestos'];

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-8 my-4">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 font-montserrat tracking-tight">Comunidad Openhood</h1>
          <p className="text-gray-500 mt-1">Comparte dudas, presupuestos y experiencias con otros conductores.</p>
        </div>
        <button 
          onClick={() => setModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition shadow-sm flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
          Nuevo Tema
        </button>
      </div>

      {/* 🚨 NUEVO: Barra de Filtros Visuales */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide">
        {categoriasFiltro.map(cat => (
          <button
            key={cat}
            onClick={() => setFiltroActivo(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition whitespace-nowrap ${
              filtroActivo === cat 
                ? 'bg-blue-600 text-white shadow-md' // Estilo si está seleccionado
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200' // Estilo si no está seleccionado
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center text-gray-500 my-12 animate-pulse">Cargando comunidad...</div>
      ) : temasFiltrados.length === 0 ? (
        <div className="text-center bg-white p-12 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-gray-500 mb-4">No hay temas en esta categoría.</p>
          {filtroActivo === 'Todos' && (
            <button onClick={() => setModalOpen(true)} className="text-blue-600 font-medium hover:underline">¡Sé el primero en preguntar algo!</button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {/* 🚨 NUEVO: Hacemos el map() sobre temasFiltrados en lugar de sobre temas */}
          {temasFiltrados.map((tema) => (
            <Link to={`/foro/${tema.id}`} key={tema.id} className="block bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition group cursor-pointer">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${getBadgeColor(tema.categoria)}`}>
                    {tema.categoria}
                  </span>
                  <span className="text-sm text-gray-400">
                    Publicado por <span className="text-gray-600 font-medium">{tema.usuario?.nombre || 'Usuario'}</span> • {tiempoRelativo(tema.fecha_creacion)} {/* • {new Date(tema.fecha_creacion).toLocaleDateString()} */}
                  </span>
                </div>
                
                <div className="flex items-center gap-1.5 text-gray-400 group-hover:text-blue-500 transition">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                  <span className="text-sm font-medium">{tema._count?.respuestas || 0}</span>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 mt-2 group-hover:text-blue-600 transition">{tema.titulo}</h3>
              <p className="text-gray-600 mt-2 line-clamp-2 text-sm">{tema.contenido}</p>
            </Link>
          ))}
        </div>
      )}

      {/* MODAL CREAR TEMA */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          {/* El contenido del modal se queda exactamente igual que lo tenías */}
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
            <div className="bg-blue-600 p-4 flex justify-between items-center">
              <h3 className="text-lg font-bold text-white font-montserrat">Crear nuevo tema</h3>
              <button onClick={() => setModalOpen(false)} className="text-blue-200 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título de tu consulta</label>
                <input 
                  type="text" required maxLength="100"
                  value={nuevoTema.titulo}
                  onChange={(e) => setNuevoTema({...nuevoTema, titulo: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Ej: Ruido extraño al frenar..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                <select 
                  value={nuevoTema.categoria}
                  onChange={(e) => setNuevoTema({...nuevoTema, categoria: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                >
                  <option value="General">General</option>
                  <option value="Mecánica">Mecánica</option>
                  <option value="Presupuestos">Presupuestos</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Detalles</label>
                <textarea 
                  required rows="5"
                  value={nuevoTema.contenido}
                  onChange={(e) => setNuevoTema({...nuevoTema, contenido: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                  placeholder="Explica tu problema detalladamente para que la comunidad pueda ayudarte..."
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition font-medium">Cancelar</button>
                <button type="submit" className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition font-medium">Publicar</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Foro;