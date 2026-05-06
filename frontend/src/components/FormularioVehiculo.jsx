import { useState, useEffect } from 'react';
import api from '../api/axios';

const FormularioVehiculo = ({ isOpen, onClose, vehiculoAEditar, onSuccess }) => {
  const [formData, setFormData] = useState({
    matricula: '', marca: '', modelo: '', año: '', kilometraje: ''
  });
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (vehiculoAEditar) {
      setFormData({
        matricula: vehiculoAEditar.matricula,
        marca: vehiculoAEditar.marca,
        modelo: vehiculoAEditar.modelo,
        año: vehiculoAEditar.anio,
        kilometraje: vehiculoAEditar.kilometraje
      });
    } else {
      setFormData({ matricula: '', marca: '', modelo: '', año: '', kilometraje: '' });
      setFile(null);
    }
  }, [vehiculoAEditar, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (vehiculoAEditar) {
        // Solo actualizamos los datos básicos
        await api.put(`/vehiculos/${vehiculoAEditar.matricula}`, formData);
        
        // Subir foto si hay una nueva
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
        
        <input className="w-full p-2 border rounded mb-4" type="number" placeholder="Kilometraje" 
               value={formData.kilometraje} onChange={e => setFormData({...formData, kilometraje: e.target.value})} required />

        {/* ESTE ES EL NUEVO DISEÑO */}
        <div className="mb-4 border-t pt-4">
            <label className="text-xs text-gray-500 mb-2 block">Foto del vehículo:</label>
            <label 
                htmlFor="file-upload" 
                className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg text-sm transition text-center block w-full border border-dashed border-gray-400"
            >
                {file ? file.name : "Seleccionar imagen"}
            </label>
            <input 
                id="file-upload" 
                type="file" 
                onChange={e => setFile(e.target.files[0])} 
                className="hidden" 
            />
        </div>
        
        <div className="flex gap-2">
          <button type="submit" className="flex-1 bg-blue-600 text-white p-2 rounded hover:bg-blue-700 font-medium">Guardar</button>
          <button type="button" onClick={onClose} className="flex-1 bg-gray-200 p-2 rounded hover:bg-gray-300 font-medium">Cancelar</button>
        </div>
      </form>
    </div>
  );
};

export default FormularioVehiculo;