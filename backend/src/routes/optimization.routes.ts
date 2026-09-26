import { Router } from 'express';
import { optimizeCharter } from '../controllers/optimization.controller';

const router = Router();

router.post('/', optimizeCharter);

export default router;
