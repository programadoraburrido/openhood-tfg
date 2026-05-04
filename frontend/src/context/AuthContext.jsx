import { createContext, useState } from 'react';
import api from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.usuario);
    return res.data;
  };

  // Nueva función de registro
  const register = async (nombre, email, telefono, password) => {
    const res = await api.post('/auth/register', { nombre, email, telefono, password });
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // ¡IMPORTANTE!: Añadimos 'register' al value para que el Login pueda usarlo
  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};