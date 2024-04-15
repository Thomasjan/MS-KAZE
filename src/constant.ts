import moment from 'moment';
moment.locale('fr');
import fs from 'fs';

let lastTimeRun: string | null = moment().format('LLL');

export const setLastTimeRun = (date: any) => {
    try {
        fs.writeFileSync('lastExec', date);
        lastTimeRun = date;
    } catch (error) {
        console.error('Error writing lastExec:', error);
    }
    return lastTimeRun;
};

export const getLastTimeRun = () => {
    //get string in lastExec.txt
    //create lastExec.txt if it doesn't exist
    if (!fs.existsSync('lastExec')) {
        fs.writeFileSync('lastExec', moment().format('LLL'));
    }
    const lastExec = fs.readFileSync('lastExec', 'utf8');
    return lastExec;
};
