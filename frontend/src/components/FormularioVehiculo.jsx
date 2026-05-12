import { useState, useEffect } from 'react';
import api from '../api/axios';

const FormularioVehiculo = ({ isOpen, onClose, vehiculoAEditar, onSuccess }) => {
  const [formData, setFormData] = useState({
    matricula: '', marca: '', modelo: '', año: '', kilometraje: '',
    precio: '', enVenta: false // <--- NUEVOS CAMPOS
  });
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (vehiculoAEditar) {
      setFormData({
        matricula: vehiculoAEditar.matricula,
        marca: vehiculoAEditar.marca,
        modelo: vehiculoAEditar.modelo,
        año: vehiculoAEditar.anio,
        kilometraje: vehiculoAEditar.kilometraje,
        precio: vehiculoAEditar.precio || '', // Cargamos el precio
        enVenta: vehiculoAEditar.enVenta || false // Cargamos el estado
      });
    } else {
      setFormData({ matricula: '', marca: '', modelo: '', año: '', kilometraje: '', precio: '', enVenta: false });
    }
  }, [vehiculoAEditar, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    } catch (error) {
      alert("Error al guardar: " + (error.response?.data?.mensaje || error.message));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl w-full max-w-sm shadow-2xl">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          {vehiculoAEditar ? 'Editar Vehículo' : 'Nuevo Vehículo'}
        </h2>
        
        <input className="w-full p-2 border rounded mb-2" placeholder="Matrícula" 
               value={formData.matricula} onChange={e => setFormData({...formData, matricula: e.target.value})} 
               required disabled={!!vehiculoAEditar} />
        
        <input className="w-full p-2 border rounded mb-2" placeholder="Marca" 
               value={formData.marca} onChange={e => setFormData({...formData, marca: e.target.value})} required />
        
        <input className="w-full p-2 border rounded mb-2" placeholder="Modelo" 
               value={formData.modelo} onChange={e => setFormData({...formData, modelo: e.target.value})} required />
        
        <input className="w-full p-2 border rounded mb-2" type="number" placeholder="Año" 
               value={formData.año} onChange={e => setFormData({...formData, año: e.target.value})} required />
        
        <input className="w-full p-2 border rounded mb-2" type="number" placeholder="Kilometraje" 
               value={formData.kilometraje} onChange={e => setFormData({...formData, kilometraje: e.target.value})} required />

        {/* CAMPOS MARKETPLACE */}
        {vehiculoAEditar && (
            <>
                <input className="w-full p-2 border rounded mb-2" type="number" placeholder="Precio de venta (€)" 
                       value={formData.precio} onChange={e => setFormData({...formData, precio: e.target.value})} />
                
                <label className="flex items-center gap-2 mb-4 text-sm text-gray-700 cursor-pointer">
                    <input type="checkbox" checked={formData.enVenta} 
                           onChange={e => setFormData({...formData, enVenta: e.target.checked})} />
                    Publicar en el Marketplace
                </label>

                <div className="mb-4 border-t pt-2">
                    <label className="text-xs text-gray-500">Cambiar foto:</label>
                    <input type="file" onChange={e => setFile(e.target.files[0])} className="w-full mt-1 text-sm" />
                </div>
            </>
        )}
        
        <div className="flex gap-2">
          <button type="submit" className="flex-1 bg-blue-600 text-white p-2 rounded hover:bg-blue-700 font-medium">Guardar</button>
          <button type="button" onClick={onClose} className="flex-1 bg-gray-200 p-2 rounded hover:bg-gray-300 font-medium">Cancelar</button>
        </div>
      </form>
    </div>
  );
};

export default FormularioVehiculo;