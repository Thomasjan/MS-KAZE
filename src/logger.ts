import winston from 'winston';
import fs from 'fs';
import moment from 'moment';
import { format } from 'winston';
import stripAnsi from 'strip-ansi';
moment.locale('fr');

const { combine, timestamp, errors, printf } = format;

// Define a custom log format
const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${stripAnsi(message)}`;
});

const logger = winston.createLogger({
    level: 'info',
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Using a custom format for timestamp
        errors({ stack: true }),
        logFormat // Using the custom log format defined above
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
        new winston.transports.File({ filename: 'history.log' })
    ]
});

export const logTimeToHistory = (message: string) => {
    const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');
    const cleanedMessage = stripAnsi(message);
    fs.appendFileSync('history.log', `${currentTime} - ${cleanedMessage}\n`);
    logger.info(`Script executed at: ${currentTime}`);
};

export default logger;
