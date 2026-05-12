import { useState, useEffect } from 'react';
import api from '../services/api';

const FormularioReparacion = ({ isOpen, onClose, matricula, onSuccess, reparacionAEditar }) => {
    const [descripcion, setDescripcion] = useState('');
    const [kilometraje, setKilometraje] = useState('');
    const [taller_nombre, setTaller_nombre] = useState('');
    const [fecha, setFecha] = useState(''); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen) {
            if (reparacionAEditar) {
                setDescripcion(reparacionAEditar.descripcion);
                setKilometraje(reparacionAEditar.kilometraje_momento);
                setTaller_nombre(reparacionAEditar.taller_nombre || '');
                const dateObj = new Date(reparacionAEditar.fecha);
                setFecha(dateObj.toISOString().split('T')[0]);
            } else {
                setDescripcion('');
                setKilometraje('');
                setTaller_nombre('');
                setFecha(new Date().toISOString().split('T')[0]);
            }
            setError(null);
        }
    }, [isOpen, reparacionAEditar]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const datosParaBackend = {
                vehiculoMatricula: matricula, 
                descripcion: descripcion,
                kilometraje_momento: parseInt(kilometraje),
                fecha: new Date(fecha).toISOString(),
                taller_nombre: taller_nombre
            };

            if (reparacionAEditar) {
                await api.put(`/reparaciones/${reparacionAEditar.id}`, datosParaBackend);
            } else {
                await api.post('/reparaciones', datosParaBackend);
            }
            
            onSuccess();
            onClose();
        } catch (err) {
            console.error(err);
            setError(reparacionAEditar ? 'Error al actualizar la reparación.' : 'Error al crear la reparación.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
                <div className="bg-blue-600 p-4 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-white">
                        {reparacionAEditar ? 'Editar Reparación' : 'Nueva Reparación'}
                    </h3>
                    <button onClick={onClose} className="text-blue-200 hover:text-white">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && <div className="bg-red-100 text-red-700 p-3 rounded text-sm">{error}</div>}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción de la Reparación</label>
                        <textarea 
                            required
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            rows="3"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Taller de Reparación</label>
                        <input 
                            type="text" 
                            required
                            value={taller_nombre}
                            onChange={(e) => setTaller_nombre(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Kilometraje</label>
                            <input 
                                type="number" 
                                required
                                min="0"
                                value={kilometraje}
                                onChange={(e) => setKilometraje(e.target.value)}
                                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                            <input 
                                type="date" 
                                required
                                value={fecha}
                                onChange={(e) => setFecha(e.target.value)}
                                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:bg-blue-400">
                            {loading ? 'Guardando...' : (reparacionAEditar ? 'Actualizar' : 'Guardar')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FormularioReparacion;