const express = require('express');
const router = express.Router();
const comparadorIAController = require('../controllers/comparadorIA.controller');
const verificarToken = require('../middlewares/auth.middleware');

router.get('/:id/analizar', verificarToken, comparadorIAController.analizarPresupuesto);

module.exports = router;