//gestimumController

require('dotenv').config();
import { Request, Response } from 'express';
import axios from 'axios';

const GESTIMUM_API_URL = process.env.GESTIMUM_API_URL;

const gestimumController = {
    index: (req: Request, res: Response) => {
        console.log('Hello, Gestimum!'.yellow)
        return res.send('Hello, Gestimum!');
    },

    getAffaires: (req: Request, res: Response) => {
        console.log('getAffaires()'.yellow)
        const config = {
            'headers': {
                'x-api-key': process.env.GESTIMUM_API_KEY
            }
        };

        axios.get(`${GESTIMUM_API_URL}/affaires/`, config)
            .then((response) => {
                console.log(response.data);
                return res.send(response.data);
            })
            .catch((error) => {
                console.log(error);
                return res.send(error);
            });
    }
}

export default gestimumController;