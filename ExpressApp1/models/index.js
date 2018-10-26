﻿'use strict';

var fs = require('fs');
var path = require('path');
var Sequelize = require('sequelize');
var basename = path.basename(__filename);
var env = process.env.NODE_ENV || 'development';
// var config = require(__dirname + '/../config/config.js')[env];
var db = {};

var sequelize;
//if (config.use_env_variable) {
//    sequelize = new Sequelize(process.env[config.use_env_variable], config);
//} else {
//    sequelize = new Sequelize(config.database, config.username, config.password, config);
//}
//sequelize = new Sequelize('MSCogCTDb', 'TestUser', 'Test123!', {
//    host: '127.0.0.1',
//    dialect: 'mssql',
//    port: 1433,

//    pool: {
//        max: 5,
//        min: 0,
//        idle: 10000
//    },

//    // SQLite only
//    //storage: 'sqldb.db'
//});

sequelize = new Sequelize('MSCogCTDb', 'TestUser', 'Test123!', {
    host: 'localhost',
    dialect: 'sqlite',

    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },

    // SQLite only
    storage: 'sqldb.db'
});


fs
    .readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(file => {
        var model = sequelize['import'](path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;