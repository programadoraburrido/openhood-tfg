const express = require('express');
const router = express.Router();
const presupuestosController = require('../controllers/presupuestos.controller');

router.get('/', presupuestosController.obtenerPresupuestos);
router.post('/', presupuestosController.crearPresupuesto);

module.exports = router;