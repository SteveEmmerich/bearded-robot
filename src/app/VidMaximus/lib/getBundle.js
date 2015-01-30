/**
 *  * Created by sdemmer on 1/26/15.
 * Copyright 2015 by Shade Tech Inc
 * Description:
 */
'use strict';

var bundle;
var bundalo = require('bundalo');

module.exports = function getBundle(req, res, next)
{
    var i18n = res.app.kraken.get('i18n');
    var engine = res.app.kraken.get('bundle engine');
    if (bundle === undefined)
    {
        bundle = bundalo({'contentPath': i18n.contentPath, 'fallback': i18n.fallback, 'engine': engine});
    }
    res.bundle = bundle;
    next();
};
