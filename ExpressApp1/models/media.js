const uuid = require('uuid/v4');
'use strict';
module.exports = (sequelize, DataTypes) => {
    var Media = sequelize.define('Media', {
        id: { type: DataTypes.UUID, primaryKey: true, defaultValue: uuid()},
        videoURL: { type: DataTypes.TEXT },
        sourceType: DataTypes.TINYINT, // 0 for echo, 1 for youtube, 2 for local
        siteSpecificJSON: DataTypes.TEXT
    });
    return Media;
};