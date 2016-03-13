'use strict';
const redisSessionClient = require('../share/redis-client.js').redisSessionClient;
const queryDB = require('../share/queryDB');
const db = require('../share/pg-db');
const constant = require('../share/constants');

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
    let cookie = socket.request.headers.cookie;
    if (!cookie) {
        return next();
    }
    let parseCookie = cookieParser(constant.SESS_SECRET);
    let cookie = parseCookie(cookie);
    let sessionID = socket.cookie.sessionID;
    redisSessionClient.get("sess:" + sessionID, function (err, sess) {
        if (!err && sess){
            socket.cookie = cookie;
            socket.sessionID = sessionID;
            socket.user = sess.user;
        }
        next();
    });
};

module.exports.restAuth = restAuth;
module.exports.socketAuth = socketAuth;
