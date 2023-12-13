import express, {NextFunction, Request, Response} from 'express';
import 'colors';
import winston from 'winston';

const app = express();
const port = 3000;

import router from './routes/router';
import logger from './logger';



app.use(express.json());
app.use(express.urlencoded({extended: true}));


//error handling
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.stack);
  next(err);
  // res.status(500).send('Something went wrong!');
});

app.get('/', (req: Request, res: Response) => {
  res.status(200).send('Hello, Kaze!');
});


app.use('/api/v1', router);

app.listen(port, () => {
  console.log(`Kaze-api running on http://localhost:${port}`.magenta.bold);
});


export default app;