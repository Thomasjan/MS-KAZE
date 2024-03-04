//gestimumController
import  { Request, Response } from 'express';
import fs from 'fs';
import moment from 'moment';
moment.locale('fr');

const formatLogTimestamp = (timestamp: string) => {
    return moment(timestamp).format('YYYY-MM-DD HH:mm:ss');
};


const logsController = {
    history: (req: Request, res: Response) => {
        //get history.log file
        console.log('GET /v1/logs/history'.blue)
        let data = fs.readFileSync('history.log', 'utf8');
        //reverse the data
        // data = data.split('\n').reverse().join('\n');
        return res.json(data);
    },

    updateHistory: (req: Request, res: Response) => {
        console.log('UPDATE /v1/logs/history'.blue)
        const { date } = req.body;
        console.log(date)
        // delete logs before date
        const data = fs.readFileSync('history.log', 'utf8');
        const logs = data.split('\n');
    
        let newLogs = '';
    
        logs.forEach((log: string) => {
            // Extract the date part of the log entry
            const logDateStr = log.match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/)?.[0];
            if (logDateStr) {
                // Extract the date string from the log entry
                const logDate = new Date(logDateStr);
                const providedDate = new Date(date);
    
                // Compare dates
                if (logDate >= providedDate) {
                    newLogs += log + '\n';
                }
            }
        });
    
        fs.writeFileSync('history.log', newLogs);
        return res.json(newLogs);
    },

    errors: (req: Request, res: Response) => {
        //get error.log file
        console.log('GET /v1/logs/errors'.blue)
        let data = fs.readFileSync('error.log', 'utf8');
        data = data.split('\n').reverse().join('\n');
        return res.json(data);
    },

    updateErrors: (req: Request, res: Response) => {
        console.log('UPDATE /v1/logs/errors'.blue)
        const { date } = req.body;
        console.log(date)
        console.log('moment date', moment(date).format('YYYY-MM-DD HH:mm:ss'))
        const formatedDate = moment(date).format('YYYY-MM-DD HH:mm:ss')
        // Read the contents of the error.log file
        const data = fs.readFileSync('error.log', 'utf8');
        const logs = data.split('\n');
        let newLogs = '';
    
        // Iterate through each log entry
        logs.forEach((log: string) => {
            // Extract the date part of the log entry
            const logDateStr = log.match(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/)?.[0];
            if (logDateStr) {
                // Extract the date string from the log entry
                const logDate = new Date(logDateStr);
                const providedDate = new Date(formatedDate);
    
                // Compare dates
                if (logDate >= providedDate) {
                    newLogs += log + '\n';
                }
            }
        });
    
        // Write the filtered logs back to the error.log file
        fs.writeFileSync('error.log', newLogs);
    
        // Return the filtered logs as JSON response
        return res.json(newLogs);
    }
    

}

export default logsController;



