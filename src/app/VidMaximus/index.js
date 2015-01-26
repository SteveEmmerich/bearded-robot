'use strict';

var kraken = require('kraken-js'),
	app = require('express')(),
	options = require('./lib/spec')(app),
	//userLib = require('./lib/users')(),
	port = process.env.PORT || 8000;

app.use(kraken({}));

/*app.listen(port, function(err)
{
	console.log('listening');
});/

/*app.on('start', function () {
    console.log('Application ready to serve requests.');
    console.log('Environment: %s', app.kraken.get('env:env'));
});*/
