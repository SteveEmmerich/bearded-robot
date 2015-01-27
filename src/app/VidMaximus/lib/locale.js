/**
 *  * Created by sdemmer on 1/26/15.
 * Copyright 2015 by Shade Tech Inc
 * Description:
 */
'use strict'
module.exports = function()
{
    return function(req, res, next)
    {
        var locale = req.cookies && req.cookies.locale;
        res.locals.context = {
            locality: locale
        };
        next();
    };
};
