import { Router } from "express";

import scriptController from "../controllers/script.controllers";

const router = Router();

router.get('/startCreateJobs', scriptController.startCreateJobsScript);
router.get('/statusCreateJobs', scriptController.statusCreateJobsScript);
router.get('/stopCreateJobs', scriptController.stopCreateJobsScript);

router.get('/startGetJobs', scriptController.startGetJobsScript);
router.get('/statusGetJobs', scriptController.statusGetJobsScript);
router.get('/stopGetJobs', scriptController.stopGetJobsScript);



export default router;