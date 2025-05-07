const winston = require("winston");
const { timestamp, combine, colorize, json, errors } = winston.format;

const infoFormat = combine(
    timestamp({ format: "HH:mm:ss DD/MM/YYYY" }),
    json(),
    colorize()
);

const errorFormat = combine(
    errors({ stack: true }),
    timestamp({ format: "HH:mm:ss DD/MM/YYYY" }),
    json(),
    colorize()
);

const Logger = winston.createLogger({
    level: "info",
    format: combine(
        timestamp({ format: "HH:mm:ss DD/MM/YYYY" }),
        json(),
        colorize()
    ),
    transports: [
        new winston.transports.Console({
            level: "info",
            format: infoFormat,
        }),
        new winston.transports.Console({
            level: "error",
            format: errorFormat,
        }),
    ],
});

const logInfo = (req, res, next) => {
    Logger.info(`${req.method} ${req.url} ${JSON.stringify(req.body)}`);
    next();
};

const logError = (err, req, res, next) => {
    Logger.error(`message: ${err.message}, stackTrace: ${err.stack}`);
    next(err);
};

module.exports = { logInfo, logError };
