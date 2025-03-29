import { createLogger, format, transports } from 'winston';
const { combine, timestamp, json, colorize } = format;

// Custom format for console logging with colors
const consoleLogFormat = format.combine(
  format.colorize(),
  format.printf(({ level, message, timestamp }) => {
    return `${level}: ${message}`;
  })
);

// Create a Winston logger
const logger = createLogger({
  level: 'info',
  format: combine(
    colorize(),
    timestamp(),
    json()
  ),
  transports: [
    new transports.Console({
      format: consoleLogFormat
    }),
    // new transports.File({ filename: 'logs/error.log', level: 'error' }), // Log errors to file
    // new transports.File({ filename: 'logs/combined.log' }), // Log all output to combined.log
  ],
});

export default logger;