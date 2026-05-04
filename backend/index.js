import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import chatRoutes from './routes/chat.routes.js'; // Asegúrate de poner el .js al final

dotenv.config();

// Importamos las rutas

import reparacionesRoutes from './routes/reparaciones.routes.js';
import presupuestosRoutes from './routes/presupuestos.routes.js';
import comparadorIARoutes from './routes/comparadorIA.routes.js';
import authRoutes from './routes/auth.routes.js';
import vehiculoRoutes from './routes/vehiculo.routes.js';

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

// Todas las peticiones que empiecen por /api/... irán a su archivo de rutas
app.use('/api/auth', authRoutes); 

// Se hace visible la carpeta (Esto te vendrá de lujo luego para las fotos de los vehículos con Multer)
app.use('/api/vehiculos', vehiculoRoutes);

app.use('/api/chat', chatRoutes); // Nueva ruta para el chat

// Levantar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

