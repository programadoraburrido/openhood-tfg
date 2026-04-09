const express = require('express');
const router = express.Router();
const comparadorIAController = require('../controllers/comparadorIA.controller');

router.get('/:id/analizar', comparadorIAController.analizarPresupuesto);

module.exports = router;