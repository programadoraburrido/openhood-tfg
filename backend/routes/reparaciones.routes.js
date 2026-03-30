const express = require('express');
const router = express.Router();
const reparacionesController = require('../controllers/reparaciones.controller');

// Definimos las rutas y las conectamos con las funciones de tu controlador reparaciones.controller.js
router.get('/', reparacionesController.obtenerReparaciones);
router.post('/', reparacionesController.crearReparacion);

module.exports = router;