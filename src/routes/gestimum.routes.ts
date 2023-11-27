import { Router } from "express";

import gestimumController from "../controllers/gestimum.controllers";

const router = Router();

router.get('/index', gestimumController.index);
router.get('/affaires/', gestimumController.getAffaires);

export default router;