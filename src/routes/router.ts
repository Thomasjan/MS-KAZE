import { Router } from 'express';

import gestimumRoutes from './gestimum.routes';
import kazeRoutes from './kaze.routes';


const router = Router();

router.use('/gestimum', gestimumRoutes);
router.use('/kaze', kazeRoutes);

export default router;

