'use strict';
var path = require('path');
module.exports = {
	app: {
		title: 'vidmaximus',
		description: 'Video Management System in Full-Stack JS',
		keywords: 'MongoDB, Express, AngularJS, Node.js'
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions',
	assets: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.css',
				'public/lib/bootstrap/dist/css/bootstrap-theme.css',
				'public/lib/videogular-themes-default/videogular.min.css',
			],
			js: [
				'public/lib/angular/angular.js',
				'public/lib/angular-resource/angular-resource.js', 
				'public/lib/angular-cookies/angular-cookies.js', 
				'public/lib/angular-animate/angular-animate.js', 
				'public/lib/angular-touch/angular-touch.js', 
				'public/lib/angular-sanitize/angular-sanitize.js', 
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/lib/angular-ui-utils/ui-utils.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
                'public/lib/angular-file-upload/angular-file-upload.js',
                'public/lib/angular-deckgrid/angular-deckgrid.js',
                'public/lib/ffmpeg.js/build/ffmpeg.js',
                'public/lib/ffmpeg.js/build/ffmpeg-all-codecs.js',
                'public/lib/videogular/videogular.js',
                'public/lib/videogular-controls/vg-controls.js',
                'public/lib/videogular-overlay-play/vg-overlay-play.js',
                'public/lib/videogular-poster/vg-poster.js',
                'public/lib/videogular-buffering/vg-buffing.js',
                'public/lib/thread/thread.min.js',
                'public/lib/angular-thread/angular-thread.js'
                
			]
		},
		css: [
			'public/modules/**/css/*.css'
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	},
    video: {
        location: path.join(__dirname, '../../','data/videos/'),
        saveLocal: true
    },
    logger: {
        'appenders': [
            {
                'type': 'file',
                'filename': 'vidmaxius.log',
                'maxLogSize': 20480,
                'backups': 5,
                'category': 'relative-logger'
            },
            {
                'type': 'console'
            }
        ],
        replaceConsole: true
    }
};
