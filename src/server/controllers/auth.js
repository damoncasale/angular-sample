'use strict';

const path = require('path'),
    config = require(path.resolve('src/server/config/config'));

module.exports = (app) => {

    const signup = (req, res) => {
        console.log("In login, params = ", req.body);

        if (('admin' === req.body.username) && ('password' === req.body.password)) {
            let user = {
                id: 'user',
                username: 'admin'
            };
            let token = app.jwt.JwtToken(user);
            return res.json({
                user: u,
                token: token
            });
        } else {
            return res.status(403).json({message: "Your username or password is incorrect."});
        }
    };

    return {
        signup: signup
    };
};
