'use strict';

angular.module('videos').factory('Transcode', ['$rootScope',
    function($rootScope)
    {
       return;/* var socket = io.connect();
        return {
            on: function(eventName, callback)
            {
                socket.on(eventName, function()
                {
                    var args = arguments;
                    $rootScope.$apply(function()
                    {
                        callback.apply(socket, args);
                    });
                });
            },
            emit: function (eventName, data, callback)
            {
                socket.emit(eventName, data, function()
                {
                    var args = arguments;
                    if (callback)
                    {
                        $rootScope.$apply(function ()
                        {
                            callback.apply(socket, args);
                        });
                    }
                });
            },
            createThumbs: function(fileItems, callback)
            {
                socket.emit('TransThumbs', fileItems, callback);

            }
        };*/
    }
]);
