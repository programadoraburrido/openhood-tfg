const express = require('express');
const router = express.Router();
const reparacionesController = require('../controllers/reparaciones.controller');

// Rutas base.
router.get('/', reparacionesController.obtenerReparaciones);
router.post('/', reparacionesController.crearReparacion);

// Rutas busqueda específica.
router.get('/vehiculo/:matricula', reparacionesController.obtenerReparacionesPorVehiculo);

// Rutas con ID.
router.put('/:id', reparacionesController.actualizarReparacion);
router.delete('/:id', reparacionesController.eliminarReparacion);

module.exports = router;