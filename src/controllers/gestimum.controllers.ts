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

    //get all affaires from Gestimum
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


    //get all actions from Gestimum
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
    
    //get Tier from Gestimum
    getTier: (req: Request, res: Response) => {
        console.log('getTier()'.yellow)
        const config = {
            'headers': {
                'x-api-key': process.env.GESTIMUM_API_KEY
            }
        };

        axios.get(`${GESTIMUM_API_URL}/clients/code/${req.params.id}`, config)
            .then((response) => {
                console.log('retrieved tier code: '.yellow + ' ' + `${response.data.client.code}`.green.bold);
                return res.send(response.data);
            })
            .catch((error) => {
                console.log(error);
                return res.send(error);
            });
    },

    //update Actions in Gestimum
    updateAction: (req: Request, res: Response) => {
        console.log('updateAction()'.yellow)
        const config = {
            'headers': {
                'x-api-key': process.env.GESTIMUM_API_KEY
            }
        };

        axios.put(`${GESTIMUM_API_URL}/actions/updateAction/${req.params.id}`, req.body, config)
            .then((response) => {
                console.log('updated action: '.yellow + ' ' + `${response.data.action.id}`.green.bold);
                return res.send(response.data);
            })
            .catch((error) => {
                console.log(error);
                return res.send(error);
            });
    },
    
    

    
}

export default gestimumController;