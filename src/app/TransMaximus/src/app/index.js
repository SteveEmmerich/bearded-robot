require('app-module-path').addPath(__dirname);

var worker = require('components/cluster/worker.js'),
    master = require('components/cluster/master.js');
    

master.init();
worker.init();

    
    

