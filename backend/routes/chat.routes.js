const express = require('express');
const router = express.Router();
const { handleChat, getChatHistory } = require('../controllers/chat.controller');

router.post('/', handleChat);
router.get('/history/:usuarioId', getChatHistory);

module.exports = router; // Forma antigua