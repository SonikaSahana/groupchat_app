const fs = require('fs')
const outputLog = fs.createWriteStream('./outputLog.log');
const errorsLog = fs.createWriteStream('./errorsLog.log');
const loggerObj = new console.Console(outputLog, errorsLog);
module.exports = loggerObj;