const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importamos las rutas
const reparacionesRoutes = require('./routes/reparaciones.routes');
const presupuestosRoutes = require('./routes/presupuestos.routes');
const comparadorIARoutes = require('./routes/comparadorIA.routes');
const authRoutes = require('./routes/auth.routes'); 
const vehiculoRoutes = require('./routes/vehiculo.routes');
const foroRoutes = require('./routes/foro.routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ==========================================
// REGISTRO DE RUTAS DE LA API
// ==========================================

app.get('/', (req, res) => {
  res.send('¡API de OpenHood funcionando perfectamente!');
});

app.use('/api/reparaciones', reparacionesRoutes);
app.use('/api/presupuestos', presupuestosRoutes);
app.use('/api/comparador', comparadorIARoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/foro', foroRoutes);

// Todas las peticiones que empiecen por /api/... irán a su archivo de rutas
app.use('/api/auth', authRoutes); 

// Se hace visible la carpeta (Esto te vendrá de lujo luego para las fotos de los vehículos con Multer)
app.use('/api/vehiculos', vehiculoRoutes);

// Levantar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

