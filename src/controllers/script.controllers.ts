//gestimumController
import  { Request, Response } from 'express';
import { exec } from 'child_process';
import logger from '../logger';
import fs from 'fs';

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
        // Read the content of the history.log file
        const historyLog = fs.readFileSync('history.log', 'utf8');
    
        // Get the current time minus 5 minutes
        const currentTime = new Date();
        const fiveMinutesAgo = new Date(currentTime.getTime() - 5 * 60000); // 5 minutes * 60 seconds * 1000 milliseconds
    
        // Check if the history log contains a line with a timestamp within the last 5 minutes
        const lines = historyLog.split('\n').reverse();
        let scriptExecuted = false;
        for (let line of lines) {
            if (line.includes('[createJobsScript] Début de l\'exécution du script le:')) {
                // Extract the timestamp from the log line
                const timestampString = line.split('[createJobsScript] Début de l\'exécution du script le: ')[1];
                const timestamp = new Date(timestampString);
    
                // Check if the timestamp is earlier than 5 minutes ago
                if (timestamp.getTime() >= fiveMinutesAgo.getTime()) {
                    console.log(`${timestamp} < ${fiveMinutesAgo}`)
                    scriptExecuted = true;
                    break;
                }
            }
        }
    
        if (scriptExecuted) {
            return res.status(200).send({ status: 'success', message: "Le script s'est exécuté dans les 5 dernières minutes" });
        } else {
            return res.status(200).send({ status: 'warning', message: "Le script ne s'est pas exécuté dans les 5 dernières minutes" });
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
        exec('npm run start-getJobs', (error, stdout, stderr) => {
            if (error) {
                console.error(`Erreur lors du lancement du script : ${error.message}`);
                logger.error(new Error(`Erreur lors du lancement du script : ${error.message}`));
                return;
            }
            if (stderr) {
                console.error(`Erreur script: ${stderr}`);
                return;
            }
            console.log(`Script output: ${stdout}`);
        });
    },

    statusGetJobsScript: (req: Request, res: Response) => {
       // Read the content of the history.log file
       const historyLog = fs.readFileSync('history.log', 'utf8');
    
       // Get the current time minus 5 minutes
       const currentTime = new Date();
       const fiveMinutesAgo = new Date(currentTime.getTime() - 5 * 60000); // 5 minutes * 60 seconds * 1000 milliseconds
   
       // Check if the history log contains a line with a timestamp within the last 5 minutes
       const lines = historyLog.split('\n').reverse();
       let scriptExecuted = false;
       for (let line of lines) {
           if (line.includes('[getJobsScript] Début de l\'exécution du script le:')) {
               // Extract the timestamp from the log line
               const timestampString = line.split('[getJobsScript] Début de l\'exécution du script le: ')[1];
               const timestamp = new Date(timestampString);
   
               // Check if the timestamp is earlier than 5 minutes ago
               if (timestamp.getTime() >= fiveMinutesAgo.getTime()) {
                   console.log(`${timestamp} < ${fiveMinutesAgo}`)
                   scriptExecuted = true;
                   break;
               }
           }
       }
   
       if (scriptExecuted) {
           return res.status(200).send({ status: 'success', message: "Le script s'est exécuté dans les 5 dernières minutes" });
       } else {
           return res.status(200).send({ status: 'warning', message: "Le script ne s'est pas exécuté dans les 5 dernières minutes" });
       }
    },

    stopGetJobsScript: (req: Request, res: Response) => {
        //kill npm run start-getJobs
        exec('pkill -f "npm run start-getJobs"', (error, stdout, stderr) => {
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



