const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const logFile = path.join(logDir, 'system.log');

const logger = {
    error: (message) => {
        const timestamp = new Date().toISOString();
        const logMessage = `${timestamp} ERROR: ${message}\n`;
        fs.appendFileSync(logFile, logMessage, { flag: 'a+' });
        console.error(logMessage);
    },
    info: (message) => {
        const timestamp = new Date().toISOString();
        const logMessage = `${timestamp} INFO: ${message}\n`;
        fs.appendFileSync(logFile, logMessage, { flag: 'a+' });
        console.log(logMessage);
    }
};

module.exports = logger;