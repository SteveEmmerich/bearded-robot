'use strict';
var mongoose = require('mongoose'),
    bcrypt = require('bcrypt'),
    crytpo = require('crypto');

var userModel = function () {
    var userSchema = mongoose.Schema({
        name: String,
        login: {type: String, unique: true },
        password: String,
        role: String
    });
    userSchema.pre('save', function(next)
    {
        var user = this;
        if (!user.isModified('password'))
        {
            next();
            return;
        }

        var hasedPwd = bcrypt.hashSync(user.password, crypto.getCryptLevel());

        user.password = hashedPwd;

        next();
    });

    userSchema.methods.passwordMatches = function(plainText)
    {
        var user = this;
        return bcrypt.compareSync(plainText, user.password);
    };


    return mongoose.model('user', userSchema);
};

module.exports = new userModel();
