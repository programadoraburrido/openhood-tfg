import { useState, useEffect } from 'react';
import api from '../api/axios';

const FormularioVehiculo = ({ isOpen, onClose, vehiculoAEditar, onSuccess }) => {
  const [formData, setFormData] = useState({
    matricula: '', marca: '', modelo: '', año: '', kilometraje: ''
  });

  // Si abrimos el formulario para editar, precargamos los datos
  useEffect(() => {
    if (vehiculoAEditar) {
      setFormData({
        matricula: vehiculoAEditar.matricula,
        marca: vehiculoAEditar.marca,
        modelo: vehiculoAEditar.modelo,
        año: vehiculoAEditar.anio, // Prisma usa 'anio'
        kilometraje: vehiculoAEditar.kilometraje
      });
    } else {
      // Limpiamos si es nuevo
      setFormData({ matricula: '', marca: '', modelo: '', año: '', kilometraje: '' });
    }
  }, [vehiculoAEditar, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (vehiculoAEditar) {
        // Lógica de actualización (PUT)
        await api.put(`/vehiculos/${vehiculoAEditar.matricula}`, formData);
      } else {
        // Lógica de creación (POST)
        await api.post('/vehiculos', formData);
      }
      onSuccess(); // Recarga la lista en el padre
      onClose();   // Cierra el modal
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
               required disabled={!!vehiculoAEditar} /> {/* Matrícula bloqueada al editar */}
        
        <input className="w-full p-2 border rounded mb-2" placeholder="Marca" 
               value={formData.marca} onChange={e => setFormData({...formData, marca: e.target.value})} required />
        
        <input className="w-full p-2 border rounded mb-2" placeholder="Modelo" 
               value={formData.modelo} onChange={e => setFormData({...formData, modelo: e.target.value})} required />
        
        <input className="w-full p-2 border rounded mb-2" type="number" placeholder="Año" 
               value={formData.año} onChange={e => setFormData({...formData, año: e.target.value})} required />
        
        <input className="w-full p-2 border rounded mb-4" type="number" placeholder="Kilometraje" 
               value={formData.kilometraje} onChange={e => setFormData({...formData, kilometraje: e.target.value})} required />
        
        <div className="flex gap-2">
          <button type="submit" className="flex-1 bg-blue-600 text-white p-2 rounded hover:bg-blue-700 font-medium">Guardar</button>
          <button type="button" onClick={onClose} className="flex-1 bg-gray-200 p-2 rounded hover:bg-gray-300 font-medium">Cancelar</button>
        </div>
      </form>
    </div>
  );
};

export default FormularioVehiculo;