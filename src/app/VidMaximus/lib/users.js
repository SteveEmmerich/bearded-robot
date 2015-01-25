'use strict';

var User = require('../model/user');

var UserLibrary = function()
{
	return {
		addUsers: function() //add default users
		{
			var admin = new User({
				name: 'Administrator',
				login: 'admin',
				password: 'admin',
				role: 'admin'
			});

			var user = new User({
				name: 'Vid Maximus',
				login: 'vidMax',
				password: 'password',
				role: 'user'
			});

			admin.save();
			user.save();
		},
		serialize: function(user, done)
		{
			done(null, user.id);
		},
		deserialise: function(id, done)
		{
			User.findOne({
				_id: id
			}, function(err, user)
			{
				done(null, user);
			});
		}
	};
};

module.exports = UserLibrary;