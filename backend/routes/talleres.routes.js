import { Router } from 'express';
import { getTalleres, createTaller } from '../controllers/talleres.controller.js';

const router = Router();

router.get('/', getTalleres);
router.post('/', createTaller);

module.exports = router;