'use strict';
// var models = require('../models');
module.exports = (sequelize, DataTypes) => {
    var User = sequelize.define('User', {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        mailId: DataTypes.TEXT
    });
    return User; 
};