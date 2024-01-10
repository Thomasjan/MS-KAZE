import winston from 'winston';
import fs from 'fs';
import ansiRegex from 'ansi-regex';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.simple(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.File({ filename: 'history.log', level: 'history'}),
  ],
});

export const logTimeToHistory = (message: string) => {
  const currentTime = new Date().toISOString();
  const cleanedMessage = stripAnsi(message);
  fs.appendFileSync('history.log', cleanedMessage + '\n');
  logger.info(`Script executed at: ${currentTime}`);
};

const stripAnsi = (text: string) => {
  return text.replace(/\x1B\[\d+m/g, '');
};

export default logger;
