'use strict';
var express = require('express');
var router = express.Router();
var db = require('../db/db');
const request = require('request');
var Cookie = require('request-cookies').Cookie;

/* GET home page. */
router.get('/', function (req, res) {
    var email = 'hongyuw2@illinois.edu';
    var password = 'JmjlfZYERRIvbYjb';

    echo_scraper(email, password);


    res.render('index', { title: 'Express' });
});

router.get('/downloadLecture', function (req, res) {
    download_lecture(req.query.taskId);
    res.render('index', { title: 'Express' });
});

function youtuber() {
    var playList = 'PLBAGcD3siRDguyYYzhVwZ3tLvOyyG5k6K';
    const { getInfo } = require('ytdl-getinfo');
    getInfo(playList).then(info => {
        info.items.forEach(function (item) {
            console.log(item.id);
        });        
    });
}
youtuber()


function echo_scraper(email, password) {
    var url_directLogin = 'https://echo360.org/directLogin';
    request({ url: url_directLogin }, (error_directLogin, response_directLogin, body_directLogin) => {
        if (error_directLogin) { return console.log(error_directLogin); }
        var cookie_directLogin = response_directLogin.headers['set-cookie'][0];
        var play_session_directLogin = new Cookie(cookie_directLogin);
        var csrf_token = play_session_directLogin.value.substring(play_session_directLogin.value.indexOf('csrf') + 10)

        var url_login = 'https://echo360.org/login';
        var options_login = {
            method: 'POST',
            url: url_login,
            qs: { csrfToken: csrf_token },
            headers:
            {
                'Content-Type': 'application/x-www-form-urlencoded',
                Cookie: play_session_directLogin.key + "=" + play_session_directLogin.value
            },
            form:
            {
                email: email,
                password: password,
                action: 'Save'
            }
        };

        var url_home = 'https://echo360.org/home';
        request(options_login, function (error_login, response_login, body_login) {
            if (error_login) throw new Error(error_login);

            var cookie_login = response_login.headers['set-cookie'][0];
            var play_session_login = new Cookie(cookie_login);
            var options_home = {
                method: 'GET',
                url: url_home,
                headers:
                {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Cookie: play_session_login.key + "=" + play_session_login.value
                }
            };

            request(options_home, function (error_home, response_home, body_home) {
                if (error_home) throw new Error(error_home);
                var cookie_home = response_home.headers['set-cookie'];
                var cloudFront_Key_Pair_Id = new Cookie(cookie_home[0]);
                var cloudFront_Policy = new Cookie(cookie_home[1]);
                var cloudFront_Signature = new Cookie(cookie_home[2]);
                console.log(cloudFront_Key_Pair_Id.key + "=" + cloudFront_Key_Pair_Id.value);
                console.log(cloudFront_Policy.key + "=" + cloudFront_Policy.value);
                console.log(cloudFront_Signature.key + "=" + cloudFront_Signature.value);
                var download_header = cloudFront_Key_Pair_Id.key + "=" + cloudFront_Key_Pair_Id.value;
                download_header += "; " + cloudFront_Policy.key + "=" + cloudFront_Policy.value;
                download_header += "; " + cloudFront_Signature.key + "=" + cloudFront_Signature.value;
                console.log(download_header);
                var body_home_str = JSON.stringify(body_home);
                var sections_str = body_home_str.match(/\/section\/([\w-]*)\/home\\" target([^>]*)>/g);
                // console.log(sections_str);
                var courses = [];
                for (var i = 0; i < 2; i++) {
                    var course_id = sections_str[i].substring(sections_str[i].indexOf('in ') + 3);
                    course_id = course_id.substring(0, course_id.search(/\s[\w]+\s-/g));
                    var section_id = sections_str[i].substring(9, sections_str[i].indexOf('/home'));
                    courses.push([course_id, section_id]);
                }
                courses.forEach(function (course) {
                    db.addCourseAndSection(course[0], course[1], download_header)
                        .then(function () {
                            download_course(course, play_session_login, download_header);
                        });
                });
            });
        });
    });
}


function download_course(course, play_session_login, download_header) {
    var url_syllabus = 'https://echo360.org/section';
    var options_syllabus = {
        method: 'GET',
        url: url_syllabus + '/' + course[1] + '/syllabus',
        headers:
        {
            'Content-Type': 'application/x-www-form-urlencoded',
            Cookie: play_session_login.key + "=" + play_session_login.value
        }
    };
    request(options_syllabus, function (error_syllabus, response_syllabus, body_syllabus) {
        if (error_syllabus) throw new Error(error_syllabus);
        var syllabus = JSON.parse(response_syllabus.body);
        var audio_data_arr = syllabus['data'];
        for (var j = 0; j < audio_data_arr.length; j++) {
            var audio_data = audio_data_arr[j];
            try {
                var media = audio_data['lesson']['video']['media'];
                var sectionId = audio_data['lesson']['video']['published']['sectionId'];
                var mediaId = media['id'];
                var userId = media['userId'];
                var institutionId = media['institutionId'];
                var createdAt = media['createdAt'];
                var audioUrl = media['media']['current']['audioFiles'][0]['s3Url'];
                var videoUrl = media['media']['current']['primaryFiles'][0]['s3Url'];

                db.addMedia(videoUrl, 0, {
                    sectionId: sectionId,
                    mediaId: mediaId,
                    userId: userId,
                    institutionId: institutionId,
                    createdAt: createdAt,
                    audioUrl: audioUrl
                }).then(function (media) {
                    db.addMSTranscriptionTask(media.id)
                        .then(function (task) {
                            console.log("TaskId" + task.id);
                        });
                });

            } catch (err) {
                // console.log(err);
            }
            // download_file(audio_url, course[0] + '_' + String(j) + '.mp3', download_header);            
        }
    });
}

function download_lecture(taskId) {
    db.getTask(taskId).then(task => {
        db.getMedia(task.mediaId)
            .then(media => {
                switch (media.sourceType) {
                    case 0:
                        download_echo_lecture(media);
                        break;
                    case 1:
                        break;
                    default:
                        console.log("Invalid sourceType");
                }
                console.log(media.videoURL);
            });
    });
}

function download_echo_lecture(media) {
    var sectionId = media.siteSpecificJSON.sectionId;
    console.log("sectionId: " + sectionId);
    db.getEchoSection(sectionId).then(section => {
        var wget = require('node-wget');
        var url = media.videoURL;
        var dest = media.id + "_" + url.substring(url.lastIndexOf('/') + 1);
        wget({
            url: url,
            dest: dest,
            headers:
            {
                Cookie: section.json.downloadHeader
            },
        }, function (error_download, response_download, body_download) {
            if (error_download) throw new Error(error_download);
        });
    });
}


module.exports = router;
