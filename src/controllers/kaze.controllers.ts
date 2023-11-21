//gestimumController
import { Request, Response } from 'express';
import { getAuthToken } from './auth.controllers';

const kazeController = {
    index: (req: Request, res: Response) => {
        console.log('Hello, Kaze!'.magenta.bold)
        return res.send('Hello, Kaze!');
    },
    
    testConnection: async (req: Request, res: Response) => {
       const authToken = getAuthToken();
        console.log(authToken);

        res.send(authToken);
    }
}

export default kazeController;