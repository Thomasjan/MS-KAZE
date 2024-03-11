//gestimumController

require('dotenv').config();
import { Request, Response } from 'express';
import axios from 'axios';
import logger from '../logger';

const GESTIMUM_API_URL = process.env.GESTIMUM_API_URL;

const gestimumController = {
    index: (req: Request, res: Response) => {
        console.log('Hello, Gestimum!'.yellow);
        return res.send('Hello, Gestimum!');
    },

    //get all affaires from Gestimum
    getAffaires: (req: Request, res: Response) => {
        console.log('getAffaires()'.yellow);
        const config = {
            'headers': {
                'x-api-key': process.env.TOKEN_SECRET
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
                logger.error(new Error('Erreur de récupération des Affaires ' + error.response.data));
                return res.send(error);
            });
    },

    //get all actions from Gestimum
    getActions: (req: Request, res: Response) => {
        console.log('getActions()'.yellow);
        const config = {
            'headers': {
                'x-api-key': process.env.TOKEN_SECRET
            }
        };
        const query = Object.keys(req.query).map(key => key + '=' + req.query[key]).join('&')
        console.log('query: ', query)
        
        axios.get(`${GESTIMUM_API_URL}/actions/?${query}`, config)
            .then((response) => {
                console.log('retrieved'.yellow + ' ' + `${response.data.count}`.green.bold + ' ' + 'actions'.yellow);
                console.log(`getActions return data: ${response.data}`)
                return res.send(response.data);
            })
            .catch((error) => {
                console.log(error);
                logger.error(new Error('Erreur de récupération des Actions -> ' + error.response.data));
                return res.send(error);
            });
    },

    //récupération de tous les Tiers
    getAllTiers: (req: Request, res: Response) => {
        console.log('getAllTiers()'.yellow);

        const config = {
            'headers': {
                'x-api-key': process.env.TOKEN_SECRET
            }
        };
        const query = Object.keys(req.query).map(key => key + '=' + req.query[key]).join('&')
        
        axios.get(`${GESTIMUM_API_URL}/clients/?${query}`, config)
            .then((response) => {
                console.log('retrieved'.yellow + ' ' + `${response.data.count}`.green.bold + ' ' + 'tiers'.yellow);
                return res.send(response.data);
            })
            .catch((error) => {
                console.log(error);
                logger.error(new Error('Erreur de récupération des Tiers -> ' + error?.response?.data));
                return res.send(error);
            });
    },
    
    //get Tier from Gestimum
    getTiers: (req: Request, res: Response) => {
        console.log('getTiers()'.yellow);
        const config = {
            'headers': {
                'x-api-key': process.env.TOKEN_SECRET
            }
        };

        axios.get(`${GESTIMUM_API_URL}/clients/code/${req.params.id}`, config)
            .then((response) => {
                if(!response.data.found) return res.status(404).send('pas de Tiers trouvé');
                console.log('retrieved tier code: '.yellow + ' ' + `${response?.data?.client?.code}`.green.bold);
                return res.send(response.data);
            })
            .catch((error) => {
                console.log("getTiers Error: ", error.response.data);
                logger.error(new Error('Erreur de récupération des Tiers -> ' + error?.response?.data));
                return res.send(error.response.data);
            });
    },

    //récupération de tous les Contacts
    getAllContacts: async (req: Request, res: Response) => {
        console.log('fetchAllContacts()'.yellow);
        const config = {
            'headers': {
                'x-api-key': process.env.TOKEN_SECRET
            }
        };

        const query = Object.keys(req.query).map(key => key + '=' + req.query[key]).join('&');

        try{
            const response = await axios.get(`${GESTIMUM_API_URL}/utilisateurs/contacts?${query}`, config);
            console.log('retrieved'.yellow + ' ' + `${response.data.count}`.green.bold + ' ' + 'contacts'.yellow);
            return res.send(response.data);
        }
        catch(error: any){
            console.log(error);
            logger.error(new Error('Erreur de récupération des Contacts -> ' + error.response.data));
            return res.send(error);
        }
    },

    //get Contact from Gestimum
    getContact: (req: Request, res: Response) => {
        console.log('getContact()'.yellow);
        const config = {
            'headers': {
                'x-api-key': process.env.TOKEN_SECRET
            }
        };

        axios.get(`${GESTIMUM_API_URL}/utilisateurs/code/${req.params.id}`, config)
            .then((response) => {
                if(!response.data.found) return res.status(404).send('Pas de contact trouvé');
                console.log('retrieved contact: '.yellow + ' ' + `${response.data.utilisateur.CCT_NUMERO}`.green.bold);
                return res.send(response.data);
            })
            .catch((error) => {
                console.log(error);
                logger.error(new Error('Erreur de récupération du Contact -> ' + error?.response?.data));
                return res.status(500).send(error);
            });
    },

    //update Actions in Gestimum
    updateAction: (req: Request, res: Response) => {
        console.log('updateAction()'.yellow);
        const config = {
            'headers': {
                'x-api-key': process.env.TOKEN_SECRET
            }
        };

        axios.put(`${GESTIMUM_API_URL}/actions/updateAction/${req.params.id}`, req.body, config)
            .then((response) => {
                console.log('updated action: '.yellow + ' ' + `${response?.data?.action?.id}`.green.bold);
                return res.send(response.data);
            })
            .catch((error) => {
                console.log(error);
                logger.error(new Error("Erreur lors de la mise à jour de l'Action -> " + error.response.data));
                return res.send(error);
            });
    },

    //update Tiers in Gestimum
    updateTiers: (req: Request, res: Response) => {
        console.log('updateTiers()'.yellow);
        const config = {
            'headers': {
                'x-api-key': process.env.TOKEN_SECRET
            }
        };

        axios.put(`${GESTIMUM_API_URL}/clients/update/${req.params.id}`, req.body, config)
            .then((response) => {
                console.log('updated client: '.yellow + ' ' + `${response?.data?.tier?.id}`.green.bold);
                return res.send(response.data);
            })
            .catch((error) => {
                console.log(error);
                logger.error(new Error("Erreur lors de la mise à jour du Tiers -> " + error.response.data));
                return res.send(error);
            });
    },

    //update Contact in Gestimum
    updateContact: (req: Request, res: Response) => {
        console.log('updateContact()'.yellow);
        const config = {
            'headers': {
                'x-api-key': process.env.TOKEN_SECRET
            }
        };

        axios.put(`${GESTIMUM_API_URL}/utilisateurs/update/${req.params.id}`, req.body, config)
            .then((response) => {
                console.log('updated contact: '.yellow + ' ' + `${response?.data?.utilisateur?.id}`.green.bold);
                return res.send(response.data);
            })
            .catch((error) => {
                console.log(error);
                logger.error(new Error("Erreur lors de la mise à jour du Contact -> " + error.response.data));
                return res.send(error);
            });
    }
    
}

export default gestimumController;