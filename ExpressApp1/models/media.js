'use strict';
module.exports = (sequelize, DataTypes) => {
    var Media = sequelize.define('Media', {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        videoURL: { type: DataTypes.TEXT, unique: true },
        sourceType: DataTypes.TINYINT, // 0 for echo, 1 for youtube, 2 for local
        siteSpecificJSON: DataTypes.JSON
    });
    return Media;
};