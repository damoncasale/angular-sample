'use strict';

const path = require('path'),
    Sequelize = require('sequelize'),
    config = require(path.resolve('src/server/config/config')),
    fs = require('fs'),
    _ = require('lodash')
    ;
let db = {};

let sequelize = new Sequelize(config.db.database, config.db.username, config.db.password, {
	host: config.db.host,
	dialect: config.db.dialect,
	logging: false
//	logging: console.log
});

fs.readdirSync(config.modelsDir)
	.filter(function(file) {
		return (file.indexOf('.' !== 0)) && (file !== 'index.js') && (file !== '.DS_Store');
	})
	.forEach(function(file) {
		var model = sequelize.import(path.join(config.modelsDir, file));
		db[model.name] = model;
	});

Object.keys(db)
	.forEach(function(modelName) {
		if (db[modelName].hasOwnProperty('associate')) {
			db[modelName].associate(db);
		}
	});

// Don't sync, we'll seed/migrate manually instead
/*
sequelize
	.sync({
		force: false,
		logging: config.enableSequelizeLog === 'true' ? console.log : false
	})
	.then(function() {
		console.log('Database ' + (config.db.FORCE_DB_SYNC ? '*DROPPED* and ' : '') + 'synchronized');
	})
	.catch(function(err) {
		console.log('An error occurred: ', err);
	});
*/

let dbExport = {
	sequelize: sequelize,
	Sequelize: Sequelize,
	getModel: model => {
	    return db[model];
	}
};
module.exports = dbExport;
