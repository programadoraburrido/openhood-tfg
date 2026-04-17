const express = require('express');
const router = express.Router();
const reparacionesController = require('../controllers/reparaciones.controller');
const verificarToken = require('../middlewares/auth.middleware');

// Rutas base.
router.get('/', verificarToken, reparacionesController.obtenerReparaciones);
router.post('/', verificarToken, reparacionesController.crearReparacion);

// Rutas busqueda específica.
router.get('/vehiculo/:matricula', verificarToken, reparacionesController.obtenerReparacionesPorVehiculo);

// Rutas con ID.
router.put('/:id', verificarToken, reparacionesController.actualizarReparacion);
router.delete('/:id', verificarToken, reparacionesController.eliminarReparacion);

module.exports = router;