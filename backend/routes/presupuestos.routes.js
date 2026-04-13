const express = require('express');
const router = express.Router();
const presupuestosController = require('../controllers/presupuestos.controller');
const upload = require('../middlewares/upload.middleware');
const verificarToken = require('../middlewares/auth.middleware');

router.get('/', verificarToken, presupuestosController.obtenerPresupuestos);
router.post('/', verificarToken, presupuestosController.crearPresupuesto);
router.put('/:id', verificarToken, presupuestosController.actualizarPresupuesto);
router.delete('/:id', verificarToken, presupuestosController.eliminarPresupuesto);
router.post('/:id/pdf', verificarToken, upload.single('archivo'), presupuestosController.subirPdf);

module.exports = router;