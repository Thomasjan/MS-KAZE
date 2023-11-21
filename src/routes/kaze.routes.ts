import { Router, Response, Request } from "express";
import kazeController from "../controllers/kaze.controllers";
import { login } from "../controllers/auth.controllers";

const router = Router();

router.get('/index', kazeController.index);
router.post('/login', async (req: Request, res: Response) => {
    const { username, password } = req.body;
  
    try {
      await login(username, password);
      res.send('Login successful');
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
});

router.get('/testConnection', kazeController.testConnection);

export default router;