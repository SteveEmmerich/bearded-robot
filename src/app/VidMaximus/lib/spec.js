'use strict';

var express = require('express'),
	passport = require('passport'),
	auth = require('../lib/auth'),
	userLib = require('../lib/users')(),
	db = require('../lib/database'),
	crypto = require('../lib/crypto');
//paypal = require('paypal-rest-sdk'),

module.exports = function spec(app)
{
	app.on('middleware:after:session', function configPassport(eventargs)
	{
		passport.use(auth.localStrategy());
		passport.serializeUser(userLib.serialize);
		passport.deserializeUser(userLib.deserialize);

		app.use(passport.initialize());
		app.use(passport.session());
	});

	return {
		onconfig: function(config, next)
		{
			var dbConfig = config.get('databaseConfig'),
              //  paypalConfig = config.get('paypalConfig'),
				cryptConfig = config.get('bcrypt');

			crypto.setCryptLevel(cryptConfig.difficulty);
			db.config(dbConfig);
            //paypal.configure(paypalConfig);
			userLib.addUsers();
			next(null, config);
		}
	};
};
