import { Router, Response, Request } from "express";
import kazeController from "../controllers/kaze.controllers";
import { login } from "../controllers/auth.controllers";
import validateData from "../utils/validData";

const router = Router();

router.get('/index', kazeController.index);

router.post('/login', /*validateData(['username', 'password']),*/ async (req: Request, res: Response) => {
    const { username, password } = req.body;
    try {
      await login(username, password);
         res.status(200).json({ status: 'ok', message: 'Login successful' });
    } catch (error) {
      console.error(error);
        res.status(500).json({ status: 'error', message: 'Login failed' });
    }
});

router.get('/testConnection', kazeController.testConnection);
router.get('/getJobs', kazeController.getJobs);
router.get('/getJobs/:id', kazeController.getJob);
router.post('/createJob', kazeController.createJob);
router.post('/createJobFromWorkflowID/:id', kazeController.createJobFromWorkflowID);

export default router;