//gestimumController
import e, { Request, Response } from 'express';
import { getAuthToken } from './auth.controllers';
import axios from 'axios';

const kazeController = {
    index: (req: Request, res: Response) => {
        console.log('Hello, Kaze!'.magenta.bold)
        return res.send('Hello, Kaze!');
    },
    
    testConnection: async (req: Request, res: Response) => {
       const authToken = getAuthToken();
        console.log(authToken);

        res.send(authToken);
    },

    getJobs: async (req: Request, res: Response) => {

        const authToken = getAuthToken();

        try{
            const response = await axios.get('https://app.kaze.so/api/jobs.json', {
                headers: {
                    Authorization: `${authToken}`,
                    "Content-Type": "application/json"
                }
            });
            console.log(response.data);
            res.send(response.data);
        }
        catch(error){
            console.log(error);
            res.status(500).send(error);
        }
    }


}

export default kazeController;