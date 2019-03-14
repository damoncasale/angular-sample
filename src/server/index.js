'use strict';

// Set default environment variables
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.NODE_CONFIG_DIR = __dirname + '/config/';

var express = require('express');
var exphbs = require('express-handlebars');
var path = require('path');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var timeout = require('connect-timeout');

var config = require('./config/config');

/**
 * Express app configurations
 */
var app = express();

app.jwt = require(path.resolve('src/server/config/strategies/local'))();

var routes = require('./routes')(app);
var hbs = exphbs.create({
    extname: ".hbs",
    layoutsDir: path.join(__dirname, 'views', 'layouts'),
    partialsDir: path.join(__dirname, 'views', 'partials'),
    defaultLayout: 'main',
    helpers: {}
});
app.engine('hbs', hbs.engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(timeout("240s"));
app.use(methodOverride());
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(cookieParser());

// Bootstrap routes
app.use(routes);

// Is this being used?
app.use('/', express.static(path.resolve('public')));

app.listen(config.APP_PORT, function() {
    console.log('app listening on port %d in %s mode', this.address().port, process.env.NODE_ENV);
});

module.exports = app;
