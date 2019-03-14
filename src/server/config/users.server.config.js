'use strict';

const path = require('path'),
    passport = require('passport'),
    config = require(path.resolve('src/server/config/config'))
    ;

module.exports = (_app, db) => {
    passport.serializeUser( (user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser( (id, done) => {
        if ('user' === id) {
            done(null, {
                id: 'user',
                username: 'admin'
            });
        } else {
            done("User does not exist!", null);
        }
    });
};
