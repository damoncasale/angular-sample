'use strict';

const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

module.exports = (app) => {

    const config = require(path.resolve('./src/server/config/config')),
        auth = require(path.resolve('./src/server/controllers/auth'))(app),
        feedback = require(path.resolve('./src/server/controllers/feedback'))
        ;

    router.get('/', (req, res) => {
        // The index page should be cached to avoid excessive server load
        res.setHeader('Cache-Control', 'public, max-age=86400');
        return res.render('index', {
            ngapp: ' ng-app="'+config.package.name+'"',
            title: config.app.name,
            urlbase: req.protocol + "://" + req.get('host') + "/",
            head: fs.readFileSync(__dirname + config.clientpath + 'head.html'),
            body: fs.readFileSync(__dirname + config.clientpath + 'body.html')
        });
    });

    router.post('/auth', auth.login);
    router.get('/refreshtoken', auth.refreshtoken);
    router.post('/add', feedback.add);

    router.get('/admin', app.jwt.JwtAuthentication, feedback.list);
    router.get('/admin/:id', app.jwt.JwtAuthentication, feedback.view);

    router.post('/upload', upload.upload);
    router.delete('/upload/:id', upload.delete);

    return router;
};
