import { Router } from "express";

import logsController from "../controllers/logs.controllers";

const router = Router();

router.get('/history', logsController.history);
router.get('/errors', logsController.errors);

router.put('/history', logsController.updateHistory);
router.put('/errors', logsController.updateErrors);


export default router;