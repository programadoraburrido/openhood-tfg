import { useState, useEffect } from 'react';
import api from '../services/api';

const FormularioPresupuesto = ({ isOpen, onClose, reparacionId, onSuccess, presupuestoAEditar }) => {
    const [base_imponible, setBase_imponible] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const IVA_FIJO = 21;

    useEffect(() => {
        if (isOpen) {
            if (presupuestoAEditar) {
                setBase_imponible(presupuestoAEditar.base_imponible);
            } else {
                setBase_imponible('');
            }
            setError(null);
        }
    }, [isOpen, presupuestoAEditar]);

    if (!isOpen) return null;

    const importe_total = (parseFloat(base_imponible || 0) * (1 + IVA_FIJO / 100)).toFixed(2);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const datosParaBackend = {
                base_imponible: parseFloat(base_imponible),
                IVA: IVA_FIJO,
                importe_total: parseFloat(importe_total),
                reparacionId: reparacionId
            };

            if (presupuestoAEditar) {
                await api.put(`/presupuestos/${presupuestoAEditar.id}`, datosParaBackend);
            } else {
                await api.post('/presupuestos', datosParaBackend);
            }
            
            onSuccess();
            onClose();
        } catch (err) {
            console.error(err);
            setError(presupuestoAEditar ? 'Error al actualizar el presupuesto. Comprueba tu conexión con el servidor.' : 'Error al crear el presupuesto. Comprueba tu conexión con el servidor.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
                <div className="bg-green-600 p-4 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-white">
                        {presupuestoAEditar ? 'Editar Presupuesto' : 'Nuevo Presupuesto'}
                    </h3>
                    <button onClick={onClose} className="text-green-200 hover:text-white">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && <div className="bg-red-100 text-red-700 p-3 rounded text-sm">{error}</div>}

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Base Imponible (€)</label>
                            <input 
                                type="number" 
                                required
                                min="0"
                                step="0.01"
                                value={base_imponible}
                                onChange={(e) => setBase_imponible(e.target.value)}
                                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                            />
                        </div>
                        <div className="w-24">
                            <label className="block text-sm font-medium text-gray-700 mb-1">IVA (%)</label>
                            <input 
                                type="number" 
                                value={IVA_FIJO}
                                disabled
                                className="w-full border border-gray-200 bg-gray-100 text-gray-500 rounded-md p-2 cursor-not-allowed focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="bg-green-50 p-3 rounded-md">
                        <span className="block text-sm text-green-800 mb-1 font-medium">Importe Total Calculado</span>
                        <span className="text-2xl font-bold text-green-900">{importe_total} €</span>
                    </div>



                    <div className="pt-4 flex justify-end gap-3">
                        <button type="submit" disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition disabled:bg-green-400">
                            {loading ? 'Guardando...' : (presupuestoAEditar ? 'Actualizar' : 'Guardar')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FormularioPresupuesto;
