const express = require('express');
const router = express.Router();
const { registrarUsuario } = require('../controllers/auth.controller');

// Ruta: POST http://localhost:3000/api/auth/register
router.post('/register', registrarUsuario);

module.exports = router;