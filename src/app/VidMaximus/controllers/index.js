'use strict';


var IndexModel = require('../models/index'),
	ProfileModel = require('../models/profile'),
	AdminModel = require('../models/admin'),
	auth = require('../lib/auth');


module.exports = function (router) {

    var indexModel = new IndexModel();
    var profileModel = new ProfileModel();
    var adminModel = new AdminModel();


    router.get('/', function (req, res) 
    {
        res.render('index', indexModel);        
    });

    router.get('/profile', function(req, res)
    {
    	res.render('profile', profileModel);
    });

    router.get('/admin', auth.isAuthenticated('admin'), auth.injectUser(), function(req, res)
    {
    	res.render('admin', adminModel);
    });

    router.get('/logout', function(req, res)
    {
    	req.logout();
    	res.redirect('/login');
    });

};
