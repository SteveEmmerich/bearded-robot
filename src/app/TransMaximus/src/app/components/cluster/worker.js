var promise = require('bluebird'),
    logger = require('lib/logger.js'),
    config = require('config/config.js'),
    cm = require('lib/cluster-manager.js'),
    express = require('config/express.js');
    
module.exports.init = function()
{    
    if (cm.isMaster())
        return;
        

    var app = express.init();

    app.listen(config.port);
    logger.info('TransMaximus listening on port ', config.port);
};
