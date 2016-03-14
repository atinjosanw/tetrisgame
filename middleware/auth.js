'use strict';
const queryDB = require('../share/queryDB');
const db = require('../share/pg-db');
const config = require('../config');
const cookieParser = require('../middleware/cookiePsr');
const redisClient = require('../share/redis-client').redisClient;

function restAuth (req, res, next) {
    if (req.session && req.session.user) {
        queryDB.findUser({email: req.session.user.email}, db)
        .then(user => {
            if (user != null) {
                req.session.email = user.user_email;
                req.session.password = user.user_password;
            }
        });
    };
    next();
}

function isAuthenticated(req, res, next) {
    if (!req.session || !req.session.email) {
        console.error("the user is not authenticated yet.");
        res.statusCode = 401;
        res.send({error: "not authenticated"});
    }
    next();
}

function socketAuth (socket, next) {
    let data = socket.request;
    let cookie = data.headers.cookie;
    if (socket.sessionID && socket.email) {
        next();
    }
    else if (cookie) {
        cookieParser(data, {}, function (err) {
            let sessionID = data.signedCookies[config.SESS_COOKIE_KEY];
            sessionID = "sess:"+sessionID;
            redisClient.get(sessionID, function (err, sess) {
                if (err) {
                    return next(err);
                }
                else if (!err && sess) {
                    sess = JSON.parse(sess);
                    socket.sessionID = sessionID;
                    socket.email = sess.email;
                    delete data["secret"];
                    socket.authenticated = true;
                    return next();
                }
            });
        });
    }
    else {
        socket.error('unauthenticated');
        socket.disconnect();
        next(new Error('invalid session'));
    }
};

module.exports.restAuth = restAuth;
module.exports.socketAuth = socketAuth;
