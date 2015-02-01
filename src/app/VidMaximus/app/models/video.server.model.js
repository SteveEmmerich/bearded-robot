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
    hashRef: {
        type: String,
        default: '',
        required: 'Create Hash'
    },
    fileLoc: {
        type: String,
        default: 'data/videos'
    },
    lastModified: {
        type: Date,
        default: Date.now
    },
    size: {
        type: String,
        default: ''

    },
    type: {
        type: String,
        default: ''
    }
});

mongoose.model('Video', VideoSchema);
