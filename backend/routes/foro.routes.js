const express = require('express');
const router = express.Router();
const verificarToken = require('../middlewares/auth.middleware');
const foroController = require('../controllers/foro.controller');

router.get('/temas', verificarToken, foroController.obtenerTemas);
router.post('/temas', verificarToken, foroController.crearTema);
router.get('/temas/:id', verificarToken, foroController.obtenerTemaPorId);
router.post('/temas/:id/respuestas', verificarToken, foroController.crearRespuesta);

module.exports = router;