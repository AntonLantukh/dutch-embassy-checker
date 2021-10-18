const {format, transports, createLogger} = require('winston');

const {combine, colorize, timestamp, printf, errors} = format;

const printFormat = info => {
    const {message, level, stack, timestamp} = info;

    return `${timestamp} [${level}]: ${stack || message}`;
};

const formats = combine(colorize(), timestamp(), errors({stack: true}), printf(printFormat));

const logger = createLogger({
    level: 'info',
    format: formats,
    transports: [new transports.Console({format: formats})],
});

module.exports = {logger};
