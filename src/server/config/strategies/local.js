'use strict';

const path = require('path'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy
    ;

const db = require(path.resolve('./src/server/config/sequelize'));

module.exports = () => {
    const fields = {
        usernameField: 'username',
        passwordField: 'password'
    };

    function JwtStrategy(passport) {
        let jwtStrategyInstance = new LocalStrategy(fields, (username, password, done) => {
            let invalidMsg = { message: 'Invalid username or password' };
    
            if (('admin' !== username) || ('password' !== password)) {
                return done(null, false, invalidMsg);
            } else {
                return done(null, {
                    id: 'user',
                    username: 'admin'
                });
            }
        });
        return passport.use(jwtStrategyInstance);
    }

    function JwtAuthentication (req, res, next) {
        passport.authenticate('local', { session: false }, function (err, user/*, info*/) {
            if (err) {
                return next(JSON.stringify({message: err}));
            }

            if (user) {
                req.user = user;
                next();
            } else {
                next(JSON.stringify({message: "Authentication failed!"}));
            }
        })(req, res, next);
    }

    return {
        JwtStrategy: JwtStrategy,
        //JwtToken: JwtToken,
        JwtAuthentication: JwtAuthentication
        //JwtOptionalAuthentication: JwtOptionalAuthentication,
        //RefreshToken: RefreshToken
    };
};
