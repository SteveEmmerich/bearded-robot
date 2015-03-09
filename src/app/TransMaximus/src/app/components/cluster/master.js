var cm = require('lib/cluster-manager.js');

module.exports.init = function()
{

    if (cm.isWorker())
        return;
        
       
    cm.fork();
};
