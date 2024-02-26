import express, {NextFunction, Request, Response} from 'express';
import 'colors';
import cors from 'cors';
const app = express();
const port = 3000;

import router from './routes/router';
import logger from './logger';


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

//error handling
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.stack);
  next(err);
  // res.status(500).send('Something went wrong!');
});

app.get('/api', (req: Request, res: Response) => {
  console.log('GET /api');
  res.status(200).send({status: 'ok', message: 'Kaze-api is running!'});
});

app.get('/api/connexionERP', async (req: Request, res: Response) => {
  console.log('GET /connexionERP');
  // tester connexion avec GESTIMUM_API_URL
  try{
    const response = await fetch(`${process.env.GESTIMUM_API_URL}`);
    const data = await response.json();
    console.log(data);
    res.status(200).send({status: 'ok', message: 'Connexion ERP établie!'});
  }
  catch(err){
    console.log(err);
    res.status(500).send({status: 'error', message: 'Connexion ERP échouée!'});
  }
});


app.use('/api/v1', router);

app.listen(port, () => {
  console.log(`Kaze-api running on http://localhost:${port}`.magenta.bold);
});


export default app;