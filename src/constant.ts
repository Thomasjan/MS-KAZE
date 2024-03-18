import moment from 'moment';
moment.locale('fr');
import fs from 'fs';

let lastTimeRun: string | null = moment().format('LLL');

export const setLastTimeRun = (date: any) => {
    //write date in lastExec.txt
    fs.writeFileSync('lastExec.txt', date);
    lastTimeRun = date;
    return lastTimeRun;
};

export const getLastTimeRun = () => {
    //get string in lastExec.txt
    //create lastExec.txt if it doesn't exist
    if (!fs.existsSync('lastExec.txt')) {
        fs.writeFileSync('lastExec.txt', moment().format('LLL'));
    }
    const lastExec = fs.readFileSync('lastExec.txt', 'utf8');
    return lastExec;
};
