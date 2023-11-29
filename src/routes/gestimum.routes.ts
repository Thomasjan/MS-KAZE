import { Router } from "express";

import gestimumController from "../controllers/gestimum.controllers";

const router = Router();

router.get('/index', gestimumController.index);
router.get('/affaires/', gestimumController.getAffaires);
router.get('/actions/', gestimumController.getActions);
router.get('/getTier/:id', gestimumController.getTier);

export default router;