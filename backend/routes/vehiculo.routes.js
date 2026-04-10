const express = require('express');
const router = express.Router();
const { 
  crearVehiculo, 
  obtenerMisVehiculos, 
  obtenerVehiculoPorMatricula, 
  eliminarVehiculo,
  actualizarVehiculo // 👈 AÑADE ESTO AQUÍ TAMBIÉN
} = require('../controllers/vehiculo.controller');
const verificarToken = require('../middlewares/auth.middleware');

// Rutas limpias y ordenadas
router.post('/', verificarToken, crearVehiculo);
router.get('/', verificarToken, obtenerMisVehiculos);
router.get('/:matricula', verificarToken, obtenerVehiculoPorMatricula);
router.delete('/:matricula', verificarToken, eliminarVehiculo);
router.put('/:matricula', verificarToken, actualizarVehiculo); 

module.exports = router;