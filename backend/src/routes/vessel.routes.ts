import { Router } from 'express';
import { getVessels, getVesselById } from '../controllers/vessel.controller';

const router = Router();

router.get('/', getVessels);
router.get('/:id', getVesselById);

export default router;
