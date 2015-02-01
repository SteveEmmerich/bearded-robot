'use strict';

// Videos controller
angular.module('videos').controller('VideosController',
    ['$scope', '$stateParams', '$location', 'Authentication', 'Videos','FileUploader', 'Transcode',
	function($scope, $stateParams, $location, Authentication, Videos, FileUploader, Transcode) {
		$scope.authentication = Authentication;
        var uploader = $scope.uploader = new FileUploader({
            url: '/uploads'
        });
        uploader.filters.push({
            name: 'videoFilter',
            fn: function(item, options)
            {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|mp4|mov|mpeg|mkv|avi|web|'.indexOf(type) !== -1;
            }
        });
		// Create new Video
		$scope.create = function(item) {
			// Create new Video object
			var video = new Videos ({
				name: item.name,
                size: item.size,
                type: item.type,
                lastModified: item.lastModifiedDate
			});

			// Redirect after save
			video.$save(function(response) {
				//$location.path('videos/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Video
		$scope.remove = function(video) {
			if ( video ) { 
				video.$remove();

				for (var i in $scope.videos) {
					if ($scope.videos [i] === video) {
						$scope.videos.splice(i, 1);
					}
				}
			} else {
				$scope.video.$remove(function() {
					$location.path('videos');
				});
			}
		};

		// Update existing Video
		$scope.update = function() {
			var video = $scope.video;

			video.$update(function() {
				$location.path('videos/' + video._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Videos
		$scope.find = function() {
			$scope.videos = Videos.query();
		};

		// Find existing Video
		$scope.findOne = function() {
			$scope.video = Videos.get({ 
				videoId: $stateParams.videoId
			});
		};
        // CALLBACKS
        uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
            console.info('onWhenAddingFileFailed', item, filter, options);
        };
        uploader.onAfterAddingFile = function(fileItem) {
            console.info('onAfterAddingFile', fileItem);

        };
        uploader.onAfterAddingAll = function(addedFileItems) {
            console.info('onAfterAddingAll', addedFileItems);
           /* Transcode.createThumbs(addedFileItems, function(data)
            {
                for (var i = 0; i < uploader.queue.length; ++i)
                    for ()
                    uploader.queue[i].thumbs = data[i]
                addedFileItems = data;
            });*/
        };
        uploader.onBeforeUploadItem = function(item) {
            console.info('onBeforeUploadItem', item);
            $scope.create(item);
        };
        uploader.onProgressItem = function(fileItem, progress) {
            console.info('onProgressItem', fileItem, progress);
        };
        uploader.onProgressAll = function(progress) {
            console.info('onProgressAll', progress);
        };
        uploader.onSuccessItem = function(fileItem, response, status, headers) {
            console.info('onSuccessItem', fileItem, response, status, headers);
        };
        uploader.onErrorItem = function(fileItem, response, status, headers) {
            console.info('onErrorItem', fileItem, response, status, headers);
        };
        uploader.onCancelItem = function(fileItem, response, status, headers) {
            console.info('onCancelItem', fileItem, response, status, headers);
        };
        uploader.onCompleteItem = function(fileItem, response, status, headers) {
            console.info('onCompleteItem', fileItem, response, status, headers);
        };
        uploader.onCompleteAll = function() {
            console.info('onCompleteAll');
            $location.path('/videos');
        };

    }
]);
