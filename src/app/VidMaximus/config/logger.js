/**
 *  * Created by sdemmer on 2/8/15.
 * Copyright 2015 by Shade Tech Inc
 * Description:
 */
var log4js = require('log4js');
var config = require('./config');
log4js.configure(config.logger);
var logger = log4js.getLogger();
logger.debug('Logging has started');
module.exports = logger;
