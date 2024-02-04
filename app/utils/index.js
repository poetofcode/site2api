const winston = require('winston');
const expressWinston = require('express-winston');

const { createLogger, format, transports } = winston;
const { combine, timestamp, label, printf } = format;

const ignoreList = [
  '/console/logdump',
  '/api/v1/sessions/'
];

function logger() {
	const myFormat = printf(({ level, message, timestamp }) => {
		const parsedDate = new Date(timestamp);
		const dateFormatted = parsedDate.toISOString().
				replace(/T/, ' ').
				replace(/\..+/, '');
	  return `${dateFormatted} ${level}: ${message}`;
	});
	return expressWinston.logger({
      transports: [
        new winston.transports.Console()
      ],
      format: winston.format.combine(
      	winston.format.timestamp(),
        winston.format.colorize(),
        myFormat
      ),
      meta: false,
      msg: "{{req.method}} {{req.url}} {{res.responseTime}}ms",
      expressFormat: true,
      colorize: true,
      ignoreRoute: function (req, res) { 
        let result = false;      
        ignoreList.forEach((item) => {
          if (req.url.includes(item)) {
            result = true;
          };
        });
        return result; 
      }
    })
}

function wrapResult(data) {
  return {
    result: data
  }
}

function wrapError(error) {
  return {
    error: error.message || "unknown",
    code: error.code || -1,
  }
}

function buildError(status, description, code) {
  const err = new Error(description);
  if (code) {
    err.code = code;
  }
  err.status = status;
  return err;
}

exports.utils = {
	logger: logger,
  wrapResult: wrapResult,
  wrapError: wrapError,
  buildError: buildError
}