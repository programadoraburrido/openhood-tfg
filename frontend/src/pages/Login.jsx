import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/vehiculos');
    } catch (err) {
      setError('Credenciales incorrectas');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <form onSubmit={handleSubmit} className="p-8 bg-white rounded-2xl shadow-xl w-full max-w-sm border border-gray-100">
        <h2 className="mb-8 text-3xl font-bold text-gray-800 text-center">OpenHood</h2>
        
        {error && <p className="mb-4 text-red-600 bg-red-50 p-2 rounded text-center text-sm">{error}</p>}
        
        <div className="space-y-4">
          <input 
            type="email" placeholder="Email" required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password" placeholder="Contraseña" required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        
        <button className="w-full mt-6 py-3 text-white bg-blue-600 rounded-lg font-medium hover:bg-blue-700 transition shadow-sm">
          Entrar
        </button>
      </form>
    </div>
  );
};

export default Login;