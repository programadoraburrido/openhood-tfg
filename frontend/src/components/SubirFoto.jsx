import { useState } from 'react';
import api from '../api/axios'; // Ajusta la ruta a donde tengas tu instancia de axios

const SubirFoto = ({ matricula, onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Por favor, selecciona una foto primero");

    setLoading(true);
    const formData = new FormData();
    formData.append('imagen', file); // 'imagen' debe coincidir con el campo en Multer

    try {
      const res = await api.post(`/vehiculos/upload-image/${matricula}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      alert("¡Foto subida con éxito!");
      if (onUploadSuccess) onUploadSuccess(res.data.url); // Avisamos al padre para refrescar la foto
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un error al subir la foto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 p-4 border rounded shadow-sm">
      <label className="text-sm font-semibold">Añadir/Cambiar foto del vehículo:</label>
      <input 
        type="file" 
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])} 
        className="text-sm"
      />
      <button 
        onClick={handleUpload}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? "Subiendo..." : "Subir Foto"}
      </button>
    </div>
  );
};

export default SubirFoto;