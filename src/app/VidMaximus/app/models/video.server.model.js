'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Video Schema
 */
var VideoSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Video name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
    originalname: {
        type: String,
        default: '',
    },
    encoding: {
        type: String,
        default: '7bit',
    },
    minetype: {
        type: String,
        default: 'video/x-msvideo',
    },
    path: {
        type: String,
        default: 'data/videos'
    },
    extension: {
        type: String,
        default: 'mp4'
    },
    size: {
        type: Number,
        default: 0,
        required: 'size needed'
    },
    truncated: {
        type: Boolean,
        default: false
    },
    dirty: {
        type: Boolean,
        default: false
    }
});

mongoose.model('Video', VideoSchema);
