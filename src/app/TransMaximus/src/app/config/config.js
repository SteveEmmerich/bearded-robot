var _ = require('lodash'),
    glob = require('glob');
    
module.exports = {
    port: 5000,
    logConfig: {
        appenders: [
            {
                type: 'console',
                layout: {
                    type: 'pattern',
                    pattern: "[%d{ABSOLUTE}] %[%-5p%] %c %m"
                }
            },
            {
                type: 'file',
                filename: '../logs/transMaximus.log',
                maxLogSize: 10485760,
                numBackups: 3
            },
            {
                type: 'logLevelFilter',
                level: 'ERROR',
                appender: {
                    type: 'file',
                    filename: '../logs/tm_errors.log'
                }
            }
        ],
        replaceConsole: true
   },
   ffmpegPath: 'default',
   ffprobePath: 'default',
   flvtoolsPath: 'default',
   flvmetaPath: 'default',
   files:
   {
        server: 
        {
            routes: getGlobedFilePaths('../routes/*.js')
        }
   }     
};
function getGlobedFilePaths (globPatterns, excludes) 
{
    // URL paths regex
    var urlRegex = new RegExp('^(?:[a-z]+:)?\/\/', 'i');
    // The output array
    var output = [];
    // If glob pattern is array so we use each pattern in a recursive way, otherwise we use glob
    if (_.isArray(globPatterns)) 
    {
        globPatterns.forEach(function(globPattern) 
        {
            output = _.union(output, getGlobedFilePaths(globPattern, excludes));
        });
    } 
    else if (_.isString(globPatterns)) 
    {
        if (urlRegex.test(globPatterns)) 
        {
            output.push(globPatterns);
        } 
        else 
        {
            glob(globPatterns, {
                sync: false
            }, 
            function(err, files) 
            {
                if (excludes) 
                {
                    files = files.map(function(file) 
                    {
                        if (_.isArray(excludes)) 
                        {
                            for (var i in excludes) 
                            {
                                file = file.replace(excludes[i], '');
                            }
                        } 
                        else 
                        {
                            file = file.replace(excludes, '');
                        }
                        return file;
                    });
                }
                output = _.union(output, files);
            });
        }
    }
    return output;
};
