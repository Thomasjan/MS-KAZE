import { execSync } from 'child_process';
import dotenv from 'dotenv';
dotenv.config();

console.log('Starting scripts');

const intervalTime = 10000; // Default interval time is 40 seconds

setInterval(() => {
    execSync('ts-node src/scripts/collections.script.ts', { stdio: [0, 1, 2] });
}, intervalTime);