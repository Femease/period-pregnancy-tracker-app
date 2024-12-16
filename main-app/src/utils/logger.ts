// Create a simple logger module
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    // Add other transports as needed
  ],
});

export { logger }; 