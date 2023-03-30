const fs = require('fs');
const { Console } = require('console');

const output = fs.createWriteStream('debug.log');
const errorout = fs.createWriteStream('err.log');

const logger = new Console(output,errorout);

module.exports = logger;