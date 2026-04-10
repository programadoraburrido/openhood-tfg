const express = require('express');
const router = express.Router();
const { 
  crearVehiculo, 
  obtenerMisVehiculos, 
  obtenerVehiculoPorMatricula, 
  eliminarVehiculo 
} = require('../controllers/vehiculo.controller');
const verificarToken = require('../middlewares/auth.middleware');

// Todas protegidas con el middleware
router.post('/', verificarToken, crearVehiculo);
router.get('/', verificarToken, obtenerMisVehiculos);
router.get('/:matricula', verificarToken, obtenerVehiculoPorMatricula);
router.delete('/:matricula', verificarToken, eliminarVehiculo);

module.exports = router;