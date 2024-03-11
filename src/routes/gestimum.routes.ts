import { Router } from "express";

import gestimumController from "../controllers/gestimum.controllers";

const router = Router();

router.get('/index', gestimumController.index);
router.get('/affaires/', gestimumController.getAffaires);
router.get('/actions/', gestimumController.getActions);
router.get('/getTiers/', gestimumController.getAllTiers);
router.get('/getTiers/:id', gestimumController.getTiers);
router.get('/getContacts/', gestimumController.getAllContacts);
router.get('/getContact/:id', gestimumController.getContact);
router.put('/updateAction/:id', gestimumController.updateAction);
router.put('/updateTiers/:id', gestimumController.updateTiers);
router.put('/updateContact/:id', gestimumController.updateContact);

export default router;