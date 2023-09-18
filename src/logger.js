const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');

const { PrepareDirectorySync } = require('./helper/prepareDirectory');

const { logging: { logDirectory } } = require('../config/config.json');
const Package = require('../package.json');

PrepareDirectorySync(logDirectory);

const customFormat = format.printf(({ level, message, timestamp }) => {

    return `${timestamp} ${level} | ${message}`;
});

const dailyRotateTransport = new transports.DailyRotateFile({
    dirname: logDirectory,
    filename: `${Package.name}%DATE%.log`,
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d'
});

const Logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.errors({ stack: true }),
        format.splat(),
        customFormat
    ),
    transports: [
        dailyRotateTransport
    ]
});

if (process.env.NODE_ENV !== 'production') {
    Logger.add(new transports.Console({
        format: format.combine(
            format.timestamp(),
            format.colorize()
        ),
        level: 'debug'
    }));
}

module.exports = Logger;