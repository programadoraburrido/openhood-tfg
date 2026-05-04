import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', nombre: '', telefono: '' });
  const [error, setError] = useState('');
  const { login, register } = useContext(AuthContext); // Asegúrate de que register exista en tu Context
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isRegistering) {
        await register(formData.nombre, formData.email, formData.telefono, formData.password);
        alert("Usuario registrado. Ya puedes iniciar sesión.");
        setIsRegistering(false);
      } else {
        await login(formData.email, formData.password);
        navigate('/vehiculos');
      }
    } catch (err) {
      setError(isRegistering ? 'Error al registrar' : 'Credenciales incorrectas');
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <form onSubmit={handleSubmit} className="p-8 bg-white rounded-2xl shadow-xl w-full max-w-sm border border-gray-100">
        <h2 className="mb-8 text-3xl font-bold text-gray-800 text-center">
          {isRegistering ? 'Crea tu cuenta' : 'Openhood'}
        </h2>
        
        {error && <p className="mb-4 text-red-600 bg-red-50 p-2 rounded text-center text-sm">{error}</p>}
        
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
    </div>
  );
};

export default Login;