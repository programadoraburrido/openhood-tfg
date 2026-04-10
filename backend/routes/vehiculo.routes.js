const express = require('express');
const router = express.Router();
const { crearVehiculo, obtenerMisVehiculos } = require('../controllers/vehiculo.controller');
const verificarToken = require('../middlewares/auth.middleware');

// Todas estas rutas están protegidas. Si no hay Token, no pasan.
router.post('/', verificarToken, crearVehiculo);
router.get('/', verificarToken, obtenerMisVehiculos);

module.exports = router;