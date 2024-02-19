import { Router } from 'express';

import gestimumRoutes from './gestimum.routes';
import kazeRoutes from './kaze.routes';
import logsRoutes from './logs.routes';


const router = Router();

router.use('/gestimum', gestimumRoutes);
router.use('/kaze', kazeRoutes);
router.use('/logs', logsRoutes);

export default router;

