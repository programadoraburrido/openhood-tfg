import { useState } from 'react';
import api from '../api/axios';

const ModalPublicar = ({ isOpen, onClose, vehiculos, onSuccess }) => {
  const [matricula, setMatricula] = useState('');
  const [precio, setPrecio] = useState('');

  // Limpiamos los estados al cerrar
  const handleClose = () => {
    setMatricula('');
    setPrecio('');
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Usamos la misma ruta que tu FormularioVehiculo: /vehiculos/marketplace/${matricula}
      await api.put(`/vehiculos/marketplace/${matricula}`, { 
        precio: parseFloat(precio),
        enVenta: true 
      });
      
      onSuccess();
      handleClose();
    } catch (err) {
      alert("Error al publicar: " + (err.response?.data?.mensaje || err.message));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4">Publicar en Marketplace</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Selecciona vehículo</label>
           <select 
  className="w-full border p-2 rounded-lg" 
  required
  value={matricula}
  onChange={(e) => setMatricula(e.target.value)}
>
  <option value="">Selecciona un coche...</option>
  {/* He eliminado el .filter para que salgan TODOS */}
  {vehiculos.map(v => (
    <option key={v.matricula} value={v.matricula}>
      {v.marca} {v.modelo}
    </option>
  ))}
</select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Precio (€)</label>
            <input 
              type="number" 
              required
              placeholder="Ej: 5000" 
              className="w-full border p-2 rounded-lg"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
            />
          </div>
          <div className="flex gap-2 mt-6">
            <button type="button" onClick={handleClose} className="flex-1 bg-gray-100 py-2 rounded-lg font-medium">Cancelar</button>
            <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium">Publicar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalPublicar;