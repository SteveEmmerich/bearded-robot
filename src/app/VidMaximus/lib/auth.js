'use strict'
/* auth.js */

var User = require('../models/user'),
	LocalStrategy = require('passport-local').Strategy;

exports.config = function(settings)
{	};

exports.LocalStrategy = function()
{
	return new LocalStrategy(function(username, password, done)
	{
		User.findOne(
		{
			login: username
		}, 
		function(err, user) 
		{
			if(err) 
			{
				return done(err);
			}

			if (!user)
			{
				return done(null, false,
				{
					message: 'Login not found'
				});
			}

			if(!user.passwordMatches(password))
			{
				return done(null, false, 
				{
					message: 'Incorrect Password'
				});
			}

			done(null, user);
		});
	});
}

exports.isAuthenticated = function()
{
	return function(req, res, next)
	{
		var auth = {
			'/admin': true,
			'/profile': true
		},
		blacklist = {
			'user': {
				'/admin': true
			}
		},
		route = req.url,
		role = (req.user && req.user.role) ? req.user.role : '';
		if (!auth[route])
		{
			next();
			return;
		}
		else if (!req.isAuthenticated())
		{
			req.session.goingTo = req.url;
			req.flash('error', 'Please log in to view this page');
			req.redirect('/login');
		}
		else if (blacklist[role] && blacklist[role][route] === true)
		{
			var model = {url: route};

			res.locals.user = req.user;
			res.status(401);

			res.render('errors/401', model);
		}
		else
		{
			next();
		}
	};
};

exports.injectUser = function()
{
	return function injectUser(req, res, next)
	{
		if (req.isAuthenticated())
		{
			res.locals.user = req.user;
		}
		next();
	};
};