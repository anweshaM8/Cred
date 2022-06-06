const winston = require('winston');
const generateFolder = Helper('generate-folder');
const moment = require('moment');

// creates a new Winston Logger
const loggers = {
	infoLogger: winston.createLogger({
		level: 'info',
		format: winston.format.json(),
		transports: [new winston.transports.File({ filename: `${generateFolder.generateLogFolder()}/info-${moment().format('YYYY-MM-DD')}.log` })],
	}),

	errorLogger: winston.createLogger({
		level: 'error',
		format: winston.format.json(),
		transports: [new winston.transports.File({ filename: `${generateFolder.generateLogFolder()}/error-${moment().format('YYYY-MM-DD')}.log` }),],
	})
};

module.exports = loggers;