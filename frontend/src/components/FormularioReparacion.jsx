import { useState, useEffect } from 'react';
import api from '../services/api';

// Añadimos 'reparacionAEditar' a las props que recibe
const FormularioReparacion = ({ isOpen, onClose, matricula, onSuccess, reparacionAEditar }) => {
    const [descripcion, setDescripcion] = useState('');
    const [kilometraje, setKilometraje] = useState('');
    const [taller_nombre, setTaller_nombre] = useState('');
    const [fecha, setFecha] = useState(''); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Este useEffect se dispara cada vez que abrimos el modal
    useEffect(() => {
        if (isOpen) {
            if (reparacionAEditar) {
                // MODO EDICIÓN: Rellenamos los campos con los datos existentes
                setDescripcion(reparacionAEditar.descripcion);
                setKilometraje(reparacionAEditar.kilometraje_momento);
                setTaller_nombre(reparacionAEditar.taller_nombre || '');
                // Formateamos la fecha de la BBDD para que el input type="date" la entienda
                const dateObj = new Date(reparacionAEditar.fecha);
                setFecha(dateObj.toISOString().split('T')[0]);
            } else {
                // MODO CREACIÓN: Limpiamos los campos y ponemos la fecha de hoy
                setDescripcion('');
                setKilometraje('');
                setTaller_nombre('');
                setFecha(new Date().toISOString().split('T')[0]);
            }
            setError(null); // Limpiamos errores antiguos
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
                // Si estamos editando, hacemos un PUT apuntando al ID de la reparación
                await api.put(`/reparaciones/${reparacionAEditar.id}`, datosParaBackend);
            } else {
                // Si estamos creando, hacemos un POST normal
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
                    {/* El título cambia dinámicamente */}
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción de la Avería</label>
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
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition">
                            Cancelar
                        </button>
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