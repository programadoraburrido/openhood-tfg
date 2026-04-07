const express = require('express');
const router = express.Router();
const presupuestosController = require('../controllers/presupuestos.controller');
const upload = require('../middlewares/upload.middleware');

router.get('/', presupuestosController.obtenerPresupuestos);
router.post('/', presupuestosController.crearPresupuesto);
router.put('/:id', presupuestosController.actualizarPresupuesto);
router.delete('/:id', presupuestosController.eliminarPresupuesto);
router.post('/:id/pdf', upload.single('archivo'), presupuestosController.subirPdf);

module.exports = router;