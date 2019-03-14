'use strict';

const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

module.exports = (app) => {

    const config = require(path.resolve('./src/server/config/config')),
        auth = require(path.resolve('./src/server/controllers/auth'))(app),
        feedback = require(path.resolve('./src/server/controllers/feedback')),
        upload = require(path.resolve('./src/server/controllers/upload'))
        ;

    router.get('/', (req, res) => {
        // The index page should be cached to avoid excessive server load
        res.setHeader('Cache-Control', 'public, max-age=86400');
        return res.render('index', {
            ngapp: ' ng-app="lavasoft"',
            title: "Angular Sample",
            urlbase: req.protocol + "://" + req.get('host') + "/",
            head: fs.readFileSync(path.resolve(path.join('src/client', 'head.html'))),
            body: fs.readFileSync(path.resolve(path.join('src/client', 'body.html')))
        });
    });

    router.post('/auth', auth.signup);
    //router.get('/refreshtoken', auth.refreshtoken);
    router.post('/add', feedback.add);

    router.get('/admin', app.jwt.JwtAuthentication, feedback.list);
    router.get('/admin/:id', app.jwt.JwtAuthentication, feedback.view);

    router.post('/upload', upload.upload);
    router.delete('/upload/:id', upload.delete);

    return router;
};
