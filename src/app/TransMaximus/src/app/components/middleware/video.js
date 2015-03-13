var logger = require('lib/logger.js'),
    config = require('config/config.js'),
    async = require('async'),
    ffmpeg = require('fluent-ffmpeg'),
   // streamBodyParser = require('stream-body-parser'),
    streamifier = require('streamifier'),
    path = require('path'),
    stream = require('stream'),
    _ = require('lodash');

var filter = ['video/*', 'application/octet-stream']

module.exports.uploadStart = function(file, req, res)
{
    logger.debug('in upload start', file.mimetype, file.encoding);
    if (filter.indexOf(file.mimetype) <= -1)
        return false;
};
module.exports.uploadComplete = function(file, req, res)
{
        logger.debug('in uploadcomplete function');
        var inStream = streamifier.createReadStream(file.buffer)
        inStream.on('open', function()
        {
            logger.debug('open');
        });
        // Transcode the file into the mp4 format
        function done(err, data)
        {
            if(err)
            {
              logger.error('error: ', err.message, 'data: ', data);
              //throw err;
              return false;
            }
            req.formatData = data;
            console.log(data);
            //next();
            
        }
        
                
        async.parallel([
            function(callback)
            {
                transProbe(inStream, callback);
            },
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
function transProbe(inStream, done)
{
    var fprobeData;
    ffmpeg(inStream)
        .ffprobe(function(err, data)
        {
            if (err)
            {
            logger.error(err);
              // throw err;
            }
            logger.debug(data);
            fprobeData = data;
            done(err, data);
        });
     return fprobeData;
};
function transMP4(inStream, callback)
{
    var mp4 = new stream.Duplex();
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
function transWebM(inStream, callback)
{
                
    var webm = new stream.Duplex();
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
function transOGG(inStream, callback)
{

   var ogg = new stream.Duplex();
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
function transFlash(inStream, callback)
{

        var flv = new stream.Duplex();
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
function transScreenShots(inStream, callback)
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
        callback(null, filename);
    })
    .on('error', function(err)
    {
        logger.error('Error during screen shot creation: ', err.message);
        callback(err, filename);
    })
    .screenshots({
        timemarks: ['20%', '40%', '60%', '80%'],
        filename: 'thumbnail-at-%i-index.png',
        folder: path.join(config.screenShotPath, 'new'),
    });             
}


