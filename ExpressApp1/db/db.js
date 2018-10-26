'use strict';
var models = require('../models');
models.sequelize.sync();

function addCourseAndSection(courseId, sectionId, downloadHeader) {
    return models.EchoSection.findOrCreate({
        where: {
            sectionId: sectionId
        },
        defaults: {
            sectionId: sectionId,
            courseId: courseId,
            json: {
                downloadHeader: downloadHeader
            }
        }
    });
}

function addYoutubeChannelPlaylist(playlistId, channelId) {
    return models.YoutubeChannel.findOrCreate({
        where: {
            playlistId: playlistId
        },
        defaults: {
            playlistId: playlistId,
            channelId: channelId
        }
    });
}

function addMedia(videoURL, sourceType, siteSpecificJSON) {
    return models.Media.findOrCreate({
        where: {
            videoURL: videoURL
        },
        defaults: {
            videoURL: videoURL,
            sourceType: sourceType,
            siteSpecificJSON: JSON.stringify(siteSpecificJSON)
        }
    });
}

function addMSTranscriptionTask(mediaId) {
    return models.MSTranscriptionTask.findOrCreate({
        where: {
            mediaId: mediaId
        },
        defaults: {
            mediaId: mediaId
        }        
    });
}

function getTask(taskId) {
    return models.MSTranscriptionTask.findById(taskId);
}

function getMedia(mediaId) {
    return models.Media.findById(mediaId);
}

function getEchoSection(sectionId) {
    return models.EchoSection.findById(sectionId);
}

module.exports = {
    models: models,
    addCourseAndSection: addCourseAndSection,
    addMedia: addMedia,
    addMSTranscriptionTask: addMSTranscriptionTask,
    getTask: getTask,
    getMedia: getMedia,
    getEchoSection: getEchoSection,
    addYoutubeChannelPlaylist: addYoutubeChannelPlaylist
}