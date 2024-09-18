import winston from 'winston';

const logger = winston.createLogger({
    level: 'debug',
    defaultMeta: {
        serviceName: 'JobService',
    },
    transports: [
        new winston.transports.File({
            dirname: 'logs',
            filename: 'combined.log',
            level: 'debug',
            silent: false,
        }),
        new winston.transports.File({
            dirname: 'logs',
            filename: 'error.log',
            level: 'error',
            silent: false,
        }),
        new winston.transports.File({
            dirname: 'logs',
            filename: 'debug.log',
            level: 'debug',
            silent: false,
        }),
        new winston.transports.Console({
            level: 'info',
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json(),
            ),
        }),
    ],
});

export default logger;
