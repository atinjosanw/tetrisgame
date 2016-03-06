let redisSessionClient = require('./share/redis-client.js').redisSessionClient;
let cookieParser = require('cookie-parser');
let queryDB = require('./share/queryDB');
let constant = require('./share/constants');

const restAuth = function (req, res, next) {
    if (req.session && req.session.user) {
        queryDB.findUser({email: req.session.user.email}, function (err, user) {
            if (user) {
                req.user = user;
                req.session.user = user;
            }
            next();
        });
    }
    next();
};

let socketAuth = function (socket, next) {
    let cookie = socket.request.headers.cookie;
    let parseCookie = cookieParser(constant.SESS_SECRET);
    socket.cookie = parseCookie(cookie);
    socket.sessionID = socket.cookie.sessionID;
    redisSessionClient.get("sess:" + socket.sessionID, function (err, sess) {
        if (!err && sess){
            socket.user = sess.user;
            next();
        }
        next();
    });
};

module.exports.restAuth = restAuthen;
module.exports.socketAuth = socketAuth;
