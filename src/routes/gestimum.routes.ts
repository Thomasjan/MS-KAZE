import { Router } from "express";

import gestimumController from "../controllers/gestimum.controllers";
import validateData from "../utils/validData";

const router = Router();

router.get('/index', gestimumController.index);
router.get('/affaires/', gestimumController.getAffaires);
router.get('/actions/', gestimumController.getActions);
router.get('/getTiers/:id', gestimumController.getTiers);
router.get('/getContact/:id', gestimumController.getContact);
router.put('/updateAction/:id', gestimumController.updateAction);

export default router;