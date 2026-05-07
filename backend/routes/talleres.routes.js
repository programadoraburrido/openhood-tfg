const express = require('express');
const router = express.Router();
const tallerController = require('../controllers/talleres.controller');

router.get('/', tallerController.getTalleres);
router.get('/cercanos', tallerController.getTalleresCercanos);
router.post('/', tallerController.createTaller);

module.exports = router;