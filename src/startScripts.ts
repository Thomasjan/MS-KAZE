import { execSync } from 'child_process';
import dotenv from 'dotenv';
dotenv.config();
import { getLastTimeRun, setLastTimeRun } from './constant';
import moment from 'moment';
moment.locale('fr');

console.log('Starting scripts');

const intervalTimeForJobs: number = Number(process.env.JOBS_INTERVAL) *1000 || 10000;
const intervalTimeForCollections: number = Number(process.env.COLLECTIONS_INTERVAL) *1000 || 10000;


setInterval(() => {
    console.log("Running jobs script", getLastTimeRun())
    // execSync('ts-node src/scripts/createJobs.script.ts', { stdio: [0, 1, 2] });
    // execSync('ts-node src/scripts/getJobs.script.ts', { stdio: [0, 1, 2] });
    setLastTimeRun(moment().format('LLL'));
}, intervalTimeForJobs);


setInterval(() => {
    // execSync('ts-node src/scripts/collections.script.ts', { stdio: [0, 1, 2] });
}, intervalTimeForCollections);