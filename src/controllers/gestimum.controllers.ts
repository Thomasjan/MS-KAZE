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
        const query = Object.keys(req.query).map(key => key + '=' + req.query[key]).join('&');

        
        axios.get(`${GESTIMUM_API_URL}/affaires/?${query}`, config)
            .then((response) => {
                console.log('retrieved'.yellow + ' ' + `${response.data.count}`.green.bold + ' ' + 'affaires'.yellow);
                return res.send(response.data);
            })
            .catch((error) => {
                console.log(error);
                return res.send(error);
            });
    },

    getActions: (req: Request, res: Response) => {
        console.log('getActions()'.yellow)
        const config = {
            'headers': {
                'x-api-key': process.env.GESTIMUM_API_KEY
            }
        };
        const query = Object.keys(req.query).map(key => key + '=' + req.query[key]).join('&');

        axios.get(`${GESTIMUM_API_URL}/actions/?${query}`, config)
            .then((response) => {
                console.log('retrieved'.yellow + ' ' + `${response.data.count}`.green.bold + ' ' + 'actions'.yellow);
                return res.send(response.data);
            })
            .catch((error) => {
                console.log(error);
                return res.send(error);
            });
    },

    
}

export default gestimumController;