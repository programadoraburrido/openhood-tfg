import React, { useState, useEffect, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix para los iconos de Leaflet utilizando importaciones locales
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Motor de movimiento del mapa
const RecenterMap = ({ coords }) => {
  const map = useMap();
  useEffect(() => {
    if (coords) map.setView(coords, 14);
  }, [coords, map]);
  return null;
};

const DirectorioTalleres = () => {
  // --- ESTADOS ---
  const [talleres, setTalleres] = useState([]);
  const [busquedaTaller, setBusquedaTaller] = useState("");
  const [direccionManual, setDireccionManual] = useState("");
  const [radio, setRadio] = useState(10);
  const [ubicacionReferencia, setUbicacionReferencia] = useState([40.4167, -3.7037]); // Madrid por defecto
  const [centroMapa, setCentroMapa] = useState([40.4167, -3.7037]);
  const [cargandoUbi, setCargandoUbi] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [enviandoTaller, setEnviandoTaller] = useState(false);
  
  const [nuevoTaller, setNuevoTaller] = useState({
    nombre: "",
    direccion: "",
    telefono: "",
    email: "",
    descripcion: "",
  });

  // --- FUNCIONES DE CARGA ---

  // Definida con useCallback para evitar re-renders infinitos y poder usarla en varios sitios
  const cargarTalleres = useCallback(async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/talleres/cercanos?lat=${ubicacionReferencia[0]}&lng=${ubicacionReferencia[1]}&radio=${radio}`
      );
      const data = await res.json();
      setTalleres(data);
    } catch (error) {
      console.error("Error cargando talleres:", error);
    }
  }, [ubicacionReferencia, radio]);

  // 1. Geolocalización automática inicial
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = [pos.coords.latitude, pos.coords.longitude];
          setUbicacionReferencia(coords);
          setCentroMapa(coords);
        },
        (error) => console.warn("Error de geolocalización (code 2 es normal en PC):", error)
      );
    }
  }, []);

  // 2. Cargar talleres cuando cambie la ubicación de referencia o el radio
  useEffect(() => {
    cargarTalleres();
  }, [cargarTalleres]);

  // --- INTERACCIONES ---

  const buscarLugar = async (e) => {
    e.preventDefault();
    if (!direccionManual) return;
    setCargandoUbi(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(direccionManual)}`
      );
      const data = await res.json();
      if (data.length > 0) {
        const coords = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
        setUbicacionReferencia(coords);
        setCentroMapa(coords);
      } else {
        alert("No se encontró el lugar.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCargandoUbi(false);
    }
  };

  const manejarRecomendacion = async (e) => {
    e.preventDefault();
    setEnviandoTaller(true);
    try {
      const res = await fetch("http://localhost:3000/api/talleres/recomendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoTaller),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Error al guardar el taller");
      }

      alert("¡Gracias! Taller añadido a la comunidad OpenHood.");
      setMostrarModal(false);
      
      // Limpiar formulario completo
      setNuevoTaller({ nombre: "", direccion: "", telefono: "", email: "", descripcion: "" });

      // Refresco automático de la lista sin recargar página
      cargarTalleres();
      
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setEnviandoTaller(false);
    }
  };

  const abrirGoogleMaps = (lat, lng) => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${ubicacionReferencia[0]},${ubicacionReferencia[1]}&destination=${lat},${lng}&travelmode=driving`;
    window.open(url, "_blank");
  };

  const talleresFiltrados = talleres.filter((t) =>
    t.nombre.toLowerCase().includes(busquedaTaller.toLowerCase())
  );

  return (
    <div style={{ display: "flex", padding: "20px", gap: "20px", height: "92vh", fontFamily: "Arial, sans-serif" }}>
      
      {/* PANEL IZQUIERDO: BUSCADOR Y LISTA */}
      <div style={{ width: "380px", overflowY: "auto", background: "#fff", padding: "20px", borderRadius: "15px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }}>
        <h3 style={{ marginTop: 0 }}>📍 Cambiar Ubicación</h3>
        <form onSubmit={buscarLugar} style={{ display: "flex", gap: "5px", marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Ciudad o dirección..."
            value={direccionManual}
            onChange={(e) => setDireccionManual(e.target.value)}
            style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "1px solid #ddd" }}
          />
          <button type="submit" style={{ padding: "10px", background: "#007bff", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" }}>
            {cargandoUbi ? "..." : "Ir"}
          </button>
        </form>

        <hr style={{ border: "0.5px solid #eee", marginBottom: "20px" }} />

        <h3>🔍 Filtrar Talleres</h3>
        <input
          type="text"
          placeholder="Nombre del taller..."
          value={busquedaTaller}
          onChange={(e) => setBusquedaTaller(e.target.value)}
          style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd", marginBottom: "15px", boxSizing: "border-box" }}
        />

        <label style={{ fontSize: "14px", fontWeight: "bold" }}>Radio: {radio} km</label>
        <input
          type="range"
          min="1"
          max="50"
          value={radio}
          onChange={(e) => setRadio(e.target.value)}
          style={{ width: "100%", marginBottom: "20px" }}
        />

        <button
          onClick={() => setMostrarModal(true)}
          style={{ width: "100%", padding: "12px", background: "#28a745", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", marginBottom: "15px", fontWeight: "bold" }}
        >
          ➕ Recomendar un Taller
        </button>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {talleresFiltrados.map((taller) => (
            <div
              key={taller.id}
              onClick={() => setCentroMapa([taller.latitud, taller.longitud])}
              style={{ padding: "15px", borderRadius: "12px", border: "1px solid #eee", cursor: "pointer", background: "#fdfdfd" }}
            >
              <h4 style={{ margin: "0", color: "#007bff" }}>{taller.nombre}</h4>
              <p style={{ margin: "5px 0", fontSize: "12px", color: "#666" }}>{taller.direccion}</p>
              <button
                onClick={(e) => { e.stopPropagation(); abrirGoogleMaps(taller.latitud, taller.longitud); }}
                style={{ marginTop: "10px", width: "100%", padding: "8px", background: "#28a745", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}
              >
                🚗 Cómo llegar
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* PANEL DERECHO: MAPA */}
      <div style={{ flex: 1, borderRadius: "15px", overflow: "hidden", border: "1px solid #ddd", filter: "grayscale(0.1) contrast(1.05)" }}>
        <MapContainer center={centroMapa} zoom={13} style={{ height: "100%", width: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <RecenterMap coords={centroMapa} />

          {/* Marcador de Búsqueda (Rojo) */}
          <Marker
            position={ubicacionReferencia}
            icon={L.icon({
              iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
              shadowUrl: markerShadow,
              iconSize: [25, 41],
              iconAnchor: [12, 41],
            })}
          >
            <Popup>Buscando desde aquí</Popup>
          </Marker>

          {/* Marcadores de Talleres (Azules por defecto) */}
          {talleresFiltrados.map((taller) => (
            <Marker key={taller.id} position={[taller.latitud, taller.longitud]}>
              <Popup>
                <div style={{ textAlign: "center" }}>
                  <strong>{taller.nombre}</strong><br />
                  <span style={{ fontSize: "11px" }}>{taller.telefono}</span><br />
                  <button
                    onClick={() => abrirGoogleMaps(taller.latitud, taller.longitud)}
                    style={{ marginTop: "5px", background: "none", border: "none", color: "#007bff", textDecoration: "underline", cursor: "pointer" }}
                  >
                    Ruta en Google Maps
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* MODAL DE RECOMENDACIÓN */}
      {mostrarModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "#fff", padding: "25px", borderRadius: "15px", width: "450px", boxShadow: "0 10px 25px rgba(0,0,0,0.2)" }}>
            <h3 style={{ marginTop: 0 }}>Recomendar Taller</h3>
            <form onSubmit={manejarRecomendacion} style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "15px" }}>
              <input
                type="text" placeholder="Nombre del taller *" value={nuevoTaller.nombre}
                onChange={(e) => setNuevoTaller({ ...nuevoTaller, nombre: e.target.value })}
                required style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}
              />
              <input
                type="text" placeholder="Dirección completa *" value={nuevoTaller.direccion}
                onChange={(e) => setNuevoTaller({ ...nuevoTaller, direccion: e.target.value })}
                required style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}
              />
              <div style={{ display: "flex", gap: "10px" }}>
                <input
                  type="text" placeholder="Teléfono" value={nuevoTaller.telefono}
                  onChange={(e) => setNuevoTaller({ ...nuevoTaller, telefono: e.target.value })}
                  style={{ flex: 1, padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}
                />
                <input
                  type="email" placeholder="Email" value={nuevoTaller.email}
                  onChange={(e) => setNuevoTaller({ ...nuevoTaller, email: e.target.value })}
                  style={{ flex: 1, padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}
                />
              </div>
              <textarea
                placeholder="¿Por qué lo recomiendas? (Descripción)"
                value={nuevoTaller.descripcion}
                onChange={(e) => setNuevoTaller({ ...nuevoTaller, descripcion: e.target.value })}
                rows="3" style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "5px", resize: "none", fontFamily: "inherit" }}
              />
              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button type="button" onClick={() => setMostrarModal(false)} style={{ flex: 1, padding: "10px", background: "#f1f1f1", border: "none", borderRadius: "5px", cursor: "pointer" }}>Cancelar</button>
                <button type="submit" disabled={enviandoTaller} style={{ flex: 1, padding: "10px", background: "#007bff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}>
                  {enviandoTaller ? "Guardando..." : "Publicar recomendación"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DirectorioTalleres;