var express = require('express'),
    logger = require('lib/logger.js'),
    config = require('lib/config.js'),
    video = require('components/middleware/video.js'),
    bodyParser = require('body-parser'),
    compress = require('compression'),
    methodOverride = require('method-override'),
    cookieParser = require('cookie-parser'),
    consolidate = require('consolidate'),
    multer = require('multer'),
    path = require('path');
    

/**
* Initialize local variables
*/
module.exports.initLocalVariables = function (app) 
{
    // Setting application local variables
    //app.locals.title = config.app.title;
    //app.locals.description = config.app.description;
    //app.locals.jsFiles = config.files.client.js;
    //app.locals.cssFiles = config.files.client.css;
    // Passing the request url to environment locals
    app.use(function (req, res, next) {
        res.locals.host = req.protocol + '://' + req.hostname;
        res.locals.url = req.protocol + '://' + req.headers.host + req.originalUrl;
        next();
        });
};

/**
* Initialize application middleware
*/
module.exports.initMiddleware = function (app) 
{
    // Showing stack errors
    app.set('showStackError', true);
    // Enable jsonp
    app.enable('jsonp callback');
    // Should be placed before express.static
    app.use(compress(
    {
        filter: function (req, res) 
        {
            return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
        },
        level: 9
    }));
    // Initialize favicon middleware
   // app.use(favicon('./components/client/img/brand/favicon.ico'));
    // Environment dependent middleware
    if (process.env.NODE_ENV === 'development') 
    {
        // Enable logger
        app.use(logger.connectLogger);
        // Disable views cache
        app.set('view cache', false);
    } 
    else if (process.env.NODE_ENV === 'production') 
    {
        app.locals.cache = 'memory';
    }
    // Request body parsing middleware should be above methodOverride
    app.use(bodyParser.urlencoded(
    {
        extended: true
    }));
    
    app.use(bodyParser.json());
    app.use(bodyParser.raw());
    app.use(methodOverride());
    
    // Add the cookie parser and flash middleware
    app.use(cookieParser());
    //app.use(flash());  
    
    // Add multipart handling middleware
    
    app.use(multer(
    {
        dest: './uploads/',
        inMemory: true,
        onFileUploadStart: video.uploadStart,
        onFileUploadComplete: video.uploadComplete
    }));
    
    // Add Stream handling middleware
  //  video.init(app);
};

/**
* Configure the server routes
*/
module.exports.initServerRoutes = function (app) 
{
    // Globbing routing files
    app.post('/uploads', function(req, res)
    {
        logger.debug('request Object: ', req);
    });
    /*logger.debug(config.files.server.routes);
    config.files.server.routes.forEach(function (routePath) 
    {
        require(path.resolve(routePath))(app);
    });*/
};

/**
* Configure error handling
*/
module.exports.initErrorRoutes = function (app) 
{
    // Assume 'not found' in the error msgs is a 404. this is somewhat silly, but valid, you can do whatever you like, set properties, use instanceof etc.
    app.use(function (err, req, res, next) 
    {
        // If the error object doesn't exists
        if (!err) return next();
        
        // Log it
        logger.error(JSON.stringify(err, null, 2));
        
        // Redirect to error page
        res.redirect('/server-error');
    });
    // Assume 404 since no middleware responded
    app.use(function (req, res) 
    {
        // Redirect to not found page
        res.redirect('/not-found');
    });
};


/**
* Configure Socket.io
* for talking to the other component apps in realtime
*/
/*module.exports.configureSocketIO = function (app, db) 
{   
    // Load the Socket.io configuration
    var server = require('./socket.io')(app, db);
    
    // Return server object
    return server;
};*/

/**
* Initialize the Express application
*/
module.exports.init = function (db) 
{
    // Initialize express app
    var app = express();
    
    // Initialize local variables
    this.initLocalVariables(app);
    
    // Initialize Express middleware
    this.initMiddleware(app);
    
    // Initialize modules server routes
    this.initServerRoutes(app);
    
    // Initialize error routes
    this.initErrorRoutes(app);
    
    // Configure Socket.io
    //app = this.configureSocketIO(app, db);
    
    return app;
};    

