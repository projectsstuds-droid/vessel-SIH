import { Router } from 'express';
import { getPorts, getPortById, checkCompatibility } from '../controllers/port.controller';

const router = Router();

router.get('/', getPorts);
router.get('/:id', getPortById);
router.post('/compatibility', checkCompatibility);

export default router;
