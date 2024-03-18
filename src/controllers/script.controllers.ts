//gestimumController
import  { Request, Response } from 'express';
import { exec } from 'child_process';
import logger from '../logger';
import fs from 'fs';
import moment from 'moment';
moment.locale('fr');
import dotenv from 'dotenv';
import { getLastTimeRun } from '../constant';

dotenv.config();

const scriptController = {
    startCreateJobsScript: (req: Request, res: Response) => {
        exec('npm run start-createJobs', (error, stdout, stderr) => {
            if (error) {
                console.error(`Erreur lors du lancement du script : ${error.message}`);
                logger.error(new Error(`Erreur lors du lancement du script : ${error.message}`));
                res.status(500).send({status: 'error', message: `Erreur lors du lancement du script : ${error.message}`});
            }
            if (stderr) {
                console.error(`Erreur script: ${stderr}`);
                res.status(500).send({status: 'error', message: `Erreur script: ${stderr}`});
            }
            console.log(`Script output: ${stdout}`);
            res.status(200).send({status: 'success', message: `Script output: ${stdout}`});
        });
    },

    statusCreateJobsScript: (req: Request, res: Response) => {
        //lastTime format 18 mars 2024 09:41
        const lastTimeRunApp = getLastTimeRun();
        console.log('lastTimeRun', lastTimeRunApp);
        const currentTime = new Date();

        //check if lastTimeRun + process.env.JOBS_INTERVAL is greater than currentTime
        const lastTimeRunPlusInterval = moment(lastTimeRunApp, 'LLL').add(Number(process.env.JOBS_INTERVAL)+60, 'seconds');
        const scriptExecuted = lastTimeRunPlusInterval.isAfter(currentTime);

        if (scriptExecuted) {
            return res.status(200).send({ status: 'success', message: "Le script s'est correctement exécuté" });
        } else {
            return res.status(400).send({ status: 'warning', message: `Le script ne s'est pas exécuté depuis le ${lastTimeRunApp}` });
        }
    },

     stopCreateJobsScript: (req: Request, res: Response) => {
        // Kill the script using taskkill on Windows
        exec('taskkill /IM node.exe /F /FI "WINDOWTITLE eq start-createJobs"', (error, stdout, stderr) => {
            if (error) {
                console.error(`Error stopping the script: ${error.message}`);
                logger.error(new Error(`Error stopping the script: ${error.message}`));
                return res.status(500).send({ status: 'error', message: `Error stopping the script: ${error.message}` });
            }
            if (stderr) {
                console.error(`Script error: ${stderr}`);
                return res.status(500).send({ status: 'error', message: `Script error: ${stderr}` });
            }

            if (stdout.includes('SUCCESS')) {
                return res.status(200).send({ status: 'success', message: 'Script stopped' });
            }

            return res.status(500).send({ status: 'error', message: stdout });
        });
    },

    startGetJobsScript: (req: Request, res: Response) => {

        // Start the script with output redirection
        const childProcess = exec('npm run start-getJobs');

        childProcess.on('error', (error) => {
            console.error(`Error starting script: ${error.message}`);
        });

        childProcess.on('exit', (code, signal) => {
            console.log(`Script exited with code ${code} and signal ${signal}`);
        });

        // Send a response to the client immediately
        res.status(200).send({ status: 'success', message: 'Script started successfully' });
    },

    statusGetJobsScript: (req: Request, res: Response) => {
        //lastTime format 18 mars 2024 09:41
        const lastTimeRunApp = getLastTimeRun();
        const currentTime = new Date();

        //check if lastTimeRun + process.env.JOBS_INTERVAL is greater than currentTime
        const lastTimeRunPlusInterval = moment(lastTimeRunApp, 'LLL').add(Number(process.env.JOBS_INTERVAL)+60, 'seconds');
        const scriptExecuted = lastTimeRunPlusInterval.isAfter(currentTime);

        if (scriptExecuted) {
            return res.status(200).send({ status: 'success', message: "Le script s'est correctement exécuté" });
        } else {
            return res.status(400).send({ status: 'warning', message: `Le script ne s'est pas exécuté depuis le ${lastTimeRunApp}` });
        }
    },
    

    stopGetJobsScript: (req: Request, res: Response) => {
        //kill npm run start-getJobs
        exec('taskkill /IM node.exe /F /FI "WINDOWTITLE eq start-getJobs"', (error, stdout, stderr) => {
            if (error) {
                console.error(`Erreur lors de l'arrêt du script : ${error.message}`);
                logger.error(new Error(`Erreur lors de l'arrêt du script : ${error.message}`));
                return;
            }
            if (stderr) {
                console.error(`Erreur script: ${stderr}`);
                return;
            }
            console.log(`Script output: ${stdout}`);
        });
    }


}


export default scriptController;



