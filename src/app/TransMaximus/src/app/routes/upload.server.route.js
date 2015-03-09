var logger = require('logger');

module.exports = function(app)
{
    app.post('/uploads', function(req, res)
    {
        //logger.debug('request Object: ', req);
        res.send('upload complete');
    }
}
