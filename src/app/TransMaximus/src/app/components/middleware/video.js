var logger = require('lib/logger.js'),
    config = require('lib/config.js'),
    async = require('async'),
    ffmpeg = require('fluent-ffmpeg'),
   // streamBodyParser = require('stream-body-parser'),
    streamifier = require('streamifier'),
    stream = require('stream');

var filter = ['video/*']

module.exports.uploadStart = function(file, req, res)
{
    if (filter.indexOf(file.mimetype) <= -1)
        return false;
};
module.exports.uploadComplete = function(file, req, res)
{
        logger.debug('in uploadcomplete function');
        var inStream = streamifier.createReadStream(file.buffer)
        // Transcode the file into the mp4 format
        function done(err, data)
        {
            if(err)
                next({err: err.message, data: data});
            req.formatData = data;
            console.log(data);
            next();
            
        }
        var fprobData = transProbe(inStream);
        if (_.isUnDefined(fprobeData))
            return next({err: 'probe data undefined'});
        
        async.parallel([
            function(callback)
            {
                transMP4(inStream, callback);
            },
            function(callback)
            {
               transWebM(inStream, callback);
            },
            function(callback)
            {        
                transOGG(inStream, callback);
            },
            function(callback)
            {        
               transFlash(inStream, callback);
           },
           function(callback)
           {
                transScreenShots(inStream, callback);

           }], 
           function(err, data)
           {
                if (err)
                    data.errors = err;
                done(null, data);
           });
    
};
function transProbe(stream)
{
    var fprobeData;
    ffmpeg(inStream)
        .ffprobe(function(err, data)
        {
            if (err)
            {
               done(err);
            }
            fprobeData = data;
        });
     return fprobeData;
};
function transMP4(stream, callback)
{
    var mp4 = new stream.duplex;
    ffmpeg(inStream, {logger: logger})
        .videoCodec('libx264')
        .audioCodec('libfacc')
        .format('mp4')
        .on('progress', function(info) {
            console.log('progress ' + info.percent + '%');
        })
        .on('end', function()
        {
            //save
            callback(null, mp4);
            logger.trace('Finished mp4');
            //next();
        })
        .on('error', function(err)
        {
            callback(err);
            logger.error('An Error Occured ' + err.message);
        })
        .pipe(mp4, {end:true});
};
function transWebM(stream, callback)
{
                
    var webm = new stream.duplex;
    // Transcode the file into the webm format
    ffmpeg(inStream, {logger: logger})
        .videoCodec('libvpx')
        .audioCodec('libvorbis')
        .format('webm')
        .on('progress', function(info) {
            console.log('progress ' + info.percent + '%');
        })
        .on('end', function()
        {
            //save
            logger.trace('Finished WEBM');
            callback(null, webm);
        })
        .on('error', function(err)
        {
            logger.error('An Error Occured ' + err.message);
            callback(err);
        })
        .pipe(webm, {end:true});
};
function transOGG(stream, callback)
{

   var ogg = new stream.duplex;
   // Transcode the file into the ogg format    
   ffmpeg(inStream, {logger: logger})
        .videoCodec('libtheora')
        .audioCodec('libvorbis')
        .format('ogg')
        .on('progress', function(info) {
            console.log('progress ' + info.percent + '%');
        })
        .on('end', function()
        {
            //save
            logger.trace('Finished OGG');
            callback(null, ogg);
        })
        .on('error', function(err)
        {
            logger.error('An Error Occured ' + err.message);
            callback(err);
        })
        .pipe(ogg, {end:true});
};
function transFlash(stream, callback)
{

        var flv = new stream.duplex;
       // Transcode the file into the flash fallback format        
       ffmpeg(inStream, {logger: logger})
            .preset('flashvideo')
            .on('progress', function(info) {
                console.log('progress ' + info.percent + '%');
            })
            .on('end', function()
            {
                //save
                logger.trace('Finished Flash fall back');
                callback(null, flv);
            })
            .on('error', function(err)
            {
                logger.error('An Error Occured ' + err.message);
                callback(err);
            })
            .pipe(flv, {end:true});
};
function transScreenShots(stream, callback)
{
    var filename;  
    ffmpeg(inStream, {logger: logger})
    .on('filenames', function(filenames)
    {
        filename = filenames;
    })
    .on('end', function()
    {
        logger.trace('screen shots created');
        callback(null, filenames);
    })
    .on('error', function(err)
    {
        logger.error('Error during screen shot creation: ', err.message);
        callback(err, filenames);
    })
    .screenshots({
        count: 5,
        folder: path.join(config.screenShotPath, fprobeDate.filename),
    });             
}


