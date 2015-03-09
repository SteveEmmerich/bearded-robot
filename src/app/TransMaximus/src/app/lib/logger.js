var chalk = require('chalk'),
    log4js = require('log4js'),
    config = require('config/config.js');

log4js.configure(config.logConfig);
    
var logger = log4js.getLogger();
module.exports = logger;


