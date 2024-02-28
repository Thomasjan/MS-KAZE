//gestimumController
import  { Request, Response } from 'express';
import { getAuthToken } from './auth.controllers';
import axios from 'axios';
import { login } from '../scripts/api.functions';
import logger from '../logger';


const kazeController = {
    index: (req: Request, res: Response) => {
        console.log('Hello, Kaze!'.magenta.bold);
        return res.send('Hello, Kaze!');
    },
    
    testConnection: async (req: Request, res: Response) => {
        try{
            await login();
            const token = getAuthToken();
            if(token === null){
                return res.status(500).send({status: 'error', message: 'Connection failed'});
            }
            return res.status(200).send({status: 'ok', message: 'Connection successful'});
        }
        catch(error){
            console.log(error);
            return res.status(500).send(error)
        }
    },

    //get all jobs from Kaze
    getJobs: async (req: Request, res: Response) => {

        const authToken = await getAuthToken();
        const body = req.body;
        console.log('body: '.yellow, body);
        try{
            const response = await axios.get('https://app.kaze.so/api/jobs.json', {
                headers: {
                    Authorization: `${authToken}`,
                    "Content-Type": "application/json"
                },
                params: body
                
            });
            // console.log(response.data);
            res.send(response.data);
        }
        catch(error){
            console.log(error);
            res.status(500).send(error);
        }
    },

    //get job by id from Kaze
    getJob: async (req: Request, res: Response) => {
        const id = req.params.id;
        const authToken = await getAuthToken();
        try{
            const response = await axios.get(`https://app.kaze.so/api/jobs/${id}.json`, {
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
    },

    //post job to Kaze
    createJob: async (req: Request, res: Response) => {
            
            const authToken = await getAuthToken();
            console.log('authTokenPOST: '.yellow, authToken);

            const json: JSON = req.body;
            try{
                const response = await axios.post('https://app.kaze.so/api/jobs.json', json, {
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
        },

    //createJobFromWorkflowID
    createJobFromWorkflowID: async (req: Request, res: Response) => {
            
            const authToken = await getAuthToken();

            const workflowID: String = req.params.id;
            const json: JSON = req.body;

            console.log('json: '.yellow, json);
            try{
                const response = await axios.post(`https://app.kaze.so/api/job_workflows/${workflowID}/job.json`, json, {
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
        },

        updateJob: async (req: Request, res: Response) => {
            console.log('updateJob'.red)
            const { id, widget_id } = req.params;
            console.log('id: '.yellow, id);
            console.log('widget_id: '.yellow, widget_id);
            const authToken = getAuthToken();

            const body = {
                data: {
                    [widget_id]: req.body.value
                },
                "skip_version_check": 1
            }
            console.log('body: '.yellow, body)
            try{
                const response = await axios.put(`https://app.kaze.so/api/jobs/${id}/cells/${widget_id}.json`, body, {
                    headers: {
                        Authorization: `${authToken}`,
                        "Content-Type": "application/json"
                    }
                });
                res.status(200).send(response.data);
            }
            catch(error){
                console.log(error);
                res.status(500).send(error);
            }
        },

        insertIntoCollection: async (req: Request, res: Response) => {
            const authToken = await getAuthToken();
            const { id } = req.params;
            const json: JSON = req.body;

            try{
                const response = await axios.post(`https://app.kaze.so/api/collections/${id}/items.json`, json, {
                    headers: {
                        Authorization: `${authToken}`,
                        "Content-Type": "application/json"
                    }
                });
                res.send(response.data);
            }
            catch(error){
                logger.error(`Erreur lors de l\'insertion dans la collection: ${id} `, error);
                res.status(500).send(error);
            }
        }



}

export default kazeController;



