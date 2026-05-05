import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', nombre: '', telefono: '' });
  const [error, setError] = useState('');
  
  // Estado para el Modal
  const [modal, setModal] = useState({ isOpen: false, titulo: '', mensaje: '', esExito: false });

  const { login, register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isRegistering) {
        await register(formData.nombre, formData.email, formData.telefono, formData.password);
        setModal({ isOpen: true, titulo: '¡Registro exitoso!', mensaje: 'Ya puedes iniciar sesión con tu cuenta.', esExito: true });
      } else {
        await login(formData.email, formData.password);
        navigate('/vehiculos');
      }
    } catch (err) {
      // Si hay error, mostramos el modal de error
      setModal({ isOpen: true, titulo: 'Error', mensaje: isRegistering ? 'No se pudo crear la cuenta.' : 'Credenciales incorrectas.', esExito: false });
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <form onSubmit={handleSubmit} className="p-8 bg-white rounded-2xl shadow-xl w-full max-w-sm border border-gray-100">
        <h2 className="mb-8 text-3xl font-bold text-gray-800 text-center">
          {isRegistering ? 'Crea tu cuenta' : 'Openhood'}
        </h2>
        
        <div className="space-y-4">
          {isRegistering && (
            <>
              <input name="nombre" type="text" placeholder="Nombre" required onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"/>
              <input name="telefono" type="tel" placeholder="Teléfono" required onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"/>
            </>
          )}
          <input name="email" type="email" placeholder="Email" required onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"/>
          <input name="password" type="password" placeholder="Contraseña" required onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"/>
        </div>
        
        <button className="w-full mt-6 py-3 text-white bg-blue-600 rounded-lg font-medium hover:bg-blue-700 transition shadow-sm">
          {isRegistering ? 'Registrarse' : 'Entrar'}
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          {isRegistering ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
          <button type="button" onClick={() => setIsRegistering(!isRegistering)} className="text-blue-600 font-bold ml-1 hover:underline">
            {isRegistering ? 'Inicia sesión' : 'Regístrate aquí'}
          </button>
        </p>
      </form>

      {/* MODAL (Estilo idéntico al de Vehiculos.jsx) */}
      {modal.isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">{modal.titulo}</h3>
            <p className="text-gray-600 mb-6">{modal.mensaje}</p>
            <button 
              onClick={() => {
                setModal({ isOpen: false, titulo: '', mensaje: '', esExito: false });
                if (modal.esExito) setIsRegistering(false); // Si fue éxito, volvemos al login
              }} 
              className="px-4 py-2 bg-blue-600 text-white rounded-xl w-full hover:bg-blue-700 transition"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;