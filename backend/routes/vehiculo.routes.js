const express = require('express');
const router = express.Router();
const multer = require('multer'); // Importamos multer
const path = require('path');

const { 
  crearVehiculo, 
  obtenerMisVehiculos, 
  obtenerVehiculoPorMatricula, 
  eliminarVehiculo,
  actualizarVehiculo,
  subirImagenVehiculo,
  publicarEnMarketplace, 
  obtenerMarketplace
} = require('../controllers/vehiculo.controller');

const verificarToken = require('../middlewares/auth.middleware');

// Configuración de almacenamiento de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/vehiculos/'); // Asegúrate de tener esta carpeta creada en backend/
  },
  filename: (req, file, cb) => {
    cb(null, `${req.params.matricula}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage: storage });

// Rutas
// Rutas ESTÁTICAS (deben ir arriba para no ser "robadas")
router.get('/marketplace', verificarToken, obtenerMarketplace);
router.put('/marketplace/:matricula', verificarToken, publicarEnMarketplace);
router.post('/upload-image/:matricula', verificarToken, upload.single('imagen'), subirImagenVehiculo);

// Rutas DINÁMICAS (deben ir abajo)
router.get('/:matricula', verificarToken, obtenerVehiculoPorMatricula);
router.delete('/:matricula', verificarToken, eliminarVehiculo);
router.put('/:matricula', verificarToken, actualizarVehiculo);

// Otras rutas
router.post('/', verificarToken, crearVehiculo);
router.get('/', verificarToken, obtenerMisVehiculos);

// NUEVA RUTA: Subir imagen
// Usamos upload.single('imagen') para recibir el archivo con nombre "imagen"
router.post('/upload-image/:matricula', verificarToken, upload.single('imagen'), subirImagenVehiculo);

module.exports = router;