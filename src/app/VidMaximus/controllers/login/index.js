'use strict';


var LoginModel = require('../../models/login'),
	passport = require('passport');


module.exports = function (router) {

    var model = new LoginModel();



    router.get('/', function (req, res) 
    {
     	model.messages = req.flash('error');   
     	res.send('login', model);
        //res.send('<code><pre>' + JSON.stringify(model, null, 2) + '</pre></code>');
        
    });

    router.post('/', function (req, res)
    {
    	passport.authenticate('local', {
    		successRedirect: req.session.goingTo || '/profile',
    		failureRedirect: '/login',
    		failureFlash: true
    	})(req, res);
    });

};
