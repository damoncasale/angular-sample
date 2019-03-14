'use strict'

const nconf = require('nconf'),
    json5 = require('json5'),
    _ = require('lodash'),
    path = require('path'),
    fs = require('fs'),
    StandardError = require('standard-error');

const pkg = path.resolve('package.json');

let sequelizeConfig = require('./sequelize.json');

const rootPath = path.resolve('.');

// Load app configuration
let computedConfig = {
    root: rootPath,
    modelsDir: path.join(rootPath, '/src/server/models'),
    package: pkg
};

//
// Setup nconf to use (in-order):
//   1. Locally computed config
//   2. Command-line arguments
//   3. Some Environment variables
//   4. Some defaults
//   5. Environment specific config file located at './env/<NODE_ENV>.json'
//   6. Shared config file located at './env/all.json'
//
nconf.argv()
.env(['PORT', 'NODE_ENV', 'FORCE_DB_SYNC', 'forceSequelizeSync']) // Load select environment variables
.defaults({store: {
    NODE_ENV: 'development'
}});

let env = nconf.get('NODE_ENV');
let envConfigPath = path.join(rootPath, '/src/server/config/env/', env + '.json');
try {
    if (!fs.statSync(envConfigPath).isFile()) {
        throw new Error(); // throw error to trigger catch
    }
} catch(err) {
    throw new StandardError('Environment specific config file not found! Throwing up! (NODE_ENV='
        + env + ')');
}

nconf.file(env, { file: envConfigPath, type: 'file', format: json5 })
.file('shared', { file: rootPath + '/config/env/all.json5', type: 'file', format: json5 })
.add('base-defaults', {type: 'literal', store: {
    PORT: 5555
}})
.overrides({store: computedConfig});

let config = nconf.get();
config.db = Object.assign(config.db, sequelizeConfig[env]);
if ("development" === env) {
    config.db.debug = config.db.debug || process.env.DB_DEBUG || false;
}
module.exports = config;
