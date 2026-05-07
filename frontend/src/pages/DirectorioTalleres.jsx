import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix para los iconos de Leaflet
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
  // ESTADOS
  const [talleres, setTalleres] = useState([]);
  const [busquedaTaller, setBusquedaTaller] = useState("");
  const [direccionManual, setDireccionManual] = useState("");
  const [radio, setRadio] = useState(10);
  const [ubicacionReferencia, setUbicacionReferencia] = useState([40.4167, -3.7037]); // Punto de búsqueda
  const [centroMapa, setCentroMapa] = useState([40.4167, -3.7037]);
  const [cargandoUbi, setCargandoUbi] = useState(false);

  // 1. Geolocalización automática inicial
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = [pos.coords.latitude, pos.coords.longitude];
          setUbicacionReferencia(coords);
          setCentroMapa(coords);
        },
        () => console.log("Usando ubicación por defecto (Madrid)")
      );
    }
  }, []);

  // 2. Cargar talleres desde el Backend
  useEffect(() => {
    const fetchTalleres = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/talleres/cercanos?lat=${ubicacionReferencia[0]}&lng=${ubicacionReferencia[1]}&radio=${radio}`
        );
        const data = await res.json();
        setTalleres(data);
      } catch (error) {
        console.error("Error cargando talleres:", error);
      }
    };
    fetchTalleres();
  }, [ubicacionReferencia, radio]);

  // 3. Funciones de Interacción
  const buscarLugar = async (e) => {
    e.preventDefault();
    if (!direccionManual) return;
    setCargandoUbi(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(direccionManual)}`);
      const data = await res.json();
      if (data.length > 0) {
        const coords = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
        setUbicacionReferencia(coords);
        setCentroMapa(coords);
      } else {
        alert("No se encontró el lugar.");
      }
    } catch (err) { console.error(err); }
    finally { setCargandoUbi(false); }
  };

  const abrirGoogleMaps = (lat, lng) => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${ubicacionReferencia[0]},${ubicacionReferencia[1]}&destination=${lat},${lng}&travelmode=driving`;
    window.open(url, "_blank");
  };

  const talleresFiltrados = talleres.filter((t) =>
    t.nombre.toLowerCase().includes(busquedaTaller.toLowerCase())
  );

  return (
    <div style={{ display: "flex", padding: "20px", gap: "20px", height: "92vh", fontFamily: 'Arial, sans-serif' }}>
      
      {/* PANEL IZQUIERDO */}
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
        <input type="range" min="1" max="50" value={radio} onChange={(e) => setRadio(e.target.value)} style={{ width: "100%", marginBottom: "20px" }} />

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
      <div style={{ flex: 1, borderRadius: "15px", overflow: "hidden", border: "1px solid #ddd" }}>
        <MapContainer center={centroMapa} zoom={13} style={{ height: "100%", width: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <RecenterMap coords={centroMapa} />
          
          {/* Marcador de Búsqueda (Rojo) */}
          <Marker 
            position={ubicacionReferencia} 
            icon={L.icon({
              iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
              shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
            })}
          >
            <Popup>Buscando desde aquí</Popup>
          </Marker>

          {/* Marcadores de Talleres */}
          {talleresFiltrados.map((taller) => (
            <Marker key={taller.id} position={[taller.latitud, taller.longitud]}>
              <Popup>
                <div style={{ textAlign: "center" }}>
                  <strong>{taller.nombre}</strong><br />
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
    </div>
  );
};

export default DirectorioTalleres;