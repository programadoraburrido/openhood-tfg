import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './ChatVista.css';

const PREGUNTAS_RAPIDAS = [
  "¿Qué mantenimiento me toca?",
  "¿Taller cercano?",
  "¿Qué aceite usa mi motor?",
  "¿Significado de testigos?"
];

const ChatVista = () => {
  const [input, setInput] = useState('');
  const [mensajes, setMensajes] = useState([]);
  const [escribiendo, setEscribiendo] = useState(false);
  const [minimizado, setMinimizado] = useState(true);
  const [misVehiculos, setMisVehiculos] = useState([]);
  const [ubicacion, setUbicacion] = useState({ lat: null, lng: null });

  const mensajesEndRef = useRef(null);
  const offset = useRef({ x: 0, y: 0 });
  const [posicion, setPosicion] = useState({ x: 20, y: 20 });
  const [arrastrando, setArrastrando] = useState(false);

  const usuarioId = localStorage.getItem('usuarioId');
  const [matriculaActiva, setMatriculaActiva] = useState(localStorage.getItem('matriculaActiva'));

  // 1. Obtener ubicación al cargar el componente
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUbicacion({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.log("Chat sin ubicación:", err)
      );
    }
  }, []);

  useEffect(() => {
    if (!minimizado) {
      setTimeout(() => { mensajesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, 100);
    }
  }, [mensajes, escribiendo, minimizado]);

  useEffect(() => {
    const fetchVehiculos = async () => {
      if (!usuarioId) return;
      try {
        const res = await axios.get(`http://localhost:3000/api/chat/vehicles/${usuarioId}`);
        setMisVehiculos(res.data);
        if (!matriculaActiva && res.data.length > 0) seleccionarCoche(res.data[0].matricula);
      } catch (err) { console.error(err); }
    };
    fetchVehiculos();
  }, [usuarioId]);

  const seleccionarCoche = (mat) => {
    localStorage.setItem('matriculaActiva', mat);
    setMatriculaActiva(mat);
    setMensajes(prev => [...prev, { rol: 'assistant', contenido: `🚗 Contexto: ${mat}.` }]);
  };

  const procesarEnvio = async (texto) => {
    setMensajes(prev => [...prev, { contenido: texto, rol: 'user' }]);
    setEscribiendo(true);
    try {
      // Enviamos también lat y lng
      const res = await axios.post('http://localhost:3000/api/chat', {
        contenido: texto,
        usuarioId: parseInt(usuarioId),
        vehiculoMatricula: matriculaActiva,
        lat: ubicacion.lat,
        lng: ubicacion.lng
      });
      setMensajes(prev => [...prev, res.data]);
    } catch (err) { console.error(err); } finally { setEscribiendo(false); }
  };

  const manejarEnvioForm = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    procesarEnvio(input.trim());
    setInput('');
  };

  const enviarPreguntaRapida = (pregunta) => {
    if (escribiendo) return;
    procesarEnvio(pregunta);
  };

  // --- LÓGICA ARRASTRE ---
  const iniciarArrastre = (e) => {
    if (e.target.closest('.btn-toggle') || e.target.closest('.selector-coche')) return;
    setArrastrando(true);
    offset.current = { x: e.clientX + posicion.x, y: window.innerHeight - e.clientY - posicion.y };
  };

  useEffect(() => {
    const mover = (e) => { if (arrastrando) setPosicion({ x: offset.current.x - e.clientX, y: window.innerHeight - e.clientY - offset.current.y }); };
    const parar = () => setArrastrando(false);
    if (arrastrando) { window.addEventListener('mousemove', mover); window.addEventListener('mouseup', parar); }
    return () => { window.removeEventListener('mousemove', mover); window.removeEventListener('mouseup', parar); };
  }, [arrastrando]);

  if (!usuarioId) return null;

  return (
    <div 
      className={`contenedor-chat ${minimizado ? 'minimizado' : ''}`}
      style={{ bottom: `${posicion.y}px`, right: `${posicion.x}px`, transition: arrastrando ? 'none' : 'all 0.3s ease' }}
    >
      <div className="cabecera-chat" onMouseDown={iniciarArrastre}>
        <div className="titulo-seccion" onClick={() => setMinimizado(!minimizado)}>
          <span className="dot-online"></span>
          <h3>Mecánico AI</h3>
        </div>
        {!minimizado && (
          <select className="selector-coche" value={matriculaActiva || ''} onChange={(e) => seleccionarCoche(e.target.value)}>
            {misVehiculos.map(v => <option key={v.matricula} value={v.matricula}>{v.marca} ({v.matricula})</option>)}
          </select>
        )}
        <button className="btn-toggle" onClick={() => setMinimizado(!minimizado)}>{minimizado ? '▲' : '▼'}</button>
      </div>
      
      {!minimizado && (
        <>
          <div className="cuerpo-chat">
            {mensajes.map((m, i) => (
              <div key={i} className={`burbuja ${m.rol}`}><p>{m.contenido}</p></div>
            ))}
            {escribiendo && <div className="burbuja assistant">Analizando...</div>}
            <div ref={mensajesEndRef} />
          </div>

          <div className="contenedor-sugerencias">
            {PREGUNTAS_RAPIDAS.map((pregunta, index) => (
              <button key={index} className="btn-sugerencia" onClick={() => enviarPreguntaRapida(pregunta)} disabled={escribiendo}>
                {pregunta}
              </button>
            ))}
          </div>

          <form className="formulario-chat" onSubmit={manejarEnvioForm}>
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Escribe..." />
            <button type="submit">Enviar</button>
          </form>
        </>
      )}
    </div>
  );
};

export default ChatVista;