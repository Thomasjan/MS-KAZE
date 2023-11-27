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
        res.status(200).send('Login successful');
    } catch (error) {
      console.error(error);
      res.status(500).send('Login failed');
    }
});

router.get('/testConnection', kazeController.testConnection);
router.get('/getJobs', kazeController.getJobs);
router.post('/createJob', kazeController.createJob);

export default router;