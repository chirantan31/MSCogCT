﻿'use strict';
module.exports = (sequelize, DataTypes) => {
    var MSTranscriptionTask = sequelize.define('MSTranscriptionTask', {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        videoLocalLocation: DataTypes.TEXT,
        audioLocalLocation: DataTypes.TEXT,
        videoHashsum: DataTypes.TEXT,
        audioHashsum: DataTypes.TEXT,
        wavAudioLocalFile: DataTypes.TEXT,
        wavHashsum: DataTypes.TEXT,
        srtFileLocation: DataTypes.TEXT,
        log: DataTypes.TEXT
    });
    MSTranscriptionTask.associate = function (models) {
        models.MSTranscriptionTask.belongsTo(models.User, { foreignKey: 'taskCreatorUserId' });
        models.MSTranscriptionTask.belongsTo(models.Media, { foreignKey: 'mediaId' });
    };    
    return MSTranscriptionTask;
};