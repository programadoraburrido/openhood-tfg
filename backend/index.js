const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importamos las rutas
const reparacionesRoutes = require('./routes/reparaciones.routes');

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

// Todas las peticiones que empiecen por /api/reparaciones irán a tu archivo de rutas
app.use('/api/reparaciones', reparacionesRoutes);


// Levantar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});