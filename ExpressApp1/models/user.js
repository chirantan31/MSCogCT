const uuid = require('uuid/v4');
'use strict';
module.exports = (sequelize, DataTypes) => {
    var User = sequelize.define('User', {
        id: { type: DataTypes.UUID, primaryKey: true, defaultValue: uuid()},
        mailId: DataTypes.TEXT
    });
    return User; 
};