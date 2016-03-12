const cookieParser = require('cookie-parser');
const redisSessionClient = require('../share/redis-client.js').redisSessionClient;
const queryDB = require('../share/queryDB');
const db = require('../share/pq-db');
const constant = require('../share/constants');

function restAuth (req, res, next) {
    if (req.session && req.session.user) {
        queryDB.findUser({email: req.session.user.email}, db)
        .then(user => {
            if (user != null) {
                req.user = user;
                req.session.user = user;
            }
            return next();
        });
    };
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

module.exports.restAuth = restAuthen;
module.exports.socketAuth = socketAuth;
