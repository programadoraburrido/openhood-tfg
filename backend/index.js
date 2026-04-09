const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importamos las rutas
const reparacionesRoutes = require('./routes/reparaciones.routes');
const presupuestosRoutes = require('./routes/presupuestos.routes');
const comparadorIARoutes = require('./routes/comparadorIA.routes');

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

// Hace visible la carpeta. Aqui se guardaran los PDFs.
app.use('/uploads', express.static('uploads'));


// Levantar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});