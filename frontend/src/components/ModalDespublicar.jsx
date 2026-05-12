import { useState } from 'react';
import api from '../api/axios';

const ModalDespublicar = ({ isOpen, onClose, vehiculos, onSuccess }) => {
  const [matricula, setMatricula] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Reutilizamos tu ruta de marketplace, pero enviamos enVenta: false
      await api.put(`/vehiculos/marketplace/${matricula}`, { 
        enVenta: false,
        precio: null // Opcional: limpiar el precio al quitarlo
      });
      
      onSuccess();
      onClose();
      setMatricula('');
    } catch (err) {
      alert("Error al retirar el anuncio: " + (err.response?.data?.mensaje || err.message));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Retirar de Marketplace</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Selecciona el anuncio a retirar</label>
            <select 
              className="w-full border p-2 rounded-lg" 
              required
              value={matricula}
              onChange={(e) => setMatricula(e.target.value)}
            >
              <option value="">Selecciona un coche...</option>
              {vehiculos.filter(v => v.enVenta).map(v => (
                <option key={v.matricula} value={v.matricula}>
                  {v.marca} {v.modelo}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 mt-6">
            <button type="button" onClick={onClose} className="flex-1 bg-gray-100 py-2 rounded-lg font-medium">Cancelar</button>
            <button type="submit" className="flex-1 bg-red-600 text-white py-2 rounded-lg font-medium">Retirar Anuncio</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalDespublicar;