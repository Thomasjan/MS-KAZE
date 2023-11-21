import express, {Request, Response} from 'express';
import 'colors';

const app = express();
const port = 3000;

import router from './routes/router';
import axios from 'axios';


app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.get('/', (req: Request, res: Response) => {
  res.status(200).send('Hello, Kaze!');
});


app.use('/api', router);

app.listen(port, () => {
  console.log(`Kaze-api running on http://localhost:${port}`.magenta.bold);
});


export default app;