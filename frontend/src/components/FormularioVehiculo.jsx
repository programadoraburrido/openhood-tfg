import { useState, useEffect } from 'react';
import api from '../api/axios';

const FormularioVehiculo = ({ isOpen, onClose, vehiculoAEditar, onSuccess }) => {
  const [formData, setFormData] = useState({
    matricula: '', marca: '', modelo: '', año: '', kilometraje: '',
    precio: '', enVenta: false 
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      if (vehiculoAEditar) {
        setFormData({
          matricula: vehiculoAEditar.matricula,
          marca: vehiculoAEditar.marca,
          modelo: vehiculoAEditar.modelo,
          año: vehiculoAEditar.anio,
          kilometraje: vehiculoAEditar.kilometraje,
          precio: vehiculoAEditar.precio || '', 
          enVenta: vehiculoAEditar.enVenta || false 
        });
      } else {
        setFormData({ matricula: '', marca: '', modelo: '', año: '', kilometraje: '', precio: '', enVenta: false });
      }
      setFile(null);
      setError(null);
    }
  }, [vehiculoAEditar, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      if (vehiculoAEditar) {
        // 1. Actualizar datos base
        await api.put(`/vehiculos/${vehiculoAEditar.matricula}`, formData);
        
        // 2. Actualizar estado de venta (Marketplace)
        await api.put(`/vehiculos/marketplace/${vehiculoAEditar.matricula}`, {
            precio: formData.precio,
            enVenta: formData.enVenta
        });
        
        // 3. Subir foto si hay una nueva
        if (file) {
          const formDataImg = new FormData();
          formDataImg.append('imagen', file);
          await api.post(`/vehiculos/upload-image/${vehiculoAEditar.matricula}`, formDataImg, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
        }
      } else {
        await api.post('/vehiculos', formData);
      }
      
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      setError("Error al guardar: " + (err.response?.data?.mensaje || err.message));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-gray-100 p-6 sm:p-8 max-h-[90vh] overflow-y-auto scrollbar-hide">
        
        {/* CABECERA DEL MODAL */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-[#1A365D] m-0">
            {vehiculoAEditar ? 'Editar Vehículo' : 'Nuevo Vehículo'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* MENSAJE DE ERROR */}
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-sm font-bold">
                {error}
            </div>
          )}

          {/* DATOS BÁSICOS */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Matrícula</label>
            <input 
              required disabled={!!vehiculoAEditar}
              placeholder="Ej: 1234ABC" 
              value={formData.matricula} 
              onChange={e => setFormData({...formData, matricula: e.target.value})} 
              className={`w-full p-3 border border-gray-200 rounded-xl outline-none transition-all uppercase ${
                vehiculoAEditar 
                  ? 'bg-gray-100 text-gray-500 cursor-not-allowed font-mono' 
                  : 'bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#00B4D8]/50 focus:border-[#00B4D8]'
              }`}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-bold text-gray-700 mb-2">Marca</label>
              <input 
                required placeholder="Ej: Toyota" 
                value={formData.marca} 
                onChange={e => setFormData({...formData, marca: e.target.value})} 
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#00B4D8]/50 focus:border-[#00B4D8] outline-none transition-all"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-bold text-gray-700 mb-2">Modelo</label>
              <input 
                required placeholder="Ej: Corolla" 
                value={formData.modelo} 
                onChange={e => setFormData({...formData, modelo: e.target.value})} 
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#00B4D8]/50 focus:border-[#00B4D8] outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-bold text-gray-700 mb-2">Año</label>
              <input 
                required type="number" placeholder="Ej: 2020" 
                value={formData.año} 
                onChange={e => setFormData({...formData, año: e.target.value})} 
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#00B4D8]/50 focus:border-[#00B4D8] outline-none transition-all"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-bold text-gray-700 mb-2">Kilometraje actual</label>
              <input 
                required type="number" placeholder="Ej: 50000" 
                value={formData.kilometraje} 
                onChange={e => setFormData({...formData, kilometraje: e.target.value})} 
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#00B4D8]/50 focus:border-[#00B4D8] outline-none transition-all"
              />
            </div>
          </div>

          {/* SECCIÓN MARKETPLACE (Solo en Edición) */}
          {vehiculoAEditar && (
            <div className="mt-6 border border-[#00B4D8]/20 bg-[#e6f7fa]/50 p-5 rounded-2xl">
              <h4 className="font-bold text-[#1A365D] mb-4 flex items-center gap-2">
                <span>🛒</span> Opciones de Venta y Perfil
              </h4>
              
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-2">Precio de venta (€)</label>
                <input 
                  type="number" placeholder="Ej: 15000" 
                  value={formData.precio} 
                  onChange={e => setFormData({...formData, precio: e.target.value})} 
                  className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00B4D8]/50 focus:border-[#00B4D8] outline-none transition-all"
                />
              </div>
              
              <label className="flex items-center gap-3 mb-5 p-3 bg-white border border-gray-200 rounded-xl cursor-pointer hover:border-[#00B4D8] transition-colors">
                <input 
                  type="checkbox" 
                  checked={formData.enVenta} 
                  onChange={e => setFormData({...formData, enVenta: e.target.checked})} 
                  className="w-5 h-5 text-[#00B4D8] bg-gray-100 border-gray-300 rounded focus:ring-[#00B4D8] focus:ring-2 accent-[#00B4D8]"
                />
                <span className="text-sm font-bold text-gray-700 select-none">Publicar en el Marketplace de OpenHood</span>
              </label>

              <div className="pt-4 border-t border-[#00B4D8]/10">
                <label className="block text-sm font-bold text-gray-700 mb-2">Foto del vehículo</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={e => setFile(e.target.files[0])} 
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2.5 file:px-4
                    file:rounded-xl file:border-0
                    file:text-sm file:font-bold
                    file:bg-[#00B4D8] file:text-white
                    hover:file:bg-cyan-500 hover:file:cursor-pointer transition-all"
                />
              </div>
            </div>
          )}
          
          {/* BOTONES DE ACCIÓN */}
          <div className="pt-4 flex gap-3 mt-2">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={loading} 
              className="flex-1 py-3 bg-[#00B4D8] text-white font-bold rounded-xl hover:bg-cyan-500 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 disabled:opacity-70 disabled:pointer-events-none flex justify-center items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Guardando...
                </>
              ) : (
                'Guardar Vehículo'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormularioVehiculo;