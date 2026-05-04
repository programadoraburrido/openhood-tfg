import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ChatVista.css';

const ChatVista = () => {
  const [input, setInput] = useState('');
  const [mensajes, setMensajes] = useState([]);
  const [escribiendo, setEscribiendo] = useState(false);
  const [minimizado, setMinimizado] = useState(true); // <--- Estado para minimizar

  const usuarioId = localStorage.getItem('usuarioId') || 1;
  const [matriculaActiva, setMatriculaActiva] = useState(localStorage.getItem('matriculaActiva'));

  useEffect(() => {
    const inicializarChat = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/chat/history/${usuarioId}`);
        if (res.data.length > 0) {
          setMensajes(res.data);
        } else if (!matriculaActiva) {
          setMensajes([{
            rol: 'assistant',
            contenido: "¡Hola! Soy tu asistente de OpenHood. ¿Podrías decirme la matrícula para ayudarte mejor?"
          }]);
        }
      } catch (err) {
        console.error("Error al cargar chat:", err);
      }
    };
    if (!minimizado) inicializarChat(); // Solo carga si está abierto
  }, [usuarioId, matriculaActiva, minimizado]);

  const manejarEnvio = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const textoUsuario = input.trim();
    setInput('');

    if (!matriculaActiva && mensajes.length === 1) {
       localStorage.setItem('matriculaActiva', textoUsuario.toUpperCase());
       setMatriculaActiva(textoUsuario.toUpperCase());
       setMensajes([...mensajes, 
         { rol: 'user', contenido: textoUsuario },
         { rol: 'assistant', contenido: `¡Perfecto! Matrícula ${textoUsuario.toUpperCase()} registrada. ¿En qué puedo ayudarte?` }
       ]);
       return;
    }

    setMensajes(prev => [...prev, { contenido: textoUsuario, rol: 'user' }]);
    setEscribiendo(true);

    try {
      const res = await axios.post('http://localhost:3000/api/chat', {
        contenido: textoUsuario,
        usuarioId: parseInt(usuarioId),
        vehiculoMatricula: matriculaActiva
      });
      setMensajes(prev => [...prev, res.data]);
    } catch (err) {
      console.error("Error en el chat:", err);
    } finally {
      setEscribiendo(false);
    }
  };

  return (
    <div className={`contenedor-chat ${minimizado ? 'minimizado' : ''}`}>
      <div className="cabecera-chat" onClick={() => setMinimizado(!minimizado)}>
        <div className="titulo-seccion">
          <span className="dot-online"></span>
          <h3>Asistente OpenHood</h3>
        </div>
        <button className="btn-toggle">{minimizado ? '▲' : '▼'}</button>
      </div>
      
      {!minimizado && (
        <>
          <div className="cuerpo-chat">
            {mensajes.map((m, i) => (
              <div key={i} className={`burbuja ${m.rol}`}>
                <p>{m.contenido}</p>
              </div>
            ))}
            {escribiendo && <div className="burbuja assistant escribiendo">Analizando...</div>}
          </div>

          <form className="formulario-chat" onSubmit={manejarEnvio}>
            <input 
              type="text" 
              placeholder={!matriculaActiva ? "Escribe tu matrícula..." : "Escribe tu duda..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit">Enviar</button>
          </form>
        </>
      )}
    </div>
  );
};

export default ChatVista;